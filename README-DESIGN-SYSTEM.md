# 🎨 Design System - Navarro Tax Legal

Sistema de componentes reutilizables completo para el proyecto Navarro Tax Legal.

## 📦 Componentes Incluidos

### 1. **Componentes Base**
- ✅ **Button** - Botón con variantes `hero`, `cta-primary`, `cta-secondary`
- ✅ **Card** - Card básica con hover effects
- ✅ **Badge** - Badges con variantes de color
- ✅ **Input / Textarea** - Campos de formulario

### 2. **Card Variants** (`card-variants.tsx`)
```tsx
import { ServiceCard, FeatureCard, TestimonialCard, PricingCard, ImageCard } from '@/components/ui';

// ServiceCard - Para servicios
<ServiceCard
  icon={<Building className="h-6 w-6" />}
  title="Asesoría Fiscal"
  area="fiscal"
  description="Optimización fiscal para empresas"
  features={["Planificación fiscal", "Declaraciones"]}
  href="/servicios/asesoria-fiscal"
/>

// FeatureCard - Para características
<FeatureCard
  icon={<Sparkles className="h-6 w-6" />}
  title="Automatización"
  description="Procesos automatizados para mayor eficiencia"
/>

// TestimonialCard - Para testimonios
<TestimonialCard
  quote="Excelente servicio y profesionalidad"
  author="Juan Pérez"
  role="CEO"
  company="Tech Corp"
  avatar="/avatar.jpg"
/>

// PricingCard - Para planes de precios
<PricingCard
  name="Básico"
  price="299€"
  period="mes"
  features={["Feature 1", "Feature 2"]}
  highlighted={true}
  ctaText="Contratar"
/>

// ImageCard - Card con imagen
<ImageCard
  image="/image.jpg"
  title="Título"
  description="Descripción"
  href="/link"
/>
```

### 3. **Badge System** (`badge-system.tsx`)
```tsx
import { BadgeArea, BadgeStatus, BadgePriority, BadgePill, BadgeCount } from '@/components/ui';

// BadgeArea - Para áreas de servicio
<BadgeArea area="fiscal" />
<BadgeArea area="legal" />

// BadgeStatus - Para estados
<BadgeStatus status="active" />
<BadgeStatus status="pending" />

// BadgePriority - Para prioridades
<BadgePriority priority="high" />

// BadgePill - Badge redondeado grande
<BadgePill variant="gradient">Nuevo</BadgePill>

// BadgeCount - Badge con contador
<BadgeCount count={5} />
```

### 4. **Form Components** (`form-components.tsx`)
```tsx
import { FormInput, FormTextarea, FormSelect, FormCheckbox } from '@/components/ui';

// FormInput - Input mejorado con label, error, icono
<FormInput
  label="Email"
  placeholder="tu@email.com"
  type="email"
  icon={<Mail className="h-4 w-4" />}
  iconPosition="left"
  error="Campo requerido"
  helperText="Ingresa tu email"
/>

// FormTextarea - Textarea mejorado
<FormTextarea
  label="Mensaje"
  placeholder="Escribe tu mensaje"
  error="Campo requerido"
/>

// FormSelect - Select mejorado
<FormSelect
  label="País"
  options={[
    { value: "es", label: "España" },
    { value: "fr", label: "Francia" }
  ]}
  placeholder="Selecciona un país"
/>

// FormCheckbox - Checkbox mejorado
<FormCheckbox
  label="Acepto los términos"
  error="Debes aceptar"
/>
```

### 5. **Layout Components** (`layout-components.tsx`)
```tsx
import { Container, Section, Grid, Stack, Cluster, Hero, SplitLayout } from '@/components/ui';

// Container - Contenedor con max-width
<Container size="xl">
  Contenido
</Container>

// Section - Sección con espaciado
<Section spacing="lg">
  Contenido
</Section>

// Grid - Grid responsive
<Grid columns={3} gap={6}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>

// Stack - Flex vertical
<Stack spacing={4} align="center">
  <div>Item 1</div>
  <div>Item 2</div>
</Stack>

// Cluster - Flex horizontal
<Cluster spacing={2} justify="between">
  <div>Left</div>
  <div>Right</div>
</Cluster>

// Hero - Layout para hero sections
<Hero variant="centered">
  <h1>Título</h1>
  <p>Descripción</p>
</Hero>

// SplitLayout - Layout 50/50
<SplitLayout imagePosition="right">
  <div>Contenido</div>
  <img src="/image.jpg" />
</SplitLayout>
```

### 6. **Typography System** (`typography-system.tsx`)
```tsx
import { Heading, Lead, Body, Small, GradientText, Overline, SectionHeader } from '@/components/ui';

// Heading - Encabezado flexible
<Heading level={1} gradient>
  Título Principal
</Heading>

// Lead - Texto destacado
<Lead>Texto importante y destacado</Lead>

// Body - Texto de cuerpo
<Body>Texto normal de párrafo</Body>

// Small - Texto pequeño
<Small>Texto auxiliar</Small>

// GradientText - Texto con gradiente
<GradientText>Texto con gradiente</GradientText>

// Overline - Texto pequeño uppercase
<Overline>Categoría</Overline>

// SectionHeader - Header de sección completo
<SectionHeader
  overline="Servicios"
  title="Nuestros Servicios"
  description="Soluciones integrales"
  centered
/>
```

### 7. **Interactive Components** (`interactive.tsx`)
```tsx
import { Tooltip, LoadingSpinner, Divider, ProgressBar } from '@/components/ui';

// Tooltip - Tooltip mejorado
<Tooltip content="Información adicional" side="top">
  <button>Hover me</button>
</Tooltip>

// LoadingSpinner - Spinner de carga
<LoadingSpinner size="md" />

// Divider - Separador visual
<Divider orientation="horizontal" label="O" />

// ProgressBar - Barra de progreso
<ProgressBar value={75} max={100} showLabel />
```

