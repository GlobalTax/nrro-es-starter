

## Análisis estratégico: Simplificación de la Intranet navarro

### Perspectiva

Analizo esto como senior partner de un despacho de 7 empleados que factura en recurrencia (fiscal, laboral, mercantil, planificación). La herramienta debe servir al negocio, no al revés. Hoy la intranet tiene **35 páginas admin**, **90+ tablas** y múltiples módulos que nadie usa. Es un problema de "feature creep" — se construyó más de lo que el negocio necesita.

---

### Datos reales de uso (registros en base de datos)

```text
┌─────────────────────────┬────────┬──────────────┐
│ Módulo                  │ Datos  │ Veredicto    │
├─────────────────────────┼────────┼──────────────┤
│ Contactos (leads)       │   26   │ ✅ CORE       │
│ Blog                    │   55   │ ✅ CORE       │
│ Servicios               │   52   │ ✅ CORE       │
│ Equipo                  │   50   │ ✅ CORE       │
│ Case Studies            │   10   │ ✅ CORE       │
│ Landings                │    6   │ ✅ CORE       │
│ Contenido páginas       │   58   │ ✅ CORE       │
│ Site Pages / Sitemap    │  198   │ ✅ AUTO       │
│ Noticias                │    9   │ ✅ KEEP       │
│ Recursos descargables   │   12   │ ✅ KEEP       │
│ Empleados               │    7   │ ✅ KEEP       │
│ Ofertas empleo          │    9   │ ⚠️ SIMPLIFY  │
│ CRM Clientes            │  190   │ ⚠️ REVISAR   │
│ CRM Facturas            │   89   │ ⚠️ REVISAR   │
│ TopBar                  │    2   │ ⚠️ SIMPLIFY  │
├─────────────────────────┼────────┼──────────────┤
│ Company Setup Leads     │    0   │ ❌ ELIMINAR   │
│ Ley Beckham Leads       │    0   │ ❌ ELIMINAR   │
│ Demo Requests           │    0   │ ❌ ELIMINAR   │
│ Propuestas              │    0   │ ❌ ELIMINAR   │
│ Plantillas propuestas   │    0   │ ❌ ELIMINAR   │
│ Presentaciones corp.    │    0   │ ❌ ELIMINAR   │
│ Nóminas                 │    0   │ ❌ ELIMINAR   │
│ Entrevistas             │    0   │ ❌ ELIMINAR   │
│ Candidatos              │    1   │ ❌ ELIMINAR   │
│ Notificaciones          │    0   │ ❌ ELIMINAR   │
│ CRM Contratos           │    0   │ ❌ ELIMINAR   │
│ CRM Interacciones       │    0   │ ❌ ELIMINAR   │
│ Presupuestos            │    0   │ ❌ ELIMINAR   │
│ Simulaciones            │    0   │ ❌ ELIMINAR   │
│ Lead documents/notes    │    0   │ ❌ ELIMINAR   │
│ Whistleblower           │    1   │ ❌ ELIMINAR   │
│ Hub herramientas        │    4   │ ❌ ELIMINAR   │
│ Marketing Settings      │    -   │ ❌ HUÉRFANO   │
│ AdminAdministration     │    -   │ ❌ HUÉRFANO   │
│ Tecnología              │    -   │ ❌ ELIMINAR   │
└─────────────────────────┴────────┴──────────────┘
```

---

### Diagnóstico de negocio

**1. El CRM está sobredimensionado.** Tenéis 4 tipos de leads separados (contact, company_setup, ley_beckham, demo) cuando ningún lead ha llegado por 3 de los 4 canales. Un despacho de 7 personas no necesita un CRM con propuestas, plantillas, presentaciones, presupuestos y nurture sequences. Necesita una bandeja de entrada de leads y un teléfono.

**2. RRHH es un ERP que no usáis.** 7 empleados, 0 nóminas, 0 entrevistas, 1 candidato. Habéis construido un sistema de nóminas con cierres mensuales, comparativas y desviaciones para un equipo que probablemente externaliza la nómina a una gestoría. Este módulo entero (salvo el directorio de empleados) es peso muerto.

