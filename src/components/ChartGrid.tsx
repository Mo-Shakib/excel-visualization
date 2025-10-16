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
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-xl font-medium text-gray-500 mb-2">No charts to display</p>
          <p className="text-sm text-gray-400">Charts will appear here once generated</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        {charts.map((chart) => (
          <div key={chart.id} className="min-h-[400px]">
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
