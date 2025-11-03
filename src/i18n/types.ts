import { Language } from '@/contexts/LanguageContext';

export type { Language };

export interface LocalizedContent<T> {
  es: T;
  ca: T;
  en: T;
}

export type RouteTranslations = {
  [key: string]: LocalizedContent<string>;
};

export const routeTranslations: RouteTranslations = {
  services: {
    es: 'servicios',
    ca: 'serveis',
    en: 'services',
  },
  about: {
    es: 'nosotros',
    ca: 'nosaltres',
    en: 'about',
  },
  team: {
    es: 'equipo',
    ca: 'equip',
    en: 'team',
  },
  caseStudies: {
    es: 'casos-exito',
    ca: 'casos-exit',
    en: 'case-studies',
  },
  blog: {
    es: 'blog',
    ca: 'blog',
    en: 'blog',
  },
  insights: {
    es: 'insights',
    ca: 'insights',
    en: 'insights',
  },
  careers: {
    es: 'trabaja-con-nosotros',
    ca: 'treballa-amb-nosaltres',
    en: 'careers',
  },
  contact: {
    es: 'contacto',
    ca: 'contacte',
    en: 'contact',
  },
  methodology: {
    es: 'metodologia',
    ca: 'metodologia',
    en: 'methodology',
  },
  sectors: {
    es: 'sectores',
    ca: 'sectors',
    en: 'sectors',
  },
  strategy: {
    es: 'estrategia',
    ca: 'estrategia',
    en: 'strategy',
  },
  legal: {
    es: 'aviso-legal',
    ca: 'avis-legal',
    en: 'legal-notice',
  },
  privacy: {
    es: 'privacidad',
    ca: 'privacitat',
    en: 'privacy',
  },
  cookies: {
    es: 'cookies',
    ca: 'cookies',
    en: 'cookies',
  },
};
