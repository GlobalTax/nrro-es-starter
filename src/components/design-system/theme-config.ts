/**
 * Theme Configuration
 * Configuración centralizada del tema del sistema de diseño
 */

export const themeConfig = {
  // Configuración de áreas de servicio
  serviceAreas: {
    fiscal: {
      color: "hsl(172 60% 15%)",
      bgColor: "hsl(172 60% 15% / 0.1)",
      label: "Fiscal",
    },
    legal: {
      color: "hsl(190 63% 6%)",
      bgColor: "hsl(190 63% 6% / 0.1)",
      label: "Legal",
    },
    laboral: {
      color: "hsl(142 76% 36%)",
      bgColor: "hsl(142 76% 36% / 0.1)",
      label: "Laboral",
    },
    contable: {
      color: "hsl(195 3% 62%)",
      bgColor: "hsl(195 3% 62% / 0.1)",
      label: "Contable",
    },
    "asesoria-empresas": {
      color: "hsl(191 48% 9%)",
      bgColor: "hsl(191 48% 9% / 0.1)",
      label: "Asesoría Empresas",
    },
  },

  // Estados
  statuses: {
    active: {
      color: "hsl(142 76% 36%)",
      bgColor: "hsl(142 76% 36% / 0.1)",
      label: "Activo",
    },
    pending: {
      color: "hsl(45 93% 47%)",
      bgColor: "hsl(45 93% 47% / 0.1)",
      label: "Pendiente",
    },
    completed: {
      color: "hsl(172 60% 15%)",
      bgColor: "hsl(172 60% 15% / 0.1)",
      label: "Completado",
    },
    cancelled: {
      color: "hsl(0 84.2% 60.2%)",
      bgColor: "hsl(0 84.2% 60.2% / 0.1)",
      label: "Cancelado",
    },
    draft: {
      color: "hsl(195 3% 62%)",
      bgColor: "hsl(195 3% 62% / 0.1)",
      label: "Borrador",
    },
  },

  // Prioridades
  priorities: {
    low: {
      color: "hsl(195 3% 62%)",
      bgColor: "hsl(195 3% 62% / 0.1)",
      label: "Baja",
    },
    medium: {
      color: "hsl(45 93% 47%)",
      bgColor: "hsl(45 93% 47% / 0.1)",
      label: "Media",
    },
    high: {
      color: "hsl(24 70% 50%)",
      bgColor: "hsl(24 70% 50% / 0.1)",
      label: "Alta",
    },
    urgent: {
      color: "hsl(0 84.2% 60.2%)",
      bgColor: "hsl(0 84.2% 60.2% / 0.1)",
      label: "Urgente",
    },
  },

  // Configuración de componentes
  components: {
    button: {
      sizes: {
        sm: "h-9 px-4 text-sm",
        default: "h-10 px-6 py-2",
        lg: "h-12 px-8 text-base",
        hero: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    card: {
      padding: {
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
    },
    badge: {
      sizes: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-3 py-1 text-xs",
        lg: "px-4 py-1.5 text-sm",
      },
    },
  },

  // Animaciones
  animations: {
    durations: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms",
    },
    easings: {
      smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    },
  },
} as const;

export type ThemeConfig = typeof themeConfig;