### 8. **Navigation Components** (`navigation.tsx`)
```tsx
import { Breadcrumb, NavTabs, Stepper } from '@/components/ui';

// Breadcrumb - Migas de pan
<Breadcrumb
  items={[
    { label: "Inicio", href: "/" },
    { label: "Servicios", href: "/servicios" },
    { label: "Fiscal" }
  ]}
/>

// NavTabs - Navegación por tabs
<NavTabs
  tabs={[
    { id: "tab1", label: "Tab 1" },
    { id: "tab2", label: "Tab 2" }
  ]}
  activeTab="tab1"
  onTabChange={(tabId) => console.log(tabId)}
/>

// Stepper - Wizard steps
<Stepper
  steps={[
    { id: "1", label: "Paso 1", description: "Descripción" },
    { id: "2", label: "Paso 2" }
  ]}
  currentStep={1}
/>
```

### 9. **Feedback Components** (`feedback.tsx`)
```tsx
import { Alert, ErrorState, SuccessState } from '@/components/ui';

// Alert - Alerta con variantes
<Alert
  variant="success"
  title="¡Éxito!"
  description="Operación completada"
  icon
/>

// ErrorState - Estado de error
<ErrorState
  title="Error"
  description="Ha ocurrido un error"
  action={<Button>Reintentar</Button>}
/>

// SuccessState - Estado de éxito
<SuccessState
  title="¡Completado!"
  description="Operación exitosa"
  action={<Button>Continuar</Button>}
/>
```

## 🎨 Tokens de Diseño

### Uso de Tokens (`tokens.ts`)
```tsx
import { designTokens } from '@/components/design-system/tokens';

// Acceso a colores
const primaryColor = designTokens.colors.primary.DEFAULT;

// Acceso a gradientes
const gradientPrimary = designTokens.gradients.primary;

// Acceso a sombras
const shadowSoft = designTokens.shadows.soft;

// Acceso a espaciado
const spacingLg = designTokens.spacing.lg;
```

### Configuración del Tema (`theme-config.ts`)
```tsx
import { themeConfig } from '@/components/design-system/theme-config';

// Áreas de servicio
const fiscalConfig = themeConfig.serviceAreas.fiscal;

// Estados
const activeStatus = themeConfig.statuses.active;

// Prioridades
const highPriority = themeConfig.priorities.high;
```

## 🚀 Ejemplo Completo

```tsx
import {
  Container,
  Section,
  Grid,
  SectionHeader,
  ServiceCard,
  Button,
  BadgeArea,
} from '@/components/ui';

export const ServicesPage = () => {
  return (
    <Section spacing="xl" className="bg-muted/30">
      <Container size="xl">
        <SectionHeader
          overline="Servicios"
          title="Nuestros Servicios Profesionales"
          description="Soluciones integrales para tu negocio"
          centered
        />
        
        <Grid columns={3} gap={6}>
          <ServiceCard
            icon={<Building className="h-6 w-6" />}
            title="Asesoría Fiscal"
            area="fiscal"
            description="Optimización fiscal para empresas"
            features={[
              "Planificación fiscal estratégica",
              "Declaraciones de impuestos",
              "Asesoramiento personalizado"
            ]}
            href="/servicios/asesoria-fiscal"
          />
          
          <ServiceCard
            icon={<Scale className="h-6 w-6" />}
            title="Asesoría Legal"
            area="legal"
            description="Protección legal integral"
            features={[
              "Derecho mercantil",
              "Contratos y acuerdos",
              "Resolución de conflictos"
            ]}
            href="/servicios/asesoria-legal"
          />
          
          <ServiceCard
            icon={<Users className="h-6 w-6" />}
            title="Asesoría Laboral"
            area="laboral"
            description="Gestión de recursos humanos"
            features={[
              "Nóminas y contratos",
              "Seguridad Social",
              "Relaciones laborales"
            ]}
            href="/servicios/asesoria-laboral"
          />
        </Grid>
        
        <div className="mt-12 text-center">
          <Button variant="cta-primary" size="hero">
            Solicita una Consulta Gratuita
          </Button>
        </div>
      </Container>
    </Section>
  );
};
```

## 📚 Utilidades CSS

### Estilos Incluidos (`utilities.css`)
- `.gradient-primary` - Fondo con gradiente primario
- `.gradient-text` - Texto con gradiente
- `.hover-lift` - Efecto hover de elevación
- `.hover-scale` - Efecto hover de escala
- `.glass` - Efecto cristal (glassmorphism)
- `.shadow-soft` - Sombra suave
- `.shadow-glow` - Sombra con brillo

### Animaciones (`animations.css`)
- `.animate-fade-in` - Fade in animado
- `.animate-slide-up` - Slide up animado
- `.animate-scale-in` - Scale in animado
- `.animate-delay-{100-500}` - Delays de animación

## 🎯 Beneficios

✅ **Consistencia** - Componentes con diseño unificado  
✅ **Reutilización** - DRY principle aplicado  
✅ **Mantenibilidad** - Cambios centralizados  
✅ **Escalabilidad** - Fácil añadir variantes  
✅ **TypeScript** - Completamente tipado  
✅ **Accesibilidad** - ARIA labels incluidos  
✅ **Performance** - Tree-shaking automático  
✅ **Responsive** - Mobile-first design  

## 📖 Documentación

Para ver todos los componentes en acción, visita la documentación completa en el proyecto.

---

**Navarro Tax Legal** - Design System v1.0
