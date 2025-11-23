import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Initialize i18next
i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    resources: {
      en: {
        translation: {} // Will be populated from Supabase
      },
      nl: {
        translation: {} // Will be populated from Supabase
      },
      de: {
        translation: {} // Will be populated from Supabase
      }
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'nl', 'de'],
    debug: false,
    interpolation: {
      escapeValue: false // React already escapes values
    },
    detection: {
      // Order of language detection
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    }
  });

export default i18n;

