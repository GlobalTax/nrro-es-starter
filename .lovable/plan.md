

## Plan: Corregir categorias y especializaciones del equipo

Se han identificado 3 problemas en el formulario de administracion del equipo y en los filtros publicos. Todos se resuelven modificando las opciones hardcoded y el mapa de ordenacion.

---

### 1. Anadir "Socio" y "Manager" a las categorias de Position

**Archivo:** `src/components/admin/team/TeamMemberFormDialog.tsx`

Actualmente `POSITION_OPTIONS` solo tiene: Senior, Asociado, Junior, Master Scholar.

Se anadiran dos nuevas opciones en orden jerarquico:
- `SOCIO` (Socio) — nivel mas alto
- `MANAGER` (Manager) — entre Senior y Asociado

**Archivo:** `src/hooks/useTeamSearch.ts`

El `orderMap` que ordena las posiciones en el filtro publico tambien debe actualizarse:
```
SOCIO: 1
MANAGER: 2
SENIOR: 3
ASOCIADO: 4
JUNIOR: 5
MASTER SCHOLAR: 6
```

---

### 2. Eliminar duplicado de "Contabilidad" en especializaciones

El duplicado probablemente viene de datos en la base de datos con diferente formato (ej: "Contabilidad" vs "CONTABILIDAD"). Hay dos acciones:

**a) Normalizar las opciones en el formulario** — ya estan correctas en el codigo (solo hay un `CONTABILIDAD`).

**b) Normalizar los datos existentes en la BD** — ejecutar un UPDATE para unificar todos los valores de `specialization_es`, `specialization_ca`, `specialization_en` que digan "Contabilidad" (con otra capitalizacion) a "CONTABILIDAD". Esto eliminara el duplicado en los filtros publicos, que se generan dinamicamente desde los datos.

---

### 3. Anadir especializacion generica para perfiles de soporte

Se anadira una nueva opcion de especializacion para agrupar perfiles como Marketing, Administracion, Facturacion, Informatica, etc.

**Opcion propuesta:** `SERVICIOS CORPORATIVOS` (Corporate Services) — es suficientemente amplio para cubrir todas estas funciones sin ser demasiado vago.

**Archivo:** `src/components/admin/team/TeamMemberFormDialog.tsx`

`SPECIALIZATION_OPTIONS` pasara de 5 a 6 opciones:
- CONTABILIDAD
- FISCALIDAD
- LABORAL
- M&A
- SERVICIOS CORPORATIVOS (nueva)
- SERVICIOS GLOBALES

---

### Resumen de cambios

| Archivo | Cambio |
|---|---|
| `src/components/admin/team/TeamMemberFormDialog.tsx` | Anadir SOCIO y MANAGER a positions, anadir SERVICIOS CORPORATIVOS a specializations |
| `src/hooks/useTeamSearch.ts` | Actualizar orderMap con las nuevas posiciones |
| Base de datos (UPDATE) | Normalizar valores duplicados de specialization para eliminar "Contabilidad" duplicado |

