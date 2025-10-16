import { useEffect, useMemo, useState } from 'react';
import { UploadZone } from './components/UploadZone';
import { DataPanel } from './components/DataPanel';
import { ChartGrid } from './components/ChartGrid';
import { Inspector } from './components/Inspector';
import { parseExcelFile } from './utils/excelParser';
import { generateChartRecommendations } from './utils/chartRecommendations';
import { ParsedSheet, ChartConfig, ChartRecommendation } from './types/data';
import { Download, Sparkles, LineChart, Layers, AlertTriangle, UploadCloud } from 'lucide-react';
import { LandingPage } from './components/LandingPage';
import { LoadingOverlay } from './components/LoadingOverlay';

type AppView = 'landing' | 'upload' | 'dashboard';

const LOADING_MESSAGES = [
  'Profiling columns and data quality...',
  'Scouting for chart-worthy relationships...',
  'Composing narrative-ready insights...',
  'Polishing your dashboard experience...',
];
const MIN_PROCESSING_MS = 3000;

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentSheet, setCurrentSheet] = useState<ParsedSheet | null>(null);
  const [charts, setCharts] = useState<ChartConfig[]>([]);
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [insights, setInsights] = useState<Record<string, string[]>>({});
  const [view, setView] = useState<AppView>('landing');
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  useEffect(() => {
    if (!isProcessing) {
      return;
    }

    setLoadingMessageIndex(0);
    const interval = window.setInterval(() => {
      setLoadingMessageIndex((previous) => (previous + 1) % LOADING_MESSAGES.length);
    }, 2200);

    return () => window.clearInterval(interval);
  }, [isProcessing]);

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    const startTime = Date.now();
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
      setView('dashboard');
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Failed to process file. Please ensure it is a valid Excel file.');
    } finally {
      const elapsed = Date.now() - startTime;
      if (elapsed < MIN_PROCESSING_MS) {
        await new Promise(resolve => setTimeout(resolve, MIN_PROCESSING_MS - elapsed));
      }
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

  const totalInsights = useMemo(
    () =>
      Object.values(insights).reduce((count, list) => {
        if (!list || list.length === 0) return count;
        return count + list.length;
      }, 0),
    [insights]
  );

  const handleReset = () => {
    setCurrentSheet(null);
    setCharts([]);
    setSelectedChart(null);
    setInsights({});
    setView('upload');
  };

  if (view === 'landing') {
    return (
      <>
        <LandingPage onGetStarted={() => setView('upload')} />
        {isProcessing && (
          <LoadingOverlay message={LOADING_MESSAGES[loadingMessageIndex]} />
        )}
      </>
    );
  }

  if (view === 'upload') {
    return (
      <>
        <UploadZone
          onFileSelect={handleFileSelect}
          isProcessing={isProcessing}
          onBack={() => setView('landing')}
        />
        {isProcessing && (
          <LoadingOverlay message={LOADING_MESSAGES[loadingMessageIndex]} />
        )}
      </>
    );
  }

  if (!currentSheet) {
    return null;
  }

  const selectedChartConfig = charts.find((c) => c.id === selectedChart) || null;
  const quickStats = [
    {
      id: 'rows',
      label: 'Rows processed',
      value: currentSheet.quality.totalRows.toLocaleString(),
      note: `${currentSheet.quality.totalColumns} columns detected`,
      Icon: LineChart,
      tone: 'bg-sky-500/10 text-sky-200 border border-sky-400/30',
    },
    {
      id: 'charts',
      label: 'Visuals generated',
      value: charts.length.toString(),
      note: 'Interactive charts ready',
      Icon: Layers,
      tone: 'bg-violet-500/10 text-violet-200 border border-violet-400/30',
    },
    {
      id: 'insights',
      label: 'Insights surfaced',
      value: totalInsights.toString(),
      note: totalInsights > 0 ? 'Auto discoveries' : 'Ready to explore',
      Icon: Sparkles,
      tone: 'bg-amber-500/10 text-amber-200 border border-amber-400/30',
    },
    {
      id: 'warnings',
      label: 'Data warnings',
      value: currentSheet.quality.warnings.length.toString(),
      note:
        currentSheet.quality.warnings.length > 0
          ? 'Review recommended'
          : 'All clear',
      Icon: AlertTriangle,
      tone: currentSheet.quality.warnings.length > 0
        ? 'bg-rose-500/10 text-rose-200 border border-rose-400/30'
        : 'bg-emerald-500/10 text-emerald-200 border border-emerald-400/30',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black" />
        <div className="absolute -left-32 top-12 h-[28rem] w-[28rem] rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-violet-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="px-6 pt-8 pb-4 sm:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl shadow-black/40 px-6 py-6 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-blue-500 to-violet-500 text-white shadow-lg">
                <Sparkles className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Vexcel</h1>
                <p className="text-sm text-slate-300 mt-1">
                  {currentSheet.name} · {currentSheet.quality.totalRows.toLocaleString()} rows analyzed
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportImage}
                className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-900/30 transition-all hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
              >
                <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:scale-105" />
                Export Insights
              </button>
              <button
                onClick={handleReset}
                className="group flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-all hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <UploadCloud className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                Load Another File
              </button>
            </div>
          </div>
        </header>

        <section className="px-6 pb-8 sm:px-8">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {quickStats.map((stat) => (
              <div
                key={stat.id}
                className="flex h-full min-h-[170px] flex-col justify-between rounded-3xl border border-white/10 bg-white/10 p-6 shadow-inner shadow-black/40 backdrop-blur transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.tone}`}>
                    <stat.Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-semibold text-white">
                      {stat.value}
                    </p>
                    <p className="text-xs text-slate-400">{stat.note}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex-1 flex flex-col px-4 pb-8 sm:px-6">
          <div className="flex-1 flex gap-6 overflow-hidden">
            <div className="hidden lg:block lg:w-[20rem] lg:flex-shrink-0">
              <div className="sticky top-8">
                <DataPanel
                  columns={currentSheet.columns}
                  quality={currentSheet.quality}
                  sheetName={currentSheet.name}
                />
              </div>
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
              <div className="hidden xl:block xl:w-[21rem] xl:flex-shrink-0">
                <Inspector
                  chart={selectedChartConfig}
                  columns={currentSheet.columns}
                  onUpdate={handleUpdateChart}
                  onClose={() => setSelectedChart(null)}
                />
              </div>
            )}
          </div>

          <div className="mt-6 lg:hidden">
            <DataPanel
              columns={currentSheet.columns}
              quality={currentSheet.quality}
              sheetName={currentSheet.name}
            />
          </div>
        </div>
      </div>
      {isProcessing && (
        <LoadingOverlay message={LOADING_MESSAGES[loadingMessageIndex]} />
      )}
    </div>
  );
}

export default App;
