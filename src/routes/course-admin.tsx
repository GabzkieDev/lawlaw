import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { CalendarDays, MapPin, Trash2, LogOut, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logoAsset from "@/assets/khens-logo.png.asset.json";
import { getProgramBySlug, formatEventDate } from "@/lib/programs";

export const Route = createFileRoute("/course-admin")({
  head: () => ({
    meta: [
      { title: "Course Events Portal — Kolehiyo ng Heneral Santos" },
      {
        name: "description",
        content:
          "Program coordinators of Kolehiyo ng Heneral Santos post and remove event dates for their own course.",
      },
      { property: "og:title", content: "Course Events Portal — Kolehiyo ng Heneral Santos" },
      {
        property: "og:description",
        content: "Post and remove course event dates for your program.",
      },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CourseAdminPage,
});

type EventRow = {
  id: string;
  title: string;
  detail: string;
  location: string;
  event_date: string;
};

function CourseAdminPage() {
  const navigate = useNavigate();
  const [slug, setSlug] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [rows, setRows] = useState<EventRow[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [detail, setDetail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async (s: string) => {
    const { data } = await supabase
      .from("program_events")
      .select("id, title, detail, location, event_date")
      .eq("program_slug", s)
      .order("event_date", { ascending: true });
    setRows(data ?? []);
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate({ to: "/auth" });
        return;
      }
      const { data: claimed } = await supabase.rpc("claim_program_admin");
      const s = (claimed as string | null) ?? null;
      setSlug(s);
      setChecking(false);
      if (s) await load(s);
    })();
  }, [navigate, load]);

  async function addEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!slug) return;
    setMessage(null);
    if (!title.trim() || !date) {
      setMessage("Please add an event name and a date.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("program_events").insert({
      program_slug: slug,
      title: title.trim(),
      detail: detail.trim(),
      location: location.trim(),
      event_date: date,
    });
    setBusy(false);
    if (error) {
      setMessage("Could not save this event. Please try again.");
      return;
    }
    setTitle("");
    setDate("");
    setLocation("");
    setDetail("");
    setMessage("Event posted.");
    await load(slug);
  }

  async function removeEvent(id: string) {
    if (!slug) return;
    const { error } = await supabase.from("program_events").delete().eq("id", id);
    if (error) {
      setMessage("Could not remove this event.");
      return;
    }
    await load(slug);
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-secondary">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </main>
    );
  }

  if (!slug) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-secondary px-6 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Course accounts only
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          This page is for program coordinator accounts. Sign in with your course account to manage
          your event dates.
        </p>
        <button
          onClick={signOut}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
        >
          Back to sign in
        </button>
      </main>
    );
  }

  const program = getProgramBySlug(slug);

  return (
    <main className="min-h-screen bg-secondary pb-20">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <img src={logoAsset.url} alt="Kolehiyo ng Heneral Santos seal" className="h-10 w-10" />
            <div>
              <p className="font-display text-sm font-extrabold text-foreground">
                Course Events Portal
              </p>
              <p className="text-xs text-muted-foreground">
                {program?.title ?? slug.toUpperCase()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/program/$slug" params={{ slug }} className="text-xs font-semibold text-muted-foreground hover:underline">
              View course page
            </Link>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-bold text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-8 px-6 py-10">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold text-foreground">Post an event date</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Events you post appear on your course page only.
          </p>
          <form onSubmit={addEvent} className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Event name
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Place
              </label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                maxLength={120}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Details
              </label>
              <textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                rows={3}
                maxLength={600}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
            {message && (
              <p className="sm:col-span-2 text-sm text-muted-foreground">{message}</p>
            )}
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                <Plus className="h-4 w-4" /> {busy ? "Saving…" : "Post event"}
              </button>
            </div>
          </form>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold text-foreground">Your posted events</h2>
          {rows.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No events posted yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {rows.map((r) => (
                <li
                  key={r.id}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
                >
                  <div>
                    <h3 className="font-display text-base font-bold text-foreground">{r.title}</h3>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-flame">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatEventDate(r.event_date)}
                      </span>
                      {r.location && (
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {r.location}
                        </span>
                      )}
                    </p>
                    {r.detail && (
                      <p className="mt-2 text-sm text-muted-foreground">{r.detail}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeEvent(r.id)}
                    aria-label={`Delete ${r.title}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-bold text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
