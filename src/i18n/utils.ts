import { Language } from '@/contexts/LanguageContext';

/**
 * Extrae contenido multiidioma de un objeto con campos _es, _ca, _en
 */
export function getLocalizedField<T extends Record<string, any>>(
  obj: T,
  fieldName: string,
  language: Language
): string | null {
  const localizedKey = `${fieldName}_${language}`;
  return obj[localizedKey] || obj[`${fieldName}_es`] || null;
}

/**
 * Extrae un array multiidioma
 */
export function getLocalizedArray<T extends Record<string, any>>(
  obj: T,
  fieldName: string,
  language: Language
): string[] {
  const localizedKey = `${fieldName}_${language}`;
  const value = obj[localizedKey] || obj[`${fieldName}_es`] || [];
  return Array.isArray(value) ? value : [];
}

/**
 * Obtiene el contenido de page_content según el idioma
 */
export function getLocalizedPageContent<T>(
  content: { es?: T; ca?: T; en?: T } | T,
  language: Language
): T | null {
  if (!content) return null;
  
  // Si el contenido ya tiene la estructura multiidioma
  if (typeof content === 'object' && content !== null && ('es' in content || 'ca' in content || 'en' in content)) {
    const localized = content as { es?: T; ca?: T; en?: T };
    return localized[language] || localized.es || null;
  }
  
  // Si no, retornar el contenido tal cual (backward compatibility)
  return content as T;
}

/**
 * Valida si un objeto tiene campos multiidioma completos
 */
export function hasAllLanguages<T extends Record<string, any>>(
  obj: T,
  fieldName: string
): { es: boolean; ca: boolean; en: boolean } {
  return {
    es: !!obj[`${fieldName}_es`],
    ca: !!obj[`${fieldName}_ca`],
    en: !!obj[`${fieldName}_en`],
  };
}