**3. Hay funcionalidades "por si acaso".** Whistleblower (obligación legal real, pero con 1 denuncia y sin uso), Hub de herramientas (4 bookmarks), Tecnología (página de vanidad), Marketing Settings (huérfano), Presentaciones corporativas (0 uso).

**4. Lo que SÍ funciona.** Blog (55 posts con auto-generación), servicios (52), equipo (50), case studies (10), landings (6), contactos (26). El motor de contenido y la web pública son el corazón real de la herramienta.

---

### Plan de simplificación

#### Fase A: Eliminar módulos sin uso (limpieza de sidebar y rutas)

Reducir el sidebar de **5 grupos con 26 items** a **3 grupos con ~14 items**:

```text
ANTES (26 items):                    DESPUÉS (14 items):
─────────────────                    ──────────────────
Dashboard                           Dashboard
Hub                                 
                                     
CRM (7 items):                      Leads (1 item):
  Contactos                            Contactos (todos los leads aquí)
  Company Setup         ❌           
  Ley Beckham           ❌           
  Demo Requests         ❌           
  Propuestas            ❌           
  Plantillas            ❌           
  Presentaciones        ❌           

RRHH (5 items):                     Equipo (2 items):
  Empleados                            Empleados
  Candidatos            ❌              Ofertas empleo
  Ofertas                            
  Entrevistas           ❌           
  Nóminas               ❌           

Marketing (6 items):                Contenido (6 items):
  Blog                                 Blog
  Noticias                             Noticias
  Case Studies                         Case Studies
  Recursos                             Recursos
  Landings                             Landings
  Auditoría Web                        Auditoría Web

Administración (8 items):           Configuración (5 items):
  Equipo                               Equipo web
  Servicios                            Servicios
  Tecnología            ❌              Sitemap (auto)
  Sitemap                              TopBar
  TopBar                               Usuarios
  Denuncias             ❌           
  Configuración         ❌ (merge)   
  Usuarios                           
```

**Acciones concretas:**
- Eliminar del sidebar y rutas: Hub, Company Setup Leads, Ley Beckham Leads, Demo Requests, Propuestas, Plantillas, Presentaciones, Candidatos, Entrevistas, Nóminas, Tecnología, Whistleblower, Configuración (merge con Settings general)
- Eliminar páginas huérfanas: AdminNotifications, AdminMarketingSettings, AdminAdministration
- Los formularios públicos de Ley Beckham y Company Setup que generan leads se redirigen al formulario de contacto general (o se mantienen en la web pública pero los leads caen en contact_leads con un tag de origen)

#### Fase B: Consolidar leads en una sola vista

Todos los leads (contacto, company setup, ley beckham, demo) deberían caer en `contact_leads` con un campo `source` o `tipo` que indique el origen. Una sola tabla, una sola vista, con filtro por tipo.

#### Fase C: Simplificar el Dashboard

El dashboard actual muestra stats de nóminas, leads por canal, y gráficos que no reflejan el uso real. Simplificar a:
- Leads recientes (últimos 30 días)
- Posts publicados este mes
- Visitas/tráfico (si hay analytics)
- Accesos rápidos a Blog, Contactos, Landings

---

### Archivos a modificar

| Acción | Archivos |
|--------|----------|
| Eliminar del sidebar | `AdminSidebar.tsx` — reducir `sidebarSections` |
| Eliminar rutas | `App.tsx` — quitar Routes de módulos eliminados |
| Eliminar páginas | ~12 archivos en `src/pages/admin/` |
| Eliminar componentes | Carpetas en `src/components/admin/` asociadas |
| Eliminar hooks | Hooks de módulos eliminados |
| Simplificar Dashboard | `AdminDashboard.tsx` |

**Nota**: Las tablas de Supabase y Edge Functions se mantienen (no se borran datos), solo se elimina el acceso desde la UI. Si en el futuro se necesitan, se pueden reactivar.

---

### Impacto estimado

- **Bundle size**: Reducción significativa (~12 páginas admin, ~15 hooks, ~20 componentes menos)
- **Mantenibilidad**: De 26 items en sidebar a 14. Menos superficie de código que mantener.
- **UX**: Un usuario entra y ve solo lo que usa. Sin módulos vacíos que generan confusión.
- **Foco de negocio**: La herramienta refleja lo que el despacho realmente hace — generar contenido, captar leads, gestionar el equipo.

