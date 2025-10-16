# Excel Visualization

A lightweight Node.js application that lets you upload an Excel workbook, preview the first sheet, and automatically build quick visualizations for every numeric column.

## Features

- 📤 Upload `.xlsx` workbooks directly from the browser
- 🔎 Preview the first sheet in a responsive, scrollable table
- 📈 Auto-generate line charts for every numeric column using Chart.js
- 🛡️ Friendly validation and error messages for empty or invalid files

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer

### Installation

```bash
npm install
```

### Run the development server

```bash
npm run start
```

Visit `http://localhost:3000` and upload an Excel file to see it in action.

## Project structure

```
.
├── public/           # Static assets served by Express
│   ├── index.html    # Upload form and visualization UI
│   ├── main.js       # Front-end logic for rendering charts & tables
│   └── styles.css    # Minimal styling
└── src/
    └── server.js    # Express server that parses Excel files
```

## License

[MIT](LICENSE)
