import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, Database, Lock, Layers, Sparkles, Globe } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { checkBackendStatus } from "@/lib/analyzer";

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
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    checkBackendStatus().then(setBackendOnline);
  }, []);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="text-center">
          <div className="mb-3 flex justify-center">
            {backendOnline === null ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
                Checking AI backend...
              </span>
            ) : backendOnline ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success ring-1 ring-success/30">
                🟢 Live AI Backend Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/15 px-3 py-1 text-xs font-semibold text-destructive ring-1 ring-destructive/30">
                🔴 Backend Offline · Using Local Engine
              </span>
            )}
          </div>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            About <span className="gradient-text">Fake News Shield</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground text-sm">
            A research-grade AI tool that empowers readers, journalists, and educators to
            spot misinformation in seconds — with transparent reasoning.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {pipeline.map((p) => {
            const isPreprocessing = p.title.includes("Preprocessing");
            return (
              <div
                key={p.title}
                className={`glass rounded-2xl p-6 relative transition-opacity ${
                  isPreprocessing ? "opacity-50 grayscale-[30%]" : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[image:var(--gradient-cyber)] text-primary-foreground">
                    <p.icon className="h-5 w-5" />
                  </div>
                  {isPreprocessing && (
                    <span className="rounded bg-destructive/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-destructive ring-1 ring-destructive/30">
                      Bypassed
                    </span>
                  )}
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="glass-strong rounded-3xl p-8">
          <h2 className="font-display text-2xl font-bold">Capabilities & Stack</h2>
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
            <strong className="text-foreground">System Status:</strong>{" "}
            {backendOnline ? (
              <span>
                FakeNews Shield is connected to the live FastAPI API backend running on port 8000. All predictions, confidence scores, explanations, and credibility metrics are processed live by the backend ML models.
              </span>
            ) : (
              <span>
                The backend is currently offline. This demo is running a lightweight heuristic engine in your browser. Predictions are illustrative — always verify with primary sources.
              </span>
            )}
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
      </div>
    </DashboardLayout>
  );
}
