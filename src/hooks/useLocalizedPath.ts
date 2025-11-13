import { useLanguage } from '@/contexts/LanguageContext';

type Language = 'es' | 'ca' | 'en';

// Mapeo de rutas base por idioma
const pathTranslations: Record<string, Record<Language, string>> = {
  '/servicios': {
    es: '/servicios',
    ca: '/serveis',
    en: '/services'
  },
  '/nosotros': {
    es: '/nosotros',
    ca: '/nosaltres',
    en: '/about'
  },
  '/equipo': {
    es: '/equipo',
    ca: '/equip',
    en: '/team'
  },
  '/blog': {
    es: '/blog',
    ca: '/blog',
    en: '/blog'
  },
  '/casos-exito': {
    es: '/casos-exito',
    ca: '/casos-exit',
    en: '/case-studies'
  },
  '/carreras': {
    es: '/carreras',
    ca: '/carreres',
    en: '/careers'
  },
  '/contacto': {
    es: '/contacto',
    ca: '/contacte',
    en: '/contact'
  },
  '/metodologia': {
    es: '/metodologia',
    ca: '/metodologia',
    en: '/methodology'
  },
  '/sectores': {
    es: '/sectores',
    ca: '/sectors',
    en: '/sectors'
  },
  '/privacidad': {
    es: '/privacidad',
    ca: '/privacitat',
    en: '/privacy'
  },
  '/aviso-legal': {
    es: '/aviso-legal',
    ca: '/avis-legal',
    en: '/legal-notice'
  },
  '/cookies': {
    es: '/cookies',
    ca: '/cookies',
    en: '/cookies'
  },
  '/condiciones-contratacion': {
    es: '/condiciones-contratacion',
    ca: '/condicions-contractacio',
    en: '/terms'
  }
};

/**
 * Hook para obtener rutas localizadas según el idioma actual
 * Maneja tanto rutas base como rutas dinámicas de servicios
 */
export const useLocalizedPath = () => {
  const { language } = useLanguage();

  /**
   * Agrega el prefijo de idioma a una ruta traducida
   */
  const addLanguagePrefix = (translatedPath: string): string => {
    if (language === 'es') return translatedPath;
    return `/${language}${translatedPath}`;
  };

  /**
   * Convierte una ruta en español a la ruta correspondiente en el idioma actual
   * @param path - Ruta en español (ej: "/servicios/empresa-familiar")
   * @returns Ruta traducida al idioma actual con prefijo de idioma
   */
  const getLocalizedPath = (path: string): string => {
    // Si la ruta está en el mapeo directo, devolverla traducida con prefijo
    if (pathTranslations[path]) {
      return addLanguagePrefix(pathTranslations[path][language]);
    }

    // Para rutas complejas, traducir solo la parte base
    for (const [basePath, translations] of Object.entries(pathTranslations)) {
      if (path.startsWith(basePath + '/')) {
        const suffix = path.substring(basePath.length);
        return addLanguagePrefix(translations[language] + suffix);
      }
    }

    // Si no hay traducción, devolver la ruta original con prefijo si aplica
    return addLanguagePrefix(path);
  };

  /**
   * Genera una ruta localizada para un servicio usando su slug según el idioma
   * @param slugEs - Slug en español
   * @param slugCa - Slug en catalán
   * @param slugEn - Slug en inglés
   * @returns Ruta completa localizada con prefijo de idioma
   */
  const getServicePath = (slugEs?: string, slugCa?: string, slugEn?: string): string => {
    const servicesBasePath = pathTranslations['/servicios'][language];
    let slug = slugEs; // fallback español

    switch (language) {
      case 'ca':
        slug = slugCa || slugEs;
        break;
      case 'en':
        slug = slugEn || slugEs;
        break;
    }

    // Agregar prefijo de idioma
    if (language === 'es') {
      return `${servicesBasePath}/${slug}`;
    }
    return `/${language}${servicesBasePath}/${slug}`;
  };

  return { getLocalizedPath, getServicePath };
};
