import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Database,
  Terminal,
  Cpu,
  RefreshCw,
  Upload,
  UserCheck,
  CheckCircle,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel — FakeNews Shield" },
      { name: "description", content: "AI retraining, system logs console, and server resources." },
    ],
  }),
  component: AdminPage,
});

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Analyst" | "Auditor";
  status: "Active" | "Inactive";
}

interface LogLine {
  timestamp: string;
  level: "INFO" | "WARNING" | "SUCCESS" | "ERROR";
  msg: string;
}

function AdminPage() {
  const [users, setUsers] = useState<UserRow[]>([
    { id: "1", name: "Alice Green", email: "alice@fakenewsshield.ai", role: "Admin", status: "Active" },
    { id: "2", name: "Bob Miller", email: "bob@fakenewsshield.ai", role: "Analyst", status: "Active" },
    { id: "3", name: "Charlie Fox", email: "charlie@fakenewsshield.ai", role: "Auditor", status: "Inactive" },
  ]);

  const [retraining, setRetraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [datasetName, setDatasetName] = useState("");
  const [datasetCount, setDatasetCount] = useState(15420);
  
  // Streaming logs state
  const [logs, setLogs] = useState<LogLine[]>([
    { timestamp: "10:24:02", level: "INFO", msg: "BERT-v2.4 active. Weights loaded." },
    { timestamp: "10:24:05", level: "INFO", msg: "Supabase connection active: listening to analyses updates." },
    { timestamp: "10:25:12", level: "SUCCESS", msg: "Completed heuristics scan: id=89a7-9b2c (Verdict: Fake, Confidence: 92%)" },
  ]);

  const logConsoleRef = useRef<HTMLDivElement>(null);

  // Monitor performance data
  const [perfData, setPerfData] = useState([
    { time: "10:30", cpu: 12, memory: 48, latency: 140 },
    { time: "10:31", cpu: 18, memory: 50, latency: 125 },
    { time: "10:32", cpu: 32, memory: 52, latency: 190 },
    { time: "10:33", cpu: 15, memory: 49, latency: 130 },
    { time: "10:34", cpu: 22, memory: 51, latency: 120 },
  ]);

  useEffect(() => {
    // Scroll logs console to bottom
    if (logConsoleRef.current) {
      logConsoleRef.current.scrollTop = logConsoleRef.current.scrollHeight;
    }
  }, [logs]);

  // Handle mock log generation
  useEffect(() => {
    const timer = setInterval(() => {
      const msgs = [
        "Received client sync batch: syncing 1 record.",
        "Scanned URL source: reputation check complete (bbc.com -> Trust rating 94).",
        "NLP Parser: tokenizing 124 words.",
        "Server status heartbeat: all processes nominal.",
      ];
      const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
      const now = new Date().toLocaleTimeString();
      const level = Math.random() > 0.85 ? "WARNING" : "INFO";
      setLogs((prev) => [...prev.slice(-30), { timestamp: now, level, msg: randomMsg }]);
      
      // Update perf metrics slightly
      setPerfData((prev) => {
        const nextTime = new Date().toLocaleTimeString().slice(0, 5);
        return [
          ...prev.slice(-6),
          {
            time: nextTime,
            cpu: Math.max(5, Math.min(95, prev[prev.length - 1].cpu + Math.round(Math.random() * 20 - 10))),
            memory: Math.max(40, Math.min(85, prev[prev.length - 1].memory + Math.round(Math.random() * 4 - 2))),
            latency: Math.max(90, Math.min(600, prev[prev.length - 1].latency + Math.round(Math.random() * 80 - 40))),
          }
        ];
      });
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const handleRetrain = () => {
    setRetraining(true);
    setProgress(0);
    toast.info("Retraining AI Model: Initializing weights...");

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setRetraining(false);
          setDatasetCount((d) => d + 200); // simulate adding dataset samples
          toast.success("AI Model successfully retrained. Final accuracy improved to 94.6%!");
          setLogs((p) => [
            ...p,
            { timestamp: new Date().toLocaleTimeString(), level: "SUCCESS", msg: "Model retrained on new dataset. Accuracy: 94.6%" }
          ]);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDatasetName(file.name);
      toast.success(`Training dataset '${file.name}' loaded. Ready for retraining.`);
    }
  };

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u))
    );
    toast.success("User status changed successfully.");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Admin Configuration Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage active users, retrain the underlying NLP classifiers, upload dataset updates, and monitor logs.
          </p>
        </div>

        {/* Row 1: Users & Retraining */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* User management */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> Active User Accounts
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="uppercase tracking-widest text-muted-foreground">
                  <tr className="border-b border-border/40">
                    <th className="pb-2 font-medium">Name</th>
                    <th className="pb-2 font-medium">Role</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t border-border/20">
                      <td className="py-2.5 font-medium">{u.name}</td>
                      <td className="py-2.5 text-muted-foreground">{u.role}</td>
                      <td className="py-2.5">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          u.status === "Active" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <Button variant="ghost" size="sm" onClick={() => toggleUserStatus(u.id)}>
                          Toggle Status
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Model retraining */}
          <div className="glass rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold mb-2 flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" /> Model Training & Dataset
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Upload custom training datasets (CSV format) to update model classification weights.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background hover:bg-muted/40 cursor-pointer text-xs font-semibold h-10 px-4 transition">
                    <Upload className="h-4 w-4" />
                    Select Dataset CSV
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleCSVUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {datasetName || "No file selected"}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground flex justify-between">
                  <span>Current Training Samples:</span>
                  <span className="font-bold text-foreground">{datasetCount} articles</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {retraining && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Retraining weights...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
              <Button onClick={handleRetrain} disabled={retraining} className="w-full glow">
                <RefreshCw className={`mr-2 h-4 w-4 ${retraining ? "animate-spin" : ""}`} />
                {retraining ? "Retraining weights..." : "Retrain AI Model"}
              </Button>
            </div>
          </div>
        </div>

        {/* Row 2: Performance Charts & Terminal Console */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Charts (3 columns) */}
          <div className="glass rounded-2xl p-6 lg:col-span-3">
            <h3 className="font-display text-lg font-semibold mb-1 flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" /> Hardware & API Latency Monitoring
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Real-time resource workloads of active prediction servers on localhost.
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={perfData}>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="time" stroke="var(--color-muted-foreground)" fontSize={10} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                  <Line type="monotone" dataKey="cpu" name="CPU Usage (%)" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="memory" name="Memory (%)" stroke="var(--color-accent)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="latency" name="API Latency (ms)" stroke="var(--color-warning)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Console (2 columns) */}
          <div className="glass rounded-2xl p-6 lg:col-span-2 flex flex-col justify-between h-[360px]">
            <div>
              <h3 className="font-display text-lg font-semibold mb-1 flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" /> Live System Logs
              </h3>
              <p className="text-xs text-muted-foreground mb-3">Live streaming of prediction scanning threads.</p>
            </div>
            <div
              ref={logConsoleRef}
              className="flex-1 bg-black/80 font-mono text-[10px] text-green-400 p-3 rounded-xl overflow-y-auto border border-border/40 space-y-1.5 h-full max-h-[220px]"
            >
              {logs.map((l, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-gray-500 font-semibold">{l.timestamp}</span>
                  <span className={`font-bold ${
                    l.level === "ERROR" ? "text-red-500" :
                    l.level === "WARNING" ? "text-yellow-500" :
                    l.level === "SUCCESS" ? "text-blue-400" : "text-green-500"
                  }`}>
                    [{l.level}]
                  </span>
                  <span className="text-gray-300">{l.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
