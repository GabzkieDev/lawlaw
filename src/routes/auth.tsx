import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import logoAsset from "@/assets/khens-logo.jpg.asset.json";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Staff Sign In — Kolehiyo ng Heneral Santos" },
      {
        name: "description",
        content:
          "Secure sign-in for the Kolehiyo ng Heneral Santos administrator to post announcements and campus updates.",
      },
      { property: "og:title", content: "Staff Sign In — Kolehiyo ng Heneral Santos" },
      {
        property: "og:description",
        content: "Secure sign-in for the KHENS website administrator.",
      },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

const ADMIN_USERNAME = "kolehiyo-admin";
const emailFor = (username: string) => `${username.trim().toLowerCase()}@khens.local`;

function AuthPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const user = username.trim().toLowerCase();
    if (!user || !password) {
      setError("Enter your username and password.");
      return;
    }
    setBusy(true);
    try {
      const email = emailFor(user);
      let { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      // First-time setup: create the single maintainer account on first successful login attempt.
      if (signInError && user === ADMIN_USERNAME) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: "KHENS Administrator" } },
        });
        if (!signUpError) {
          ({ error: signInError } = await supabase.auth.signInWithPassword({ email, password }));
        }
      }

      if (signInError) {
        setError("Incorrect username or password.");
        return;
      }
      navigate({ to: "/admin" });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-lg">
        <div className="flex flex-col items-center text-center">
          <img src={logoAsset.url} alt="Kolehiyo ng Heneral Santos seal" className="h-20 w-20 rounded-full" />
          <h1 className="mt-4 font-display text-2xl font-extrabold text-foreground">Staff Portal</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to post announcements and campus updates.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={60}
              autoComplete="username"
              required
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
              placeholder="kolehiyo-admin"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={72}
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {busy ? "Please wait…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          This website is maintained by a single administrator account.
        </p>
        <p className="mt-3 text-center text-sm">
          <Link to="/" className="text-muted-foreground hover:underline">
            ← Back to the website
          </Link>
        </p>
      </div>
    </main>
  );
}
