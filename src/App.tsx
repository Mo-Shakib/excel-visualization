import { useState } from 'react';
import { UploadZone } from './components/UploadZone';
import { DataPanel } from './components/DataPanel';
import { ChartGrid } from './components/ChartGrid';
import { Inspector } from './components/Inspector';
import { parseExcelFile } from './utils/excelParser';
import { generateChartRecommendations } from './utils/chartRecommendations';
import { ParsedSheet, ChartConfig, ChartRecommendation } from './types/data';
import { Download, Plus } from 'lucide-react';

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentSheet, setCurrentSheet] = useState<ParsedSheet | null>(null);
  const [charts, setCharts] = useState<ChartConfig[]>([]);
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [insights, setInsights] = useState<Record<string, string[]>>({});

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    try {
      const workbook = await parseExcelFile(file);
      const sheet = workbook.sheets[workbook.selectedSheet];
      setCurrentSheet(sheet);

      const recommendations = generateChartRecommendations(sheet.columns, sheet.data);

      const initialCharts = recommendations.map((rec) =>
        recommendationToConfig(rec)
      );
      setCharts(initialCharts);

      const newInsights: Record<string, string[]> = {};
      recommendations.forEach((rec) => {
        if (rec.insights) {
          newInsights[rec.id] = rec.insights;
        }
      });
      setInsights(newInsights);
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Failed to process file. Please ensure it is a valid Excel file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const recommendationToConfig = (rec: ChartRecommendation): ChartConfig => {
    return {
      id: rec.id,
      type: rec.type,
      title: rec.title,
      xAxis: rec.xAxis,
      yAxis: rec.yAxis,
      colorBy: rec.colorBy,
      aggregation: rec.aggregation,
      filters: rec.filters,
    };
  };

  const handleEditChart = (chartId: string) => {
    setSelectedChart(chartId);
  };

  const handleRemoveChart = (chartId: string) => {
    setCharts((prev) => prev.filter((c) => c.id !== chartId));
    setInsights((prev) => {
      const updated = { ...prev };
      delete updated[chartId];
      return updated;
    });
  };

  const handleUpdateChart = (config: ChartConfig) => {
    setCharts((prev) => prev.map((c) => (c.id === config.id ? config : c)));
  };

  const handleExportImage = async () => {
    alert('Export functionality will capture all charts as images. This feature requires additional libraries for production use.');
  };

  const handleReset = () => {
    setCurrentSheet(null);
    setCharts([]);
    setSelectedChart(null);
    setInsights({});
  };

  if (!currentSheet) {
    return <UploadZone onFileSelect={handleFileSelect} isProcessing={isProcessing} />;
  }

  const selectedChartConfig = charts.find((c) => c.id === selectedChart) || null;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Smart Excel Visualizer</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {currentSheet.name} - {currentSheet.quality.totalRows.toLocaleString()} rows
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportImage}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            New File
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 flex-shrink-0">
          <DataPanel
            columns={currentSheet.columns}
            quality={currentSheet.quality}
            sheetName={currentSheet.name}
          />
        </div>

        <div className="flex-1 overflow-hidden">
          <ChartGrid
            charts={charts}
            data={currentSheet.data}
            insights={insights}
            onEditChart={handleEditChart}
            onRemoveChart={handleRemoveChart}
          />
        </div>

        {selectedChart && (
          <div className="w-80 flex-shrink-0">
            <Inspector
              chart={selectedChartConfig}
              columns={currentSheet.columns}
              onUpdate={handleUpdateChart}
              onClose={() => setSelectedChart(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
