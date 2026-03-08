

## Plan: Corregir error de foreign key en generación de blog

### Problema

Los logs muestran:
```
insert or update on table "blog_posts" violates foreign key constraint "blog_posts_author_id_fkey"
```

**Causa raíz**: La columna `author_id` en `blog_posts` tiene una FK que apunta a `auth.users`, pero el edge function intenta insertar un UUID de `team_members` (ej: Samuel Navarro `e6edc72e-...`). Estos IDs no existen en `auth.users`, por lo que Postgres rechaza el insert.

### Solución

**1. Migración SQL** — Eliminar la FK incorrecta y crear una nueva apuntando a `team_members`:

```sql
ALTER TABLE blog_posts DROP CONSTRAINT blog_posts_author_id_fkey;
ALTER TABLE blog_posts ADD CONSTRAINT blog_posts_author_id_fkey 
  FOREIGN KEY (author_id) REFERENCES team_members(id) ON DELETE SET NULL;
```

Esto es correcto porque:
- `author_id` ya se usa para guardar IDs de `team_members` (no de `auth.users`)
- La columna ya es nullable (`YES`)
- Los team members activos existen y tienen datos válidos

**2. No se requieren cambios en el edge function** — El código actual (línea 427) ya asigna `defaultAuthor?.id` desde `team_members`, que es el comportamiento correcto.

### Alcance
- Una migración SQL (cambiar FK)
- Sin cambios en código frontend ni edge functions

