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
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/70 via-slate-900/50 to-slate-950/80 shadow-2xl shadow-black/40 backdrop-blur">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
        <div>
          <h3 className="text-lg font-semibold text-white">{config.title}</h3>
          <p className="text-xs text-slate-400">Auto-generated insight</p>
        </div>
        <div className="relative group">
          <button className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-200 transition-colors hover:bg-white/10">
            <MoreVertical className="w-4 h-4" />
          </button>
          <div className="invisible absolute right-0 top-11 w-44 rounded-2xl border border-white/10 bg-slate-900/95 p-1 opacity-0 shadow-xl shadow-black/50 backdrop-blur transition-all group-hover:visible group-hover:opacity-100">
            <button
              onClick={onEdit}
              className="w-full rounded-xl px-4 py-2 text-left text-sm text-slate-200 hover:bg-white/5"
            >
              Edit Chart
            </button>
            <button
              onClick={onRemove}
              className="w-full rounded-xl px-4 py-2 text-left text-sm text-rose-200 hover:bg-rose-500/10"
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        <Chart config={config} data={data} />
      </div>

      {insights && insights.length > 0 && (
        <div className="border-t border-sky-400/20 bg-sky-500/10 px-6 py-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-lg bg-sky-500/20 text-sky-200">
              <Lightbulb className="w-4 h-4" />
            </span>
            <div className="flex-1 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-100">Insights</p>
              <ul className="space-y-1 text-sm text-sky-100">
                {insights.map((insight, index) => (
                  <li key={index} className="leading-snug">
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
