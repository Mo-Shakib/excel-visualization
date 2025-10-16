import { ChartConfig } from '../types/data';
import { Chart } from './Chart';
import { MoreVertical, Lightbulb } from 'lucide-react';

interface ChartCardProps {
  config: ChartConfig;
  data: any[];
  insights?: string[];
  onEdit: () => void;
  onRemove: () => void;
}

export function ChartCard({ config, data, insights, onEdit, onRemove }: ChartCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
        <h3 className="font-semibold text-gray-900">{config.title}</h3>
        <div className="relative group">
          <button className="p-1 hover:bg-gray-200 rounded transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
          <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
            <button
              onClick={onEdit}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
            >
              Edit Chart
            </button>
            <button
              onClick={onRemove}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 min-h-[300px]">
        <Chart config={config} data={data} />
      </div>

      {insights && insights.length > 0 && (
        <div className="px-6 py-4 bg-blue-50 border-t border-blue-100">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-medium text-blue-900 mb-1">Insights</p>
              <ul className="text-xs text-blue-700 space-y-0.5">
                {insights.map((insight, index) => (
                  <li key={index}>{insight}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
