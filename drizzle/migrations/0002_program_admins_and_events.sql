CREATE TABLE public.program_admins (
  user_id uuid PRIMARY KEY,
  program_slug text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.program_admins TO authenticated;
GRANT ALL ON public.program_admins TO service_role;
ALTER TABLE public.program_admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own program admin row"
  ON public.program_admins FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE TABLE public.program_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_slug text NOT NULL,
  title text NOT NULL,
  detail text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  event_date date NOT NULL,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX program_events_slug_date_idx ON public.program_events (program_slug, event_date);
GRANT SELECT ON public.program_events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.program_events TO authenticated;
GRANT ALL ON public.program_events TO service_role;
ALTER TABLE public.program_events ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_program_admin(_user_id uuid, _slug text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.program_admins WHERE user_id = _user_id AND program_slug = _slug)
$$;
GRANT EXECUTE ON FUNCTION public.is_program_admin(uuid, text) TO authenticated, service_role;

CREATE POLICY "Anyone can read program events"
  ON public.program_events FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Course or site admins can insert program events"
  ON public.program_events FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.is_program_admin(auth.uid(), program_slug));
CREATE POLICY "Course or site admins can update program events"
  ON public.program_events FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.is_program_admin(auth.uid(), program_slug))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.is_program_admin(auth.uid(), program_slug));
CREATE POLICY "Course or site admins can delete program events"
  ON public.program_events FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.is_program_admin(auth.uid(), program_slug));

CREATE OR REPLACE FUNCTION public.claim_program_admin()
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  uid uuid := auth.uid();
  mail text;
  slug text;
BEGIN
  IF uid IS NULL THEN RETURN NULL; END IF;
  SELECT email INTO mail FROM auth.users WHERE id = uid;
  IF mail IS NULL THEN RETURN NULL; END IF;
  IF mail !~ '^khs-(bsit|bsed|beed|bsba|bshm|act)@khens\.local$' THEN
    SELECT program_slug INTO slug FROM public.program_admins WHERE user_id = uid;
    RETURN slug;
  END IF;
  slug := split_part(split_part(mail, '@', 1), '-', 2);
  INSERT INTO public.program_admins (user_id, program_slug) VALUES (uid, slug)
    ON CONFLICT (user_id) DO UPDATE SET program_slug = EXCLUDED.program_slug;
  RETURN slug;
END;
$$;
GRANT EXECUTE ON FUNCTION public.claim_program_admin() TO authenticated, service_role;