import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2, FileSearch } from "lucide-react";
import { SiteNav, SiteFooter } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { clearHistory, loadHistory, loadHistoryFromSupabase, type AnalysisResult } from "@/lib/analyzer";
import { ResultCard } from "@/components/result-card";
import { VerdictBadge } from "./dashboard";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Fact-Check History — Fake News Shield" },
      {
        name: "description",
        content: "Browse every article you've analyzed with Fake News Shield.",
      },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [selected, setSelected] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    // Load from localStorage immediately, then refresh from Supabase
    const cached = loadHistory();
    setHistory(cached);
    setSelected(cached[0] ?? null);
    loadHistoryFromSupabase().then((data) => {
      setHistory(data);
      setSelected(data[0] ?? null);
    });
  }, []);

  const reset = async () => {
    await clearHistory();
    setHistory([]);
    setSelected(null);
  };

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6">
        <div className="mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0">
            <h1 className="font-display text-4xl font-bold">Fact-check history</h1>
            <p className="mt-1 text-muted-foreground">
              {history.length} stored {history.length === 1 ? "analysis" : "analyses"} on this device.
            </p>
          </div>
          {history.length > 0 && (
            <Button variant="outline" onClick={reset}>
              <Trash2 className="mr-1 h-4 w-4" /> Clear
            </Button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="glass-strong flex flex-col items-center rounded-3xl p-16 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[image:var(--gradient-cyber)] text-primary-foreground">
              <FileSearch className="h-7 w-7" />
            </div>
            <h2 className="mt-6 font-display text-2xl font-bold">Nothing here yet</h2>
            <p className="mt-2 max-w-sm text-muted-foreground">
              Your analyzed articles will appear here for easy review and re-checking.
            </p>
            <Button asChild className="mt-6 glow">
              <Link to="/analyze">Analyze a story</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            <div className="glass max-h-[70vh] overflow-y-auto rounded-2xl p-2">
              {history.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setSelected(h)}
                  className={`w-full rounded-xl p-3 text-left transition hover:bg-muted ${
                    selected?.id === h.id ? "bg-muted" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <VerdictBadge verdict={h.verdict} />
                    <span className="font-mono text-xs text-muted-foreground">
                      {h.confidence}%
                    </span>
                  </div>
                  <div className="mt-2 line-clamp-2 text-sm font-medium">{h.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {new Date(h.createdAt).toLocaleString()}
                  </div>
                </button>
              ))}
            </div>

            <div>{selected && <ResultCard result={selected} />}</div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
