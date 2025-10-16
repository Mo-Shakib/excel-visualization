const form = document.getElementById('upload-form');
const fileInput = document.getElementById('file');
const statusElement = document.getElementById('status');
const chartSection = document.getElementById('chart-section');
const tableSection = document.getElementById('table-section');
const tableElement = document.getElementById('data-table');
const chartNote = document.getElementById('chart-note');

let chartInstance = null;

function resetView() {
  statusElement.textContent = '';
  chartSection.hidden = true;
  tableSection.hidden = true;
  tableElement.innerHTML = '';
  chartNote.hidden = true;
  chartNote.textContent = '';

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
}

function renderTable(headers, rows) {
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headers.forEach((header) => {
    const th = document.createElement('th');
    th.scope = 'col';
    th.textContent = header;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  const tbody = document.createElement('tbody');
  rows.forEach((row) => {
    const tr = document.createElement('tr');
    row.forEach((cell) => {
      const td = document.createElement('td');
      td.textContent = cell ?? '';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  tableElement.append(thead, tbody);
  tableSection.hidden = false;
}

function renderChart(chart) {
  const { labels, datasets, truncated, originalPointCount } = chart;
  const canvas = document.getElementById('chart');
  const palette = [
    '#4F46E5',
    '#14B8A6',
    '#F97316',
    '#EC4899',
    '#0EA5E9',
    '#8B5CF6',
    '#F59E0B',
  ];

  const chartDatasets = datasets.map((dataset, index) => ({
    label: dataset.label,
    data: dataset.data,
    borderColor: palette[index % palette.length],
    backgroundColor: `${palette[index % palette.length]}33`,
    tension: 0.3,
  }));

  chartInstance = new window.Chart(canvas, {
    type: 'line',
    data: { labels, datasets: chartDatasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            precision: 0,
          },
        },
      },
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    },
  });

  chartSection.hidden = false;

  if (truncated) {
    chartNote.hidden = false;
    chartNote.textContent = `Showing ${labels.length} of ${originalPointCount} rows for the preview chart.`;
  } else {
    chartNote.hidden = true;
    chartNote.textContent = '';
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  resetView();

  if (!fileInput.files.length) {
    statusElement.textContent = 'Select an Excel file to continue.';
    return;
  }

  const formData = new FormData();
  formData.append('file', fileInput.files[0]);

  statusElement.textContent = 'Uploading…';

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || 'Upload failed');
    }

    statusElement.textContent = '';
    renderChart(payload.chart);
    renderTable(payload.headers, payload.rows);
  } catch (error) {
    statusElement.textContent = error.message;
  }
});
