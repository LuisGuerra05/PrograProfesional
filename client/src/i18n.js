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
  .use(LanguageDetector) // Detectar automáticamente el idioma del navegador
  .use(initReactI18next) // Conectar con React
  .init({
    resources,
    fallbackLng: 'en', // Idioma predeterminado si no se detecta otro
    interpolation: {
      escapeValue: false, // React ya escapa los valores
    },
  });

export default i18n;
