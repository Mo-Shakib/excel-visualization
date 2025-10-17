## Vexcel — Smart Excel Visualizer

Vexcel turns raw spreadsheets into an interactive dashboard you can explore in seconds. Upload an Excel/CSV file and the app profiles your data, generates chart recommendations, and lets you dig deeper with one‑click insights.

### Highlights
- **Flexible ingestion** – drag and drop Excel or CSV files; empty headers and noisy rows are handled automatically.
- **Instant visuals** – charts are suggested based on column types, with tooltips, hover states, and a clean dark UI.
- **Living document** – click any chart element (e.g., a bar in “Units by Region”) to cross-filter the entire dashboard. A filter pill appears in the header and quick stats update immediately; click again or use “Clear filter” to reset.
- **Fullscreen charts** – every chart has a fullscreen view with richer insights and editing controls.
- **Mobile-ready landing and upload experiences** – the CTA is always visible, and uploads lead straight into the dashboard.

### Getting Started
```bash
# install dependencies
npm install

# start the dev server
npm run dev

# run a production build
npm run build
```

Open the dev server URL (defaults to `http://localhost:5173`) and drop a spreadsheet into the landing page.

### Usage Tips
- Hover any bar, area, or line to see values in the tooltip; the cursor changes to a pointer to show clickability.
- Click a chart element to focus the dashboard on that segment—quick stats, charts, and insights will update to the filtered view.
- Use the “Clear filter” pill in the header to return to the full dataset.
- Edit or remove charts directly from each card; toggle fullscreen mode for a larger canvas while retaining the insights panel.

### Available Scripts
- `npm run dev` – Vite development server with hot reload.
- `npm run build` – Production build.
- `npm run preview` – Preview the production build (after running `npm run build`).
- `npm run lint` – ESLint (optional, configure as needed).

### Tech Stack
- **React 18 + TypeScript**
- **Vite** (build tooling)
- **Tailwind-inspired custom styling** for the dark glassmorphism look
- **Recharts** for all charting needs
- **XLSX** (SheetJS) for spreadsheet parsing

### Project Structure
```
src/
├── components/        # UI building blocks (landing page, dashboard panels, chart cards, etc.)
├── utils/             # Excel parsing, chart recommendation logic
├── types/             # Shared TypeScript types
└── App.tsx            # App entry and routing between landing, upload, and dashboard views
```

### Roadmap / Ideas
- Export charts as images or PDFs.
- Persist filters and custom chart edits.
- Shareable dashboard links or embedding.

Feel free to fork and extend—Vexcel is designed to be a quick analytics starter kit for your datasets. Enjoy exploring! 🎉
