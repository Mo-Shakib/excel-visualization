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
  numeric: 'bg-sky-500/10 text-sky-200 border border-sky-400/20',
  categorical: 'bg-emerald-500/10 text-emerald-200 border border-emerald-400/20',
  datetime: 'bg-violet-500/10 text-violet-200 border border-violet-400/20',
  text: 'bg-slate-500/10 text-slate-200 border border-slate-400/20',
  boolean: 'bg-amber-500/10 text-amber-200 border border-amber-400/20',
  identifier: 'bg-pink-500/10 text-pink-200 border border-pink-400/20',
};

export function DataPanel({ columns, quality, sheetName }: DataPanelProps) {
  return (
    <div className="h-full rounded-3xl border border-white/10 bg-white/10 backdrop-blur overflow-hidden">
      <div className="h-full overflow-y-auto px-5 py-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-white">{sheetName}</h2>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mt-2">
            {quality.totalRows.toLocaleString()} rows · {quality.totalColumns} columns
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner shadow-black/30">
            <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">Duplicates</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {quality.duplicateRows.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400">
              {quality.duplicateRows > 0 ? 'Rows to review' : 'No duplicates detected'}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner shadow-black/30">
            <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">Missing Data</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {Object.values(quality.missingValuesByColumn).reduce((sum, value) => sum + value, 0).toLocaleString()}
            </p>
            <p className="text-xs text-slate-400">Total empty cells</p>
          </div>
        </div>

        {quality.warnings.length > 0 && (
          <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 shadow-inner shadow-amber-900/30">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-amber-500/20 p-2">
                <AlertCircle className="w-4 h-4 text-amber-200" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-amber-100">Data quality warnings</p>
                <ul className="text-xs text-amber-200 space-y-1">
                  {quality.warnings.slice(0, 3).map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                  {quality.warnings.length > 3 && (
                    <li className="font-medium text-amber-100">
                      +{quality.warnings.length - 3} more
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-[11px] uppercase tracking-[0.35em] text-slate-400">
            Fields
          </h3>
          <div className="mt-3 space-y-3">
            {columns.map((col) => {
              const Icon = typeIcons[col.type];
              const colorClass = typeColors[col.type];

              return (
                <div
                  key={col.name}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition-all hover:bg-white/10 hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="flex-1 text-sm font-medium text-white">
                      {col.originalName}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${colorClass}`}
                    >
                      <Icon className="w-3 h-3" />
                      {col.type}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-[11px] text-slate-300">
                    <div className="flex justify-between">
                      <span>Unique values</span>
                      <span className="font-semibold text-white">{col.uniqueCount.toLocaleString()}</span>
                    </div>

                    {col.missingCount > 0 && (
                      <div className="flex justify-between">
                        <span>Missing</span>
                        <span className="font-semibold text-amber-200">
                          {col.missingPercent.toFixed(1)}%
                        </span>
                      </div>
                    )}

                    {col.type === 'numeric' && (
                      <>
                        {col.min !== undefined && col.max !== undefined && (
                          <div className="flex justify-between">
                            <span>Range</span>
                            <span className="font-semibold text-white">
                              {col.min.toFixed(2)} – {col.max.toFixed(2)}
                            </span>
                          </div>
                        )}
                        {col.mean !== undefined && (
                          <div className="flex justify-between">
                            <span>Mean</span>
                            <span className="font-semibold text-white">{col.mean.toFixed(2)}</span>
                          </div>
                        )}
                      </>
                    )}

                    {col.sampleValues.length > 0 && (
                      <div className="mt-3 rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-[11px] text-slate-200">
                        <span className="text-slate-400">Sample </span>
                        <span className="font-medium text-white">
                          {col.sampleValues.slice(0, 3).map(String).join(', ')}
                          {col.sampleValues.length > 3 && '…'}
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
    </div>
  );
}
