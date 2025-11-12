import { useEffect, useState, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import i18n from './config';

interface TranslationProviderProps {
  children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const { ready } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        // Fetch all translations from Supabase
        const { data: translations, error } = await supabase
          .from('translations')
          .select('*');

        if (error) {
          console.warn('Translations table not found. Skipping translation loading.', error);
          console.warn('Please apply database migrations to enable multi-language support.');
          setIsLoading(false);
          return;
        }

        // Organize translations by language
        const translationsByLang: Record<string, Record<string, string>> = {
          en: {},
          nl: {}
        };

        translations?.forEach((translation) => {
          if (translationsByLang[translation.language]) {
            translationsByLang[translation.language][translation.translation_key] = 
              translation.translation_value;
          }
        });

        // Add translations to i18n
        Object.keys(translationsByLang).forEach((lang) => {
          i18n.addResources(lang, 'translation', translationsByLang[lang]);
        });

        setIsLoading(false);
      } catch (error) {
        console.warn('Error loading translations. App will work without i18n.', error);
        setIsLoading(false);
      }
    };

    loadTranslations();

    // Set up realtime subscription for translations (only if table exists)
    const channel = supabase
      .channel('translations-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'translations' },
        () => {
          loadTranslations();
        }
      )
      .subscribe();

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch (e) {
        // Ignore cleanup errors
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}

