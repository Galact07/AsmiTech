import { useLanguage, Language } from '@/contexts/LanguageContext';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function SimpleLanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; name: string }[] = [
    { code: 'nl', name: 'Dutch' },
    { code: 'de', name: 'German' },
    { code: 'en', name: 'English' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 bg-white/50 hover:bg-white border border-slate-200 hover:border-primary/30 transition-all rounded-sm focus:outline-none shadow-sm">
        <span>{currentLanguage.name}</span>
        <ChevronDown className="h-3.5 w-3.5 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm border-slate-200 rounded-sm shadow-md min-w-[120px] p-1">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`cursor-pointer text-sm px-3 py-1.5 rounded-sm focus:bg-primary/5 focus:text-primary ${language === lang.code ? 'text-primary font-medium bg-primary/5' : 'text-slate-600'
              }`}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
