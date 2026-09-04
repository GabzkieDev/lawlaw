import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { getVisitorStats, listAccounts, resetAccountPassword } from "@/lib/analytics.functions";
import { countryFlag } from "@/lib/countries";
import { LogOut, ShieldCheck, Users, Globe2, KeyRound } from "lucide-react";
import logoAsset from "@/assets/khens-logo.png.asset.json";

export const Route = createFileRoute("/superadmin")({
  head: () => ({
    meta: [
      { title: "Super Admin Dashboard — Kolehiyo ng Heneral Santos" },
      {
        name: "description",
        content:
          "Super administrator dashboard for Kolehiyo ng Heneral Santos: staff accounts and website visitor statistics by country.",
      },
      { property: "og:title", content: "Super Admin Dashboard — KHENS" },
      { property: "og:description", content: "Accounts and visitor analytics for the KHENS website." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SuperAdminPage,
});

type Stats = Awaited<ReturnType<typeof getVisitorStats>>;
type Account = Awaited<ReturnType<typeof listAccounts>>[number];

function SuperAdminPage() {
  const navigate = useNavigate();
  const fetchStats = useServerFn(getVisitorStats);
  const fetchAccounts = useServerFn(listAccounts);
  const setPassword = useServerFn(resetAccountPassword);

  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pwFor, setPwFor] = useState<string | null>(null);
  const [pwValue, setPwValue] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data: sess } = await supabase.auth.getSession();
    if (!sess.session) {
      navigate({ to: "/auth" });
      return;
    }
    await supabase.rpc("claim_superadmin");
    const { data: isSuper } = await supabase.rpc("is_superadmin", {
      _user_id: sess.session.user.id,
    });
    setAllowed(!!isSuper);
    if (isSuper) {
      try {
        const [s, a] = await Promise.all([fetchStats({ data: undefined }), fetchAccounts({ data: undefined })]);
        setStats(s);
        setAccounts(a);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load dashboard data.");
      }
    }
    setReady(true);
  }, [navigate, fetchStats, fetchAccounts]);

  useEffect(() => {
    void load();
  }, [load]);

  async function savePassword(userId: string) {
    setError(null);
    setNotice(null);
    try {
      await setPassword({ data: { userId, password: pwValue } });
      setNotice("Password updated.");
      setPwFor(null);
      setPwValue("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update the password.");
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-secondary">
        <p className="text-sm text-muted-foreground">Loading dashboard…</p>
      </main>
    );
  }

  if (!allowed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-secondary px-4">
        <div className="max-w-md rounded-3xl border border-border bg-card p-8 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-primary" />
          <h1 className="mt-4 font-display text-2xl font-extrabold text-foreground">
            Super admin only
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in with the super administrator account to open this dashboard.
          </p>
          <Link
            to="/auth"
            className="mt-6 inline-block rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
          >
            Go to staff login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-secondary">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <img src={logoAsset.url} alt="KHENS seal" className="h-10 w-10 rounded-full" />
            <div>
              <p className="font-display text-sm font-extrabold text-foreground">Super Admin Dashboard</p>
              <p className="text-xs text-muted-foreground">Accounts & visitors</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/admin" className="rounded-xl border border-border px-3 py-2 text-xs font-bold text-foreground">
              Announcements
            </Link>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-10">
        {error && (
          <p className="mb-6 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}
        {notice && (
          <p className="mb-6 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground">{notice}</p>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total visits", value: stats?.total ?? 0 },
            { label: "Last 24 hours", value: stats?.last24h ?? 0 },
            { label: "Last 7 days", value: stats?.last7d ?? 0 },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
              <p className="font-display text-3xl font-extrabold text-foreground">{s.value}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <section className="mt-10">
          <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-foreground">
            <Globe2 className="h-5 w-5 text-primary" /> Visitors by country
          </h2>
          <div className="mt-4 rounded-2xl border border-border bg-card p-5">
            {!stats || stats.countries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No visits recorded yet.</p>
            ) : (
              <ul className="space-y-2">
                {stats.countries.map((c) => (
                  <li key={c.code} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">
                      <span className="mr-2 text-lg">{countryFlag(c.code)}</span>
                      {c.name}
                    </span>
                    <span className="font-bold text-primary">{c.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-foreground">
            <Users className="h-5 w-5 text-primary" /> Accounts ({accounts.length})
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Passwords are stored encrypted and cannot be displayed by anyone — you can set a new one instead.
          </p>
          <div className="mt-4 space-y-3">
            {accounts.map((a) => (
              <article key={a.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display text-base font-bold text-foreground">{a.username}</p>
                  {a.roles.map((r) => (
                    <span
                      key={r}
                      className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary"
                    >
                      {r}
                    </span>
                  ))}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Created {new Date(a.createdAt).toLocaleDateString("en-PH")} · Last sign in{" "}
                  {a.lastSignInAt ? new Date(a.lastSignInAt).toLocaleString("en-PH") : "never"}
                </p>
                {pwFor === a.id ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <input
                      type="text"
                      value={pwValue}
                      onChange={(e) => setPwValue(e.target.value)}
                      placeholder="New password"
                      className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                    <button
                      onClick={() => void savePassword(a.id)}
                      className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setPwFor(null);
                        setPwValue("");
                      }}
                      className="rounded-xl border border-border px-4 py-2 text-xs font-bold text-foreground"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setPwFor(a.id);
                      setPwValue("");
                    }}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-bold text-foreground"
                  >
                    <KeyRound className="h-3.5 w-3.5" /> Set new password
                  </button>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-lg font-extrabold text-foreground">Recent visits</h2>
          <div className="mt-4 rounded-2xl border border-border bg-card p-5">
            {!stats || stats.recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing yet.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {stats.recent.map((r, i) => (
                  <li key={i} className="flex items-center justify-between gap-3">
                    <span className="text-foreground">
                      <span className="mr-2">{countryFlag(r.country_code)}</span>
                      {r.country_name} · {r.path}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleString("en-PH")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
