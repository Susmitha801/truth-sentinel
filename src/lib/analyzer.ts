// FakeNews Shield — Analyzer
// Primary: FastAPI ML backend at http://localhost:8000
// Fallback: Local heuristic analysis (used when backend is offline)

const BACKEND_URL = "http://localhost:8000";

/** Call the Python FastAPI backend for analysis */
async function analyzeViaBackend(input: {
  source: "text" | "url" | "file";
  text: string;
  title?: string;
}): Promise<AnalysisResult | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input.text, source: input.source, title: input.title }),
      signal: AbortSignal.timeout(8000), // 8-second timeout
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.warn("Backend error:", res.status, err);
      return null;
    }
    const data = await res.json();
    // Map alternate naming options if returned by backend
    if (data.prediction && !data.verdict) {
      data.verdict = data.prediction.toLowerCase() as Verdict;
    }
    if (data.confidence_score !== undefined && data.confidence === undefined) {
      data.confidence = data.confidence_score;
    }
    if (data.explanation && !data.reasoning) {
      data.reasoning = data.explanation;
    }
    if (data.source_credibility !== undefined && data.credibility === undefined) {
      data.credibility = data.source_credibility;
    }
    // Normalize sentiment label casing from backend
    if (data.sentiment?.label) {
      data.sentiment.label = data.sentiment.label.toLowerCase() as "positive" | "neutral" | "negative";
    }
    return data as AnalysisResult;
  } catch (err) {
    console.warn("Backend unreachable, using local analysis:", err);
    return null;
  }
}

