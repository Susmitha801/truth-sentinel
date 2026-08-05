import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2, FileSearch, Search, Download, Printer, X } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clearHistory, loadHistory, loadHistoryFromSupabase, type AnalysisResult } from "@/lib/analyzer";
import { ResultCard } from "@/components/result-card";
import { VerdictBadge } from "./dashboard";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [verdictFilter, setVerdictFilter] = useState("all");

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
    toast.success("History database cleared.");
  };

  const deleteItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent selecting the item
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    if (selected?.id === id) {
      setSelected(updated[0] ?? null);
    }
    // Update local storage
    localStorage.setItem("fns_history_v1", JSON.stringify(updated));
    // Update Supabase
    try {
      const { error } = await supabase.from("analyses").delete().eq("id", id);
      if (error) console.warn("Supabase single delete error:", error.message);
    } catch (err) {
      console.warn("Supabase single delete failed:", err);
    }
    toast.success("Analysis record deleted.");
  };

  const exportCSV = () => {
    if (history.length === 0) return;
    const headers = "id,title,verdict,confidence,category,createdAt\n";
    const rows = history
      .map(
        (h) =>
          `"${h.id}","${h.title.replace(/"/g, '""')}","${h.verdict}",${h.confidence},"${h.category}","${h.createdAt}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fakenewsshield_history.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("CSV export downloaded.");
  };

  const exportPDF = () => {
    toast.info("Generating printer-friendly PDF report...");
    setTimeout(() => {
      window.print();
    }, 500);
  };

  // Filter history based on search & verdict selector
  const filtered = history.filter((h) => {
    const matchesSearch =
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVerdict = verdictFilter === "all" || h.verdict === verdictFilter;
    return matchesSearch && matchesVerdict;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-4">
          <div className="min-w-0">
            <h1 className="font-display text-4xl font-bold">Fact-check history</h1>
            <p className="mt-1 text-muted-foreground text-sm">
              Browse, search, and export the {history.length} stored scan results.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <>
                <Button variant="outline" size="sm" onClick={exportCSV}>
                  <Download className="mr-1.5 h-4 w-4" /> Export CSV
                </Button>
                <Button variant="outline" size="sm" onClick={exportPDF}>
                  <Printer className="mr-1.5 h-4 w-4" /> Export PDF
                </Button>
                <Button variant="destructive" size="sm" onClick={reset}>
                  <Trash2 className="mr-1.5 h-4 w-4" /> Clear All
                </Button>
              </>
            )}
          </div>
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
          <div className="space-y-4">
            {/* Filter controls */}
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search articles, keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-background/30 text-xs"
                />
              </div>

              <div>
                <select
                  value={verdictFilter}
                  onChange={(e) => setVerdictFilter(e.target.value)}
                  className="w-full h-9 rounded-lg border border-border bg-background/30 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="all">All Verdicts</option>
                  <option value="real">Real News</option>
                  <option value="fake">Fake News</option>
                  <option value="suspicious">Suspicious News</option>
                </select>
              </div>

              <div className="text-right text-xs text-muted-foreground flex items-center justify-end">
                Showing {filtered.length} of {history.length} records
              </div>
            </div>

            {/* Content list Grid */}
            <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
              <div className="glass max-h-[70vh] overflow-y-auto rounded-2xl p-2 space-y-1">
                {filtered.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => setSelected(h)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSelected(h);
                      }
                    }}
                    className={`group w-full rounded-xl p-3 text-left transition cursor-pointer hover:bg-muted/50 ${
                      selected?.id === h.id ? "bg-muted" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <VerdictBadge verdict={h.verdict} />
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs text-muted-foreground">
                          {h.confidence}%
                        </span>
                        <button
                          onClick={(e) => deleteItem(h.id, e)}
                          className="text-muted-foreground hover:text-destructive p-0.5 rounded opacity-0 group-hover:opacity-100 transition"
                          title="Delete record"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 line-clamp-2 text-sm font-medium">{h.title}</div>
                    <div className="mt-1 text-[10px] text-muted-foreground">
                      {new Date(h.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div>{selected && <ResultCard result={selected} />}</div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
