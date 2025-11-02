# Módulo de Tecnología - Instrucciones de Configuración

## ✅ Archivos creados

1. **Hook de datos**: `src/hooks/useTechnology.ts`
2. **Página de administración**: `src/pages/admin/AdminTechnology.tsx`
3. **Componente de formulario**: `src/components/admin/TechnologyFormDialog.tsx`
4. **Script de datos iniciales**: `src/scripts/insertTechnologyData.ts`

## ✅ Archivos modificados

1. **`src/components/home/TechnologyShowcase.tsx`**: Ahora usa datos dinámicos de la base de datos
2. **`src/App.tsx`**: Añadida ruta `/admin/technology`
3. **`src/components/admin/AdminSidebar.tsx`**: Añadido link "Tecnología" en el menú

## 📋 Configuración inicial

Para completar la configuración, necesitas insertar los datos iniciales en la base de datos. Tienes 3 opciones:

### Opción 1: Desde la consola del navegador (Recomendado)

1. Abre tu aplicación en el navegador
2. Abre las herramientas de desarrollo (F12)
3. Ve a la pestaña "Console"
4. Ejecuta el siguiente código:

```javascript
// Importar el script
const script = await import('/src/scripts/insertTechnologyData.ts');
// Ejecutar la función
await script.insertTechnologyData();
```

Si ves el mensaje "Datos insertados correctamente", ¡listo!

### Opción 2: Desde el SQL Editor de Supabase

1. Ve a tu proyecto de Supabase: https://supabase.com/dashboard/project/zntotcpagkunvkwpubqu/sql/new
2. Ejecuta la siguiente query:

```sql
INSERT INTO page_content (page_key, section_key, content, is_active)
VALUES (
  'home',
  'tecnologia',
  '{
    "overline": "Tecnología que usamos",
    "title": "Herramientas profesionales para un servicio excepcional",
    "technologies": [
      {
        "name": "Sage",
        "category": "ERP Contable",
        "description": "Gestión contable y financiera integral para empresas",
        "mockup_url": "/assets/mockups/sage-dashboard.jpg",
        "featured": true,
        "order": 1
      },
      {
        "name": "A3 Software",
        "category": "Gestión Empresarial",
        "description": "Asesoría, nóminas y gestión de recursos humanos",
        "mockup_url": "/assets/mockups/a3-software-dashboard.jpg",
        "featured": true,
        "order": 2
      },
      {
        "name": "Wolters Kluwer",
        "category": "Normativa Fiscal",
        "description": "Base de datos legal y fiscal actualizada",
        "mockup_url": "/assets/mockups/wolters-kluwer.jpg",
        "featured": false,
        "order": 3
      },
      {
        "name": "Microsoft 365",
        "category": "Productividad",
        "description": "Suite completa de herramientas empresariales",
        "mockup_url": "/assets/mockups/microsoft-365.jpg",
        "featured": false,
        "order": 4
      },
      {
        "name": "DocuSign",
        "category": "Firma Digital",
        "description": "Firma electrónica segura y legalmente válida",
        "mockup_url": "/assets/mockups/docusign.jpg",
        "featured": false,
        "order": 5
      },
      {
        "name": "Lexnet",
        "category": "Justicia Digital",
        "description": "Notificaciones judiciales y gestión procesal",
        "mockup_url": "/assets/mockups/lexnet.jpg",
        "featured": false,
        "order": 6
      }
    ]
  }'::jsonb,
  true
);
```

### Opción 3: Desde el panel de administración

1. Ve a `/admin/technology` en tu aplicación
2. Usa el botón "Añadir Tecnología" para crear cada una manualmente

## 🎯 Funcionalidades disponibles

Una vez insertados los datos, podrás:

✅ **Añadir nuevas tecnologías** con mockup y descripción
✅ **Editar tecnologías existentes**
✅ **Reordenar** con botones ↑↓
✅ **Marcar hasta 2 como destacadas** (aparecen grandes en el Home)
✅ **Eliminar tecnologías**
✅ **Subir imágenes** de mockups directamente
✅ **Preview en tiempo real** en el Home

## 📍 Acceso

- **Panel de administración**: `/admin/technology`
- **Vista pública**: Sección "Tecnología que usamos" en la página principal (`/`)

## 🔒 Permisos

El módulo respeta los permisos existentes definidos en las RLS policies de `page_content`:
- Solo **admins y editors** pueden modificar las tecnologías
- El público puede ver las tecnologías activas

## 🎨 Características de diseño

- Máximo **2 tecnologías destacadas** (aparecen grandes en el grid)
- El resto aparecen en tarjetas más pequeñas
- **Reordenamiento drag-free** con botones ↑↓
- **Preview de mockups** al hacer clic
- **Responsive design** para móvil y desktop

---

¿Preguntas? El módulo está completo y listo para usar después de insertar los datos iniciales.
