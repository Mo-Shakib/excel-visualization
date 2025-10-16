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
    <div className="h-full bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Chart Settings</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chart Title
            </label>
            <input
              type="text"
              value={config.title}
              onChange={(e) => handleUpdate({ title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chart Type
            </label>
            <select
              value={config.type}
              onChange={(e) => handleUpdate({ type: e.target.value as ChartType })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  X-Axis
                </label>
                <select
                  value={config.xAxis || ''}
                  onChange={(e) => handleUpdate({ xAxis: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Y-Axis
                </label>
                <select
                  value={Array.isArray(config.yAxis) ? config.yAxis[0] : config.yAxis || ''}
                  onChange={(e) => handleUpdate({ yAxis: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aggregation
              </label>
              <select
                value={config.aggregation || 'sum'}
                onChange={(e) => handleUpdate({ aggregation: e.target.value as AggregationType })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color By
              </label>
              <select
                value={config.colorBy || ''}
                onChange={(e) => handleUpdate({ colorBy: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Field
              </label>
              <select
                value={config.xAxis || ''}
                onChange={(e) => handleUpdate({ xAxis: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={config.sortBy || ''}
              onChange={(e) => handleUpdate({ sortBy: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort Order
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="asc"
                    checked={config.sortOrder === 'asc'}
                    onChange={(e) => handleUpdate({ sortOrder: 'asc' })}
                    className="mr-2"
                  />
                  Ascending
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="desc"
                    checked={config.sortOrder === 'desc'}
                    onChange={(e) => handleUpdate({ sortOrder: 'desc' })}
                    className="mr-2"
                  />
                  Descending
                </label>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Limit to Top N
            </label>
            <input
              type="number"
              value={config.topN || ''}
              onChange={(e) => handleUpdate({ topN: e.target.value ? parseInt(e.target.value) : undefined })}
              placeholder="All records"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {(config.type === 'stacked-bar' || config.type === 'stacked-area') && (
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.stacked || false}
                  onChange={(e) => handleUpdate({ stacked: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Enable Stacking</span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
