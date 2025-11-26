import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationES from '../../public/locales/es/common.json';
import translationCA from '../../public/locales/ca/common.json';
import translationEN from '../../public/locales/en/common.json';

const resources = {
  es: {
    translation: translationES
  },
  ca: {
    translation: translationCA
  },
  en: {
    translation: translationEN
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    supportedLngs: ['es', 'ca', 'en'],
    returnNull: false,
    returnEmptyString: false,
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false
    },
    debug: import.meta.env.DEV,
    saveMissing: import.meta.env.DEV,
    missingKeyHandler: (lng, ns, key) => {
      if (import.meta.env.DEV) {
        console.warn(`⚠️ Missing i18n key: ${key} in ${lng}`);
      }
    }
  });

export default i18n;
