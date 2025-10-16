let currentData = null;
let currentChart = null;

// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const loadingIndicator = document.getElementById('loadingIndicator');
const uploadSection = document.getElementById('uploadSection');
const resultsSection = document.getElementById('resultsSection');
const dataSummary = document.getElementById('dataSummary');
const columnInfo = document.getElementById('columnInfo');
const chartSuggestions = document.getElementById('chartSuggestions');
const chartSection = document.getElementById('chartSection');
const chartCanvas = document.getElementById('chartCanvas');
const chartTitle = document.getElementById('chartTitle');
const chartTypeSelector = document.getElementById('chartTypeSelector');
const xAxisSelector = document.getElementById('xAxisSelector');
const yAxisSelector = document.getElementById('yAxisSelector');
const updateChartBtn = document.getElementById('updateChart');
const uploadNewFileBtn = document.getElementById('uploadNewFile');

// Chart type icons
const chartIcons = {
    line: '📈',
    bar: '📊',
    pie: '🥧',
    scatter: '⚫'
};

// Event Listeners
uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileSelect);
uploadArea.addEventListener('dragover', handleDragOver);
uploadArea.addEventListener('dragleave', handleDragLeave);
uploadArea.addEventListener('drop', handleDrop);
updateChartBtn.addEventListener('click', handleUpdateChart);
uploadNewFileBtn.addEventListener('click', resetApp);

// File handling
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        uploadFile(file);
    }
}

function handleDragOver(event) {
    event.preventDefault();
    uploadArea.classList.add('drag-over');
}

function handleDragLeave(event) {
    event.preventDefault();
    uploadArea.classList.remove('drag-over');
}

function handleDrop(event) {
    event.preventDefault();
    uploadArea.classList.remove('drag-over');
    const file = event.dataTransfer.files[0];
    if (file) {
        uploadFile(file);
    }
}

