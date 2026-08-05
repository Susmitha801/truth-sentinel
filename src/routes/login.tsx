import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Shield, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — FakeNews Shield" },
      { name: "description", content: "Sign in to access your news authenticity analysis dashboard." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already logged in, redirect to dashboard
    const token = localStorage.getItem("auth_token");
    if (token) {
      router.navigate({ to: "/dashboard" });
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Username/Email is required.");
      return;
    }
    if (!password.trim()) {
      toast.error("Password is required.");
      return;
    }

    setLoading(true);
    // Simulate API request delay
    await new Promise((r) => setTimeout(r, 800));

    // Simple mock logic: accept standard test user or any nonempty valid format
    if (username.includes("@") && !username.includes("@user.com") && password !== "Password123") {
      toast.error("Invalid credentials. Try test@user.com / Password123");
      setLoading(false);
      return;
    }

    // Write token and default profile info to localStorage
    localStorage.setItem("auth_token", "jwt_token_valid_123");
    localStorage.setItem(
      "user_profile",
      JSON.stringify({
        username: username.split("@")[0] || username,
        email: username.includes("@") ? username : `${username}@fakenewsshield.ai`,
      })
    );

    toast.success("Login successful!");
    setLoading(false);
    router.navigate({ to: "/dashboard" });
  };

  return (
    <div className="relative grid min-h-screen place-items-center px-4 overflow-hidden">
      {/* Cybersecurity background grids */}
      <div className="absolute inset-0 grid-bg opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/10 blur-[120px] pointer-events-none" />

      <div className="glass-strong relative z-10 w-full max-w-md rounded-3xl p-8 sm:p-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[image:var(--gradient-cyber)] text-primary-foreground glow mb-4">
            <Shield className="h-6 w-6" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Welcome Back</h1>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Access the FakeNews Shield AI Authenticity Detector
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" /> Username or Email
            </label>
            <Input
              id="username"
              type="text"
              placeholder="e.g., test@user.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-background/40"
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" /> Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/40 pr-10"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            id="login-btn"
            type="submit"
            className="w-full mt-6 glow"
            disabled={loading}
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        {/* Footer help */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Use demo credentials: <span className="font-semibold text-primary">test@user.com</span> /{" "}
          <span className="font-semibold text-primary">Password123</span>
        </p>
      </div>
    </div>
  );
}
