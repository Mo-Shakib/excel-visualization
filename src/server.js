import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const staticDir = path.join(__dirname, '..', 'public');
app.use(express.static(staticDir));

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Please choose an Excel (.xlsx) file to upload.' });
  }

  const allowedMimeTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];

  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ error: 'Unsupported file type. Please upload an Excel file.' });
  }

  try {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const [firstSheetName] = workbook.SheetNames;

    if (!firstSheetName) {
      return res.status(400).json({ error: 'The uploaded workbook does not contain any sheets.' });
    }

    const sheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: false });

    if (!rows.length) {
      return res.status(400).json({ error: 'The first sheet of the workbook is empty.' });
    }

    const headers = rows[0].map((header, index) =>
      header === undefined || header === null || header === '' ? `Column ${index + 1}` : String(header)
    );

    const dataRows = rows
      .slice(1)
      .map((row) => headers.map((_, index) => row[index]))
      .filter((row) => row.some((value) => value !== undefined && value !== null && value !== ''));

    if (!dataRows.length) {
      return res.status(400).json({ error: 'The sheet does not contain any data rows.' });
    }

    const labels = dataRows.map((row) => String(row[0] ?? ''));
    const datasets = [];

    for (let columnIndex = 1; columnIndex < headers.length; columnIndex += 1) {
      const columnValues = dataRows.map((row) => row[columnIndex]);
      const parsedValues = columnValues.map((value) => {
        if (value === undefined || value === null || value === '') {
          return null;
        }
        if (typeof value === 'number') {
          return Number.isFinite(value) ? value : null;
        }
        const numericValue = Number.parseFloat(value);
        return Number.isFinite(numericValue) ? numericValue : null;
      });

      if (parsedValues.some((value) => value !== null)) {
        datasets.push({
          label: headers[columnIndex],
          data: parsedValues,
        });
      }
    }

    if (!datasets.length) {
      return res.status(400).json({
        error: 'No numeric columns were found to visualize. Please include at least one numeric column.',
      });
    }

    return res.json({
      sheetName: firstSheetName,
      headers,
      rows: dataRows,
      chart: {
        labels,
        datasets,
      },
    });
  } catch (error) {
    console.error('Failed to process uploaded workbook:', error);
    return res.status(500).json({ error: 'Failed to read the uploaded workbook.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Excel visualization server listening on port ${PORT}`);
});
