import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { countryName } from "./countries";

/** Records one visit. Country is read from the edge geo headers of the request. */
export const recordVisit = createServerFn({ method: "POST" })
  .inputValidator((data: { path?: string }) => ({
    path: (data?.path ?? "/").slice(0, 200),
  }))
  .handler(async ({ data }) => {
    const headers = getRequest().headers;
    const code = (
      headers.get("cf-ipcountry") ??
      headers.get("x-vercel-ip-country") ??
      headers.get("x-country-code") ??
      "XX"
    )
      .toUpperCase()
      .slice(0, 2);
    const city = headers.get("cf-ipcity") ?? headers.get("x-vercel-ip-city");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("site_visits").insert({
      country_code: code,
      country_name: countryName(code),
      city: city ? decodeURIComponent(city).slice(0, 80) : null,
      path: data.path,
    });
    return { ok: true };
  });

type VisitRow = { country_code: string; country_name: string; path: string; created_at: string };

export const getVisitorStats = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: allowed } = await context.supabase.rpc("is_superadmin", {
      _user_id: context.userId,
    });
    if (!allowed) throw new Error("Forbidden");

    const { data, error } = await context.supabase
      .from("site_visits")
      .select("country_code,country_name,path,created_at")
      .order("created_at", { ascending: false })
      .limit(5000);
    if (error) throw error;

    const rows = (data ?? []) as VisitRow[];
    const byCountry = new Map<string, { code: string; name: string; count: number }>();
    for (const r of rows) {
      const cur = byCountry.get(r.country_code) ?? {
        code: r.country_code,
        name: r.country_name,
        count: 0,
      };
      cur.count += 1;
      byCountry.set(r.country_code, cur);
    }

    const dayMs = 86_400_000;
    const now = Date.now();
    return {
      total: rows.length,
      last24h: rows.filter((r) => now - new Date(r.created_at).getTime() < dayMs).length,
      last7d: rows.filter((r) => now - new Date(r.created_at).getTime() < 7 * dayMs).length,
      countries: [...byCountry.values()].sort((a, b) => b.count - a.count),
      recent: rows.slice(0, 25),
    };
  });

export const listAccounts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: allowed } = await context.supabase.rpc("is_superadmin", {
      _user_id: context.userId,
    });
    if (!allowed) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    if (error) throw error;

    const { data: roles } = await supabaseAdmin.from("user_roles").select("user_id,role");
    const { data: supers } = await supabaseAdmin.from("super_admins").select("user_id");
    const superIds = new Set((supers ?? []).map((s) => s.user_id));

    return data.users.map((u) => ({
      id: u.id,
      username: (u.email ?? "").split("@")[0] ?? "",
      email: u.email ?? "",
      createdAt: u.created_at,
      lastSignInAt: u.last_sign_in_at ?? null,
      roles: [
        ...(superIds.has(u.id) ? ["superadmin"] : []),
        ...(roles ?? []).filter((r) => r.user_id === u.id).map((r) => String(r.role)),
      ],
    }));
  });

/** Super admin can set a new password for any account (passwords themselves are hashed and unreadable). */
export const resetAccountPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { userId: string; password: string }) => data)
  .handler(async ({ data, context }) => {
    const { data: allowed } = await context.supabase.rpc("is_superadmin", {
      _user_id: context.userId,
    });
    if (!allowed) throw new Error("Forbidden");
    if (data.password.length < 6) throw new Error("Password must be at least 6 characters.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.updateUserById(data.userId, {
      password: data.password,
    });
    if (error) throw error;
    return { ok: true };
  });
