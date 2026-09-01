import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Pencil, LogOut, Plus, ShieldCheck } from "lucide-react";
import logoAsset from "@/assets/khens-logo.jpg.asset.json";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Announcement Manager — Kolehiyo ng Heneral Santos" },
      {
        name: "description",
        content:
          "Admin dashboard for Kolehiyo ng Heneral Santos to publish, edit, and remove campus announcements and updates.",
      },
      { property: "og:title", content: "Announcement Manager — KHENS" },
      { property: "og:description", content: "Publish and manage campus announcements." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPage,
});

type Announcement = {
  id: string;
  title: string;
  body: string;
  category: string;
  published: boolean;
  created_at: string;
  image_url: string | null;
};

const categories = ["Announcement", "Admissions", "Events", "Scholarship", "Academics"];

function AdminPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [items, setItems] = useState<Announcement[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState(categories[0]!);
  const [published, setPublished] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    const { data } = await supabase
      .from("announcements")
      .select("id,title,body,category,published,created_at,image_url")
      .order("created_at", { ascending: false });
    setItems((data as Announcement[]) ?? []);
  }, []);

  const checkRole = useCallback(async () => {
    const { data: sess } = await supabase.auth.getSession();
    if (!sess.session) {
      navigate({ to: "/auth" });
      return;
    }
    setUserEmail(sess.session.user.email ?? null);
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", sess.session.user.id);
    setIsAdmin(!!roles?.some((r) => r.role === "admin"));
    await loadItems();
    setReady(true);
  }, [navigate, loadItems]);

  useEffect(() => {
    void checkRole();
  }, [checkRole]);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setBody("");
    setCategory(categories[0]!);
    setPublished(true);
    setImageFile(null);
    setImagePreview(null);
    setExistingImage(null);
  }

  function pickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (f && f.size > 5 * 1024 * 1024) {
      setError("Image must be 5 MB or smaller.");
      return;
    }
    setImageFile(f);
    setImagePreview(f ? URL.createObjectURL(f) : null);
    if (f) setExistingImage(null);
  }

  async function claimAdmin() {
    setBusy(true);
    const { data, error: err } = await supabase.rpc("claim_first_admin");
    setBusy(false);
    if (err || !data) {
      setError("An administrator already exists. Ask them to grant you access.");
      return;
    }
    setError(null);
    await checkRole();
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const t = title.trim();
    const b = body.trim();
    if (!t || t.length > 150) return setError("Title is required (max 150 characters).");
    if (!b || b.length > 3000) return setError("Details are required (max 3000 characters).");

    setBusy(true);
    const { data: sess } = await supabase.auth.getSession();

    let imagePath: string | null = existingImage;
    if (imageFile) {
      const ext = imageFile.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const up = await supabase.storage.from("announcements").upload(path, imageFile, {
        contentType: imageFile.type,
        upsert: false,
      });
      if (up.error) {
        setBusy(false);
        setError(`Photo upload failed: ${up.error.message}`);
        return;
      }
      imagePath = path;
    }

    const payload = {
      title: t,
      body: b,
      category,
      published,
      image_url: imagePath,
      author_id: sess.session?.user.id ?? null,
    };
    const res = editingId
      ? await supabase.from("announcements").update(payload).eq("id", editingId)
      : await supabase.from("announcements").insert(payload);
    setBusy(false);
    if (res.error) {
      setError(res.error.message);
      return;
    }
    resetForm();
    await loadItems();
  }

  async function remove(id: string) {
    if (!confirm("Delete this announcement?")) return;
    const { error: err } = await supabase.from("announcements").delete().eq("id", id);
    if (err) setError(err.message);
    await loadItems();
  }

  async function edit(a: Announcement) {
    setEditingId(a.id);
    setTitle(a.title);
    setBody(a.body);
    setCategory(a.category);
    setPublished(a.published);
    setImageFile(null);
    setExistingImage(a.image_url);
    if (a.image_url) {
      const { data: signed } = await supabase.storage
        .from("announcements")
        .createSignedUrl(a.image_url, 3600);
      setImagePreview(signed?.signedUrl ?? null);
    } else {
      setImagePreview(null);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  return (
    <main className="min-h-screen bg-secondary">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <img src={logoAsset.url} alt="KHENS seal" className="h-10 w-10 rounded-full" />
            <div>
              <p className="font-display text-sm font-extrabold text-foreground">Announcement Manager</p>
              <p className="text-xs text-muted-foreground">{userEmail?.split("@")[0]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="rounded-xl border border-border px-3 py-2 text-xs font-bold text-foreground">
              View site
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

        {!isAdmin ? (
          <div className="rounded-3xl border border-border bg-card p-8 text-center">
            <ShieldCheck className="mx-auto h-10 w-10 text-primary" />
            <h1 className="mt-4 font-display text-2xl font-extrabold text-foreground">Admin access required</h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              This account is signed in but is not yet an administrator. If you are setting up the
              website for the first time, you can claim the administrator role below.
            </p>
            <button
              onClick={claimAdmin}
              disabled={busy}
              className="mt-6 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
            >
              Claim administrator role
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={save} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h1 className="font-display text-xl font-extrabold text-foreground">
                {editingId ? "Edit announcement" : "Post a new announcement"}
              </h1>

              <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_200px]">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Title
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={150}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                    placeholder="Enrollment for 2nd Semester is open"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Details
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  maxLength={3000}
                  rows={5}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                  placeholder="Write the full announcement here…"
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="h-4 w-4"
                  />
                  Publish on the website
                </label>
                <div className="ml-auto flex gap-2">
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="rounded-xl border border-border px-4 py-2.5 text-sm font-bold text-foreground"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={busy}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-60"
                  >
                    <Plus className="h-4 w-4" />
                    {editingId ? "Save changes" : "Post announcement"}
                  </button>
                </div>
              </div>
            </form>

            <h2 className="mt-10 font-display text-lg font-extrabold text-foreground">
              All announcements ({items.length})
            </h2>
            <div className="mt-4 space-y-3">
              {items.length === 0 && (
                <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                  No announcements yet. Post your first update above.
                </p>
              )}
              {items.map((a) => (
                <article key={a.id} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-secondary px-2.5 py-1 font-bold uppercase tracking-wide text-primary">
                      {a.category}
                    </span>
                    <span className="text-muted-foreground">
                      {new Date(a.created_at).toLocaleDateString("en-PH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    {!a.published && (
                      <span className="rounded-full bg-muted px-2.5 py-1 font-bold uppercase text-muted-foreground">
                        Draft
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 font-display text-base font-bold text-foreground">{a.title}</h3>
                  <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{a.body}</p>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => edit(a)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-bold text-foreground"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => remove(a.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/40 px-3 py-1.5 text-xs font-bold text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
