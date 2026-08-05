import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { TrendingUp, AlertOctagon, CheckCircle, BarChart3, Download, RefreshCw } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { loadHistory, type AnalysisResult } from "@/lib/analyzer";
import { toast } from "sonner";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — FakeNews Shield" },
      { name: "description", content: "AI model performance metrics and monthly fake news statistics." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const refreshAnalytics = () => {
    setLoading(true);
    setTimeout(() => {
      setHistory(loadHistory());
      setLoading(false);
      toast.success("Analytics data refreshed.");
    }, 600);
  };

  // Mock keywords
  const commonKeywords = [
    { word: "miracle cure", count: 28, risk: "CRITICAL" },
    { word: "shocking truth", count: 22, risk: "HIGH" },
    { word: "destroy instantly", count: 19, risk: "HIGH" },
    { word: "banned secret", count: 15, risk: "MEDIUM" },
    { word: "conspiracy", count: 12, risk: "MEDIUM" },
    { word: "cover-up", count: 10, risk: "LOW" },
  ];

  // Model comparison
  const modelData = [
    { name: "BERT v2.4", accuracy: 94.2, latency: 120, f1: 93.8 },
    { name: "RoBERTa custom", accuracy: 92.5, latency: 150, f1: 91.9 },
    { name: "GPT-3.5 Classifier", accuracy: 89.1, latency: 450, f1: 88.5 },
  ];

  // Last 30 days fake vs real trend mock
  const trendData = [
    { date: "07/15", real: 12, fake: 18 },
    { date: "07/20", real: 15, fake: 22 },
    { date: "07/25", real: 19, fake: 14 },
    { date: "07/30", real: 24, fake: 11 },
    { date: "08/05", real: history.filter(h => h.verdict === "real").length + 20, fake: history.filter(h => h.verdict === "fake").length + 15 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Analytics & Model Performance</h1>
            <p className="text-sm text-muted-foreground">
              Deep analytics of detected fake news trends and comparison metrics.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={refreshAnalytics} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Button size="sm" onClick={() => toast.success("Report downloaded.")}>
              <Download className="mr-2 h-4 w-4" /> Download Report
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="glass rounded-2xl p-5 flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Model Accuracy</p>
              <h3 className="font-display text-2xl font-bold">94.2%</h3>
              <p className="text-[10px] text-success font-medium mt-0.5">+0.4% from last epoch</p>
            </div>
          </div>
          <div className="glass rounded-2xl p-5 flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-destructive/10 text-destructive">
              <AlertOctagon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Fake News Share</p>
              <h3 className="font-display text-2xl font-bold">
                {history.length > 0
                  ? Math.round((history.filter((h) => h.verdict === "fake").length / history.length) * 100)
                  : 45}
                %
              </h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">Average across all analyses</p>
            </div>
          </div>
          <div className="glass rounded-2xl p-5 flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-success/10 text-success">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Avg Response Time</p>
              <h3 className="font-display text-2xl font-bold">1.4s</h3>
              <p className="text-[10px] text-success font-medium mt-0.5">-200ms optimization</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Trend Analysis */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-lg font-semibold mb-1">Fake vs Real Trend (30 Days)</h3>
            <p className="text-xs text-muted-foreground mb-4">Volume of authenticity verdicts.</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorFake" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-destructive)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-destructive)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                  <Legend />
                  <Area type="monotone" dataKey="real" stroke="var(--color-success)" fillOpacity={1} fill="url(#colorReal)" strokeWidth={2} />
                  <Area type="monotone" dataKey="fake" stroke="var(--color-destructive)" fillOpacity={1} fill="url(#colorFake)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Model Accuracy Comparison */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-lg font-semibold mb-1">Model Benchmarks</h3>
            <p className="text-xs text-muted-foreground mb-4">Comparison of accuracy vs latency across classifiers.</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={modelData}>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} domain={[70, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                  <Legend />
                  <Bar dataKey="accuracy" name="Accuracy (%)" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="f1" name="F1 Score (%)" fill="var(--color-accent)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Lower Row */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Keyword list */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-lg font-semibold mb-1">Most Common Fake Keywords</h3>
            <p className="text-xs text-muted-foreground mb-4">Linguistic phrases with high correlation to fake verdicts.</p>
            <div className="space-y-3">
              {commonKeywords.map((k) => (
                <div key={k.word} className="flex items-center justify-between rounded-xl bg-muted/30 px-4 py-3 border border-border/20 hover:bg-muted/50 transition">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold">{k.word}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      k.risk === "CRITICAL" ? "bg-destructive/20 text-destructive" :
                      k.risk === "HIGH" ? "bg-warning/20 text-warning" : "bg-primary/20 text-primary"
                    }`}>
                      {k.risk}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-foreground">{k.count} hits</span>
                </div>
              ))}
            </div>
          </div>

          {/* Model Statistics Summary */}
          <div className="glass rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold mb-1">AI Classifier Properties</h3>
              <p className="text-xs text-muted-foreground mb-4">Status & hyper-parameters of the local active engine.</p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-border/30 pb-2">
                  <span className="text-muted-foreground">Active Classifier</span>
                  <span className="font-semibold">BERT Ensemble (Attention-based)</span>
                </div>
                <div className="flex justify-between border-b border-border/30 pb-2">
                  <span className="text-muted-foreground">Vocabulary Size</span>
                  <span className="font-semibold">30,522 tokens</span>
                </div>
                <div className="flex justify-between border-b border-border/30 pb-2">
                  <span className="text-muted-foreground">Confidence Threshold</span>
                  <span className="font-semibold">75% for Strict Verdicts</span>
                </div>
                <div className="flex justify-between border-b border-border/30 pb-2">
                  <span className="text-muted-foreground">Last Epoch Retrained</span>
                  <span className="font-semibold">August 04, 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cross-Validation F1</span>
                  <span className="font-semibold text-primary">0.938</span>
                </div>
              </div>
            </div>
            <div className="mt-6 rounded-xl border border-dashed border-border/60 p-4 text-xs text-muted-foreground">
              Hyper-parameters are calibrated for balanced precision and recall. Click Retrain in the Admin Panel to update weights.
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
