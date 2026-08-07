import { Link } from "@tanstack/react-router";
import { Shield, Menu, X, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "Home" },
  { to: "/analyze", label: "Analyze" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/history", label: "History" },
  { to: "/about", label: "About" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    // We've used the prompt, discard it
    setDeferredPrompt(null);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[image:var(--gradient-cyber)] text-primary-foreground glow">
            <Shield className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="truncate font-display text-base font-bold leading-none">
              Fake News Shield
            </div>
            <div className="hidden text-[10px] uppercase tracking-widest text-muted-foreground sm:block">
              AI Authenticity Detector
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
              activeProps={{ className: "bg-muted text-foreground" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {deferredPrompt && (
            <Button 
              onClick={handleInstallClick} 
              size="sm" 
              variant="outline" 
              className="hidden md:inline-flex gap-1.5 border border-primary/20 text-primary hover:bg-primary/5"
            >
              <Download className="h-4 w-4" />
              Install App
            </Button>
          )}
          <Button asChild className="hidden md:inline-flex" size="sm">
            <Link to="/analyze">Analyze News</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="glass mx-auto mt-2 max-w-6xl rounded-2xl p-2 md:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              activeProps={{ className: "bg-muted text-foreground" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
          {deferredPrompt && (
            <button
              onClick={() => {
                handleInstallClick();
                setOpen(false);
              }}
              className="w-full text-left flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-primary hover:bg-muted"
            >
              <Download className="h-4 w-4" />
              Install Mobile App
            </button>
          )}
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mx-auto mt-20 max-w-6xl px-4 pb-10 pt-6 text-center text-xs text-muted-foreground sm:px-6">
      <div className="glass rounded-2xl px-6 py-5">
        <div className="flex items-center justify-center gap-2">
          <Shield className="h-3.5 w-3.5" />
          <span className="font-medium">Fake News Shield AI</span>
        </div>
        <p className="mt-2 text-foreground/80">
          Protected by FakeNews Shield AI · Heuristic NLP verification scan engine
        </p>
      </div>
    </footer>
  );
}
