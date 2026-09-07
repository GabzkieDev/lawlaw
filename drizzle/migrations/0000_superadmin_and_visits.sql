CREATE TABLE public.super_admins (
  user_id uuid PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.super_admins TO authenticated;
GRANT ALL ON public.super_admins TO service_role;

ALTER TABLE public.super_admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own superadmin row"
ON public.super_admins FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.is_superadmin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.super_admins WHERE user_id = _user_id)
$$;

REVOKE ALL ON FUNCTION public.is_superadmin(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_superadmin(uuid) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.claim_superadmin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  mail text;
BEGIN
  IF uid IS NULL THEN RETURN false; END IF;
  SELECT email INTO mail FROM auth.users WHERE id = uid;
  IF mail IS DISTINCT FROM 'khs-superadmin@khens.local' THEN RETURN false; END IF;
  INSERT INTO public.super_admins (user_id) VALUES (uid) ON CONFLICT DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (uid, 'admin') ON CONFLICT DO NOTHING;
  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_superadmin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_superadmin() TO authenticated;

CREATE TABLE public.site_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code text NOT NULL DEFAULT 'XX',
  country_name text NOT NULL DEFAULT 'Unknown',
  city text,
  path text NOT NULL DEFAULT '/',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX site_visits_created_at_idx ON public.site_visits (created_at DESC);

GRANT SELECT ON public.site_visits TO authenticated;
GRANT ALL ON public.site_visits TO service_role;

ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can read visits"
ON public.site_visits FOR SELECT TO authenticated
USING (public.is_superadmin(auth.uid()));