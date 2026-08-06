import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { FileText, Link as LinkIcon, Upload, Loader2, Sparkles, CheckCircle2, Trash2, Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { analyze, saveResult, checkBackendStatus, type AnalysisResult } from "@/lib/analyzer";
import { ResultCard } from "@/components/result-card";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "Analyze News — Fake News Shield" },
      {
        name: "description",
        content:
          "Paste an article, enter a URL, or upload a document and let our AI return a verdict in seconds.",
      },
    ],
  }),
  component: AnalyzePage,
});

const SAMPLES = [
  "BREAKING: Scientists reveal SHOCKING miracle cure doctors don't want you to know! This banned secret will destroy big pharma instantly!!!",
  "The European Central Bank held its benchmark interest rate steady on Thursday, citing easing inflation and steady economic growth across the eurozone.",
];

const STAGES = [
  "Tokenizing input & cleaning markup...",
  "Removing stop words & normalising layout syntax...",
  "Extracting entity keywords & stylistic clickbait patterns...",
  "Running classifier (BERT ensemble v2.4 + linguistic weights)...",
  "Cross-referencing domain against publisher database...",
];

function AnalyzePage() {
  const [tab, setTab] = useState<"text" | "url" | "file">("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileText, setFileText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(-1);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    checkBackendStatus().then(setBackendOnline);
    const poll = setInterval(() => checkBackendStatus().then(setBackendOnline), 10000);
    return () => clearInterval(poll);
  }, []);

  const onFile = async (f: File) => {
    setFileName(f.name);
    // Support basic reading, mock PDF/docx reading details
    if (f.name.endsWith(".pdf") || f.name.endsWith(".docx")) {
      toast.info(`Mocking text extraction for document: ${f.name}`);
      setFileText(`This is a mock extracted text representation of the document ${f.name}. It contains multiple assertions, some of which might contain sensationalized clickbait words like miracle cure and banned secret to check the authenticity scoring.`);
    } else {
      const txt = await f.text();
      setFileText(txt.slice(0, 20000));
    }
  };

  const clearFields = () => {
    setText("");
    setUrl("");
    setFileName("");
    setFileText("");
    setResult(null);
    setLoadingStage(-1);
    toast.success("Fields cleared.");
  };

  const run = async () => {
    let payload = "";
    let source: "text" | "url" | "file" = tab;
    let title: string | undefined;

    if (tab === "text") payload = text.trim();
    else if (tab === "url") {
      payload = url.trim();
      title = url.trim();
    } else {
      payload = fileText.trim();
      title = fileName;
    }

    if (!payload || (tab === "text" && payload.length < 30)) {
      toast.error("Please provide at least 30 characters of content.");
      return;
    }
    if (tab === "url" && !/^https?:\/\//i.test(payload)) {
      toast.error("Enter a valid URL starting with http(s)://");
      return;
    }

    setLoading(true);
    setResult(null);
    setLoadingStage(0);

    // Multi-stage log progress interval
    const interval = setInterval(() => {
      setLoadingStage((prev) => {
        if (prev >= STAGES.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 280);

    await new Promise((r) => setTimeout(r, 1500));
    clearInterval(interval);

    const r = await analyze({ source, text: payload, title });
    await saveResult(r);
    setResult(r);
    setLoading(false);
    setLoadingStage(-1);
    toast.success(`Analysis complete · ${r.verdict.toUpperCase()}`);
    setTimeout(() => {
      document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            {backendOnline === null ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" /> Checking AI backend...
              </span>
            ) : backendOnline ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success ring-1 ring-success/30">
                🟢 Backend Online
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/15 px-3 py-1 text-xs font-semibold text-destructive ring-1 ring-destructive/30">
                🔴 Backend Offline
              </span>
            )}
          </div>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            Analyze a <span className="gradient-text">news story</span>
          </h1>
          <p className="mt-3 text-muted-foreground text-sm">
            Input news text, article URL, or upload a document (.txt, .pdf, .docx) to verify authenticity instantly.
          </p>
        </div>

        <div className="glass-strong rounded-3xl p-6 sm:p-8">
          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
            <TabsList className="grid w-full grid-cols-3 bg-muted/50">
              <TabsTrigger value="text" className="gap-2">
                <FileText className="h-4 w-4" /> Text Content
              </TabsTrigger>
              <TabsTrigger value="url" className="gap-2">
                <LinkIcon className="h-4 w-4" /> URL Link
              </TabsTrigger>
              <TabsTrigger value="file" className="gap-2">
                <Upload className="h-4 w-4" /> Upload Document
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="mt-5 space-y-3">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste the full article news content here (at least 30 characters)..."
                className="min-h-[200px] resize-none bg-background/50 font-mono text-sm border-border/60"
              />
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>{text.length} characters</span>
                <div className="flex flex-wrap gap-2">
                  {SAMPLES.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setText(s)}
                      className="rounded-md border border-border/80 px-2 py-1 hover:bg-muted transition"
                    >
                      Try sample {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="url" className="mt-5 space-y-3">
              <Input
                id="url-input"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/article-url"
                className="bg-background/50 border-border/60"
              />
              <p className="text-xs text-muted-foreground">
                Domain reputation is evaluated against known fact-checking databases.
              </p>
            </TabsContent>

            <TabsContent value="file" className="mt-5">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/60 bg-background/40 p-10 text-center transition hover:border-primary hover:bg-muted/30">
                <Upload className="h-7 w-7 text-muted-foreground" />
                <div>
                  <div className="font-medium">
                    {fileName ? fileName : "Click to select local document"}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Accepts .txt, .pdf, .docx, .md, .csv, .json
                  </div>
                </div>
                <input
                  type="file"
                  accept=".txt,.md,.csv,.json,.pdf,.docx,text/plain"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onFile(f);
                  }}
                />
              </label>
              {fileText && (
                <p className="mt-3 text-xs text-muted-foreground bg-muted/40 p-3 rounded-xl border border-border/20 truncate">
                  Loaded: {fileText.slice(0, 120)}... ({fileText.length} characters loaded)
                </p>
              )}
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Protected by FakeNews Shield AI heuristic classifier.
            </p>
            <div className="flex gap-2">
              {(text || url || fileName) && (
                <Button variant="outline" onClick={clearFields} disabled={loading} size="lg">
                  <Trash2 className="mr-1.5 h-4 w-4" /> Clear
                </Button>
              )}
              <Button id="analyze-btn" onClick={run} disabled={loading} size="lg" className="glow">
                {loading ? (
                  <>
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Analyzing…
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-1.5 h-4 w-4" /> Analyze News
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Multiple stage loading sequences */}
          {loading && loadingStage >= 0 && (
            <div className="mt-6 border-t border-border/20 pt-4 space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Loader2 className="h-3 w-3 animate-spin text-primary" /> Prediction Pipeline Stages
              </h4>
              {STAGES.map((s, i) => {
                const finished = loadingStage > i;
                const active = loadingStage === i;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-2.5 text-xs transition ${
                      finished ? "text-success font-medium" : active ? "text-primary font-semibold" : "text-muted-foreground opacity-60"
                    }`}
                  >
                    {finished ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                    ) : active ? (
                      <span className="grid h-4 w-4 place-items-center rounded-full bg-primary pulse-ring shrink-0" />
                    ) : (
                      <span className="h-3 w-3 rounded-full border border-muted-foreground/30 shrink-0" />
                    )}
                    {s}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {result && (
          <div id="result" className="mt-8 transition-opacity duration-300">
            <ResultCard result={result} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
