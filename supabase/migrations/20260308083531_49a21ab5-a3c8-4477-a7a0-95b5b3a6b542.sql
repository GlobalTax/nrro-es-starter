CREATE OR REPLACE FUNCTION public.get_empleado_stats()
RETURNS TABLE(
  total bigint,
  activos bigint,
  inactivos bigint,
  coste_mensual_total numeric,
  coste_anual_total numeric
)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::bigint,
    COUNT(*) FILTER (WHERE e.activo = true)::bigint,
    COUNT(*) FILTER (WHERE e.activo IS NOT TRUE)::bigint,
    COALESCE(SUM(e.coste_total_mensual) FILTER (WHERE e.activo = true), 0)::numeric,
    (COALESCE(SUM(e.coste_total_mensual) FILTER (WHERE e.activo = true), 0) * 12)::numeric
  FROM public.empleados e;
END;
$$;