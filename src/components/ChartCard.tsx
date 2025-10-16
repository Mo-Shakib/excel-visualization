import { ChartConfig } from '../types/data';
import { Chart } from './Chart';
import { MoreHorizontal, Wand2 } from 'lucide-react';

interface ChartCardProps {
  config: ChartConfig;
  data: any[];
  insights?: string[];
  onEdit: () => void;
  onRemove: () => void;
}

export function ChartCard({ config, data, insights, onEdit, onRemove }: ChartCardProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900/70 via-slate-900/50 to-slate-950/80 shadow-2xl shadow-black/40 backdrop-blur">
      <div className="flex items-start justify-between border-b border-white/10 px-6 py-5">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-white">
            {config.title}
          </h3>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Auto-generated insight</p>
        </div>
        <div className="relative group flex flex-col items-end gap-2">
          <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-300">
            Live
          </span>
          <button className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-200 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            <MoreHorizontal className="w-4 h-4" />
          </button>
          <div className="invisible absolute right-0 top-16 w-44 rounded-2xl border border-white/10 bg-slate-900/95 p-1 opacity-0 shadow-xl shadow-black/50 backdrop-blur transition-all group-hover:visible group-hover:opacity-100">
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
              <Wand2 className="w-4 h-4" />
            </span>
            <div className="flex-1 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-100">Insights</p>
              <ul className="space-y-1.5 text-sm leading-relaxed text-sky-100">
                {insights.map((insight, index) => (
                  <li key={index}>
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
