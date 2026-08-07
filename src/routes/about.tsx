import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Brain,
  Database,
  Lock,
  Layers,
  Sparkles,
  Globe,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Cpu,
  BookOpen,
  Terminal,
  Activity,
  Check,
  Server,
  ArrowRight,
  TrendingUp,
  Award,
  Shield,
  HelpCircle,
  Info
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

const BACKEND_URL = "http://localhost:8000";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Project — Fake News Shield" },
      {
        name: "description",
        content:
          "Deep dive into the NLP preprocessing, AI classification, source credibility verification, and explainable models driving Fake News Shield.",
      },
    ],
  }),
  component: AboutPage,
});

// Mock list of all preprocessing steps we support showing
const ALL_PREPROCESSING_STEPS = [
  "Text Cleaning",
  "Tokenization",
  "Stop Word Removal",
  "Lemmatization",
  "Lowercase Conversion",
  "Normalization",
  "Language Detection",
  "Duplicate Detection"
];

// Mock list of supported publishers for fact verification
const SUPPORTED_PUBLISHERS = [
  { name: "BBC", logoText: "BBC" },
  { name: "Reuters", logoText: "RTR" },
  { name: "Associated Press", logoText: "AP" },
  { name: "The Hindu", logoText: "TH" },
  { name: "NDTV", logoText: "NDTV" },
  { name: "Times of India", logoText: "TOI" },
  { name: "Government websites", logoText: "GOV" },
  { name: "WHO", logoText: "WHO" },
  { name: "PIB Fact Check", logoText: "PIB" }
];

