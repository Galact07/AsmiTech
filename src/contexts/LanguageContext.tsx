import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'nl';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (enText: string, nlText?: string) => string;
  tDb: (enText: string, nlText?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * LanguageProvider - Manages the current language state
 * 
 * This provider handles:
 * 1. Current language state (en/nl)
 * 2. Language persistence to localStorage
 * 3. Simple inline translation for dynamic content from database
 * 
 * For static content translations, use the useTranslation hook instead.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Get from localStorage or default to English
    const saved = localStorage.getItem('language');
    return (saved === 'nl' ? 'nl' : 'en') as Language;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  /**
   * Simple translation function for dynamic content
   * Used when you have both English and Dutch text available (e.g., from database)
   * 
   * @param enText - English text
   * @param nlText - Dutch text (optional)
   * @returns Text in the current language, falling back to English if Dutch is not available
   * 
   * Example:
   * ```tsx
   * // For database content with content_nl field
   * <h1>{tDb(service.title, service.content_nl?.title)}</h1>
   * ```
   */
  const tDb = (enText: string, nlText?: string): string => {
    if (language === 'nl' && nlText) {
      return nlText;
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

