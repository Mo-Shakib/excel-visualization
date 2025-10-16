import { ChartConfig } from '../types/data';
import { ChartCard } from './ChartCard';

interface ChartGridProps {
  charts: ChartConfig[];
  data: any[];
  insights: Record<string, string[]>;
  onEditChart: (chartId: string) => void;
  onRemoveChart: (chartId: string) => void;
}

export function ChartGrid({ charts, data, insights, onEditChart, onRemoveChart }: ChartGridProps) {
  if (charts.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="max-w-sm rounded-3xl border border-white/10 bg-white/10 p-10 text-center shadow-2xl shadow-black/40 backdrop-blur">
          <p className="text-lg font-semibold text-white">Ready when you are</p>
          <p className="mt-2 text-sm text-slate-300">
            Upload a file to let the visualizer build charts automatically. Your dashboards will
            appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-2 pb-8 pt-2">
      <div className="grid gap-6 pb-8 md:grid-cols-2 xl:grid-cols-2">
        {charts.map((chart) => (
          <div key={chart.id} className="min-h-[420px]">
            <ChartCard
              config={chart}
              data={data}
              insights={insights[chart.id]}
              onEdit={() => onEditChart(chart.id)}
              onRemove={() => onRemoveChart(chart.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