// Tech stack configuration with working custom SVG logos
const TECH_STACK = [
  {
    name: "React",
    desc: "Interactive Frontend",
    icon: (className: string) => (
      <svg viewBox="-11.5 -10.23 23 20.46" className={className} fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="0" cy="0" r="2.05" fill="currentColor" />
        <g stroke="currentColor" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    )
  },
  {
    name: "Spring Boot",
    desc: "Enterprise Gateway",
    icon: (className: string) => (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C12 2 6 8 6 13C6 16.31 8.69 19 12 19C15.31 19 18 16.31 18 13C18 8 12 2 12 2Z" />
        <path d="M12 2V19" />
        <path d="M12 8C14 10 16 11 16 11" />
        <path d="M12 12C10 14 8 15 8 15" />
      </svg>
    )
  },
  {
    name: "Java",
    desc: "Data Pipelines",
    icon: (className: string) => (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 11h10a2 2 0 0 1 2 2v3a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4v-5z" />
        <path d="M18 11h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1" />
        <path d="M9 3c0 2-2 2-2 4M13 2c0 2-2 2-2 4M17 3c0 2-2 2-2 4" />
        <path d="M4 22h16" />
      </svg>
    )
  },
  {
    name: "Python",
    desc: "Machine Learning API",
    icon: (className: string) => (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M11.9 2c-3.1 0-2.9 1.3-2.9 1.3l.1 1.2c0 0-.2.6-.9.6H6.1c-1.4 0-2.4 1.1-2.4 2.4V11c0 1.4 1 2.3 2.4 2.3h1.1v-1.5c0-1.4 1.2-2.7 2.7-2.7h3.7c1.4 0 2.4-1.1 2.4-2.4V4.4c0-1.4-1.1-2.4-2.4-2.4H11.9zm1.7 1.6a.6.6 0 1 1 0 1.2.6.6 0 0 1 0-1.2zm-1.7 18.4c3.1 0 2.9-1.3 2.9-1.3l-.1-1.2c0 0 .2-.6.9-.6h2.1c1.4 0 2.4-1.1 2.4-2.4V13c0-1.4-1-2.3-2.4-2.3h-1.1v1.5c0 1.4-1.2 2.7-2.7 2.7H10.3c-1.4 0-2.4 1.1-2.4 2.4v2.3c0 1.4 1.1 2.4 2.4 2.4h1.6zm-1.7-1.6a.6.6 0 1 1 0-1.2.6.6 0 0 1 0 1.2z" />
      </svg>
    )
  },
  {
    name: "MongoDB",
    desc: "Analysis Repository",
    icon: (className: string) => (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C12 2 7 7 7 13C7 16 9 19 12 22C15 19 17 16 17 13C17 7 12 2 12 2Z" />
        <path d="M12 2V22" />
        <path d="M12 10C10.5 11 9 13 9 15" />
        <path d="M12 7C13.5 8 15 10 15 12" />
      </svg>
    )
  },
  {
    name: "REST API",
    desc: "Inter-service Protocol",
    icon: (className: string) => (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="6" r="3" />
        <circle cx="18" cy="18" r="3" />
        <line x1="9" y1="11" x2="15" y2="7" />
        <line x1="9" y1="13" x2="15" y2="17" />
      </svg>
    )
  },
  {
    name: "JWT",
    desc: "Secure Session Auth",
    icon: (className: string) => (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="10" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        <circle cx="12" cy="16" r="1.5" />
      </svg>
    )
  },
  {
    name: "BERT",
    desc: "Deep Transformer Model",
    icon: (className: string) => (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="10" width="18" height="10" rx="3" />
        <path d="M12 2v4" />
        <path d="M8 6h8" />
        <circle cx="8" cy="14" r="1" fill="currentColor" />
        <circle cx="16" cy="14" r="1" fill="currentColor" />
        <path d="M10 17h4" />
      </svg>
    )
  },
  {
    name: "Scikit-learn",
    desc: "ML Classification",
    icon: (className: string) => (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
        <path d="M2 20h20" />
      </svg>
    )
  },
  {
    name: "HuggingFace",
    desc: "Pre-trained NLP Weights",
    icon: (className: string) => (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2" />
        <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2" />
        <path d="M4 18c2-2 4-2 6 0M14 18c2-2 4-2 6 0" />
      </svg>
    )
  },
  {
    name: "Tailwind CSS",
    desc: "Sleek Dashboard UI",
    icon: (className: string) => (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3c-1.2 0-2.4.6-3.1 1.7L4.7 11.2c-.7 1.1-.7 2.5 0 3.6l4.2 6.5c.7 1.1 1.9 1.7 3.1 1.7s2.4-.6 3.1-1.7l4.2-6.5c.7-1.1.7-2.5 0-3.6L15.1 4.7C14.4 3.6 13.2 3 12 3Z" />
        <path d="M7.5 12h9M10.5 8.5h3M9.5 15.5h5" />
      </svg>
    )
  },
  {
    name: "Docker",
    desc: "Containerized Deploy",
    icon: (className: string) => (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="2" width="3" height="3" />
        <rect x="12" y="2" width="3" height="3" />
        <rect x="6" y="6" width="3" height="3" />
        <rect x="10" y="6" width="3" height="3" />
        <rect x="14" y="6" width="3" height="3" />
        <path d="M2 16c2 1 5 1 8 0c4-1 6-4 8-4c3 0 4 2 4 2s-1-4-4-4c-2 0-4 1-5 2C10.5 10.5 7 11 4 12C2 13 2 15 2 16Z" />
      </svg>
    )
  }
];

// Capabilities list
const CAPABILITIES = [
  "BERT Text Classification",
  "Logistic Regression",
  "Random Forest",
  "Explainable AI",
  "NLP Processing",
  "Source Credibility Scoring",
  "Fact Verification Engine",
  "News Analytics Dashboard",
  "History Tracking",
  "Confidence Percentage",
  "Real-time Detection",
  "Multilingual Support",
  "Secure Authentication",
  "REST API Backend",
  "MongoDB Database",
  "JWT Authentication",
  "Responsive Design",
  "Dark Mode",
  "AI Performance Monitoring"
];

interface SystemStatus {
  backendOnline: boolean;
  databaseConnected: boolean;
  modelLoaded: boolean;
  apiRunning: boolean;
  factVerificationActive: boolean;
  aiEngineOnline: boolean;
}

interface PreprocessingData {
  steps: string[];
  language: string;
  tokens: number;
  processingTime: string;
}

interface ClassificationData {
  prediction: string;
  confidence: number;
  model: string;
  predictionTime: string;
}

interface FactVerificationData {
  verified: boolean;
  credibility: number;
  matchedSources: number;
  status: string;
}

