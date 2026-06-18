import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Gauge,
  Heart,
  Hash,
  Building2,
  Sparkles,
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
  },
  fake: {
    icon: XCircle,
    label: "Likely Fake",
    color: "text-destructive",
    bg: "bg-destructive/15",
    bar: "bg-destructive",
    ring: "ring-destructive/30",
  },
  suspicious: {
    icon: AlertTriangle,
    label: "Suspicious",
    color: "text-warning",
    bg: "bg-warning/15",
    bar: "bg-warning",
    ring: "ring-warning/30",
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
  return (
    <div className="glass-strong rounded-3xl p-6 sm:p-8">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${v.bg} ${v.color} ring-4 ${v.ring}`}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Verdict
            </div>
            <div className={`truncate font-display text-2xl font-bold ${v.color}`}>
              {v.label}
            </div>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Confidence
          </div>
          <div className="font-mono text-2xl font-bold">{result.confidence}%</div>
        </div>
      </div>

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

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
            Article excerpt
          </h3>
          <div className="rounded-xl border border-dashed border-border p-4">
            <HighlightedText text={result.excerpt} phrases={result.suspiciousPhrases} />
          </div>
          {result.keywords.length > 0 && (
            <div className="mt-4">
              <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                <Hash className="h-3 w-3" /> Keywords
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {result.keywords.map((k) => (
                  <span
                    key={k}
                    className="rounded-md bg-muted px-2 py-1 font-mono text-xs"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
            AI reasoning
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

          {result.suspiciousPhrases.length > 0 && (
            <div className="mt-4">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Suspicious phrases
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {result.suspiciousPhrases.map((p) => (
                  <span
                    key={p}
                    className="rounded-md bg-destructive/15 px-2 py-1 text-xs font-medium text-destructive"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
