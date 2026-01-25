import { TopBarConfig, TopBarData } from '../types';

export const DEFAULT_CONFIG: TopBarConfig = {
  phoneNumber: '',
  phoneLink: '',
  showSearch: false,
  showLanguageSelector: true,
  languageLabel: 'ES',
  backgroundColor: '#0f172a',
  textColor: 'rgba(255,255,255,0.7)',
  hoverColor: '#ffffff',
  fontFamily: 'inherit',
  fontSize: '0.875rem',
};

export const DEFAULT_DATA: TopBarData = {
  config: DEFAULT_CONFIG,
  companies: [],
  links: [],
};

export const COLOR_PRESETS = {
  dark: { 
    bg: '#0f172a', 
    text: 'rgba(255,255,255,0.7)', 
    hover: '#ffffff',
    label: 'Dark (Slate 900)'
  },
  blackGold: { 
    bg: '#000000', 
    text: '#d4af37', 
    hover: '#ffd700',
    label: 'Black + Gold'
  },
  navy: { 
    bg: '#1e3a5f', 
    text: 'rgba(255,255,255,0.8)', 
    hover: '#ffffff',
    label: 'Navy Blue'
  },
  slate: { 
    bg: '#334155', 
    text: 'rgba(255,255,255,0.7)', 
    hover: '#ffffff',
    label: 'Slate'
  },
  charcoal: {
    bg: '#1a1a1a',
    text: 'rgba(255,255,255,0.6)',
    hover: '#ffffff',
    label: 'Charcoal'
  },
};

export const FONT_OPTIONS = [
  { value: 'inherit', label: 'Por defecto (sistema)' },
  { value: "'Plus Jakarta Sans', sans-serif", label: 'Plus Jakarta Sans' },
  { value: "'Inter', sans-serif", label: 'Inter' },
  { value: "'General Sans', sans-serif", label: 'General Sans' },
  { value: "'DM Sans', sans-serif", label: 'DM Sans' },
];

export const FONT_SIZE_OPTIONS = [
  { value: '0.75rem', label: 'Extra pequeño (12px)' },
  { value: '0.8125rem', label: 'Pequeño (13px)' },
  { value: '0.875rem', label: 'Normal (14px)' },
  { value: '1rem', label: 'Grande (16px)' },
];
