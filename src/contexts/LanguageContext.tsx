import { createContext, useContext, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import i18n from '@/i18n/config';

type Language = 'es' | 'ca' | 'en';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: any) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Fallback that works even outside the provider (e.g. during HMR)
const fallbackContext: LanguageContextType = {
  language: (i18n.language as Language) || 'es',
  setLanguage: (lang: Language) => i18n.changeLanguage(lang),
  t: (key: string, options?: any) => i18n.t(key, options) as string,
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  return context ?? fallbackContext;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { i18n, t: i18nT, ready } = useTranslation();
  const language = i18n.language as Language;

  // All hooks MUST be called before any conditional return
  const setLanguage = useCallback((lang: Language) => {
    i18n.changeLanguage(lang);
  }, [i18n]);

  const t = useCallback((key: string, options?: any): string => {
    return i18nT(key, options) as string;
  }, [i18nT]);

  const contextValue = useMemo(() => ({
    language,
    setLanguage,
    t
  }), [language, setLanguage, t]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Show loading state while i18next initializes, but still provide context
  if (!ready) {
    return (
      <LanguageContext.Provider value={contextValue}>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
