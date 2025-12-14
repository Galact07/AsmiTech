import { useLanguage, Language } from '@/contexts/LanguageContext';

/**
 * Hook for translating dynamic content from database records
 * 
 * This hook provides utility functions for extracting translated content
 * from database records that have content_nl and content_de JSONB fields.
 * 
 * Falls back to English if translation is missing.
 */
export function useDynamicTranslation() {
  const { language } = useLanguage();

  /**
   * Get translated field value from a database record
   * 
   * @param record - The database record with content_nl and content_de fields
   * @param field - The field name to translate (e.g., 'name', 'title', 'description')
   * @returns The translated value or the original English value as fallback
   * 
   * @example
   * ```tsx
   * const { getField } = useDynamicTranslation();
   * 
   * // For a team member record
   * <h3>{getField(teamMember, 'name')}</h3>
   * <p>{getField(teamMember, 'role')}</p>
   * <p>{getField(teamMember, 'bio')}</p>
   * ```
   */
  const getField = <T extends Record<string, any>>(
    record: T | null | undefined,
    field: keyof T & string
  ): string => {
    if (!record) return '';

    // Get the original English value
    const englishValue = record[field];

    if (language === 'en') {
      return englishValue ?? '';
    }

    // Try to get translated value from content_nl or content_de
    const contentField = language === 'nl' ? 'content_nl' : 'content_de';
    const translatedContent = record[contentField as keyof T];

    if (translatedContent && typeof translatedContent === 'object') {
      const translatedValue = (translatedContent as Record<string, any>)[field];
      if (translatedValue !== undefined && translatedValue !== null && translatedValue !== '') {
        return translatedValue;
      }
    }

    // Fallback to English
    return englishValue ?? '';
  };

  /**
   * Get translated array field value from a database record
   * 
   * @param record - The database record with content_nl and content_de fields
   * @param field - The field name to translate (e.g., 'features', 'requirements')
   * @returns The translated array or the original English array as fallback
   * 
   * @example
   * ```tsx
   * const { getArrayField } = useDynamicTranslation();
   * 
   * // For an industry record
   * <ul>
   *   {getArrayField(industry, 'features').map(feature => (
   *     <li key={feature}>{feature}</li>
   *   ))}
   * </ul>
   * ```
   */
  const getArrayField = <T extends Record<string, any>>(
    record: T | null | undefined,
    field: keyof T & string
  ): any[] => {
    if (!record) return [];

    // Get the original English value
    const englishValue = record[field];
    const englishArray = Array.isArray(englishValue) ? englishValue : [];

    if (language === 'en') {
      return englishArray;
    }

    // Try to get translated value from content_nl or content_de
    const contentField = language === 'nl' ? 'content_nl' : 'content_de';
    const translatedContent = record[contentField as keyof T];

    if (translatedContent && typeof translatedContent === 'object') {
      const translatedValue = (translatedContent as Record<string, any>)[field];
      if (Array.isArray(translatedValue) && translatedValue.length > 0) {
        return translatedValue;
      }
    }

    // Fallback to English
    return englishArray;
  };

  /**
   * Get translated nested object field value from a database record
   * 
   * @param record - The database record with content_nl and content_de fields
   * @param field - The field name to translate (e.g., 'content_sections')
   * @returns The translated object or the original English object as fallback
   */
  const getObjectField = <T extends Record<string, any>>(
    record: T | null | undefined,
    field: keyof T & string
  ): Record<string, any> => {
    if (!record) return {};

    // Get the original English value
    const englishValue = record[field];
    const englishObject = (typeof englishValue === 'object' && !Array.isArray(englishValue)) 
      ? englishValue 
      : {};

    if (language === 'en') {
      return englishObject;
    }

    // Try to get translated value from content_nl or content_de
    const contentField = language === 'nl' ? 'content_nl' : 'content_de';
    const translatedContent = record[contentField as keyof T];

    if (translatedContent && typeof translatedContent === 'object') {
      const translatedValue = (translatedContent as Record<string, any>)[field];
      if (typeof translatedValue === 'object' && !Array.isArray(translatedValue) && translatedValue !== null) {
        return translatedValue;
      }
    }

    // Fallback to English
    return englishObject;
  };

  /**
   * Get all translated fields from a database record at once
   * Returns a new object with all fields translated where available
   * 
   * @param record - The database record with content_nl and content_de fields
   * @param fields - Array of field names to translate
   * @returns Object with all translated fields
   * 
   * @example
   * ```tsx
   * const { getTranslatedRecord } = useDynamicTranslation();
   * 
   * const translated = getTranslatedRecord(testimonial, ['quote', 'author_role', 'company_name']);
   * // Returns { quote: "Translated quote...", author_role: "Translated role", company_name: "Company" }
   * ```
   */
  const getTranslatedRecord = <T extends Record<string, any>>(
    record: T | null | undefined,
    fields: (keyof T & string)[]
  ): Record<string, any> => {
    if (!record) return {};

    const result: Record<string, any> = {};
    
    for (const field of fields) {
      const value = record[field];
      
      if (Array.isArray(value)) {
        result[field] = getArrayField(record, field);
      } else if (typeof value === 'object' && value !== null) {
        result[field] = getObjectField(record, field);
      } else {
        result[field] = getField(record, field);
      }
    }

    return result;
  };

  /**
   * Check if a record has translations for the current language
   * 
   * @param record - The database record to check
   * @returns true if translations exist for current language
   */
  const hasTranslation = <T extends Record<string, any>>(
    record: T | null | undefined
  ): boolean => {
    if (!record || language === 'en') return true;

    const contentField = language === 'nl' ? 'content_nl' : 'content_de';
    const translatedContent = record[contentField as keyof T];

    return translatedContent !== null && translatedContent !== undefined && 
           typeof translatedContent === 'object' && 
           Object.keys(translatedContent as object).length > 0;
  };

  return {
    language,
    getField,
    getArrayField,
    getObjectField,
    getTranslatedRecord,
    hasTranslation
  };
}

export default useDynamicTranslation;

