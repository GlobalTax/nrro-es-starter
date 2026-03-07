

## Dashboard de Estadísticas de Uso de IA

Crear un nuevo widget/sección en el Admin Dashboard que muestre KPIs y estadísticas del uso de IA en el proyecto.

### Fuentes de datos disponibles

| Métrica | Tabla | Query |
|---|---|---|
| Artículos generados por IA | `blog_generation_queue` | Count where status = 'completed' |
| Noticias creadas por IA | `news_automation_runs` | SUM(articles_generated) where status = 'completed' |
| Traducciones realizadas | `blog_posts` | Count where `content_en IS NOT NULL` (posts traducidos) |
| Auditorías completadas | `marketing_audits` | Count total |

### Implementación

**1. Hook `useAIUsageStats.ts`**
- Query paralelo a las 4 tablas usando `Promise.all`
- Incluir también datos temporales (últimos 30 días vs total) para mostrar tendencia
- Datos adicionales: total de runs de noticias, tasa de éxito, tiempo medio de ejecución

**2. Componente `AIUsageStatsWidget.tsx`**
- 4 tarjetas KPI con iconos (Bot, Newspaper, Languages, ScanLine)
- Estilo consistente con las KPI cards existentes en el dashboard (border-0, shadow-sm, bg-white)
- Cada tarjeta muestra: valor total + subtexto con dato de últimos 30 días
- Colores diferenciados: violeta (artículos), azul (noticias), verde (traducciones), naranja (auditorías)

**3. Integración en `AdminDashboard.tsx`**
- Añadir una nueva sección "Uso de IA" entre las KPI cards de CRM/HR y los gráficos
- Encabezado con icono Bot y título "Inteligencia Artificial"

### Archivos a crear/modificar

| Archivo | Acción |
|---|---|
| `src/hooks/useAIUsageStats.ts` | Crear - hook con queries |
| `src/components/admin/AIUsageStatsWidget.tsx` | Crear - widget con 4 KPIs |
| `src/pages/admin/AdminDashboard.tsx` | Modificar - integrar widget |