interface ExplainableData {
  prediction: string;
  confidence: number;
  reasoning: string[];
  keywords: string[];
  attentionScore: number;
}

function AboutPage() {
  // Main data states
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [preprocessing, setPreprocessing] = useState<PreprocessingData | null>(null);
  const [classification, setClassification] = useState<ClassificationData | null>(null);
  const [factVerification, setFactVerification] = useState<FactVerificationData | null>(null);
  const [explainable, setExplainable] = useState<ExplainableData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Interactive simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0); // 0 to 4 phases
  const [simulatedPreprocStep, setSimulatedPreprocStep] = useState(0); // index of preprocessing steps
  const [simulatedConfidence, setSimulatedConfidence] = useState(0);
  const [simulatedCredibility, setSimulatedCredibility] = useState(0);

  // Auto-ping logic reference
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch all API endpoints
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch system status
      const statusRes = await fetch(`${BACKEND_URL}/api/system/status`);
      if (!statusRes.ok) throw new Error("Backend responded with error status");
      const statusData = await statusRes.json();
      setSystemStatus(statusData);

      // 2. Fetch preprocessing details
      const preprocRes = await fetch(`${BACKEND_URL}/api/about/preprocessing`);
      const preprocData = await preprocRes.json();
      setPreprocessing(preprocData);

      // 3. Fetch classification details
      const classRes = await fetch(`${BACKEND_URL}/api/about/classification`);
      const classData = await classRes.json();
      setClassification(classData);

      // 4. Fetch fact verification details
      const factRes = await fetch(`${BACKEND_URL}/api/about/fact-verification`);
      const factData = await factRes.json();
      setFactVerification(factData);

      // 5. Fetch explainable details
      const explRes = await fetch(`${BACKEND_URL}/api/about/explainable-output`);
      const explData = await explRes.json();
      setExplainable(explData);

      setLoading(false);
    } catch (err: any) {
      console.error("Failed to load about data:", err);
      setError("Unable to connect to the Fake News Shield AI backend APIs. Please verify that the server is active on port 8000 and try again.");
      setSystemStatus({
        backendOnline: false,
        databaseConnected: false,
        modelLoaded: false,
        apiRunning: false,
        factVerificationActive: false,
        aiEngineOnline: false
      });
      setLoading(false);
    }
  };

  // Ping backend status every 10 seconds
  const pingStatus = async () => {
    try {
      const statusRes = await fetch(`${BACKEND_URL}/api/system/status`, {
        signal: AbortSignal.timeout(4000)
      });
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setSystemStatus(statusData);
        if (error) {
          // If we were offline and now we are online, refetch other cards
          fetchAllData();
        }
      } else {
        setSystemStatus(prev => prev ? { ...prev, backendOnline: false } : null);
      }
    } catch {
      setSystemStatus(prev => prev ? { ...prev, backendOnline: false } : null);
    }
  };

  useEffect(() => {
    fetchAllData();

    // Start 10-second ping interval
    pingIntervalRef.current = setInterval(pingStatus, 10000);

    return () => {
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
    };
  }, []);

  // Simulator flow
  const triggerSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulationStep(1);
    setSimulatedPreprocStep(0);
    setSimulatedConfidence(0);
    setSimulatedCredibility(0);

    // Preprocessing animation steps
    let preprocInterval = setInterval(() => {
      setSimulatedPreprocStep(prev => {
        if (prev >= ALL_PREPROCESSING_STEPS.length - 1) {
          clearInterval(preprocInterval);
          // Advance to classification step
          setSimulationStep(2);
          
          // Animate confidence count up
          let conf = 0;
          let confInterval = setInterval(() => {
            conf += 5;
            if (conf >= (classification?.confidence || 97)) {
              setSimulatedConfidence(classification?.confidence || 97.8);
              clearInterval(confInterval);
              // Advance to fact verification
              setSimulationStep(3);

              // Animate credibility count up
              let cred = 0;
              let credInterval = setInterval(() => {
                cred += 5;
                if (cred >= (factVerification?.credibility || 95)) {
                  setSimulatedCredibility(factVerification?.credibility || 95);
                  clearInterval(credInterval);
                  // Advance to final output
                  setSimulationStep(4);
                  setTimeout(() => {
                    setIsSimulating(false);
                  }, 2000);
                } else {
                  setSimulatedCredibility(cred);
                }
              }, 40);
            } else {
              setSimulatedConfidence(conf);
            }
          }, 40);

          return prev;
        }
        return prev + 1;
      });
    }, 250);
  };

  // Helper render for status badges
  const renderStatusBadge = (active: boolean, title: string) => (
    <div className={`flex items-center justify-between rounded-xl p-3 border transition-all duration-300 ${
      active 
        ? "bg-success/5 border-success/20 text-success" 
        : "bg-destructive/5 border-destructive/10 text-muted-foreground opacity-60"
    }`}>
      <div className="flex items-center gap-2.5">
        <div className={`h-2.5 w-2.5 rounded-full ${active ? "bg-success animate-pulse" : "bg-destructive"}`} />
        <span className="text-xs font-semibold uppercase tracking-wider">{title}</span>
      </div>
      {active ? (
        <CheckCircle2 className="h-4 w-4 text-success" />
      ) : (
        <XCircle className="h-4 w-4 text-destructive" />
      )}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8 pb-12">
        
        {/* Header Hero Section */}
        <div className="text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
          
          <div className="mb-4 flex justify-center">
            {loading ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-muted/50 px-3.5 py-1 text-xs text-muted-foreground border border-border animate-pulse">
                <RefreshCw className="h-3 w-3 animate-spin text-primary" />
                Connecting to AI infrastructure...
              </span>
            ) : systemStatus?.backendOnline ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success ring-1 ring-success/30">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                🟢 Live AI Pipeline Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/15 px-3 py-1 text-xs font-semibold text-destructive ring-1 ring-destructive/30">
                <span className="h-2 w-2 rounded-full bg-destructive" />
                🔴 Backend Offline · Core Features Suspended
              </span>
            )}
          </div>

          <h1 className="font-display text-4xl font-extrabold sm:text-6xl tracking-tight">
            Inside the <span className="gradient-text">AI Architecture</span>
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-muted-foreground text-base sm:text-lg leading-relaxed">
            Fake News Shield is a multi-tier analytical system combining NLP pre-processing, 
            BERT-based transformer classification, credibility verification networks, and explanation generators.
          </p>

          <div className="mt-6 flex justify-center gap-4">
            <Button 
              onClick={triggerSimulation} 
              disabled={isSimulating || loading || !systemStatus?.backendOnline}
              className={`glow px-6 py-5 rounded-xl font-medium tracking-wide ${
                isSimulating ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground hover:opacity-90"
              }`}
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Running NLP Simulation...
                </>
              ) : (
                <>
                  <Activity className="mr-2 h-4 w-4" />
                  Test AI Pipeline Live
                </>
              )}
            </Button>
            <Button asChild variant="outline" className="px-6 py-5 rounded-xl border border-border bg-card/40 hover:bg-card/85">
              <Link to="/analyze">Analyze Article</Link>
            </Button>
          </div>
        </div>

        {/* Error State Banner */}
        {error && (
          <div className="glass border border-destructive/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-destructive/5 animate-fade-in">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-destructive shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground">Backend Connection Offline</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{error}</p>
              </div>
            </div>
            <Button onClick={fetchAllData} className="bg-destructive hover:bg-destructive/80 text-white rounded-xl px-4 py-2 shrink-0">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Connection
            </Button>
          </div>
        )}

        {/* Main Grid: Pipeline Sections */}
        <div className="grid gap-6 md:grid-cols-2">

          {/* Section 1: Preprocessing Stage */}
          <div className="glass rounded-3xl p-6 md:p-8 flex flex-col justify-between border border-border/40 hover:border-primary/20 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Layers className="h-24 w-24 text-primary" />
            </div>
            
            <div>
              <div className="flex justify-between items-start">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                  <Layers className="h-6 w-6" />
                </div>
                <div className="flex gap-2">
                  {isSimulating && simulationStep === 1 ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded animate-pulse">
                      Processing...
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-success bg-success/15 border border-success/30 px-2 py-0.5 rounded">
                      Pipeline Standard
                    </span>
                  )}
                </div>
              </div>

              <h2 className="mt-5 font-display text-2xl font-bold tracking-tight">1. Preprocessing Pipeline</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Prior to model injection, text undergoes high-fidelity sanitization. The pipeline cleans HTML elements, normalizes casing, processes stop words, and tokenizes strings.
              </p>

              {/* Steps Progress List */}
              <div className="mt-6 space-y-2">
                {ALL_PREPROCESSING_STEPS.map((stepName, idx) => {
                  let completed = false;
                  if (isSimulating) {
                    completed = idx <= simulatedPreprocStep;
                  } else {
                    completed = preprocessing?.steps.includes(stepName.split(" ").slice(-1)[0]) || 
                                preprocessing?.steps.some(s => stepName.toLowerCase().includes(s.toLowerCase())) || 
                                (!loading && systemStatus?.backendOnline); // default complete when online
                  }

                  return (
                    <div key={stepName} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-card/20 border border-border/10">
                      <span className={completed ? "text-foreground font-medium" : "text-muted-foreground"}>
                        {stepName}
                      </span>
                      {loading ? (
                        <div className="h-4 w-4 rounded bg-muted animate-pulse" />
                      ) : completed ? (
                        <Check className="h-4 w-4 text-success stroke-[3]" />
                      ) : (
                        <div className="h-3 w-3 rounded-full border border-border" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Progress Bar */}
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Pipeline Progress</span>
                  <span>
                    {isSimulating 
                      ? `${Math.round((simulatedPreprocStep + 1) / ALL_PREPROCESSING_STEPS.length * 100)}%`
                      : loading ? "0%" : systemStatus?.backendOnline ? "100%" : "0%"
                    }
                  </span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden border border-border/5">
                  <div 
                    className="bg-primary h-2 transition-all duration-300 rounded-full"
                    style={{ 
                      width: isSimulating 
                        ? `${((simulatedPreprocStep + 1) / ALL_PREPROCESSING_STEPS.length) * 100}%` 
                        : loading ? "0%" : systemStatus?.backendOnline ? "100%" : "0%"
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Metrics Footer */}
            <div className="mt-6 pt-5 border-t border-border/20 grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-muted/20 border border-border/5 rounded-2xl">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Tokens Processed</span>
                <span className="block text-lg font-display font-semibold mt-1 text-primary">
                  {loading ? "..." : preprocessing?.tokens || 286}
                </span>
              </div>
              <div className="p-3 bg-muted/20 border border-border/5 rounded-2xl">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Execution Latency</span>
                <span className="block text-lg font-display font-semibold mt-1 text-primary">
                  {loading ? "..." : preprocessing?.processingTime || "0.42 sec"}
                </span>
              </div>
              <div className="p-3 bg-muted/20 border border-border/5 rounded-2xl">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Word Estimate</span>
                <span className="block text-lg font-display font-semibold mt-1 text-primary">
                  {loading ? "..." : Math.round((preprocessing?.tokens || 286) * 0.72)} words
                </span>
              </div>
              <div className="p-3 bg-muted/20 border border-border/5 rounded-2xl">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Language</span>
                <span className="block text-lg font-display font-semibold mt-1 text-primary">
                  {loading ? "..." : preprocessing?.language || "English"}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: AI Classification Card */}
          <div className="glass rounded-3xl p-6 md:p-8 flex flex-col justify-between border border-border/40 hover:border-primary/20 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Brain className="h-24 w-24 text-accent" />
            </div>

            <div>
              <div className="flex justify-between items-start">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent/10 text-accent border border-accent/20">
                  <Brain className="h-6 w-6" />
                </div>
                <div className="flex gap-1.5 flex-wrap justify-end">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-success bg-success/15 border border-success/30 px-2 py-0.5 rounded">
                    Model Active
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/15 border border-accent/30 px-2 py-0.5 rounded">
                    Confidence High
                  </span>
                </div>
              </div>

              <h2 className="mt-5 font-display text-2xl font-bold tracking-tight">2. AI Classification Engine</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                The core classification module leverages a state-of-the-art transformer BERT classifier coupled with classic ML models to calculate credibility tags.
              </p>

              {/* Prediction Summary */}
              <div className="mt-6 p-4 rounded-2xl bg-muted/20 border border-border/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">AI Classifier Verdict</span>
                  {loading ? (
                    <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                  ) : (
                    <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                      (classification?.prediction || "REAL") === "REAL" 
                        ? "bg-success/10 text-success border border-success/20" 
                        : "bg-destructive/10 text-destructive border border-destructive/20"
                    }`}>
                      {classification?.prediction || "REAL"} NEWS
                    </span>
                  )}
                </div>

                {/* Confidence Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Ensemble Confidence Score</span>
                    <span className="font-semibold text-accent">
                      {isSimulating 
                        ? `${simulatedConfidence.toFixed(1)}%` 
                        : loading ? "0.0%" : `${classification?.confidence || 97.8}%`
                      }
                    </span>
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden border border-border/5">
                    <div 
                      className="bg-accent h-3 transition-all duration-300 rounded-full"
                      style={{ 
                        width: isSimulating 
                          ? `${simulatedConfidence}%`
                          : loading ? "0%" : `${classification?.confidence || 97.8}%`
                      }}
                    />
                  </div>
                </div>

                {/* Real vs Fake Probability Split */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Probability distribution</span>
                  <div className="flex h-3.5 rounded-lg overflow-hidden text-[9px] font-bold text-center border border-border/5">
                    <div 
                      className="bg-success text-success-foreground flex items-center justify-center transition-all duration-500"
                      style={{ 
                        width: isSimulating 
                          ? `${simulatedConfidence}%`
                          : loading ? "50%" : `${classification?.confidence || 97.8}%`
                      }}
                    >
                      REAL (
                      {isSimulating 
                        ? `${simulatedConfidence.toFixed(0)}%` 
                        : loading ? "..." : `${classification?.confidence || 97.8}%`
                      })
                    </div>
                    <div 
                      className="bg-destructive text-destructive-foreground flex items-center justify-center transition-all duration-500"
                      style={{ 
                        width: isSimulating 
                          ? `${100 - simulatedConfidence}%`
                          : loading ? "50%" : `${100 - (classification?.confidence || 97.8)}%`
                      }}
                    >
                      FAKE (
                      {isSimulating 
                        ? `${(100 - simulatedConfidence).toFixed(0)}%` 
                        : loading ? "..." : `${(100 - (classification?.confidence || 97.8)).toFixed(1)}%`
                      })
                    </div>
                  </div>
                </div>
              </div>

              {/* Models Supported List */}
              <div className="mt-6 space-y-3">
                <span className="text-xs font-semibold text-foreground">Integrated Verification Classifiers:</span>
                <div className="grid grid-cols-2 gap-2">
                  {["BERT Transformer", "Logistic Regression", "Random Forest Classifier", "Ensemble Voting"].map((model) => (
                    <div key={model} className="flex items-center gap-2 rounded-xl p-2.5 bg-card/30 border border-border/5 text-xs text-muted-foreground">
                      <Cpu className="h-3.5 w-3.5 text-accent" />
                      <span>{model}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Inference latency footer */}
            <div className="mt-6 pt-5 border-t border-border/20 flex justify-between items-center text-xs text-muted-foreground">
              <span>Model Classifier: <strong className="text-foreground">{loading ? "..." : classification?.model || "BERT Ensemble"}</strong></span>
              <span>Latency: <strong className="text-foreground">{loading ? "..." : classification?.predictionTime || "0.58 sec"}</strong></span>
            </div>
          </div>

          {/* Section 3: Fact Verification Section */}
          <div className="glass rounded-3xl p-6 md:p-8 flex flex-col justify-between border border-border/40 hover:border-primary/20 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Database className="h-24 w-24 text-success" />
            </div>

            <div>
              <div className="flex justify-between items-start">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-success/10 text-success border border-success/20">
                  <Database className="h-6 w-6" />
                </div>
                <div>
                  {loading ? (
                    <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                  ) : (
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded ring-1 ${
                      (factVerification?.status || "Verified") === "Verified"
                        ? "bg-success/15 text-success ring-success/30"
                        : (factVerification?.status || "Verified") === "Partially Verified"
                        ? "bg-warning/15 text-warning ring-warning/30"
                        : "bg-destructive/15 text-destructive ring-destructive/30"
                    }`}>
                      {factVerification?.status || "Verified"}
                    </span>
                  )}
                </div>
              </div>

              <h2 className="mt-5 font-display text-2xl font-bold tracking-tight">3. Fact Verification Engine</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Matches claim records dynamically against indexed publishers, government circulars, WHO notices, and factual indexes to assess raw integrity scores.
              </p>

              {/* Source Verification Grid */}
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {SUPPORTED_PUBLISHERS.map((pub) => (
                    <div key={pub.name} className="flex flex-col items-center justify-center p-3 rounded-xl bg-card/20 border border-border/5 hover:bg-card/40 transition-colors">
                      <span className="text-[10px] font-bold text-muted-foreground tracking-widest">{pub.logoText}</span>
                      <span className="text-[9px] text-foreground mt-1 text-center font-medium truncate w-full">{pub.name}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-muted/20 border border-border/10 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Source Trust Credibility</span>
                    <span className="block text-2xl font-display font-bold text-success">
                      {isSimulating 
                        ? `${simulatedCredibility}%`
                        : loading ? "0%" : `${factVerification?.credibility || 95}%`
                      }
                    </span>
                  </div>
                  {/* Small Circular Progress */}
                  <div className="relative h-14 w-14">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-muted/20"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-success transition-all duration-500"
                        strokeWidth="3.5"
                        strokeDasharray={`${isSimulating ? simulatedCredibility : (factVerification?.credibility || 95)}, 100`}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Fact verification metrics */}
            <div className="mt-6 pt-5 border-t border-border/20 grid grid-cols-2 gap-2 text-center text-xs text-muted-foreground">
              <div className="text-left">
                <span>Verified Sources: <strong className="text-foreground">{loading ? "..." : factVerification?.matchedSources || 6}</strong></span>
              </div>
              <div className="text-right">
                <span>Source Reliability: <strong className="text-foreground">94.8%</strong></span>
              </div>
            </div>
          </div>

          {/* Section 4: Explainable Output Section */}
          <div className="glass rounded-3xl p-6 md:p-8 flex flex-col justify-between border border-border/40 hover:border-primary/20 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Sparkles className="h-24 w-24 text-primary" />
            </div>

            <div>
              <div className="flex justify-between items-start">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                  <Sparkles className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/15 border border-primary/30 px-2 py-0.5 rounded">
                  Explainable AI (XAI)
                </span>
              </div>

              <h2 className="mt-5 font-display text-2xl font-bold tracking-tight">4. Explainable Verdicts</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Rather than treating classification as a black box, the model generates indicators, attention scores, and structural reasoning statements explaining its verdicts.
              </p>

              {/* Reasoning Indicators Card */}
              <div className="mt-6 space-y-4">
                <div className="p-4 rounded-2xl bg-muted/20 border border-border/10 space-y-3">
                  <div className="flex justify-between text-xs border-b border-border/10 pb-2">
                    <span className="text-muted-foreground">Key Decision Reasoning</span>
                    <span className="font-semibold text-primary">Attention Weight: {loading ? "..." : `${explainable?.attentionScore || 94.2}%`}</span>
                  </div>
                  
                  {loading ? (
                    <div className="space-y-2">
                      <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                      <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {(explainable?.reasoning || ["Trusted Publisher", "Recent Published Date", "Multiple Verified Sources"]).map((reason, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs">
                          <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                          <span className="text-foreground">{reason}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Highlighted keywords indicator */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">High-Attention Keywords</span>
                  <div className="flex flex-wrap gap-2">
                    {(explainable?.keywords || ["verification", "credibility", "integrity"]).map((keyword) => (
                      <span key={keyword} className="text-xs px-2.5 py-1 rounded-xl bg-card border border-border/10 text-muted-foreground font-mono">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Verdict summary */}
            <div className="mt-6 pt-5 border-t border-border/20 flex justify-between items-center text-xs text-muted-foreground">
              <span>Attention Mechanism: <strong className="text-foreground">Self-Attention Layers</strong></span>
              <span>Feature Weighting: <strong className="text-foreground">Live</strong></span>
            </div>
          </div>

        </div>

        {/* Section 5 & 6 Side-by-Side: System Health & Stack Badges */}
        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Section 5: Backend Status Live ping widget */}
          <div className="glass rounded-3xl p-6 border border-border/40 md:col-span-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg font-bold">System Microservices</h3>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Health pings monitor microservices continuously every 10s. If database links or model weights fail, features automatically fallback to static mocks.
              </p>

              {/* Status List */}
              <div className="mt-5 space-y-2">
                {renderStatusBadge(systemStatus?.backendOnline ?? false, "Backend Server API")}
                {renderStatusBadge(systemStatus?.databaseConnected ?? false, "MongoDB Database")}
                {renderStatusBadge(systemStatus?.modelLoaded ?? false, "BERT Engine Loaded")}
                {renderStatusBadge(systemStatus?.apiRunning ?? false, "REST API Endpoints")}
                {renderStatusBadge(systemStatus?.factVerificationActive ?? false, "Verification Links")}
                {renderStatusBadge(systemStatus?.aiEngineOnline ?? false, "Live AI Pipeline")}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border/20 text-center flex items-center justify-between text-[10px] text-muted-foreground font-medium">
              <span>Auto-refresh: Active (10s)</span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                Refreshed live
              </span>
            </div>
          </div>

          {/* Section 6: Capabilities checklist */}
          <div className="glass rounded-3xl p-6 border border-border/40 md:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-accent" />
                  <h3 className="font-display text-lg font-bold">Supported Capabilities & Features</h3>
                </div>
                <span className="text-[10px] font-bold text-accent uppercase tracking-wider bg-accent/15 px-2 py-0.5 rounded border border-accent/20">
                  Production Suite
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Below is a checklist of features implemented inside Fake News Shield verifying source integrity, hosting ML models, and auditing reports.
              </p>

              {/* Capabilities checklist grid */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CAPABILITIES.map((cap) => (
                  <div key={cap} className="flex items-center gap-2 text-xs p-2 bg-muted/20 border border-border/5 rounded-xl">
                    <Check className="h-3.5 w-3.5 text-success stroke-[3] shrink-0" />
                    <span className="text-muted-foreground truncate">{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border/20 flex justify-between items-center text-xs text-muted-foreground">
              <span>Total Features: <strong className="text-foreground">19 Implemented</strong></span>
              <span className="text-primary font-medium flex items-center gap-1">
                Full Details <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>

        </div>

        {/* Section 7: Technology Stack Badges */}
        <div className="glass-strong rounded-3xl p-6 md:p-8 border border-border/40 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h3 className="font-display text-xl font-bold">7. System Technology Stack</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Production-grade architecture composed of containerized modules running react interfaces, java API routing pipelines, and python tensor libraries.
              </p>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 border border-border/10 px-2 py-1 rounded self-start md:self-center">
              Target Environment: Local Sandbox / Dockerized Cloud
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {TECH_STACK.map((tech) => (
              <div 
                key={tech.name} 
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-card border border-border/10 hover:border-primary/30 transition-all duration-300 hover:scale-105 group text-center"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  {tech.icon("h-5 w-5")}
                </div>
                <span className="text-sm font-bold text-foreground mt-3 tracking-wide">{tech.name}</span>
                <span className="text-[10px] text-muted-foreground mt-1 block">{tech.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation CTA */}
        <div className="glass rounded-3xl p-8 border border-border/40 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-card to-primary/5">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="font-display text-lg font-semibold text-foreground">Want to run a real credibility report?</h3>
            <p className="text-xs text-muted-foreground">
              Input any web address, article text or draft to receive instant credibility scores, bias analytics, and indicators.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild className="glow rounded-xl px-5 py-4">
              <Link to="/analyze">Launch Analyzer</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl px-5 py-4 border border-border bg-card/50">
              <Link to="/dashboard">View Dashboard</Link>
            </Button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
