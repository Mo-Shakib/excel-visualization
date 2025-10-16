const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.xlsx' && ext !== '.xls' && ext !== '.csv') {
      return cb(new Error('Only Excel and CSV files are allowed'));
    }
    cb(null, true);
  }
});

// Data type inference
function inferDataType(values) {
  const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
  if (nonNullValues.length === 0) return 'empty';

  let numCount = 0;
  let dateCount = 0;
  let strCount = 0;

  for (const val of nonNullValues) {
    if (typeof val === 'number') {
      numCount++;
    } else if (val instanceof Date || (!isNaN(Date.parse(val)) && /\d{1,4}[-/]\d{1,2}[-/]\d{1,4}/.test(val))) {
      dateCount++;
    } else {
      strCount++;
    }
  }

  const total = nonNullValues.length;
  if (numCount / total > 0.8) return 'numeric';
  if (dateCount / total > 0.8) return 'date';
  return 'categorical';
}

// Suggest chart types based on data structure
function suggestChartType(columns) {
  const numericCols = columns.filter(col => col.type === 'numeric');
  const categoricalCols = columns.filter(col => col.type === 'categorical');
  const dateCols = columns.filter(col => col.type === 'date');

  const suggestions = [];

  // Time series chart
  if (dateCols.length > 0 && numericCols.length > 0) {
    suggestions.push({
      type: 'line',
      xAxis: dateCols[0].name,
      yAxis: numericCols[0].name,
      title: `${numericCols[0].name} over ${dateCols[0].name}`,
      description: 'Time series visualization'
    });
  }

  // Bar chart for categorical vs numeric
  if (categoricalCols.length > 0 && numericCols.length > 0) {
    suggestions.push({
      type: 'bar',
      xAxis: categoricalCols[0].name,
      yAxis: numericCols[0].name,
      title: `${numericCols[0].name} by ${categoricalCols[0].name}`,
      description: 'Categorical comparison'
    });
  }

  // Pie chart for categorical data with counts
  if (categoricalCols.length > 0) {
    suggestions.push({
      type: 'pie',
      dataColumn: categoricalCols[0].name,
      title: `Distribution of ${categoricalCols[0].name}`,
      description: 'Category distribution'
    });
  }

  // Scatter plot for two numeric columns
  if (numericCols.length >= 2) {
    suggestions.push({
      type: 'scatter',
      xAxis: numericCols[0].name,
      yAxis: numericCols[1].name,
      title: `${numericCols[1].name} vs ${numericCols[0].name}`,
      description: 'Correlation analysis'
    });
  }

  return suggestions;
}

// Process Excel data
function processExcelData(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet, { defval: null });

  if (data.length === 0) {
    throw new Error('No data found in the Excel file');
  }

  // Analyze columns
  const columnNames = Object.keys(data[0]);
  const columns = columnNames.map(name => {
    const values = data.map(row => row[name]);
    const type = inferDataType(values);
    return {
      name,
      type,
      sampleValues: values.slice(0, 5)
    };
  });

  // Get chart suggestions
  const chartSuggestions = suggestChartType(columns);

  return {
    data,
    columns,
    chartSuggestions,
    rowCount: data.length,
    columnCount: columns.length
  };
}

// API Routes
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = processExcelData(req.file.path);

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error processing file:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      error: error.message || 'Error processing file'
    });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
