import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartConfig } from '../types/data';

interface ChartProps {
  config: ChartConfig;
  data: any[];
  onDataClick?: (data: any) => void;
}

const COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
];

function processChartData(data: any[], config: ChartConfig) {
  let processedData = [...data];

  if (config.filters) {
    Object.entries(config.filters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        processedData = processedData.filter(row => values.includes(row[key]));
      }
    });
  }

  if (config.xAxis && config.yAxis) {
    const yAxisFields = Array.isArray(config.yAxis) ? config.yAxis : [config.yAxis];

    if (config.aggregation) {
      const grouped = processedData.reduce((acc, row) => {
        const key = row[config.xAxis!];
        if (!acc[key]) {
          acc[key] = { [config.xAxis!]: key };
          yAxisFields.forEach(field => {
            acc[key][field] = [];
          });
        }

        yAxisFields.forEach(field => {
          const value = Number(row[field]);
          if (!isNaN(value)) {
            acc[key][field].push(value);
          }
        });

        return acc;
      }, {} as Record<string, any>);

      processedData = Object.values(grouped).map(group => {
        const result = { [config.xAxis!]: group[config.xAxis!] };

        yAxisFields.forEach(field => {
          const values = group[field];
          if (values.length > 0) {
            switch (config.aggregation) {
              case 'sum':
                result[field] = values.reduce((sum: number, v: number) => sum + v, 0);
                break;
              case 'avg':
                result[field] = values.reduce((sum: number, v: number) => sum + v, 0) / values.length;
                break;
              case 'count':
                result[field] = values.length;
                break;
              case 'min':
                result[field] = Math.min(...values);
                break;
              case 'max':
                result[field] = Math.max(...values);
                break;
              case 'median':
                const sorted = [...values].sort((a, b) => a - b);
                result[field] = sorted.length % 2 === 0
                  ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
                  : sorted[Math.floor(sorted.length / 2)];
                break;
              default:
                result[field] = values[0];
            }
          } else {
            result[field] = 0;
          }
        });

        return result;
      });
    }

    if (config.sortBy) {
      processedData.sort((a, b) => {
        const aVal = a[config.sortBy!];
        const bVal = b[config.sortBy!];
        const order = config.sortOrder === 'desc' ? -1 : 1;
        return (aVal > bVal ? 1 : -1) * order;
      });
    }

    if (config.topN && config.topN > 0) {
      processedData = processedData.slice(0, config.topN);
    }
  }

  return processedData;
}

export function Chart({ config, data, onDataClick }: ChartProps) {
  const chartData = processChartData(data, config);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No data available for this chart
      </div>
    );
  }

  const yAxisFields = config.yAxis
    ? Array.isArray(config.yAxis)
      ? config.yAxis
      : [config.yAxis]
    : [];

  const renderChart = () => {
    switch (config.type) {
      case 'bar':
      case 'stacked-bar':
      case '100-stacked-bar':
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey={config.xAxis} stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
              }}
            />
            <Legend />
            {yAxisFields.map((field, index) => (
              <Bar
                key={field}
                dataKey={field}
                fill={COLORS[index % COLORS.length]}
                stackId={config.stacked ? 'stack' : undefined}
                onClick={onDataClick}
              />
            ))}
          </BarChart>
        );

      case 'line':
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey={config.xAxis} stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
              }}
            />
            <Legend />
            {yAxisFields.map((field, index) => (
              <Line
                key={field}
                type="monotone"
                dataKey={field}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={{ fill: COLORS[index % COLORS.length], r: 4 }}
              />
            ))}
          </LineChart>
        );

      case 'area':
      case 'stacked-area':
      case '100-stacked-area':
        return (
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey={config.xAxis} stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
              }}
            />
            <Legend />
            {yAxisFields.map((field, index) => (
              <Area
                key={field}
                type="monotone"
                dataKey={field}
                fill={COLORS[index % COLORS.length]}
                stroke={COLORS[index % COLORS.length]}
                stackId={config.stacked ? 'stack' : undefined}
              />
            ))}
          </AreaChart>
        );

      case 'scatter':
        return (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey={config.xAxis} stroke="#6b7280" />
            <YAxis dataKey={yAxisFields[0]} stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
              }}
            />
            <Legend />
            <Scatter
              name={`${config.xAxis} vs ${yAxisFields[0]}`}
              data={chartData}
              fill={COLORS[0]}
            />
          </ScatterChart>
        );

      case 'pie':
        const pieData = config.colorBy
          ? chartData.reduce((acc, row) => {
              const key = row[config.colorBy!];
              const existing = acc.find(item => item.name === key);
              if (existing) {
                existing.value += 1;
              } else {
                acc.push({ name: key, value: 1 });
              }
              return acc;
            }, [] as { name: string; value: number }[])
          : chartData.map((row, index) => ({
              name: row[config.xAxis!] || `Item ${index + 1}`,
              value: Number(row[yAxisFields[0]] || 0),
            }));

        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
              }}
            />
          </PieChart>
        );

      case 'histogram':
        const numericValues = chartData
          .map(row => Number(row[config.xAxis!]))
          .filter(v => !isNaN(v))
          .sort((a, b) => a - b);

        if (numericValues.length === 0) return null;

        const min = numericValues[0];
        const max = numericValues[numericValues.length - 1];
        const binCount = Math.min(20, Math.ceil(Math.sqrt(numericValues.length)));
        const binSize = (max - min) / binCount;

        const bins = Array.from({ length: binCount }, (_, i) => {
          const binStart = min + i * binSize;
          const binEnd = binStart + binSize;
          const count = numericValues.filter(v => v >= binStart && v < binEnd).length;
          return {
            range: `${binStart.toFixed(1)}-${binEnd.toFixed(1)}`,
            count,
          };
        });

        return (
          <BarChart data={bins}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="range" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
              }}
            />
            <Bar dataKey="count" fill={COLORS[0]} />
          </BarChart>
        );

      default:
        return <div>Chart type not supported</div>;
    }
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}
