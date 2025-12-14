import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage, Language } from '@/contexts/LanguageContext';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { setLanguage } = useLanguage();

  const changeLanguage = (langCode: string) => {
    // Update both i18n (for static content) and LanguageContext (for dynamic DB content)
    i18n.changeLanguage(langCode);
    setLanguage(langCode as Language);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors rounded-none border border-slate-200 hover:border-primary bg-white">
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{currentLanguage.flag} {currentLanguage.name}</span>
        <span className="sm:hidden">{currentLanguage.flag}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white border-slate-200 rounded-none">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`cursor-pointer ${i18n.language === lang.code ? 'bg-primary/10 text-primary' : ''
              }`}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

