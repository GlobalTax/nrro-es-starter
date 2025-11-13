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
  '/casos-de-exito': {
    es: '/casos-de-exito',
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
  }
};

/**
 * Hook para obtener rutas localizadas según el idioma actual
 * Maneja tanto rutas base como rutas dinámicas de servicios
 */
export const useLocalizedPath = () => {
  const { language } = useLanguage();

  /**
   * Convierte una ruta en español a la ruta correspondiente en el idioma actual
   * @param path - Ruta en español (ej: "/servicios/empresa-familiar")
   * @returns Ruta traducida al idioma actual
   */
  const getLocalizedPath = (path: string): string => {
    // Si la ruta está en el mapeo directo, devolverla traducida
    if (pathTranslations[path]) {
      return pathTranslations[path][language];
    }

    // Si es una ruta de servicio con slug, mantener el formato
    // Los slugs ya están en la BD en todos los idiomas (slug_es, slug_ca, slug_en)
    // Por ahora, mantenemos la estructura para que funcione con los links dinámicos
    
    // Para rutas complejas, traducir solo la parte base
    for (const [basePath, translations] of Object.entries(pathTranslations)) {
      if (path.startsWith(basePath + '/')) {
        const suffix = path.substring(basePath.length);
        return translations[language] + suffix;
      }
    }

    // Si no hay traducción, devolver la ruta original
    return path;
  };

  /**
   * Genera una ruta localizada para un servicio usando su slug según el idioma
   * @param slugEs - Slug en español
   * @param slugCa - Slug en catalán
   * @param slugEn - Slug en inglés
   * @returns Ruta completa localizada
   */
  const getServicePath = (slugEs?: string, slugCa?: string, slugEn?: string): string => {
    const basePath = pathTranslations['/servicios'][language];
    let slug = slugEs; // fallback español

    switch (language) {
      case 'ca':
        slug = slugCa || slugEs;
        break;
      case 'en':
        slug = slugEn || slugEs;
        break;
    }

    return `${basePath}/${slug}`;
  };

  return { getLocalizedPath, getServicePath };
};
