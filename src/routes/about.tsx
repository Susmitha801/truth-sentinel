import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, Database, Lock, Layers, Sparkles, Globe } from "lucide-react";
import { SiteNav, SiteFooter } from "@/components/site-nav";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Fake News Shield" },
      {
        name: "description",
        content:
          "Learn how Fake News Shield combines NLP, transformer models, and source credibility scoring to detect misinformation.",
      },
    ],
  }),
  component: AboutPage,
});

const pipeline = [
  { icon: Layers, title: "1. Preprocessing", desc: "Tokenization, stop-word removal, normalization." },
  { icon: Brain, title: "2. Classification", desc: "Logistic Regression + Random Forest + BERT ensemble." },
  { icon: Database, title: "3. Fact Verification", desc: "Cross-checks claims against trusted publishers." },
  { icon: Sparkles, title: "4. Explainable Output", desc: "Verdict, confidence, reasoning, and highlights." },
];

function AboutPage() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-4xl px-4 pb-20 pt-10 sm:px-6">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            About <span className="gradient-text">Fake News Shield</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            A research-grade AI tool that empowers readers, journalists, and educators to
            spot misinformation in seconds — with transparent reasoning.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {pipeline.map((p) => (
            <div key={p.title} className="glass rounded-2xl p-6">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[image:var(--gradient-cyber)] text-primary-foreground">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{p.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 glass-strong rounded-3xl p-8">
          <h2 className="font-display text-2xl font-bold">Capabilities</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { icon: Brain, label: "BERT-based text classification" },
              { icon: Sparkles, label: "Explainable AI predictions" },
              { icon: Lock, label: "Source credibility scoring" },
              { icon: Globe, label: "Multilingual ready" },
              { icon: Database, label: "Analysis history & analytics" },
              { icon: Layers, label: "Confidence percentage per verdict" },
            ].map((c) => (
              <li key={c.label} className="flex items-center gap-3 rounded-xl bg-muted/40 p-3">
                <c.icon className="h-4 w-4 text-primary" />
                <span className="text-sm">{c.label}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground">
            <strong className="text-foreground">Disclaimer:</strong> This demo runs a
            lightweight heuristic engine in the browser. Predictions are illustrative —
            always verify with primary sources before sharing.
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="glow">
              <Link to="/analyze">Try the analyzer</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/dashboard">See the dashboard</Link>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
