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
} from "lucide-react";

import { SiteNav, SiteFooter } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { loadHistory, loadHistoryFromSupabase, type AnalysisResult } from "@/lib/analyzer";

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
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            {label}
          </div>
          <div className="font-display text-2xl font-bold">{value}</div>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [history, setHistory] = useState<AnalysisResult[]>([]);

  useEffect(() => {
    // Load from localStorage immediately, then refresh from Supabase
    setHistory(loadHistory());
    loadHistoryFromSupabase().then((data) => setHistory(data));
  }, []);

  const counts = {
    real: history.filter((h) => h.verdict === "real").length,
    fake: history.filter((h) => h.verdict === "fake").length,
    suspicious: history.filter((h) => h.verdict === "suspicious").length,
  };

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
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6">
        <div className="mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0">
            <h1 className="font-display text-4xl font-bold">Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
              Live overview of every analysis you've run on this device.
            </p>
          </div>
          <Button asChild>
            <Link to="/analyze">New analysis</Link>
          </Button>
        </div>

        {history.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat
                icon={Activity}
                label="Total analyzed"
                value={history.length}
                color="bg-primary/15 text-primary"
              />
              <Stat
                icon={CheckCircle2}
                label="Real"
                value={counts.real}
                color="bg-success/15 text-success"
              />
              <Stat
                icon={XCircle}
                label="Fake"
                value={counts.fake}
                color="bg-destructive/15 text-destructive"
              />
              <Stat
                icon={AlertTriangle}
                label="Suspicious"
                value={counts.suspicious}
                color="bg-warning/15 text-warning"
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
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">Recent analyses</h3>
                <Link to="/history" className="text-sm text-primary hover:underline">
                  View all →
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-xs uppercase tracking-widest text-muted-foreground">
                    <tr>
                      <th className="pb-3 font-medium">Title</th>
                      <th className="pb-3 font-medium">Verdict</th>
                      <th className="pb-3 font-medium">Confidence</th>
                      <th className="pb-3 font-medium">Category</th>
                      <th className="pb-3 font-medium">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.slice(0, 6).map((h) => (
                      <tr key={h.id} className="border-t border-border">
                        <td className="max-w-xs truncate py-3 pr-4">{h.title}</td>
                        <td className="py-3 pr-4">
                          <VerdictBadge verdict={h.verdict} />
                        </td>
                        <td className="py-3 pr-4 font-mono">{h.confidence}%</td>
                        <td className="py-3 pr-4 text-muted-foreground">{h.category}</td>
                        <td className="py-3 text-muted-foreground">
                          {new Date(h.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
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
