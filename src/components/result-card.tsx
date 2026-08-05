import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Gauge,
  Heart,
  Hash,
  Building2,
  Sparkles,
  ShieldCheck,
  AlertOctagon,
  ShieldAlert,
} from "lucide-react";
import type { AnalysisResult } from "@/lib/analyzer";

const VERDICT = {
  real: {
    icon: CheckCircle2,
    label: "Likely Real",
    color: "text-success",
    bg: "bg-success/15",
    bar: "bg-success",
    ring: "ring-success/30",
    risk: "Low Risk",
    riskColor: "text-success bg-success/10 border-success/30",
    recommendation: "This article aligns with patterns of objective reporting. It is safe to share, but always cross-reference critical claims with primary sources.",
  },
  fake: {
    icon: XCircle,
    label: "Likely Fake",
    color: "text-destructive",
    bg: "bg-destructive/15",
    bar: "bg-destructive",
    ring: "ring-destructive/30",
    risk: "High Risk",
    riskColor: "text-destructive bg-destructive/10 border-destructive/30",
    recommendation: "WARNING: High misinformation index. Clickbait patterns and unverified facts detected. Avoid sharing this content as factual news.",
  },
  suspicious: {
    icon: AlertTriangle,
    label: "Suspicious",
    color: "text-warning",
    bg: "bg-warning/15",
    bar: "bg-warning",
    ring: "ring-warning/30",
    risk: "Medium Risk",
    riskColor: "text-warning bg-warning/10 border-warning/30",
    recommendation: "CAUTION: Sensationalized framing or unverified assertions detected. Read with skepticism and verify publisher credentials before sharing.",
  },
} as const;

function Meter({
  label,
  value,
  icon: Icon,
  bar,
  suffix = "%",
}: {
  label: string;
  value: number;
  icon: typeof Gauge;
  bar: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-xl bg-muted/50 p-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5" /> {label}
        </span>
        <span className="font-mono text-sm text-foreground">
          {value}
          {suffix}
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-background">
        <div
          className={`h-full ${bar} transition-all`}
          style={{ width: `${Math.max(2, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}

function HighlightedText({
  text,
  phrases,
}: {
  text: string;
  phrases: string[];
}) {
  if (!phrases.length) return <p className="text-sm leading-relaxed">{text}</p>;
  const re = new RegExp(
    `(${phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "gi",
  );
  const parts = text.split(re);
  return (
    <p className="text-sm leading-relaxed">
      {parts.map((p, i) =>
        phrases.some((ph) => ph.toLowerCase() === p.toLowerCase()) ? (
          <mark
            key={i}
            className="rounded bg-destructive/15 px-1 py-0.5 font-medium text-destructive"
          >
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </p>
  );
}

export function ResultCard({ result }: { result: AnalysisResult }) {
  const v = VERDICT[result.verdict];
  const Icon = v.icon;

  // Calculate fake vs real probability distribution for the chart
  const isFake = result.verdict === "fake";
  const isReal = result.verdict === "real";
  const fakeProb = isFake ? result.confidence : isReal ? 100 - result.confidence : 50 + (result.confidence % 15);
  const realProb = 100 - fakeProb;

  return (
    <div className="glass-strong rounded-3xl p-6 sm:p-8">
      {/* Header Info */}
      <div className="grid gap-4 sm:flex sm:items-center sm:justify-between border-b border-border/40 pb-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${v.bg} ${v.color} ring-4 ${v.ring}`}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Prediction Verdict
            </div>
            <div className={`truncate font-display text-2xl font-bold ${v.color}`}>
              {v.label}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:text-right">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Risk Assessment
            </div>
            <span className={`inline-block mt-1 px-2.5 py-0.5 rounded text-xs font-semibold border ${v.riskColor}`}>
              {v.risk}
            </span>
          </div>
          <div className="h-8 w-px bg-border/40 hidden sm:block" />
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              AI Confidence
            </div>
            <div className="font-mono text-2xl font-bold">{result.confidence}%</div>
          </div>
        </div>
      </div>

      {/* KPI Meters */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Meter label="Credibility" value={result.credibility} icon={Gauge} bar={v.bar} />
        <Meter
          label={`Sentiment · ${result.sentiment.label}`}
          value={result.sentiment.score}
          icon={Heart}
          bar="bg-accent"
        />
        <Meter
          label="Confidence"
          value={result.confidence}
          icon={Sparkles}
          bar="bg-primary"
        />
        <Meter
          label="Source rating"
          value={result.sourceRating ?? 50}
          icon={Building2}
          bar="bg-chart-2"
        />
      </div>

      {/* Probability Chart Grid */}
      <div className="mt-6 rounded-2xl bg-muted/30 p-4 border border-border/20">
        <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Veracity Probability Distribution
        </h4>
        <div className="space-y-2">
          {/* Bar Chart Container */}
          <div className="h-6 flex rounded-lg overflow-hidden font-mono text-[10px] text-white font-bold">
            <div
              className="bg-success flex items-center justify-center transition-all"
              style={{ width: `${realProb}%` }}
            >
              {realProb > 15 && `Real ${realProb}%`}
            </div>
            <div
              className="bg-destructive flex items-center justify-center transition-all"
              style={{ width: `${fakeProb}%` }}
            >
              {fakeProb > 15 && `Fake ${fakeProb}%`}
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>0% Fake Bias (Truth)</span>
            <span>100% Fake Bias (Clickbait)</span>
          </div>
        </div>
      </div>

      {/* Main Analysis Sections */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
              Article excerpt
            </h3>
            <div className="rounded-xl border border-dashed border-border p-4">
              <HighlightedText text={result.excerpt} phrases={result.suspiciousPhrases} />
            </div>
          </div>

          {result.keywords.length > 0 && (
            <div>
              <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                <Hash className="h-3 w-3" /> Suspicious Highlighted Keywords
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {result.keywords.map((k) => (
                  <span
                    key={k}
                    className="rounded-md bg-destructive/10 border border-destructive/20 text-destructive px-2.5 py-1 font-mono text-xs"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
              Explanation of Prediction
            </h3>
            <ul className="space-y-2">
              {result.reasoning.map((r, i) => (
                <li
                  key={i}
                  className="flex gap-3 rounded-xl bg-muted/40 p-3 text-sm"
                >
                  <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/15 font-mono text-[10px] text-primary">
                    {i + 1}
                  </span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Recommendation Card */}
          <div className={`rounded-xl border p-4 ${
            result.verdict === "real" ? "bg-success/5 border-success/20" :
            result.verdict === "fake" ? "bg-destructive/5 border-destructive/20" :
            "bg-warning/5 border-warning/20"
          }`}>
            <h4 className="font-display font-semibold text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
              {result.verdict === "real" && <ShieldCheck className="h-4 w-4 text-success" />}
              {result.verdict === "fake" && <AlertOctagon className="h-4 w-4 text-destructive" />}
              {result.verdict === "suspicious" && <ShieldAlert className="h-4 w-4 text-warning" />}
              AI Recommendation
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{v.recommendation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
