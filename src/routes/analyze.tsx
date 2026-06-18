import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Link as LinkIcon, Upload, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { SiteNav, SiteFooter } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { analyze, saveResult, type AnalysisResult } from "@/lib/analyzer";
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

function AnalyzePage() {
  const [tab, setTab] = useState<"text" | "url" | "file">("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileText, setFileText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const onFile = async (f: File) => {
    setFileName(f.name);
    const txt = await f.text();
    setFileText(txt.slice(0, 20000));
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
    await new Promise((r) => setTimeout(r, 1400));
    const r = analyze({ source, text: payload, title });
    saveResult(r);
    setResult(r);
    setLoading(false);
    toast.success(`Analysis complete · ${r.verdict.toUpperCase()}`);
    setTimeout(() => {
      document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-5xl px-4 pb-20 pt-10 sm:px-6">
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            Analyze a <span className="gradient-text">news story</span>
          </h1>
          <p className="mt-3 text-muted-foreground">
            Choose an input method, hit analyze, and explore the AI's reasoning.
          </p>
        </div>

        <div className="glass-strong rounded-3xl p-6 sm:p-8">
          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
            <TabsList className="grid w-full grid-cols-3 bg-muted/50">
              <TabsTrigger value="text" className="gap-2">
                <FileText className="h-4 w-4" /> Text
              </TabsTrigger>
              <TabsTrigger value="url" className="gap-2">
                <LinkIcon className="h-4 w-4" /> URL
              </TabsTrigger>
              <TabsTrigger value="file" className="gap-2">
                <Upload className="h-4 w-4" /> File
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="mt-5 space-y-3">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste the full article text here..."
                className="min-h-[200px] resize-none bg-background/50 font-mono text-sm"
              />
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>{text.length} characters</span>
                <div className="flex flex-wrap gap-2">
                  {SAMPLES.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setText(s)}
                      className="rounded-md border border-border px-2 py-1 hover:bg-muted"
                    >
                      Try sample {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="url" className="mt-5 space-y-3">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/article"
                className="bg-background/50"
              />
              <p className="text-xs text-muted-foreground">
                We rate the source against a curated list of trusted publishers.
              </p>
            </TabsContent>

            <TabsContent value="file" className="mt-5">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-background/40 p-10 text-center transition hover:border-primary hover:bg-muted/30">
                <Upload className="h-7 w-7 text-muted-foreground" />
                <div>
                  <div className="font-medium">
                    {fileName ? fileName : "Click to upload a document"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    .txt, .md, .csv, .json — up to ~20k characters
                  </div>
                </div>
                <input
                  type="file"
                  accept=".txt,.md,.csv,.json,text/plain"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onFile(f);
                  }}
                />
              </label>
              {fileText && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Loaded {fileText.length} characters from {fileName}.
                </p>
              )}
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Powered by NLP heuristics + transformer-based scoring.
            </p>
            <Button onClick={run} disabled={loading} size="lg" className="glow">
              {loading ? (
                <>
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Analyzing…
                </>
              ) : (
                <>
                  <Sparkles className="mr-1 h-4 w-4" /> Analyze
                </>
              )}
            </Button>
          </div>

          {loading && (
            <div className="mt-6 grid gap-2 text-xs text-muted-foreground">
              {[
                "Tokenizing input…",
                "Removing stop words & special characters…",
                "Extracting keywords & entities…",
                "Running classifier (Logistic · RF · BERT)…",
                "Cross-referencing source credibility…",
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="grid h-1.5 w-1.5 place-items-center rounded-full bg-primary pulse-ring" />
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        {result && (
          <div id="result" className="mt-8">
            <ResultCard result={result} />
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
