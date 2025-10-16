import { Sparkles, BarChart3, ShieldCheck, Zap, ArrowRight, Stars } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const features = [
  {
    icon: BarChart3,
    title: 'Instant Visuals',
    description: 'Upload a spreadsheet and get a gallery of tailored charts in seconds.',
  },
  {
    icon: ShieldCheck,
    title: 'Trustworthy Insights',
    description: 'Automatic data profiling surfaces anomalies and validation warnings.',
  },
  {
    icon: Zap,
    title: 'No Sign-up Needed',
    description: 'Start exploring immediately. No onboarding hurdles, no paywall.',
  },
];

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black" />
        <div className="absolute -top-10 left-[-12rem] h-[28rem] w-[28rem] rounded-full bg-sky-500/20 blur-3xl sm:left-[-18rem]" />
        <div className="absolute bottom-[-12rem] right-[-10rem] h-[32rem] w-[32rem] rounded-full bg-violet-500/25 blur-3xl" />
      </div>

      <header className="relative z-10 px-6 py-6 sm:px-12 sm:py-8">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-blue-500 to-violet-500 text-white shadow-lg shadow-sky-900/50">
              <span className="absolute inset-0 -z-10 animate-ping rounded-2xl bg-sky-500/40" />
              <Sparkles className="relative h-6 w-6" />
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-400">
                Smart Excel Visualizer
              </p>
              <h1 className="flex items-center gap-2 text-xl font-semibold text-white sm:text-2xl">
                From spreadsheet to story in one click
                <Stars className="hidden h-5 w-5 text-amber-200 sm:block" />
              </h1>
            </div>
          </div>
          <span className="hidden text-xs font-medium uppercase tracking-[0.35em] text-slate-400 md:inline">
            Free tier · No credit card
          </span>
        </div>
      </header>

      <main className="relative z-10 flex-1">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pb-20 pt-10 sm:px-12 sm:pt-12 lg:gap-16">
          <section className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr),minmax(0,1.1fr)]">
            <div className="space-y-6 lg:pr-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium text-slate-200 shadow-lg shadow-black/40 backdrop-blur">
                Ready in minutes
              </div>
              <h2 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                Turn raw Excel data into an interactive analytics hub.
              </h2>
              <p className="text-base text-slate-300 sm:text-lg">
                Drop any Excel or CSV file to unlock AI-assisted profiles, smart chart suggestions,
                and polished dashboards. Built for analysts, teams, and founders who need clarity now.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  onClick={onGetStarted}
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-violet-500 px-8 py-3 text-base font-semibold text-white shadow-[0_18px_40px_-20px_rgba(59,130,246,0.8)] transition-all hover:-translate-y-0.5 hover:shadow-[0_24px_55px_-16px_rgba(59,130,246,0.9)]"
                >
                  Try Today for Free
                  <ArrowRight className="h-4 w-4" />
                </button>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                  No login · Unlimited uploads
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-black/50 backdrop-blur xl:p-8">
              <div className="absolute -top-12 right-[-8rem] h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />
              <div className="absolute bottom-[-6rem] left-[-4rem] h-60 w-60 rounded-full bg-violet-500/25 blur-3xl" />
              <div className="relative grid gap-4">
                <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    Auto Insights
                  </p>
                  <p className="mt-2 text-base font-medium text-white">
                    “Revenue spikes 32% in April. Customer churn steady at 4.2%.”
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                      Data Preview
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-white">52,481 rows</p>
                    <p className="text-xs text-slate-400">Clean, profiled, and ready to explore.</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                      Chart Gallery
                    </p>
                    <p className="mt-2 text-sm text-slate-200">
                      Smart bar, line, and composition charts tailored to your schema.
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    Export Ready
                  </p>
                  <p className="mt-2 text-sm text-slate-200">
                    One-click chart exports for decks and investor updates.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-inner shadow-black/40 backdrop-blur"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 via-blue-500 to-violet-500 text-white shadow-lg shadow-sky-900/40">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm text-slate-300">{feature.description}</p>
              </div>
            ))}
          </section>

          <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-900/30 p-8 shadow-2xl shadow-black/50 backdrop-blur sm:p-12">
            <div className="flex flex-col gap-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
                Lightning-fast loading · Works on any device
              </p>
              <h3 className="text-2xl font-semibold text-white sm:text-3xl">
                Start exploring your data today. No setup, no friction.
              </h3>
              <button
                onClick={onGetStarted}
                className="mx-auto inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-black/40 transition-all hover:bg-white/20"
              >
                Try Today for Free
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        </div>
      </main>

      <footer className="relative z-10 px-6 pb-10 pt-6 text-center text-xs text-slate-500 sm:px-12">
        Smart Excel Visualizer · Built for modern teams · Free early-access tier
      </footer>
    </div>
  );
}
