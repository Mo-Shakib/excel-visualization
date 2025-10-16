import { Loader2, Sparkles } from 'lucide-react';

interface LoadingOverlayProps {
  headline?: string;
  message: string;
}

export function LoadingOverlay({ headline = 'Analyzing your spreadsheet', message }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl">
      <div className="flex flex-col items-center gap-6 text-center px-8">
        <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-blue-500 to-violet-500 text-white shadow-[0_20px_50px_-18px_rgba(59,130,246,0.65)]">
          <span className="absolute inset-0 -z-10 animate-ping rounded-2xl bg-sky-500/40" />
          <Loader2 className="h-8 w-8 animate-spin" />
        </span>
        <div className="space-y-2">
          <p className="inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
            <Sparkles className="h-3 w-3" />
            {headline}
          </p>
          <p className="text-lg font-semibold text-white">{message}</p>
        </div>
        <p className="text-sm text-slate-400">Hang tight &mdash; premium-grade insights are loading.</p>
      </div>
    </div>
  );
}
