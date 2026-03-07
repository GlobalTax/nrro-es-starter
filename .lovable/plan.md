

## Diagnóstico: Error RLS en tabla `profiles`

### Causa raíz

La tabla `profiles` tiene RLS habilitado pero **no tiene ninguna política INSERT**. Las políticas existentes son:

- `Admins can view all profiles` (SELECT)
- `Users can view their own profile` (SELECT)
- `Users can update their own profile` (UPDATE)

Cuando un admin crea un usuario desde `AdminUsers.tsx`, el código intenta hacer un `INSERT` directo en `profiles` usando el cliente Supabase (anon key), que es bloqueado por RLS.

Además, ya existe una Edge Function `create-admin-user` que hace todo esto correctamente usando el **service role key** (bypass de RLS), incluyendo: crear usuario en Auth, asignar perfil, asignar rol, y rollback en caso de error.

### Solución (dos partes)

**1. Añadir política INSERT para profiles**

Añadir una política que permita a admins insertar perfiles, como respaldo para el trigger `handle_new_user`:

```sql
CREATE POLICY "Admins can insert profiles"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
```

**2. Refactorizar `AdminUsers.tsx` para usar la Edge Function existente**

Cambiar `createAdminMutation` para invocar `create-admin-user` en lugar de hacer inserts directos. La Edge Function ya maneja:
- Creación del usuario en Supabase Auth
- Creación del perfil (con service role, sin RLS)
- Asignación de rol en `user_roles`
- Rollback automático si falla algún paso
- Logging en `security_events`

El código actual (líneas 128-164) se reemplazará por una llamada a `supabase.functions.invoke('create-admin-user', ...)`.

### Resultado esperado

- Los nuevos usuarios se crean correctamente desde el panel de admin
- Se elimina el error de RLS
- Se usa el flujo seguro del servidor (Edge Function) en lugar de operaciones directas desde el cliente