// Upload file to server
async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    loadingIndicator.style.display = 'block';
    uploadArea.style.display = 'none';

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Upload failed');
        }

        currentData = result;
        displayResults(result);
    } catch (error) {
        alert('Error: ' + error.message);
        resetApp();
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

// Display results
function displayResults(result) {
    uploadSection.style.display = 'none';
    resultsSection.style.display = 'block';

    // Display data summary
    dataSummary.innerHTML = `
        <div class="summary-item">
            <div class="summary-value">${result.rowCount}</div>
            <div class="summary-label">Rows</div>
        </div>
        <div class="summary-item">
            <div class="summary-value">${result.columnCount}</div>
            <div class="summary-label">Columns</div>
        </div>
        <div class="summary-item">
            <div class="summary-value">${result.chartSuggestions.length}</div>
            <div class="summary-label">Chart Suggestions</div>
        </div>
    `;

    // Display column information
    columnInfo.innerHTML = result.columns.map(col => `
        <div class="column-card">
            <div class="column-name">${col.name}</div>
            <span class="column-type">${col.type}</span>
            <div class="column-samples">
                Sample: ${col.sampleValues.filter(v => v !== null).slice(0, 3).join(', ') || 'N/A'}
            </div>
        </div>
    `).join('');

    // Display chart suggestions
    chartSuggestions.innerHTML = result.chartSuggestions.map((suggestion, index) => `
        <div class="suggestion-card" data-suggestion-index="${index}">
            <div class="suggestion-icon">${chartIcons[suggestion.type] || '📊'}</div>
            <div class="suggestion-title">${suggestion.title}</div>
            <div class="suggestion-description">${suggestion.description}</div>
            <div class="suggestion-details">
                Type: ${suggestion.type.toUpperCase()}
                ${suggestion.xAxis ? ` | X: ${suggestion.xAxis}` : ''}
                ${suggestion.yAxis ? ` | Y: ${suggestion.yAxis}` : ''}
                ${suggestion.dataColumn ? ` | Data: ${suggestion.dataColumn}` : ''}
            </div>
        </div>
    `).join('');

    // Add click handlers to suggestions
    document.querySelectorAll('.suggestion-card').forEach(card => {
        card.addEventListener('click', function() {
            const index = parseInt(this.dataset.suggestionIndex);
            const suggestion = result.chartSuggestions[index];
            renderSuggestedChart(suggestion);
        });
    });

    // Populate chart controls
    populateChartControls(result.columns);

    // Automatically render the first suggestion if available
    if (result.chartSuggestions.length > 0) {
        renderSuggestedChart(result.chartSuggestions[0]);
    }
}

// Populate chart control dropdowns
function populateChartControls(columns) {
    // Chart types
    chartTypeSelector.innerHTML = `
        <option value="">Select chart type</option>
        <option value="line">Line Chart</option>
        <option value="bar">Bar Chart</option>
        <option value="pie">Pie Chart</option>
        <option value="scatter">Scatter Plot</option>
    `;

    // X and Y axis options
    const columnOptions = columns.map(col => 
        `<option value="${col.name}">${col.name}</option>`
    ).join('');

    xAxisSelector.innerHTML = `<option value="">Select X-axis</option>${columnOptions}`;
    yAxisSelector.innerHTML = `<option value="">Select Y-axis</option>${columnOptions}`;
}

// Render suggested chart
function renderSuggestedChart(suggestion) {
    chartSection.style.display = 'block';
    chartTitle.textContent = suggestion.title;

    // Set control values
    chartTypeSelector.value = suggestion.type;
    if (suggestion.xAxis) xAxisSelector.value = suggestion.xAxis;
    if (suggestion.yAxis) yAxisSelector.value = suggestion.yAxis;
    if (suggestion.dataColumn) xAxisSelector.value = suggestion.dataColumn;

    const chartConfig = prepareChartData(suggestion);
    createChart(chartConfig);

    // Scroll to chart
    chartSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Handle manual chart update
function handleUpdateChart() {
    const chartType = chartTypeSelector.value;
    const xAxis = xAxisSelector.value;
    const yAxis = yAxisSelector.value;

    if (!chartType) {
        alert('Please select a chart type');
        return;
    }

    const suggestion = {
        type: chartType,
        xAxis: xAxis,
        yAxis: chartType === 'pie' ? null : yAxis,
        dataColumn: chartType === 'pie' ? xAxis : null,
        title: `Custom ${chartType} Chart`
    };

    renderSuggestedChart(suggestion);
}

// Prepare chart data based on suggestion
function prepareChartData(suggestion) {
    const { type, xAxis, yAxis, dataColumn } = suggestion;

    if (type === 'pie') {
        // For pie chart, count occurrences
        const counts = {};
        currentData.data.forEach(row => {
            const value = row[dataColumn];
            if (value) {
                counts[value] = (counts[value] || 0) + 1;
            }
        });

        return {
            type: 'pie',
            data: {
                labels: Object.keys(counts),
                datasets: [{
                    data: Object.values(counts),
                    backgroundColor: generateColors(Object.keys(counts).length)
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    title: {
                        display: true,
                        text: suggestion.title
                    }
                }
            }
        };
    } else {
        // For other chart types
        const labels = currentData.data.map(row => row[xAxis]);
        const values = yAxis ? currentData.data.map(row => row[yAxis]) : [];

        return {
            type: type,
            data: {
                labels: labels,
                datasets: [{
                    label: yAxis || 'Value',
                    data: values,
                    backgroundColor: type === 'scatter' ? 'rgba(79, 70, 229, 0.5)' : 'rgba(79, 70, 229, 0.8)',
                    borderColor: 'rgba(79, 70, 229, 1)',
                    borderWidth: 2,
                    tension: type === 'line' ? 0.4 : 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: type !== 'scatter'
                    },
                    title: {
                        display: true,
                        text: suggestion.title
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: xAxis
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: yAxis || 'Value'
                        }
                    }
                }
            }
        };
    }
}

// Create or update chart
function createChart(config) {
    if (currentChart) {
        currentChart.destroy();
    }

    const ctx = chartCanvas.getContext('2d');
    currentChart = new Chart(ctx, config);
}

// Generate colors for pie chart
function generateColors(count) {
    const colors = [
        'rgba(79, 70, 229, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(14, 165, 233, 0.8)',
        'rgba(132, 204, 22, 0.8)'
    ];

    const result = [];
    for (let i = 0; i < count; i++) {
        result.push(colors[i % colors.length]);
    }
    return result;
}

// Reset app to initial state
function resetApp() {
    currentData = null;
    if (currentChart) {
        currentChart.destroy();
        currentChart = null;
    }

    uploadSection.style.display = 'block';
    resultsSection.style.display = 'none';
    uploadArea.style.display = 'block';
    loadingIndicator.style.display = 'none';
    fileInput.value = '';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}
