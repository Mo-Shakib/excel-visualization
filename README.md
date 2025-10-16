# Excel Visualization App

A web application that lets users upload Excel files and automatically generates interactive visualizations. The app intelligently infers data types, detects relationships, and suggests appropriate chart types.

## Features

- **Drag & Drop File Upload**: Easy file upload with drag-and-drop support
- **Automatic Data Type Inference**: Intelligently detects numeric, categorical, and date columns
- **Smart Chart Suggestions**: Automatically suggests the best chart types based on your data
- **Interactive Visualizations**: Create line charts, bar charts, pie charts, and scatter plots
- **Customizable Charts**: Refine visualizations by selecting different axes and chart types
- **Clean, Modern UI**: Minimal and intuitive interface

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Mo-Shakib/excel-visualization.git
cd excel-visualization
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

1. **Upload a File**: Drag and drop an Excel file (.xlsx, .xls, or .csv) onto the upload area, or click to browse
2. **View Data Summary**: See an overview of your data including row count, column count, and detected data types
3. **Explore Suggestions**: Review automatically generated chart suggestions based on your data structure
4. **Interact with Charts**: Click on any suggestion to view the visualization, or use the controls to create custom charts
5. **Customize**: Use the dropdown menus to change chart types, X-axis, and Y-axis values

## Supported File Formats

- Excel (.xlsx, .xls)
- CSV (.csv)

## Chart Types

The app supports the following chart types:
- **Line Charts**: Best for time series data
- **Bar Charts**: Best for categorical comparisons
- **Pie Charts**: Best for showing distribution of categories
- **Scatter Plots**: Best for correlation analysis

## Technology Stack

- **Backend**: Node.js with Express
- **Excel Parsing**: xlsx library
- **Frontend**: HTML5, CSS3, vanilla JavaScript
- **Charts**: Chart.js
- **File Upload**: Multer

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.