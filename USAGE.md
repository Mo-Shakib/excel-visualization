# Usage Guide

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

3. **Open your browser**:
   Navigate to `http://localhost:3000`

## How It Works

### 1. Upload Your Excel File

The app supports three file formats:
- `.xlsx` (Excel 2007+)
- `.xls` (Excel 97-2003)
- `.csv` (Comma-separated values)

You can either:
- **Drag and drop** your file onto the upload area
- **Click** the upload area to browse and select a file

### 2. Automatic Data Analysis

Once uploaded, the app will:

#### Data Type Inference
The app automatically detects three types of data:
- **Numeric**: Numbers, quantities, amounts (e.g., sales, prices, counts)
- **Categorical**: Text categories or labels (e.g., product names, departments)
- **Date**: Date or timestamp values (e.g., order dates, hire dates)

#### Chart Suggestions
Based on detected data types, the app suggests appropriate visualizations:

| Data Combination | Suggested Chart | Purpose |
|-----------------|-----------------|---------|
| Date + Numeric | Line Chart | Track changes over time |
| Category + Numeric | Bar Chart | Compare values across categories |
| Category only | Pie Chart | Show distribution of categories |
| Numeric + Numeric | Scatter Plot | Analyze correlation between variables |

### 3. Explore Visualizations

#### Automatic Suggestions
- Click any suggested visualization card to view that chart
- The app will automatically configure the chart with appropriate axes

#### Custom Charts
Use the chart controls to create your own visualizations:
1. **Chart Type**: Select from Line, Bar, Pie, or Scatter
2. **X-Axis**: Choose the column for horizontal axis
3. **Y-Axis**: Choose the column for vertical axis (not used for Pie charts)
4. Click **Update Chart** to generate your custom visualization

### 4. Understanding Your Data

The app displays:
- **Data Summary**: Total rows, columns, and number of chart suggestions
- **Column Information**: Each column's name, detected type, and sample values
- **Interactive Charts**: Hover over chart elements to see detailed values

## Example Workflows

### Sales Analysis
**Data**: Dates, Products, Sales amounts
1. Upload your sales data
2. View the time series line chart to see trends
3. Switch to bar chart to compare products
4. Use pie chart to see product distribution

### Employee Analysis
**Data**: Names, Departments, Salaries, Hire dates
1. Upload employee data
2. View salary distribution by department with bar chart
3. Check department distribution with pie chart
4. Analyze salary vs performance with scatter plot

### Financial Data
**Data**: Months, Revenue, Expenses
1. Upload financial spreadsheet
2. View line chart for trend analysis
3. Compare metrics side-by-side with bar chart
4. Analyze relationship between revenue and expenses

## Tips for Best Results

### Data Preparation
- **Headers Required**: First row should contain column names
- **Clean Data**: Remove empty rows and columns
- **Consistent Types**: Keep data types consistent within columns
- **Date Format**: Use standard date formats (YYYY-MM-DD, MM/DD/YYYY)

### File Size
- Optimized for files with up to 1000 rows
- Larger files may take longer to process

### Chart Selection
- **Line Charts**: Best for continuous time series data
- **Bar Charts**: Best for comparing discrete categories
- **Pie Charts**: Best for showing parts of a whole (use with categorical data)
- **Scatter Plots**: Best for finding relationships between two numeric variables

## Troubleshooting

### File Upload Issues
- **Error: "Only Excel and CSV files are allowed"**
  - Ensure your file has .xlsx, .xls, or .csv extension
  - Try re-saving your file in one of the supported formats

- **Error: "No data found in the Excel file"**
  - Check that your file has data starting from row 1
  - Ensure the first row contains column headers

### Chart Display Issues
- **Chart not showing**: Check browser console for JavaScript errors
- **Wrong data types**: Ensure your data is formatted consistently
- **Missing data**: Remove or fill empty cells in your Excel file

## Advanced Features

### Multiple Sheet Support
Currently, the app processes the first sheet of your Excel file. To analyze other sheets:
1. Save the desired sheet as a separate file
2. Upload that file

### Data Export
Charts are displayed using Chart.js and can be:
- Right-click to save as image (in most browsers)
- Screenshot using browser tools

## Browser Compatibility

Tested and working on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## API Endpoint

For programmatic access:
```bash
curl -X POST -F "file=@yourfile.xlsx" http://localhost:3000/api/upload
```

Returns JSON with:
- Parsed data
- Column types
- Chart suggestions
- Row and column counts