/** Check if the backend is online */
export async function checkBackendStatus(): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/health`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}

export type Verdict = "real" | "fake" | "suspicious";

export interface AnalysisResult {
  id: string;
  createdAt: string;
  source: "text" | "url" | "file";
  title: string;
  excerpt: string;
  verdict: Verdict;
  confidence: number; // 0-100
  credibility: number; // 0-100
  sentiment: { label: "positive" | "neutral" | "negative"; score: number };
  suspiciousPhrases: string[];
  keywords: string[];
  category: string;
  reasoning: string[];
  sourceRating?: number;
}

const SENSATIONAL = [
  "shocking", "you won't believe", "miracle", "exposed", "secret", "scandal",
  "destroy", "banned", "shocking truth", "they don't want you to know",
  "breaking", "urgent", "must read", "100%", "guaranteed", "hoax",
  "conspiracy", "cover-up", "doctors hate", "instantly",
];

const TRUSTED_DOMAINS = [
  "reuters.com", "apnews.com", "bbc.com", "bbc.co.uk", "npr.org",
  "nytimes.com", "washingtonpost.com", "theguardian.com", "wsj.com",
  "bloomberg.com", "ft.com", "economist.com",
];

const CATEGORIES = ["Politics", "Health", "Technology", "Science", "Business", "World", "Sports"];

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function extractKeywords(text: string): string[] {
  const stop = new Set([
    "the", "a", "an", "and", "or", "but", "of", "to", "in", "on", "at", "for",
    "is", "are", "was", "were", "be", "been", "being", "have", "has", "had",
    "this", "that", "with", "as", "by", "from", "it", "its", "they", "their",
    "we", "you", "i", "he", "she", "his", "her", "not", "no", "so", "if",
  ]);
  const words = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 4 && !stop.has(w));
  const freq: Record<string, number> = {};
  for (const w of words) freq[w] = (freq[w] || 0) + 1;
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([w]) => w);
}

export async function analyze(input: {
  source: "text" | "url" | "file";
  text: string;
  title?: string;
}): Promise<AnalysisResult> {
  // ── Try FastAPI backend first ─────────────────────────────────────────────
  const backendResult = await analyzeViaBackend(input);
  if (backendResult) {
    console.info("✅ Analysis via FastAPI backend");
    return backendResult;
  }

  // ── Fallback: local heuristic analysis ───────────────────────────────────
  console.info("⚠️  Backend offline – using local heuristic analysis");
  const text = input.text.trim();
  const lower = text.toLowerCase();
  const found = SENSATIONAL.filter((p) => lower.includes(p));
  const exclamations = (text.match(/!/g) || []).length;
  const allCapsWords = (text.match(/\b[A-Z]{4,}\b/g) || []).length;
  const len = text.length;

  let suspicionScore =
    found.length * 14 + Math.min(exclamations, 10) * 3 + allCapsWords * 5;
  if (len < 200) suspicionScore += 15;

  let domainBoost = 0;
  let sourceRating: number | undefined;
  if (input.source === "url") {
    const domain = (text.match(/https?:\/\/(?:www\.)?([^/\s]+)/i) || [])[1] ?? "";
    if (TRUSTED_DOMAINS.some((d) => domain.endsWith(d))) {
      domainBoost = -35;
      sourceRating = 85 + (hash(domain) % 12);
    } else if (domain) {
      sourceRating = 30 + (hash(domain) % 40);
    }
  }

  const raw = Math.max(0, Math.min(100, suspicionScore + domainBoost + 10));
  let verdict: Verdict;
  if (raw < 25) verdict = "real";
  else if (raw < 55) verdict = "suspicious";
  else verdict = "fake";

  const confidence =
    verdict === "real"
      ? 100 - raw
      : verdict === "fake"
      ? Math.min(98, 60 + raw / 3)
      : 55 + (raw % 25);

  const credibility =
    verdict === "real" ? 75 + (hash(text) % 20) : verdict === "fake" ? 10 + (hash(text) % 25) : 35 + (hash(text) % 30);

  const posWords = ["good", "great", "success", "win", "improve", "hope", "positive"];
  const negWords = ["bad", "fail", "crisis", "attack", "war", "death", "fear", "loss"];
  const pos = posWords.reduce((n, w) => n + (lower.split(w).length - 1), 0);
  const neg = negWords.reduce((n, w) => n + (lower.split(w).length - 1), 0);
  const sentLabel: "positive" | "neutral" | "negative" =
    pos > neg + 1 ? "positive" : neg > pos + 1 ? "negative" : "neutral";
  const sentScore = Math.min(100, 40 + Math.abs(pos - neg) * 12);

  const reasoning: string[] = [];
  if (found.length) reasoning.push(`Detected ${found.length} sensational phrase(s): ${found.slice(0, 3).join(", ")}.`);
  if (exclamations > 3) reasoning.push(`High exclamation density (${exclamations}) suggests emotional framing.`);
  if (allCapsWords > 0) reasoning.push(`${allCapsWords} ALL-CAPS word(s) indicate clickbait styling.`);
  if (len < 200) reasoning.push("Content is unusually short for a news article.");
  if (domainBoost < 0) reasoning.push("URL matches a known reputable publisher.");
  if (!reasoning.length) reasoning.push("Linguistic patterns match typical neutral reporting.");

  const category = CATEGORIES[hash(text) % CATEGORIES.length];
  const title =
    input.title ||
    text.split(/[.!?\n]/)[0]?.slice(0, 80) ||
    (input.source === "url" ? "URL submission" : "Untitled article");

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    source: input.source,
    title,
    excerpt: text.slice(0, 240),
    verdict,
    confidence: Math.round(confidence),
    credibility: Math.round(credibility),
    sentiment: { label: sentLabel, score: Math.round(sentScore) },
    suspiciousPhrases: found,
    keywords: extractKeywords(text),
    category,
    reasoning,
    sourceRating,
  };
}

const KEY = "fns_history_v1";

// Supabase-backed persistence (with localStorage fallback/cache)
import { supabase } from "./supabase";

export function loadHistory(): AnalysisResult[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export async function loadHistoryFromSupabase(): Promise<AnalysisResult[]> {
  try {
    const { data, error } = await supabase
      .from("analyses")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.warn("Supabase load error, falling back to localStorage:", error.message);
      return loadHistory();
    }

    const results: AnalysisResult[] = (data || []).map((row: any) => ({
      id: row.id,
      createdAt: row.created_at,
      source: row.source,
      title: row.title,
      excerpt: row.excerpt,
      verdict: row.verdict,
      confidence: row.confidence,
      credibility: row.credibility,
      sentiment: row.sentiment,
      suspiciousPhrases: row.suspicious_phrases || [],
      keywords: row.keywords || [],
      category: row.category,
      reasoning: row.reasoning || [],
      sourceRating: row.source_rating,
    }));

    // Sync to localStorage as cache
    if (typeof window !== "undefined") {
      localStorage.setItem(KEY, JSON.stringify(results));
    }

    return results;
  } catch {
    return loadHistory();
  }
}

export async function saveResult(r: AnalysisResult) {
  // Always save to localStorage first (instant)
  if (typeof window !== "undefined") {
    const list = [r, ...loadHistory()].slice(0, 100);
    localStorage.setItem(KEY, JSON.stringify(list));
  }

  // Then persist to Supabase
  try {
    const { error } = await supabase.from("analyses").insert({
      id: r.id,
      created_at: r.createdAt,
      source: r.source,
      title: r.title,
      excerpt: r.excerpt,
      verdict: r.verdict,
      confidence: r.confidence,
      credibility: r.credibility,
      sentiment: r.sentiment,
      suspicious_phrases: r.suspiciousPhrases,
      keywords: r.keywords,
      category: r.category,
      reasoning: r.reasoning,
      source_rating: r.sourceRating ?? null,
    });

    if (error) {
      console.warn("Supabase save error:", error.message);
    }
  } catch (err) {
    console.warn("Supabase save failed:", err);
  }
}

export async function clearHistory() {
  // Clear localStorage
  if (typeof window !== "undefined") {
    localStorage.removeItem(KEY);
  }

  // Clear Supabase table
  try {
    const { error } = await supabase.from("analyses").delete().neq("id", "");
    if (error) {
      console.warn("Supabase clear error:", error.message);
    }
  } catch (err) {
    console.warn("Supabase clear failed:", err);
  }
}

