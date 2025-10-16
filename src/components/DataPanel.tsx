import { ColumnMetadata, DataQuality } from '../types/data';
import { Database, Hash, Type, Calendar, Tag, AlertCircle } from 'lucide-react';

interface DataPanelProps {
  columns: ColumnMetadata[];
  quality: DataQuality;
  sheetName: string;
}

const typeIcons = {
  numeric: Hash,
  categorical: Tag,
  datetime: Calendar,
  text: Type,
  boolean: Tag,
  identifier: Database,
};

const typeColors = {
  numeric: 'bg-blue-100 text-blue-700',
  categorical: 'bg-green-100 text-green-700',
  datetime: 'bg-purple-100 text-purple-700',
  text: 'bg-gray-100 text-gray-700',
  boolean: 'bg-yellow-100 text-yellow-700',
  identifier: 'bg-pink-100 text-pink-700',
};

export function DataPanel({ columns, quality, sheetName }: DataPanelProps) {
  return (
    <div className="h-full bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">{sheetName}</h2>
        <p className="text-sm text-gray-500 mb-6">
          {quality.totalRows.toLocaleString()} rows × {quality.totalColumns} columns
        </p>

        {quality.warnings.length > 0 && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800 mb-2">Data Quality Warnings</p>
                <ul className="text-xs text-amber-700 space-y-1">
                  {quality.warnings.slice(0, 3).map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                  {quality.warnings.length > 3 && (
                    <li className="font-medium">+{quality.warnings.length - 3} more</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Fields</h3>
          {columns.map((col) => {
            const Icon = typeIcons[col.type];
            const colorClass = typeColors[col.type];

            return (
              <div
                key={col.name}
                className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-medium text-gray-900 text-sm flex-1">
                    {col.originalName}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}
                  >
                    <Icon className="w-3 h-3" />
                    {col.type}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Unique values:</span>
                    <span className="font-medium">{col.uniqueCount.toLocaleString()}</span>
                  </div>

                  {col.missingCount > 0 && (
                    <div className="flex justify-between">
                      <span>Missing:</span>
                      <span className="font-medium text-orange-600">
                        {col.missingPercent.toFixed(1)}%
                      </span>
                    </div>
                  )}

                  {col.type === 'numeric' && (
                    <>
                      {col.min !== undefined && col.max !== undefined && (
                        <div className="flex justify-between">
                          <span>Range:</span>
                          <span className="font-medium">
                            {col.min.toFixed(2)} - {col.max.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {col.mean !== undefined && (
                        <div className="flex justify-between">
                          <span>Mean:</span>
                          <span className="font-medium">{col.mean.toFixed(2)}</span>
                        </div>
                      )}
                    </>
                  )}

                  {col.sampleValues.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <span className="text-gray-500">Sample: </span>
                      <span className="font-medium">
                        {col.sampleValues.slice(0, 3).map(String).join(', ')}
                        {col.sampleValues.length > 3 && '...'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
