import { useLanguageContext, Language } from '@/contexts/LanguageContext';
import { translations } from '@/i18n/translations';
import { useNavigate, useLocation } from 'react-router-dom';
import { routeTranslations } from '@/i18n/types';

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${NestedKeyOf<T[K]>}` | K
          : K
        : never;
    }[keyof T]
  : never;

type TranslationPath = NestedKeyOf<typeof translations.es>;

export const useLanguage = () => {
  const { language, setLanguage: setLang } = useLanguageContext();
  const navigate = useNavigate();
  const location = useLocation();

  const t = (key: TranslationPath): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key} for language: ${language}`);
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  const getLocalizedPath = (routeKey: keyof typeof routeTranslations, lang?: Language): string => {
    const targetLang = lang || language;
    const localizedRoute = routeTranslations[routeKey]?.[targetLang];
    return localizedRoute ? `/${targetLang}/${localizedRoute}` : `/${targetLang}`;
  };

  const changeLanguage = (newLang: Language) => {
    setLang(newLang);

    // Extraer la ruta actual sin el prefijo de idioma
    const pathParts = location.pathname.split('/').filter(Boolean);
    const currentLang = pathParts[0];
    
    let newPath = `/${newLang}`;
    
    // Si la ruta actual tiene un idioma válido, reconstruir la ruta
    if (['es', 'ca', 'en'].includes(currentLang)) {
      const routeWithoutLang = pathParts.slice(1);
      
      if (routeWithoutLang.length > 0) {
        // Intentar mapear la ruta actual a su equivalente en el nuevo idioma
        const routeKey = Object.keys(routeTranslations).find(key => {
          return routeTranslations[key][currentLang as Language] === routeWithoutLang[0];
        });
        
        if (routeKey) {
          const translatedRoute = routeTranslations[routeKey][newLang];
          newPath = `/${newLang}/${translatedRoute}`;
          
          // Agregar el resto de la ruta (slug, etc.)
          if (routeWithoutLang.length > 1) {
            newPath += '/' + routeWithoutLang.slice(1).join('/');
          }
        } else {
          // Si no se puede mapear, usar la ruta tal cual
          newPath = `/${newLang}/${routeWithoutLang.join('/')}`;
        }
      }
    }

    navigate(newPath);
  };

  return {
    language,
    setLanguage: changeLanguage,
    t,
    getLocalizedPath,
  };
};
