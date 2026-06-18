import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Shield,
  Brain,
  Search,
  BarChart3,
  Globe,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { SiteNav, SiteFooter } from "@/components/site-nav";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fake News Shield — Detect Fake News with AI" },
      {
        name: "description",
        content:
          "Paste articles, URLs, or upload documents. Fake News Shield analyzes authenticity, credibility, sentiment, and source reputation in seconds.",
      },
    ],
  }),
  component: Home,
});

const features = [
  {
    icon: Brain,
    title: "BERT-grade NLP",
    desc: "Transformer-based classification combined with linguistic heuristics.",
  },
  {
    icon: Shield,
    title: "Source Credibility",
    desc: "Cross-checks domains against trusted publisher databases.",
  },
  {
    icon: Sparkles,
    title: "Explainable AI",
    desc: "See the reasoning, sentiment, and suspicious phrases highlighted.",
  },
  {
    icon: Globe,
    title: "Multilingual Ready",
    desc: "Built to extend across English, Spanish, French, and more.",
  },
  {
    icon: BarChart3,
    title: "Live Dashboard",
    desc: "Track real, fake, and suspicious trends with rich visualizations.",
  },
  {
    icon: Search,
    title: "Fact Verification",
    desc: "Authenticity score with confidence percentage for every claim.",
  },
];

const verdicts = [
  { icon: CheckCircle2, label: "Real", color: "text-success", bar: "bg-success" },
  { icon: AlertTriangle, label: "Suspicious", color: "text-warning", bar: "bg-warning" },
  { icon: XCircle, label: "Fake", color: "text-destructive", bar: "bg-destructive" },
];

function Home() {
  return (
    <div className="min-h-screen">
      <SiteNav />

      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero */}
        <section className="relative pt-16 pb-20 sm:pt-24">
          <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          <div className="relative mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <span className="grid h-1.5 w-1.5 place-items-center rounded-full bg-success pulse-ring" />
              AI engine online — v2.4
            </div>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] sm:text-6xl">
              Spot fake news with{" "}
              <span className="gradient-text">AI you can trust</span>.
            </h1>
            <p className="mt-5 text-balance text-base text-muted-foreground sm:text-lg">
              Paste an article, drop a URL, or upload a document. Fake News Shield
              returns an authenticity verdict, credibility score, sentiment analysis,
              and the reasoning behind every prediction.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="glow">
                <Link to="/analyze">
                  Analyze a story <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/dashboard">View dashboard</Link>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {verdicts.map((v) => (
                <div
                  key={v.label}
                  className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm"
                >
                  <v.icon className={`h-4 w-4 ${v.color}`} />
                  <span className="font-medium">{v.label}</span>
                  <span className="text-muted-foreground">verdict</span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating preview card */}
          <div className="relative mx-auto mt-16 max-w-3xl">
            <div className="glass-strong rounded-3xl p-6 sm:p-8 float">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-destructive/15 text-destructive">
                    <XCircle className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">
                      Verdict
                    </div>
                    <div className="truncate font-display text-xl font-bold text-destructive">
                      Likely Fake · 92% confidence
                    </div>
                  </div>
                </div>
                <div className="hidden rounded-lg bg-muted px-2.5 py-1 font-mono text-xs text-muted-foreground sm:block">
                  /analyze
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Credibility", value: 18, bar: "bg-destructive" },
                  { label: "Sentiment", value: 74, bar: "bg-accent", suffix: "negative" },
                  { label: "Source rating", value: 24, bar: "bg-warning" },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-muted/50 p-4">
                    <div className="flex items-baseline justify-between text-xs text-muted-foreground">
                      <span>{m.label}</span>
                      <span className="font-mono text-foreground">
                        {m.value}
                        {m.suffix ? ` · ${m.suffix}` : "%"}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background">
                      <div className={`h-full ${m.bar}`} style={{ width: `${m.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                <span className="rounded bg-destructive/15 px-1.5 py-0.5 font-medium text-destructive">
                  Shocking
                </span>{" "}
                new study reveals doctors don't want you to know this{" "}
                <span className="rounded bg-destructive/15 px-1.5 py-0.5 font-medium text-destructive">
                  miracle
                </span>{" "}
                cure that destroys big pharma overnight…
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="pb-20">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Built for the misinformation era
            </h2>
            <p className="mt-3 text-muted-foreground">
              A complete AI toolkit for journalists, researchers, and curious readers.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="glass group rounded-2xl p-6 transition hover:-translate-y-1">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[image:var(--gradient-cyber)] text-primary-foreground">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="pb-10">
          <div className="glass-strong relative overflow-hidden rounded-3xl p-10 text-center">
            <div className="absolute inset-0 grid-bg opacity-20" />
            <div className="relative">
              <h2 className="font-display text-3xl font-bold sm:text-4xl">
                Ready to verify a story?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                Run your first analysis in under 5 seconds. No signup required.
              </p>
              <Button asChild size="lg" className="mt-6 glow">
                <Link to="/analyze">
                  Start analyzing <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
