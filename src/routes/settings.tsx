import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Settings as SettingsIcon, ShieldAlert, Database, Bell, Globe, Sparkles, Download, Upload } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { loadHistory, saveResult, type AnalysisResult } from "@/lib/analyzer";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — FakeNews Shield" },
      { name: "description", content: "Configure notification thresholds and active AI classification settings." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [lang, setLang] = useState("en");
  const [threshold, setThreshold] = useState(75);
  const [model, setModel] = useState("bert");
  
  // Notification switches
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [browserAlerts, setBrowserAlerts] = useState(true);
  const [criticalUpdates, setCriticalUpdates] = useState(false);

  // Backup DB: triggers JSON download of current analysis history
  const handleBackup = () => {
    try {
      const history = loadHistory();
      const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fakenewsshield_db_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Database backup JSON downloaded successfully.");
    } catch {
      toast.error("Failed to generate database backup.");
    }
  };

  // Restore DB: triggers upload merging
  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target?.result as string;
        const parsed: AnalysisResult[] = JSON.parse(text);
        if (!Array.isArray(parsed) || (parsed.length > 0 && !parsed[0].id)) {
          throw new Error("Invalid backup format.");
        }
        
        // Merge with existing local storage
        const current = loadHistory();
        const merged = [...parsed];
        
        // Deduplicate by ID
        const seen = new Set(merged.map(item => item.id));
        for (const c of current) {
          if (!seen.has(c.id)) {
            merged.push(c);
          }
        }
        
        localStorage.setItem("fns_history_v1", JSON.stringify(merged));
        toast.success(`Restored database: successfully imported ${parsed.length} records!`);
        
        // Merge sync to Supabase (async)
        for (const item of parsed) {
          await saveResult(item);
        }
      } catch (err) {
        toast.error("Failed to restore: invalid backup file schema.");
      }
    };
    reader.readAsText(file);
  };

  const handleSaveAIConfig = () => {
    toast.success(`Active AI Configuration updated: ${model.toUpperCase()} @ ${threshold}% threshold.`);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold">System Settings</h1>
          <p className="text-sm text-muted-foreground">
            Configure system language, custom AI threshold settings, notifications, and data backups.
          </p>
        </div>

        {/* Global Settings */}
        <div className="glass rounded-2xl p-6 space-y-6">
          <h3 className="font-display text-lg font-semibold flex items-center gap-2 border-b border-border/40 pb-3">
            <Globe className="h-5 w-5 text-primary" /> Application Prefs
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Language selection</label>
              <select
                value={lang}
                onChange={(e) => {
                  setLang(e.target.value);
                  toast.success(`Language set to ${e.target.value.toUpperCase()}`);
                }}
                className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="en">English (US)</option>
                <option value="es">Español (ES)</option>
                <option value="fr">Français (FR)</option>
                <option value="de">Deutsch (DE)</option>
              </select>
            </div>
            <div className="space-y-1.5 flex flex-col justify-end">
              <label className="text-xs font-semibold text-muted-foreground">Appearance Mode</label>
              <div className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
                Use the sun/moon button in the topbar to toggle Light/Dark mode.
              </div>
            </div>
          </div>
        </div>

        {/* AI model config */}
        <div className="glass rounded-2xl p-6 space-y-6">
          <h3 className="font-display text-lg font-semibold flex items-center gap-2 border-b border-border/40 pb-3">
            <Sparkles className="h-5 w-5 text-primary" /> AI Classification Engine
          </h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Active model classifier</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm focus:outline-none"
              >
                <option value="bert">BERT Ensemble v2.4 (Highly Accurate)</option>
                <option value="roberta">RoBERTa Custom Classifier (Optimized Latency)</option>
                <option value="gpt">GPT-3.5 API Verification (Hybrid Heuristics)</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                <span>Confidence Threshold Alert</span>
                <span className="font-mono text-primary font-bold">{threshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <p className="text-[10px] text-muted-foreground">
                Flags articles as "Fake" or "Suspicious" if prediction exceeds this threshold.
              </p>
            </div>

            <Button onClick={handleSaveAIConfig} className="glow w-full sm:w-auto">
              Save AI Settings
            </Button>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold flex items-center gap-2 border-b border-border/40 pb-3">
            <Bell className="h-5 w-5 text-primary" /> System Alerts & Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-alerts">Email Notification Alerts</Label>
                <p className="text-xs text-muted-foreground">Send daily digests of critical fake news outbreaks.</p>
              </div>
              <Switch id="email-alerts" checked={emailAlerts} onCheckedChange={setEmailAlerts} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="browser-alerts">In-App Browser Popups</Label>
                <p className="text-xs text-muted-foreground">Enable real-time toast alerts for analysis completions.</p>
              </div>
              <Switch id="browser-alerts" checked={browserAlerts} onCheckedChange={setBrowserAlerts} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="critical-updates">Model Retraining Notices</Label>
                <p className="text-xs text-muted-foreground">Notify when training datasets are loaded or models retrain.</p>
              </div>
              <Switch id="critical-updates" checked={criticalUpdates} onCheckedChange={setCriticalUpdates} />
            </div>
          </div>
        </div>

        {/* Database backup */}
        <div className="glass rounded-2xl p-6 space-y-6">
          <h3 className="font-display text-lg font-semibold flex items-center gap-2 border-b border-border/40 pb-3">
            <Database className="h-5 w-5 text-primary" /> Database Operations
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border/40 bg-muted/20 p-4 space-y-3">
              <h4 className="font-display font-semibold text-sm">Backup Local DB</h4>
              <p className="text-xs text-muted-foreground">
                Export all news check history data stored on this client profile.
              </p>
              <Button onClick={handleBackup} variant="outline" size="sm" className="w-full">
                <Download className="mr-2 h-4 w-4" /> Backup Database
              </Button>
            </div>

            <div className="rounded-xl border border-border/40 bg-muted/20 p-4 space-y-3">
              <h4 className="font-display font-semibold text-sm">Restore Local DB</h4>
              <p className="text-xs text-muted-foreground">
                Restore history from a previously exported `.json` database file.
              </p>
              <label className="flex items-center justify-center gap-2 rounded-lg border border-border bg-background hover:bg-muted/40 cursor-pointer text-xs font-semibold h-9 px-4 transition">
                <Upload className="h-4 w-4" />
                Upload Backup file
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestore}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
