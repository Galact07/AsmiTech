import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'nl' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (enText: string, nlText?: string, deText?: string) => string;
  tDb: (enText: string, nlText?: string, deText?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * LanguageProvider - Manages the current language state
 * 
 * This provider handles:
 * 1. Current language state (en/nl/de)
 * 2. Language persistence to localStorage (synced with i18next)
 * 3. Simple inline translation for dynamic content from database
 * 
 * For static content translations, use the useTranslation hook instead.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // First check i18next's localStorage key for consistency
    const i18nextLang = localStorage.getItem('i18nextLng');
    if (i18nextLang === 'nl' || i18nextLang === 'de' || i18nextLang === 'en') {
      return i18nextLang as Language;
    }
    // Fallback to our own localStorage key
    const saved = localStorage.getItem('language');
    return (saved === 'nl' || saved === 'de' ? saved : 'en') as Language;
  });

  // Sync with i18next language on mount and when it changes externally
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'i18nextLng' && e.newValue) {
        const newLang = e.newValue as Language;
        if (newLang === 'en' || newLang === 'nl' || newLang === 'de') {
          setLanguageState(newLang);
          localStorage.setItem('language', newLang);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    // Sync both localStorage keys
    localStorage.setItem('language', lang);
    localStorage.setItem('i18nextLng', lang);
  };

  /**
   * Simple translation function for dynamic content
   * Used when you have English, Dutch, and German text available (e.g., from database)
   * 
   * @param enText - English text
   * @param nlText - Dutch text (optional)
   * @param deText - German text (optional)
   * @returns Text in the current language, falling back to English if target language text is not available
   * 
   * Example:
   * ```tsx
   * // For database content with content_nl and content_de fields
   * <h1>{tDb(service.title, service.content_nl?.title, service.content_de?.title)}</h1>
   * ```
   */
  const tDb = (enText: string, nlText?: string, deText?: string): string => {
    if (language === 'nl' && nlText) {
      return nlText;
    }
    if (language === 'de' && deText) {
      return deText;
    }
    return enText;
  };

  // Legacy alias for backward compatibility
  const t = tDb;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tDb }}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * useLanguage hook - Access language state and database content translation
 * 
 * Use this for:
 * - Getting current language
 * - Changing language
 * - Translating dynamic content from database using tDb(enText, nlText)
 * 
 * For static content translations (from JSON files), use useTranslation hook instead.
 * 
 * Example:
 * ```tsx
 * const { language, setLanguage, tDb } = useLanguage();
 * <h1>{tDb(job.title, job.content_nl?.title)}</h1>
 * ```
 */
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

