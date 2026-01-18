/**
 * INTRANET DESIGN SYSTEM - Theme Configuration
 * Sistema de diseño unificado para CRM, HR, Marketing, Admin
 * 
 * Uso en componentes:
 * import { adminTheme, getStatusStyles, getPriorityStyles } from '@/components/admin/ui/admin-theme';
 */

// ============================================
// COLORES
// ============================================

export const adminColors = {
  background: '#F9FAFB',
  card: '#FFFFFF',
  cardHover: '#F3F4F6',
  border: '#E5E7EB',
  borderMuted: 'rgba(229, 231, 235, 0.6)',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: 'rgba(107, 114, 128, 0.7)',
} as const;

// ============================================
// ESTADOS
// ============================================

export type StatusType = 'active' | 'pending' | 'inactive' | 'urgent' | 'completed' | 'info' | 'default';

export const statusStyles: Record<StatusType, {
  bg: string;
  text: string;
  border: string;
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
}> = {
  active: {
    bg: '#ECFDF5',
    text: '#059669',
    border: '#A7F3D0',
    label: 'Activo',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-200',
  },
  pending: {
    bg: '#FEF3C7',
    text: '#D97706',
    border: '#FCD34D',
    label: 'Pendiente',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-700',
    borderClass: 'border-amber-200',
  },
  inactive: {
    bg: '#F3F4F6',
    text: '#6B7280',
    border: '#D1D5DB',
    label: 'Inactivo',
    bgClass: 'bg-gray-100',
    textClass: 'text-gray-600',
    borderClass: 'border-gray-200',
  },
  urgent: {
    bg: '#FEF2F2',
    text: '#DC2626',
    border: '#FECACA',
    label: 'Urgente',
    bgClass: 'bg-red-50',
    textClass: 'text-red-700',
    borderClass: 'border-red-200',
  },
  completed: {
    bg: '#ECFDF5',
    text: '#059669',
    border: '#A7F3D0',
    label: 'Completado',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-200',
  },
  info: {
    bg: '#DBEAFE',
    text: '#2563EB',
    border: '#93C5FD',
    label: 'Info',
    bgClass: 'bg-blue-50',
    textClass: 'text-blue-700',
    borderClass: 'border-blue-200',
  },
  default: {
    bg: '#F3F4F6',
    text: '#374151',
    border: '#D1D5DB',
    label: 'Default',
    bgClass: 'bg-gray-100',
    textClass: 'text-gray-700',
    borderClass: 'border-gray-200',
  },
};

export function getStatusStyles(status: StatusType) {
  return statusStyles[status] || statusStyles.default;
}

export function getStatusClasses(status: StatusType): string {
  const styles = getStatusStyles(status);
  return `${styles.bgClass} ${styles.textClass} ${styles.borderClass}`;
}

// ============================================
// PRIORIDADES
// ============================================

export type PriorityType = 'high' | 'medium' | 'low';

export const priorityStyles: Record<PriorityType, {
  bg: string;
  text: string;
  border: string;
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
}> = {
  high: {
    bg: '#ECFDF5',
    text: '#059669',
    border: '#A7F3D0',
    label: 'Alta',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-200',
  },
  medium: {
    bg: '#FEF3C7',
    text: '#D97706',
    border: '#FCD34D',
    label: 'Media',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-700',
    borderClass: 'border-amber-200',
  },
  low: {
    bg: '#F3F4F6',
    text: '#6B7280',
    border: '#D1D5DB',
    label: 'Baja',
    bgClass: 'bg-gray-100',
    textClass: 'text-gray-600',
    borderClass: 'border-gray-200',
  },
};

export function getPriorityStyles(priority: PriorityType) {
  return priorityStyles[priority] || priorityStyles.low;
}

export function getPriorityClasses(priority: PriorityType): string {
  const styles = getPriorityStyles(priority);
  return `${styles.bgClass} ${styles.textClass} ${styles.borderClass}`;
}

// ============================================
// ESPACIADO (Grid de 8px)
// ============================================

export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
} as const;

// ============================================
// TIPOGRAFÍA
// ============================================

export const typography = {
  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  sizes: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
  },
    weights: {
      light: 300,
      regular: 400,
    },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.625,
  },
} as const;

// ============================================
// BORDER RADIUS
// ============================================

export const radius = {
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  full: '9999px',
} as const;

// ============================================
// SOMBRAS
// ============================================

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  default: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
} as const;

// ============================================
// THEME OBJECT COMPLETO
// ============================================

export const adminTheme = {
  colors: adminColors,
  status: statusStyles,
  priority: priorityStyles,
  spacing,
  typography,
  radius,
  shadows,
} as const;

export default adminTheme;
