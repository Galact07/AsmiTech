import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export function SimpleLanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'nl' : 'en');
  };

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      size="sm"
      className="gap-2 rounded-none border-primary/20 hover:bg-primary/10"
    >
      <span className="text-lg">{language === 'en' ? '🇬🇧' : '🇳🇱'}</span>
      <span className="hidden sm:inline font-medium">
        {language === 'en' ? 'English' : 'Nederlands'}
      </span>
    </Button>
  );
}

