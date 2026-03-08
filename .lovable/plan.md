

## Plan: Fase 3 — Optimización de stats y upload de contratos/firma

### Cambio 1: Optimizar `useEmpleadoStats` con SQL aggregate

Actualmente `useEmpleadoStats()` hace `SELECT *` de todos los empleados y calcula en cliente. Lo reemplazaremos con una función SQL.

**Migración SQL** — Crear función `get_empleado_stats()`:
```sql
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
    COUNT(*) FILTER (WHERE e.activo = false)::bigint,
    COALESCE(SUM(e.coste_total_mensual) FILTER (WHERE e.activo = true), 0)::numeric,
    COALESCE(SUM(e.coste_total_mensual) FILTER (WHERE e.activo = true), 0)::numeric * 12
  FROM public.empleados e;
END;
$$;
```

**`useEmpleados.ts`** — Modificar `useEmpleadoStats` para llamar a `supabase.rpc('get_empleado_stats')` en lugar de cargar todos los registros. Mantener `porDepartamento` como query separada ligera (`select('departamento, activo')`).

### Cambio 2: Implementar upload de contratos y firma

**`EmpleadoDetailSheet.tsx`** — Conectar los botones estáticos con uploads reales al bucket `cvs`:

- **Contrato**: Al hacer clic en "Seleccionar archivo", abrir un `<input type="file">` hidden. Subir a `cvs/{empleado_id}/contrato_{timestamp}.pdf`. Guardar la URL en `formData.contrato_url`.
- **Firma**: Al hacer clic en "Subir firma", abrir input para imagen. Subir a `cvs/{empleado_id}/firma_{timestamp}.png`. Guardar en `formData.firma_url`.
- **Descarga**: El botón de Download abrirá la URL del contrato en nueva pestaña.
- Ambos usan `supabase.storage.from('cvs').upload(path, file)` y luego `getPublicUrl` (o `createSignedUrl` ya que el bucket es privado).

Crear un hook auxiliar `useStorageUpload` o implementar la lógica inline con `supabase.storage`.

### Resumen de archivos a modificar

| Archivo | Cambio |
|---------|--------|
| **Migración SQL** | Crear `get_empleado_stats()` |
| `src/hooks/useEmpleados.ts` | Refactorizar `useEmpleadoStats` para usar RPC |
| `src/components/admin/empleados/EmpleadoDetailSheet.tsx` | Conectar upload de contrato y firma al bucket `cvs` |

