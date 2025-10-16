import { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export function UploadZone({ onFileSelect, isProcessing }: UploadZoneProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (isProcessing) return;

      const file = e.dataTransfer.files[0];
      if (file && isValidFile(file)) {
        onFileSelect(file);
      }
    },
    [onFileSelect, isProcessing]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && isValidFile(file)) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const isValidFile = (file: File): boolean => {
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileName = file.name.toLowerCase();
    return validExtensions.some(ext => fileName.endsWith(ext));
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black" />
        <div className="absolute -left-40 top-10 h-[28rem] w-[28rem] rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-violet-500/25 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-3xl px-6 py-12">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-10 text-center shadow-2xl shadow-black/40 backdrop-blur">
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            Smart Excel Visualizer
          </h1>
          <p className="mt-3 text-lg text-slate-300">
            Drop your spreadsheet and watch insights come to life instantly.
          </p>

          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="mt-10 flex flex-col items-center rounded-3xl border border-dashed border-white/20 bg-white/5 p-12 transition-all hover:border-sky-400/50 hover:bg-sky-500/10"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-blue-500 to-violet-500 text-white shadow-lg">
              <Upload className="h-8 w-8" />
            </span>
            <p className="mt-6 text-xl font-semibold text-white">
              Drop your Excel file here
            </p>
            <p className="mt-2 text-sm text-slate-300">or choose a file from your device</p>

            <label className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-sky-400/50 hover:bg-sky-500/20 cursor-pointer">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileInput}
                disabled={isProcessing}
                className="hidden"
              />
              {isProcessing ? 'Processing...' : 'Select File'}
            </label>

            <p className="mt-4 text-xs uppercase tracking-[0.35em] text-slate-400">
              Supports .xlsx · .xls · .csv up to 50MB
            </p>
          </div>

          <div className="mt-12 grid gap-4 text-left sm:grid-cols-3">
            {[
              { number: '01', headline: 'Auto profiling', description: 'We classify columns and highlight data health instantly.' },
              { number: '02', headline: 'Smart visuals', description: 'Recommended charts appear tailored to your dataset.' },
              { number: '03', headline: 'Refine & export', description: 'Fine-tune visuals, overlay insights, and share in seconds.' },
            ].map((item) => (
              <div
                key={item.number}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
              >
                <p className="text-2xl font-semibold text-white">{item.number}</p>
                <h3 className="mt-3 text-sm font-semibold text-white">{item.headline}</h3>
                <p className="mt-2 text-xs text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
