

## Revisión en profundidad: Módulo de Recursos Humanos

### Estructura actual

El módulo tiene **5 secciones** bajo el grupo "Recursos Humanos" en el sidebar:

| Sección | Página | Estado |
|---------|--------|--------|
| Empleados | `AdminEmpleados.tsx` | Completa y bien estructurada |
| Candidatos | `AdminCandidatos.tsx` | Funcional pero con inconsistencias de diseño |
| Ofertas | `AdminJobPositions.tsx` | Funcional pero básica |
| Entrevistas | `AdminEntrevistas.tsx` | Completa |
| Nóminas | `AdminNominas.tsx` | Completa |

---

### Problemas detectados

#### 1. Inconsistencia visual entre secciones

- **Empleados, Entrevistas y Nóminas** siguen el patrón de diseño estándar del admin (cards sin borde, shadow-sm, colores slate, stat cards con iconos).
- **Candidatos** usa un diseño anterior: `CardHeader` con título "Filtros", `StatCard` genérico, `Dialog` en vez de `DetailSheet`, `font-normal text-3xl` en vez de `text-2xl font-semibold`.
- **Ofertas** también tiene diseño inconsistente: `text-3xl font-normal`, borde en la tabla en vez de card sin borde, sin stat cards.

#### 2. Candidatos: eliminación con `window.confirm`

`AdminCandidatos.tsx` línea 88 usa `window.confirm()` nativo en vez del `AlertDialog` de Radix que usan todas las demás secciones. Rompe la experiencia visual.

#### 3. Candidatos: sin vinculación con Ofertas

El campo `job_position_id` existe en la tabla `candidatos` pero **no se muestra ni se usa** en la UI. No hay forma de vincular un candidato con una oferta publicada.

#### 4. Ofertas: sin estadísticas ni filtros

`AdminJobPositions` es la sección más básica: sin stat cards, sin filtros, sin búsqueda. No muestra cuántos candidatos tiene cada oferta.

#### 5. Entrevistas: no se pueden crear desde la UI

`AdminEntrevistas` permite ver, editar y eliminar entrevistas, pero **no tiene botón de crear nueva entrevista**. Solo se pueden editar las existentes.

#### 6. EmpleadoDetailSheet: upload de contrato y firma no funcional

Los botones de "Seleccionar archivo" y "Subir firma" no tienen lógica de upload implementada. Son solo UI estática.

#### 7. Nóminas: no se pueden crear cierres nuevos

`AdminNominas` genera los 12 meses como placeholder pero los pendientes (con `id: pending-X`) no se pueden clickar. No hay `useCreateCierreNomina` conectado a un botón en la UI.

#### 8. Stats de empleados: carga todos los empleados para calcular

`useEmpleadoStats()` hace `SELECT *` de todos los empleados para calcular estadísticas en el cliente. Debería usar una función SQL aggregate.

---

### Plan de mejoras (priorizado)

**Fase 1: Consistencia visual y bugs funcionales**

1. **Homogeneizar Candidatos** — Refactorizar `AdminCandidatos.tsx` para seguir el mismo patrón visual que Empleados: stat cards con iconos/colores, filtros en card sin borde, `DetailSheet` en vez de `Dialog`, `AlertDialog` para eliminación.

2. **Homogeneizar Ofertas** — Añadir stat cards (total, publicadas, borradores, cerradas), barra de filtros (búsqueda, estado), y aplicar el diseño estándar (cards sin borde, shadow-sm).

3. **Reemplazar `window.confirm`** en Candidatos por `AlertDialog`.

**Fase 2: Funcionalidad faltante**

4. **Crear entrevistas desde la UI** — Añadir botón "Nueva entrevista" en `AdminEntrevistas` con selector de candidato y formulario completo.

5. **Crear cierres de nómina** — Hacer clickables los meses pendientes para crear un cierre nuevo usando `useCreateCierreNomina`.

6. **Vincular candidatos con ofertas** — Mostrar y permitir seleccionar `job_position_id` en Candidatos, y mostrar conteo de candidatos en la tabla de Ofertas.

**Fase 3: Mejoras de rendimiento y UX**

7. **Optimizar stats de empleados** — Mover el cálculo de estadísticas a una función SQL en lugar de cargar todos los registros.

8. **Implementar upload de contratos** — Conectar los botones de upload con el bucket `cvs` de Supabase Storage.

---

### Recomendación

Sugiero empezar por la **Fase 1** (consistencia visual) ya que son los cambios más visibles y no requieren modificaciones de base de datos. Esto unificaría la experiencia en las 5 secciones del módulo HR.

