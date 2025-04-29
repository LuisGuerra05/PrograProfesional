import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from './locales/en.json';
import esTranslation from './locales/es.json';

// Configurar i18next con los archivos JSON de traducciones
const resources = {
  en: { translation: enTranslation },
  es: { translation: esTranslation },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'], // <- importante
      caches: ['localStorage'], // <- guarda ahí el idioma
    }
  });

export default i18n;
