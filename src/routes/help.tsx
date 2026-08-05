import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  HelpCircle,
  BookOpen,
  FileQuestion,
  MessageSquare,
  Mail,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & Feedback — FakeNews Shield" },
      { name: "description", content: "FAQs, user guides, issue reports, and contact support." },
    ],
  }),
  component: HelpPage,
});

interface FAQItem {
  id: string;
  q: string;
  a: string;
}

function HelpPage() {
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDesc, setIssueDesc] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(5);

  const faqs: FAQItem[] = [
    {
      id: "1",
      q: "How does FakeNews Shield analyze articles?",
      a: "The tool processes the linguistic features of the text (like clickbait words, punctuation density, and case capitalization) and cross-checks domains against a compiled dataset of known reliable publishers. This is scored via a lightweight local model.",
    },
    {
      id: "2",
      q: "What types of files can I upload?",
      a: "You can upload plain text files (.txt, .md, .csv, .json) directly. For document files (.pdf, .docx), the system processes the extracted text formatting locally on your browser.",
    },
    {
      id: "3",
      q: "Is my analysis history private?",
      a: "Yes. History is cached locally in your browser's localStorage. If connected, it is persisted to a secure backend database under your session ID. You can wipe all stored records at any time using the clear button in History.",
    },
  ];

  const handleReportIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueTitle.trim() || !issueDesc.trim()) {
      toast.error("Please fill in the title and description.");
      return;
    }
    toast.success("Issue submitted successfully! Support ticket created.");
    setIssueTitle("");
    setIssueDesc("");
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      toast.error("Feedback message cannot be empty.");
      return;
    }
    toast.success("Thank you for your valuable feedback!");
    setFeedback("");
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Help & Support Center</h1>
          <p className="text-sm text-muted-foreground">
            Browse FAQs, read the user manual guide, report issue tickets, or drop feedback.
          </p>
        </div>

        {/* FAQs & User Guide */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* FAQ */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
              <FileQuestion className="h-5 w-5 text-primary" /> Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              {faqs.map((faq) => {
                const open = activeFaq === faq.id;
                return (
                  <div key={faq.id} className="rounded-xl border border-border/40 overflow-hidden bg-muted/20">
                    <button
                      onClick={() => setActiveFaq(open ? null : faq.id)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left font-medium text-sm hover:bg-muted/40 transition"
                    >
                      <span>{faq.q}</span>
                      {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    {open && (
                      <div className="px-4 pb-3 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-border/20">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Guide */}
          <div className="glass rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" /> Quick Start Guide
              </h3>
              <div className="space-y-3 text-xs text-muted-foreground">
                <div className="flex gap-2">
                  <span className="font-mono font-bold text-primary">01.</span>
                  <p>Navigate to **News Detection** and select your input type (Text paste, URL link, or local file).</p>
                </div>
                <div className="flex gap-2">
                  <span className="font-mono font-bold text-primary">02.</span>
                  <p>Click **Analyze** to submit. Watch the prediction indicator parse your article's credibility details.</p>
                </div>
                <div className="flex gap-2">
                  <span className="font-mono font-bold text-primary">03.</span>
                  <p>Check the **Dashboard** for charts, verdict statistics, and historic analyses logs.</p>
                </div>
                <div className="flex gap-2">
                  <span className="font-mono font-bold text-primary">04.</span>
                  <p>Go to **Settings** to select different models (e.g. RoBERTa) or export data backups.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-border/40 pt-4">
              <h4 className="font-display font-semibold text-sm flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" /> Contact Support
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                Direct email: <a href="mailto:support@fakenewsshield.ai" className="text-primary hover:underline">support@fakenewsshield.ai</a>
              </p>
            </div>
          </div>
        </div>

        {/* Forms Row */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Report Issue */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" /> Report a System Issue
            </h3>
            <form onSubmit={handleReportIssue} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Issue Title</label>
                <Input
                  placeholder="e.g. PDF parsing failed"
                  value={issueTitle}
                  onChange={(e) => setIssueTitle(e.target.value)}
                  className="bg-background/30 text-xs h-9"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Description & Steps</label>
                <Textarea
                  placeholder="Explain what happened..."
                  value={issueDesc}
                  onChange={(e) => setIssueDesc(e.target.value)}
                  className="bg-background/30 min-h-[80px] text-xs resize-none"
                />
              </div>
              <Button type="submit" size="sm" className="glow">
                Submit Ticket
              </Button>
            </form>
          </div>

          {/* Feedback */}
          <div className="glass rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" /> Send Feedback
              </h3>
              <form onSubmit={handleSendFeedback} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Rating (1 to 5 Stars)</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackRating(star)}
                        className={`h-8 w-8 rounded text-xs font-bold transition ${
                          feedbackRating >= star ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {star}★
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Feedback Comment</label>
                  <Textarea
                    placeholder="We'd love to hear your thoughts on improvements!"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="bg-background/30 min-h-[80px] text-xs resize-none"
                  />
                </div>
                <Button type="submit" size="sm" className="glow">
                  Send Feedback
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
