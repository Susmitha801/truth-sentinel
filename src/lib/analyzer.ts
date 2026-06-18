// Mock AI analyzer — deterministic pseudo-analysis based on text heuristics.
// Replace with real ML/NLP backend later.

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

export function analyze(input: {
  source: "text" | "url" | "file";
  text: string;
  title?: string;
}): AnalysisResult {
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

export function loadHistory(): AnalysisResult[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveResult(r: AnalysisResult) {
  if (typeof window === "undefined") return;
  const list = [r, ...loadHistory()].slice(0, 100);
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function clearHistory() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
