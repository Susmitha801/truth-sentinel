import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileSearch,
  Brain,
  ShieldAlert,
  ShieldCheck,
  Clock,
  TrendingUp,
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { loadHistory, loadHistoryFromSupabase, type AnalysisResult } from "@/lib/analyzer";
import { ResultCard } from "@/components/result-card";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Fake News Shield" },
      {
        name: "description",
        content: "Analytics on detected fake, real, and suspicious news with charts and trends.",
      },
    ],
  }),
  component: Dashboard,
});

/* ── Simple stat card (Total / Accuracy) ─────────────── */
function Stat({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Activity;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-3">
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
          <div className="font-display text-2xl font-bold">{value}</div>
        </div>
      </div>
    </div>
  );
}

/* ── Verdict-aware stat card (Real / Fake / Suspicious) ─ */
function VerdictStatCard({
  icon: Icon,
  label,
  count,
  isLatest,
  latestLabel,
  iconBg,
  iconText,
  glowClass,
  badgeBg,
  badgeText,
}: {
  icon: typeof CheckCircle2;
  label: string;
  count: number;
  isLatest: boolean;
  latestLabel: string;
  iconBg: string;
  iconText: string;
  glowClass: string;
  badgeBg: string;
  badgeText: string;
}) {
  return (
    <div
      className={`glass rounded-2xl p-5 transition-all duration-500 ${
        isLatest ? glowClass : ""
      }`}
      style={isLatest ? { animation: "pulse-glow 2s ease-in-out 1" } : undefined}
    >
      <div className="flex items-start justify-between gap-2">
        {/* Icon */}
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconText}`} />
        </div>
        {/* Latest badge */}
        {isLatest && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase ${badgeBg} ${badgeText}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current inline-block animate-pulse" />
            Latest: {latestLabel}
          </span>
        )}
      </div>
      <div className="mt-3">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="font-display text-3xl font-bold mt-0.5">{count}</div>
        {!isLatest && (
          <div className="mt-1 text-[11px] text-muted-foreground/60">articles detected</div>
        )}
      </div>
    </div>
  );
}

function Dashboard() {
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [selected, setSelected] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    // Load from localStorage immediately, then refresh from Supabase
    const cached = loadHistory();

    // Seed demo articles so the dashboard is never empty on first visit
    if (cached.length === 0) {
      const now = new Date().toISOString();
      const demo: AnalysisResult[] = [
        {
          id: "demo-1",
          title: "SHOCKING: Scientists Discover Miracle Cure Big Pharma Doesn't Want You to Know!",
          excerpt: "SHOCKING miracle cure discovered that big pharma is hiding from the public. Share this banned secret now before it gets removed!!!",
          verdict: "fake",
          confidence: 96,
          credibility: 8,
          sentiment: { label: "negative", score: 85 },
          keywords: ["miracle cure", "big pharma", "banned secret", "SHOCKING"],
          suspiciousPhrases: ["big pharma doesn't want", "banned secret", "miracle cure"],
          reasoning: [
            "Extreme clickbait language: SHOCKING, miracle cure, banned secret.",
            "Unverified medical claims with no cited sources.",
            "Sensationalist call-to-action designed to trigger emotional sharing.",
          ],
          category: "Health",
          source: "text",
          sourceRating: 5,
          createdAt: now,
        },
        {
          id: "demo-2",
          title: "European Central Bank Holds Interest Rates Steady Amid Easing Inflation",
          excerpt: "The European Central Bank held its benchmark interest rate steady on Thursday, citing easing inflation and steady economic growth across the eurozone.",
          verdict: "real",
          confidence: 94,
          credibility: 91,
          sentiment: { label: "neutral", score: 55 },
          keywords: ["ECB", "interest rate", "inflation", "eurozone"],
          suspiciousPhrases: [],
          reasoning: [
            "Neutral, objective language consistent with financial reporting.",
            "Source domain matches known reputable financial outlets.",
            "No emotional manipulation or unverified claims detected.",
          ],
          category: "Finance",
          source: "text",
          sourceRating: 93,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "demo-3",
          title: "NASA Announces Plans to Land Humans on Mars by 2040",
          excerpt: "NASA has announced ambitious plans to send the first humans to Mars by 2040, pending budget approval from Congress.",
          verdict: "real",
          confidence: 88,
          credibility: 82,
          sentiment: { label: "positive", score: 72 },
          keywords: ["NASA", "Mars", "2040", "space mission"],
          suspiciousPhrases: [],
          reasoning: [
            "Factual tone with specific dates and conditional language.",
            "Aligned with known public NASA mission roadmaps.",
            "No sensationalism or misleading framing detected.",
          ],
          category: "Science",
          source: "text",
          sourceRating: 88,
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "demo-4",
          title: "Government Secretly Installing 5G Chips in COVID Vaccines, Whistleblower Claims",
          excerpt: "A whistleblower claims the government is secretly embedding 5G tracking chips inside COVID-19 vaccines to monitor citizens.",
          verdict: "fake",
          confidence: 99,
          credibility: 2,
          sentiment: { label: "negative", score: 91 },
          keywords: ["5G chips", "COVID vaccines", "whistleblower", "government conspiracy"],
          suspiciousPhrases: ["secretly installing", "5G chips", "tracking citizens"],
          reasoning: [
            "Conspiracy framing with no verifiable source.",
            "Previously debunked by WHO, CDC, and health authorities.",
            "Designed to spread fear and distrust of public health institutions.",
          ],
          category: "Health",
          source: "text",
          sourceRating: 3,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "demo-5",
          title: "Local Council Approves New Public Park Development Plan",
          excerpt: "The city council voted 8-3 to approve a $2.4 million development plan for a new public park in the Westside district.",
          verdict: "real",
          confidence: 91,
          credibility: 89,
          sentiment: { label: "positive", score: 68 },
          keywords: ["city council", "public park", "Westside", "development"],
          suspiciousPhrases: [],
          reasoning: [
            "Specific vote count and budget figure indicate factual reporting.",
            "Local civic news with verifiable council meeting records.",
            "No bias indicators or emotional language detected.",
          ],
          category: "Politics",
          source: "text",
          sourceRating: 85,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "demo-6",
          title: "Experts Warn Drinking Coffee May Cause Serious Long-Term Health Risks",
          excerpt: "Some experts are warning that daily coffee consumption could potentially lead to health complications over long periods.",
          verdict: "suspicious",
          confidence: 62,
          credibility: 45,
          sentiment: { label: "negative", score: 60 },
          keywords: ["coffee", "health risks", "experts warn"],
          suspiciousPhrases: ["experts warn", "serious health risks"],
          reasoning: [
            "Vague attribution: 'some experts' without specific sources.",
            "Contradicts majority scientific consensus on moderate coffee consumption.",
            "Misleading framing — hedged language designed to alarm without proof.",
          ],
          category: "Health",
          source: "text",
          sourceRating: 40,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
      localStorage.setItem("fns_history_v1", JSON.stringify(demo));
      setHistory(demo);
    } else {
      setHistory(cached);
    }

    loadHistoryFromSupabase().then((data) => {
      if (data.length > 0) setHistory(data);
    });
  }, []);

  const counts = {
    real: history.filter((h) => h.verdict === "real").length,
    fake: history.filter((h) => h.verdict === "fake").length,
    suspicious: history.filter((h) => h.verdict === "suspicious").length,
  };

  // Latest verdict from most recently analyzed article
  const latestResult = history.length > 0
    ? [...history].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    : null;
  const latestVerdict = latestResult?.verdict ?? null;

  const pieData = [
    { name: "Real", value: counts.real, color: "var(--color-success)" },
    { name: "Fake", value: counts.fake, color: "var(--color-destructive)" },
    { name: "Suspicious", value: counts.suspicious, color: "var(--color-warning)" },
  ].filter((d) => d.value > 0);

  const categoryMap: Record<string, number> = {};
  history.forEach((h) => {
    categoryMap[h.category] = (categoryMap[h.category] || 0) + h.confidence;
  });
  const barData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value: Math.round(value / Math.max(1, history.filter((h) => h.category === name).length)),
  }));

  // 7-day trend
  const days: { day: string; real: number; fake: number; suspicious: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const items = history.filter((h) => h.createdAt.startsWith(key));
    days.push({
      day: d.toLocaleDateString(undefined, { weekday: "short" }),
      real: items.filter((h) => h.verdict === "real").length,
      fake: items.filter((h) => h.verdict === "fake").length,
      suspicious: items.filter((h) => h.verdict === "suspicious").length,
    });
  }

  const tooltipStyle = {
    backgroundColor: "var(--color-popover)",
    border: "1px solid var(--color-border)",
    borderRadius: 12,
    fontSize: 12,
  } as const;

  return (
    <DashboardLayout>
      {/* ── Page Header ──────────────────────────────────── */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-4xl font-bold">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Live overview of every analysis you've run on this device.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Latest verdict badge */}
          {latestVerdict === "real" && (
            <span className="inline-flex items-center gap-2 rounded-full bg-success/15 px-4 py-1.5 text-sm font-bold text-success ring-1 ring-success/30 animate-pulse">
              <span className="h-2 w-2 rounded-full bg-success" />
              🟢 REAL
            </span>
          )}
          {latestVerdict === "fake" && (
            <span className="inline-flex items-center gap-2 rounded-full bg-destructive/15 px-4 py-1.5 text-sm font-bold text-destructive ring-1 ring-destructive/30 animate-pulse">
              <span className="h-2 w-2 rounded-full bg-destructive" />
              🔴 FAKE
            </span>
          )}
          {latestVerdict === "suspicious" && (
            <span className="inline-flex items-center gap-2 rounded-full bg-warning/15 px-4 py-1.5 text-sm font-bold text-warning ring-1 ring-warning/30 animate-pulse">
              <span className="h-2 w-2 rounded-full bg-warning" />
              🟡 SUSPICIOUS
            </span>
          )}
          <Button asChild>
            <Link to="/analyze">New analysis</Link>
          </Button>
        </div>
      </div>

      {history.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {/* Total Analyzed */}
            <Stat
              icon={Activity}
              label="Total analyzed"
              value={history.length}
              color="bg-primary/15 text-primary"
            />

            {/* Real News Card */}
            <VerdictStatCard
              icon={CheckCircle2}
              label="Real News"
              count={counts.real}
              isLatest={latestVerdict === "real"}
              latestLabel="REAL"
              iconBg="bg-success/15"
              iconText="text-success"
              glowClass="ring-2 ring-success/40 shadow-[0_0_24px_4px_rgba(34,197,94,0.18)]"
              badgeBg="bg-success/15"
              badgeText="text-success"
            />

            {/* Fake News Card */}
            <VerdictStatCard
              icon={XCircle}
              label="Fake News"
              count={counts.fake}
              isLatest={latestVerdict === "fake"}
              latestLabel="FAKE"
              iconBg="bg-destructive/15"
              iconText="text-destructive"
              glowClass="ring-2 ring-destructive/40 shadow-[0_0_24px_4px_rgba(239,68,68,0.20)]"
              badgeBg="bg-destructive/15"
              badgeText="text-destructive"
            />

            {/* Suspicious Card */}
            <VerdictStatCard
              icon={AlertTriangle}
              label="Suspicious"
              count={counts.suspicious}
              isLatest={latestVerdict === "suspicious"}
              latestLabel="SUSPICIOUS"
              iconBg="bg-warning/15"
              iconText="text-warning"
              glowClass="ring-2 ring-warning/40 shadow-[0_0_24px_4px_rgba(234,179,8,0.18)]"
              badgeBg="bg-warning/15"
              badgeText="text-warning"
            />

            {/* Accuracy */}
            <Stat
              icon={Brain}
              label="Accuracy"
              value="94.2%"
              color="bg-accent/15 text-accent"
            />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-5">
            <div className="glass rounded-2xl p-6 lg:col-span-2">
              <h3 className="font-display text-lg font-semibold">
                Verdict distribution
              </h3>
              <p className="text-xs text-muted-foreground">
                Share of real, fake, and suspicious articles.
              </p>
              <div className="mt-4 h-64">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((d) => (
                        <Cell key={d.name} fill={d.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 lg:col-span-3">
              <h3 className="font-display text-lg font-semibold">
                Avg. authenticity score by category
              </h3>
              <p className="text-xs text-muted-foreground">
                Higher means more confident in the verdict.
              </p>
              <div className="mt-4 h-64">
                <ResponsiveContainer>
                  <BarChart data={barData}>
                    <CartesianGrid stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-muted)" }} />
                    <Bar dataKey="value" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="mt-6 glass rounded-2xl p-6">
            <h3 className="font-display text-lg font-semibold">
              Daily detection trend (last 7 days)
            </h3>
            <div className="mt-4 h-72">
              <ResponsiveContainer>
                <LineChart data={days}>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Line type="monotone" dataKey="real" stroke="var(--color-success)" strokeWidth={2} />
                  <Line type="monotone" dataKey="fake" stroke="var(--color-destructive)" strokeWidth={2} />
                  <Line type="monotone" dataKey="suspicious" stroke="var(--color-warning)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-6 glass rounded-2xl p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold">Recent News Analysis</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Click any article to see full prediction details</p>
              </div>
              <Link to="/history" className="text-sm text-primary hover:underline font-medium">
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {history.slice(0, 6).map((h) => {
                const isFake = h.verdict === "fake";
                const isReal = h.verdict === "real";
                const VIcon = isFake ? XCircle : isReal ? ShieldCheck : ShieldAlert;
                const verdictLabel = isFake ? "FAKE NEWS" : isReal ? "REAL NEWS" : "SUSPICIOUS";
                const borderColor = isFake ? "border-l-destructive" : isReal ? "border-l-success" : "border-l-warning";
                const bgColor = isFake ? "bg-destructive/5 hover:bg-destructive/10" : isReal ? "bg-success/5 hover:bg-success/10" : "bg-warning/5 hover:bg-warning/10";
                const labelColor = isFake ? "text-destructive" : isReal ? "text-success" : "text-warning";
                const iconBg = isFake ? "bg-destructive/10" : isReal ? "bg-success/10" : "bg-warning/10";
                return (
                  <div
                    key={h.id}
                    onClick={() => setSelected(h)}
                    className={`flex items-center gap-4 rounded-xl border-l-4 ${borderColor} ${bgColor} ${
                      selected?.id === h.id ? "ring-1 ring-primary/30" : ""
                    } cursor-pointer px-4 py-3 transition-all`}
                  >
                    {/* Verdict Icon */}
                    <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${iconBg}`}>
                      <VIcon className={`h-5 w-5 ${labelColor}`} />
                    </div>

                    {/* Title + Category */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground leading-tight">{h.title}</p>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span>{h.category}</span>
                        <span>·</span>
                        <Clock className="h-3 w-3" />
                        <span>{new Date(h.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Verdict Label + Confidence */}
                    <div className="shrink-0 text-right">
                      <span className={`inline-block rounded-lg px-3 py-1 text-xs font-bold tracking-wide ${labelColor} ${iconBg}`}>
                        {verdictLabel}
                      </span>
                      <p className="mt-1 font-mono text-xs text-muted-foreground">{h.confidence}% confidence</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {selected && (
            <div className="mt-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">Analysis details</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>
                  Close details
                </Button>
              </div>
              <ResultCard result={selected} />
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}

export function VerdictBadge({ verdict }: { verdict: AnalysisResult["verdict"] }) {
  const map = {
    real: { color: "bg-success/15 text-success", label: "Real" },
    fake: { color: "bg-destructive/15 text-destructive", label: "Fake" },
    suspicious: { color: "bg-warning/15 text-warning", label: "Suspicious" },
  } as const;
  const v = map[verdict];
  return (
    <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${v.color}`}>
      {v.label}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="glass-strong flex flex-col items-center rounded-3xl p-16 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[image:var(--gradient-cyber)] text-primary-foreground">
        <FileSearch className="h-7 w-7" />
      </div>
      <h2 className="mt-6 font-display text-2xl font-bold">No analyses yet</h2>
      <p className="mt-2 max-w-sm text-muted-foreground">
        Run your first article through Fake News Shield to populate your dashboard with live charts.
      </p>
      <Button asChild className="mt-6 glow">
        <Link to="/analyze">Analyze a story</Link>
      </Button>
    </div>
  );
}
