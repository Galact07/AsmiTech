import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import enTranslations from '@/locales/en.json';

// Type for nested object access
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TranslationKey = NestedKeyOf<typeof enTranslations>;

interface Translations {
  [key: string]: any;
}

export function useTranslation() {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState<Translations>(enTranslations);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadTranslations = async () => {
      if (language === 'en') {
        setTranslations(enTranslations);
        setIsLoading(false);
      } else if (language === 'nl') {
        setIsLoading(true);
        try {
          // Try to load Dutch translations
          const nlModule = await import('@/locales/nl.json');
          setTranslations(nlModule.default || enTranslations);
        } catch (error) {
          console.warn('Dutch translations not found, falling back to English');
          setTranslations(enTranslations);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadTranslations();
  }, [language]);

  /**
   * Get a translation by key (supports nested keys with dot notation)
   * @param key - Translation key (e.g., 'home.hero.title')
   * @param fallback - Optional fallback text if translation is missing
   * @returns Translated text or fallback
   */
  const t = (key: string, fallback?: string): string => {
    try {
      const keys = key.split('.');
      let value: any = translations;

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          // If key not found, try English as fallback
          if (language !== 'en') {
            let enValue: any = enTranslations;
            for (const ek of keys) {
              if (enValue && typeof enValue === 'object' && ek in enValue) {
                enValue = enValue[ek];
              } else {
                console.warn(`Translation key not found: ${key}`);
                return fallback || key;
              }
            }
            return typeof enValue === 'string' ? enValue : fallback || key;
          }
          console.warn(`Translation key not found: ${key}`);
          return fallback || key;
        }
      }

      return typeof value === 'string' ? value : fallback || key;
    } catch (error) {
      console.error(`Error getting translation for key: ${key}`, error);
      return fallback || key;
    }
  };

  /**
   * Get a translation array by key
   * @param key - Translation key for an array
   * @returns Array of translations or empty array
   */
  const tArray = (key: string): any[] => {
    try {
      const keys = key.split('.');
      let value: any = translations;

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          // Fallback to English
          if (language !== 'en') {
            let enValue: any = enTranslations;
            for (const ek of keys) {
              if (enValue && typeof enValue === 'object' && ek in enValue) {
                enValue = enValue[ek];
              } else {
                console.warn(`Translation array key not found: ${key}`);
                return [];
              }
            }
            return Array.isArray(enValue) ? enValue : [];
          }
          console.warn(`Translation array key not found: ${key}`);
          return [];
        }
      }

      return Array.isArray(value) ? value : [];
    } catch (error) {
      console.error(`Error getting translation array for key: ${key}`, error);
      return [];
    }
  };

  /**
   * Get a translation object by key
   * @param key - Translation key for an object
   * @returns Object with translations or empty object
   */
  const tObject = (key: string): any => {
    try {
      const keys = key.split('.');
      let value: any = translations;

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          // Fallback to English
          if (language !== 'en') {
            let enValue: any = enTranslations;
            for (const ek of keys) {
              if (enValue && typeof enValue === 'object' && ek in enValue) {
                enValue = enValue[ek];
              } else {
                console.warn(`Translation object key not found: ${key}`);
                return {};
              }
            }
            return typeof enValue === 'object' && !Array.isArray(enValue) ? enValue : {};
          }
          console.warn(`Translation object key not found: ${key}`);
          return {};
        }
      }

      return typeof value === 'object' && !Array.isArray(value) ? value : {};
    } catch (error) {
      console.error(`Error getting translation object for key: ${key}`, error);
      return {};
    }
  };

  return {
    t,
    tArray,
    tObject,
    language,
    isLoading
  };
}

