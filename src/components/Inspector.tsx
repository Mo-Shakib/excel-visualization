import { useState } from 'react';
import { ChartConfig, ChartType, AggregationType, ColumnMetadata } from '../types/data';
import { X } from 'lucide-react';

interface InspectorProps {
  chart: ChartConfig | null;
  columns: ColumnMetadata[];
  onUpdate: (config: ChartConfig) => void;
  onClose: () => void;
}

const chartTypes: { value: ChartType; label: string }[] = [
  { value: 'bar', label: 'Bar Chart' },
  { value: 'line', label: 'Line Chart' },
  { value: 'area', label: 'Area Chart' },
  { value: 'scatter', label: 'Scatter Plot' },
  { value: 'pie', label: 'Pie Chart' },
  { value: 'histogram', label: 'Histogram' },
  { value: 'stacked-bar', label: 'Stacked Bar' },
  { value: 'stacked-area', label: 'Stacked Area' },
];

const aggregations: { value: AggregationType; label: string }[] = [
  { value: 'sum', label: 'Sum' },
  { value: 'avg', label: 'Average' },
  { value: 'count', label: 'Count' },
  { value: 'min', label: 'Minimum' },
  { value: 'max', label: 'Maximum' },
  { value: 'median', label: 'Median' },
];

export function Inspector({ chart, columns, onUpdate, onClose }: InspectorProps) {
  const [config, setConfig] = useState<ChartConfig | null>(chart);

  if (!config) return null;

  const handleUpdate = (updates: Partial<ChartConfig>) => {
    const updated = { ...config, ...updates };
    setConfig(updated);
    onUpdate(updated);
  };

  const numericColumns = columns.filter(c => c.type === 'numeric');
  const categoricalColumns = columns.filter(c => c.type === 'categorical');
  const dateColumns = columns.filter(c => c.type === 'datetime');
  const allDataColumns = [...categoricalColumns, ...dateColumns, ...numericColumns];

  return (
    <div className="h-full overflow-hidden rounded-3xl border border-white/10 bg-white/10 backdrop-blur">
      <div className="h-full overflow-y-auto px-6 py-6 text-slate-100">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Chart Settings</h2>
          <button
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 p-1.5 text-slate-200 transition-colors hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Chart Title
            </label>
            <input
              type="text"
              value={config.title}
              onChange={(e) => handleUpdate({ title: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              placeholder="Give this chart a memorable name"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Chart Type
            </label>
            <select
              value={config.type}
              onChange={(e) => handleUpdate({ type: e.target.value as ChartType })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            >
              {chartTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {config.type !== 'pie' && config.type !== 'histogram' && (
            <>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  X-Axis
                </label>
                <select
                  value={config.xAxis || ''}
                  onChange={(e) => handleUpdate({ xAxis: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                >
                  <option value="">Select field...</option>
                  {allDataColumns.map((col) => (
                    <option key={col.name} value={col.originalName}>
                      {col.originalName} ({col.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Y-Axis
                </label>
                <select
                  value={Array.isArray(config.yAxis) ? config.yAxis[0] : config.yAxis || ''}
                  onChange={(e) => handleUpdate({ yAxis: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                >
                  <option value="">Select field...</option>
                  {numericColumns.map((col) => (
                    <option key={col.name} value={col.originalName}>
                      {col.originalName}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {(config.type === 'bar' ||
            config.type === 'stacked-bar' ||
            config.type === '100-stacked-bar') && (
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Aggregation
              </label>
              <select
                value={config.aggregation || 'sum'}
                onChange={(e) => handleUpdate({ aggregation: e.target.value as AggregationType })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              >
                {aggregations.map((agg) => (
                  <option key={agg.value} value={agg.value}>
                    {agg.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {config.type === 'pie' && (
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Color By
              </label>
              <select
                value={config.colorBy || ''}
                onChange={(e) => handleUpdate({ colorBy: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              >
                <option value="">Select field...</option>
                {categoricalColumns.map((col) => (
                  <option key={col.name} value={col.originalName}>
                    {col.originalName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {config.type === 'histogram' && (
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Field
              </label>
              <select
                value={config.xAxis || ''}
                onChange={(e) => handleUpdate({ xAxis: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              >
                <option value="">Select field...</option>
                {numericColumns.map((col) => (
                  <option key={col.name} value={col.originalName}>
                    {col.originalName}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Sort By
            </label>
            <select
              value={config.sortBy || ''}
              onChange={(e) => handleUpdate({ sortBy: e.target.value || undefined })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            >
              <option value="">None</option>
              {allDataColumns.map((col) => (
                <option key={col.name} value={col.originalName}>
                  {col.originalName}
                </option>
              ))}
            </select>
          </div>

          {config.sortBy && (
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Sort Order
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="asc"
                    checked={config.sortOrder === 'asc'}
                    onChange={(e) => handleUpdate({ sortOrder: 'asc' })}
                    className="mr-2 accent-sky-500"
                  />
                  Ascending
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="desc"
                    checked={config.sortOrder === 'desc'}
                    onChange={(e) => handleUpdate({ sortOrder: 'desc' })}
                    className="mr-2 accent-sky-500"
                  />
                  Descending
                </label>
              </div>
            </div>
          )}

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Limit to Top N
            </label>
            <input
              type="number"
              value={config.topN || ''}
              onChange={(e) => handleUpdate({ topN: e.target.value ? parseInt(e.target.value) : undefined })}
              placeholder="All records"
              min="1"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            />
          </div>

          {(config.type === 'stacked-bar' || config.type === 'stacked-area') && (
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.stacked || false}
                  onChange={(e) => handleUpdate({ stacked: e.target.checked })}
                  className="mr-2 accent-sky-500"
                />
                <span className="text-sm font-medium text-slate-200">Enable Stacking</span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
