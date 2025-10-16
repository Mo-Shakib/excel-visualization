import { Sparkles, BarChart3, ShieldCheck, Zap, ArrowRight, Stars, MoveRight, FileSpreadsheet, Settings, Share2 } from 'lucide-react';

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

const howItWorks = [
  {
    icon: FileSpreadsheet,
    label: 'Upload your data',
    detail: 'Drag & drop an Excel or CSV file and we automatically profile columns, data quality, and structure.',
  },
  {
    icon: Settings,
    label: 'Customize & explore',
    detail: 'Review smart chart recommendations, tweak fields, and uncover insights surfaced from your dataset.',
  },
  {
    icon: Share2,
    label: 'Share with confidence',
    detail: 'Export polished visuals or continue exploring with your team—no heavy BI setup required.',
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

      <header className="relative z-10 px-6 py-6 sm:px-12 sm:py-10">
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
              <h1 className="flex items-center gap-3 text-2xl font-semibold text-white sm:text-3xl">
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
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-20 pt-12 sm:px-12 sm:pt-16 lg:gap-20">
          <section className="grid items-center gap-16 md:grid-cols-[minmax(0,0.95fr),minmax(0,1fr)]">
            <div className="space-y-8 lg:pr-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium text-slate-200 shadow-lg shadow-black/40 backdrop-blur">
                Ready in minutes
              </div>
              <div className="space-y-6">
                <h2 className="text-[2.8rem] font-semibold leading-[1.1] text-white sm:text-[3.2rem] md:text-[3.6rem]">
                  Turn raw Excel data into an interactive analytics hub.
                </h2>
                <p className="text-base leading-relaxed text-slate-300 sm:text-lg">
                  Drop any Excel or CSV file to unlock AI-assisted profiles, smart chart suggestions,
                  and polished dashboards. Built for analysts, teams, and founders who need clarity now.
                </p>
                <p className="text-sm uppercase tracking-[0.4em] text-slate-500">
                  No login · Unlimited uploads · Free while in early access
                </p>
              </div>
              <button
                onClick={onGetStarted}
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-violet-500 px-9 py-3.5 text-base font-semibold text-white shadow-[0_18px_40px_-18px_rgba(59,130,246,0.75)] transition-all hover:-translate-y-1 hover:shadow-[0_28px_60px_-20px_rgba(59,130,246,0.9)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
              >
                Try Today for Free
                <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem] border border-white/10 bg-white/10 p-8 shadow-2xl shadow-black/50 backdrop-blur sm:p-9 md:mt-0 mt-10 xl:p-10">
              <div className="absolute -top-16 right-[-10rem] h-72 w-72 rounded-full bg-sky-500/25 blur-3xl" />
              <div className="absolute bottom-[-10rem] left-[-8rem] h-72 w-72 rounded-full bg-violet-500/25 blur-3xl" />
              <div className="relative grid gap-5">
                <div className="rounded-3xl border border-white/10 bg-slate-900/85 p-6 shadow-lg shadow-black/40 transition-transform duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                      Auto Insights
                    </p>
                    <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-200">
                      New
                    </span>
                  </div>
                  <p className="mt-3 text-lg font-medium leading-relaxed text-white">
                    “Revenue spikes 32% in April. Customer churn steady at 4.2%.”
                  </p>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-slate-900/85 p-6 shadow-lg shadow-black/40 transition-transform duration-300 hover:-translate-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                      Data Preview
                    </p>
                    <p className="mt-3 text-3xl font-semibold text-white">52,481 rows</p>
                    <p className="mt-2 text-xs text-slate-400">Clean, profiled, and ready to explore.</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-slate-900/85 p-6 shadow-lg shadow-black/40 transition-transform duration-300 hover:-translate-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                      Chart Gallery
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-200">
                      Smart bar, line, and composition charts tailored to your schema.
                    </p>
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-900/85 p-6 shadow-lg shadow-black/40 transition-transform duration-300 hover:-translate-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    Export Ready
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-200">
                    One-click chart exports polished for investor-ready decks.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
                  Powerful analytics stack
                </p>
                <h3 className="text-2xl font-semibold text-white sm:text-3xl">
                  Features that accelerate insight discovery
                </h3>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-slate-300">
                Everything in Smart Excel Visualizer is tuned for clarity—from automatic chart recommendations to guided data quality cues.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-3xl border border-white/10 bg-white/10 p-6 shadow-inner shadow-black/40 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:bg-white/15 focus-within:-translate-y-2 focus-within:bg-white/15"
                  tabIndex={0}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 via-blue-500 to-violet-500 text-white shadow-lg shadow-sky-900/40 transition-transform duration-300 group-hover:scale-105 group-focus-visible:scale-105">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h4 className="mt-5 text-lg font-semibold text-white">{feature.title}</h4>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{feature.description}</p>
                  <p className="mt-4 text-xs uppercase tracking-[0.3em] text-slate-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    Learn more →
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
                  Getting started
                </p>
                <h3 className="text-2xl font-semibold text-white sm:text-3xl">
                  How to go from spreadsheet to story in minutes
                </h3>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-slate-300">
                Follow three quick steps—no onboarding, no steep learning curve. Your data stays in your control throughout.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {howItWorks.map((step, index) => (
                <div
                  key={step.label}
                  className="relative rounded-3xl border border-white/10 bg-white/10 p-6 shadow-inner shadow-black/40 backdrop-blur transition-transform duration-300 hover:-translate-y-2"
                >
                  <span className="absolute top-5 right-5 text-sm font-semibold text-slate-500">
                    0{index + 1}
                  </span>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 via-blue-500 to-violet-500 text-white shadow-lg shadow-sky-900/40">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <h4 className="mt-5 text-lg font-semibold text-white">{step.label}</h4>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{step.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-900/30 p-10 shadow-2xl shadow-black/50 backdrop-blur sm:p-14">
            <div className="flex flex-col gap-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
                Lightning-fast loading · Works on any device
              </p>
              <h3 className="text-2xl font-semibold leading-tight text-white sm:text-3xl">
                Start exploring your data today. No setup, no friction.
              </h3>
              <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
                Upload, analyze, and share insights in minutes with a modern analytics experience built for immediacy.
              </p>
              <button
                onClick={onGetStarted}
                className="mx-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-black/40 transition-all hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
