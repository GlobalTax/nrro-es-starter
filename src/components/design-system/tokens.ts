/**
 * Design System Tokens
 * Centraliza todos los valores de diseño del sistema
 */

export const designTokens = {
  // Colores (HSL)
  colors: {
    primary: {
      DEFAULT: "191 48% 9%",
      foreground: "0 0% 100%",
      hover: "191 48% 12%",
    },
    secondary: {
      DEFAULT: "180 7% 92%",
      foreground: "190 63% 6%",
    },
    accent: {
      DEFAULT: "172 60% 15%",
      foreground: "0 0% 100%",
      hover: "172 65% 18%",
    },
    muted: {
      DEFAULT: "180 20% 97%",
      foreground: "195 3% 62%",
    },
    background: "0 0% 100%",
    foreground: "190 63% 6%",
    destructive: {
      DEFAULT: "0 84.2% 60.2%",
      foreground: "0 0% 100%",
    },
    success: {
      DEFAULT: "142 76% 36%",
      foreground: "0 0% 100%",
    },
    border: "180 7% 92%",
    input: "180 7% 92%",
    ring: "172 60% 15%",
  },

  // Gradientes
  gradients: {
    primary: "linear-gradient(135deg, hsl(190 63% 6%), hsl(190 48% 9%))",
    accent: "linear-gradient(135deg, hsl(172 60% 15%), hsl(172 65% 20%))",
    hero: "linear-gradient(135deg, hsl(190 63% 6%) 0%, hsl(190 48% 9%) 50%, hsl(172 60% 15%) 100%)",
  },

  // Sombras
  shadows: {
    soft: "0 2px 8px -2px hsl(190 63% 6% / 0.08)",
    medium: "0 4px 16px -4px hsl(190 63% 6% / 0.12)",
    strong: "0 12px 32px -8px hsl(190 63% 6% / 0.18)",
    glow: "0 0 32px hsl(172 60% 15% / 0.2)",
  },

  // Espaciado (usando escala de Tailwind)
  spacing: {
    xs: "0.5rem", // 8px
    sm: "0.75rem", // 12px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
    "4xl": "6rem", // 96px
    "5xl": "8rem", // 128px
  },

  // Tipografía
  typography: {
    fontFamily: {
      sans: '"Plus Jakarta Sans", system-ui, sans-serif',
      display: '"General Sans", "Plus Jakarta Sans", system-ui, sans-serif',
      mono: '"Roboto Mono", Courier New, monospace',
    },
    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem", // 48px
      "6xl": "3.75rem", // 60px
      "7xl": "4.5rem", // 72px
      "8xl": "6rem", // 96px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.1,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // Border Radius
  borderRadius: {
    sm: "0.375rem", // 6px
    md: "0.5rem", // 8px
    lg: "0.75rem", // 12px
    xl: "1rem", // 16px
    "2xl": "1.5rem", // 24px
    full: "9999px",
  },

  // Transiciones
  transitions: {
    smooth: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    fast: "all 0.15s ease",
    normal: "all 0.3s ease",
    slow: "all 0.5s ease",
  },

  // Breakpoints (para referencia)
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1400px",
  },

  // Z-index
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
} as const;

export type DesignTokens = typeof designTokens;
