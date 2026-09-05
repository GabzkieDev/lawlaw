GRANT SELECT ON public.site_visits TO authenticated;
GRANT ALL ON public.site_visits TO service_role;
GRANT SELECT ON public.super_admins TO authenticated;
GRANT ALL ON public.super_admins TO service_role;

REVOKE ALL ON FUNCTION public.is_superadmin(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_superadmin(uuid) TO authenticated, service_role;
REVOKE ALL ON FUNCTION public.claim_superadmin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_superadmin() TO authenticated, service_role;