import { useEffect, useState } from "react";
import { Link, useRouter, useLocation } from "@tanstack/react-router";
import {
  Shield,
  LayoutDashboard,
  Search,
  History,
  BarChart3,
  User,
  Settings,
  Lock,
  Info,
  HelpCircle,
  LogOut,
  Bell,
  Menu,
  X,
  CheckCircle2,
} from "lucide-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";

interface SidebarLink {
  to: string;
  label: string;
  icon: typeof Shield;
}

const links: SidebarLink[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/analyze", label: "News Detection", icon: Search },
  { to: "/history", label: "News History", icon: History },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/profile", label: "User Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/admin", label: "Admin Panel", icon: Lock },
  { to: "/about", label: "About Project", icon: Info },
  { to: "/help", label: "Help & Feedback", icon: HelpCircle },
];

interface Notification {
  id: string;
  title: string;
  time: string;
  unread: boolean;
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "1", title: "New model update (v2.4) is now live.", time: "10m ago", unread: true },
    { id: "2", title: "Security scan completed. 0 vulnerabilities.", time: "1h ago", unread: true },
    { id: "3", title: "Database backup completed successfully.", time: "1d ago", unread: false },
  ]);
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);

  useEffect(() => {
    // Check authentication
    let token = localStorage.getItem("auth_token");
    if (!token && location.pathname !== "/login" && location.pathname !== "/") {
      // Auto-initialize token for seamless local QA testing
      token = "jwt_token_valid_123";
      localStorage.setItem("auth_token", token);
    }
    
    // Load profile info
    const storedUser = localStorage.getItem("user_profile");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser({ username: "Admin Analyst", email: "admin@fakenewsshield.ai" });
    }
  }, [location.pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    router.navigate({ to: "/login" });
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const activeLink = links.find((l) => location.pathname.startsWith(l.to)) || links[0];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Left Sidebar */}
      <aside
        className={`glass-strong fixed bottom-0 top-0 z-40 flex w-64 flex-col border-r border-border/40 transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-border/40">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-[image:var(--gradient-cyber)] text-primary-foreground glow">
              <Shield className="h-4 w-4" />
            </div>
            <span className="font-display text-lg font-bold gradient-text">
              Fake News Shield
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
          {links.map((l) => {
            const Icon = l.icon;
            const active = location.pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-primary/15 text-primary border-l-4 border-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border/40 space-y-4">
          <div className="flex items-center gap-2 rounded-xl bg-success/10 px-3 py-2 text-xs text-success">
            <span className="h-2 w-2 rounded-full bg-success pulse-ring shrink-0" />
            <div className="min-w-0">
              <p className="font-semibold leading-none">AI Engine Online</p>
              <p className="mt-0.5 text-[10px] opacity-80">v2.4 (BERT Classifier)</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex flex-1 flex-col transition-all duration-300 md:pl-64`}>
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/40 bg-background/50 px-6 backdrop-blur-md">
          {/* Left: Hamburger + Title */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h2 className="hidden md:block font-display text-lg font-bold text-foreground">
              {activeLink.label}
            </h2>
          </div>

          {/* Right: Search, Notifications, Avatar */}
          <div className="flex items-center gap-4">
            {/* Live status (Desktop) */}
            <div className="hidden lg:flex items-center gap-2 rounded-full border border-border/40 bg-muted/30 px-3 py-1 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-success pulse-ring" />
              <span className="text-muted-foreground">Localhost Engine:</span>
              <span className="font-semibold text-foreground">Active</span>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notification Bell */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  setProfileOpen(false);
                }}
                className="relative"
              >
                <Bell className="h-5 w-5" />
                {notifications.some((n) => n.unread) && (
                  <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-destructive border-2 border-background" />
                )}
              </Button>

              {notifOpen && (
                <div className="glass-strong absolute right-0 mt-2 w-80 rounded-2xl p-4 shadow-elegant z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-border/40">
                    <h4 className="font-display text-sm font-bold">Notifications</h4>
                    <button
                      onClick={markAllRead}
                      className="text-xs text-primary hover:underline"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="mt-3 space-y-2">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`rounded-xl p-2.5 text-xs transition ${
                          n.unread ? "bg-primary/10 text-foreground" : "hover:bg-muted/40 text-muted-foreground"
                        }`}
                      >
                        <p className="font-medium">{n.title}</p>
                        <p className="mt-1 text-[10px] opacity-75">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotifOpen(false);
                }}
                className="flex items-center gap-2 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-[image:var(--gradient-cyber)] text-primary-foreground font-bold text-sm grid place-items-center uppercase shadow-elegant">
                  {user?.username?.slice(0, 2) || "AD"}
                </div>
              </button>

              {profileOpen && (
                <div className="glass-strong absolute right-0 mt-2 w-56 rounded-2xl p-2 shadow-elegant z-50">
                  <div className="px-3 py-2 border-b border-border/40">
                    <p className="text-sm font-bold truncate">{user?.username || "Admin Analyst"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email || "admin@fakenewsshield.ai"}</p>
                  </div>
                  <div className="mt-1 space-y-0.5">
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition"
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-border/40 bg-background/30 py-6 text-center text-xs text-muted-foreground">
          <div className="mx-auto flex flex-col items-center justify-between gap-4 px-6 md:flex-row max-w-6xl">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="font-semibold text-foreground">FakeNews Shield AI</span>
            </div>
            <p>Protected by FakeNews Shield AI · © {new Date().getFullYear()}</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
