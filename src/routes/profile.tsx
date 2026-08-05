import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { User, Mail, Lock, Shield, Save, Check } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "User Profile — FakeNews Shield" },
      { name: "description", content: "Manage your user profile details and password security." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user_profile");
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setUsername(u.username || "");
      setEmail(u.email || "");
    } else {
      setUsername("Admin Analyst");
      setEmail("admin@fakenewsshield.ai");
    }
  }, []);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim()) {
      toast.error("All profile fields are required.");
      return;
    }
    localStorage.setItem("user_profile", JSON.stringify({ username, email }));
    toast.success("Profile details updated successfully!");
    // Trigger router reload to sync topnav username
    window.location.reload();
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill out all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 800);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold">User Profile</h1>
          <p className="text-sm text-muted-foreground">
            Manage your personal settings, password changes, and avatar identity.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Avatar widget */}
          <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <div className="h-24 w-24 rounded-full bg-[image:var(--gradient-cyber)] text-primary-foreground font-bold text-3xl grid place-items-center uppercase shadow-elegant border border-primary/20">
              {username.slice(0, 2) || "AD"}
            </div>
            <h3 className="mt-4 font-display font-semibold text-base">{username || "Admin Analyst"}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Role: QA Auditor</p>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {["AD", "SA", "FN", "AI"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setUsername(tag === "AD" ? "Admin Analyst" : tag === "SA" ? "Senior Auditor" : tag === "FN" ? "FakeNews Checker" : "AI Specialist");
                    toast.info(`Pre-filled display name: ${tag}`);
                  }}
                  className="h-8 w-8 rounded-lg bg-muted text-foreground text-xs font-bold border border-border hover:bg-primary/20 transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Edit details form */}
          <div className="glass rounded-2xl p-6 md:col-span-2">
            <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Profile Settings
            </h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-background/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-background/30"
                  />
                </div>
              </div>

              <Button type="submit" className="glow w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" /> Save Details
              </Button>
            </form>
          </div>
        </div>

        {/* Change password form */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" /> Update Security Credentials
          </h3>
          <form onSubmit={handleChangePassword} className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Current Password</label>
              <Input
                type="password"
                placeholder="Current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="bg-background/30"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">New Password</label>
              <Input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-background/30"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Confirm Password</label>
              <Input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-background/30"
              />
            </div>
            <div className="sm:col-span-3 flex justify-end">
              <Button type="submit" disabled={loading} className="glow w-full sm:w-auto">
                {loading ? "Updating..." : "Change Password"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
