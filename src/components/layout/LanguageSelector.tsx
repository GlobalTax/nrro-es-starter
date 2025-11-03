import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/hooks/useLanguage';
import { Globe } from 'lucide-react';
import { Language } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const languages = [
  { code: 'es' as Language, label: 'Español', flag: '🇪🇸' },
  { code: 'ca' as Language, label: 'Català', flag: '🏴' },
  { code: 'en' as Language, label: 'English', flag: '🇬🇧' },
];

interface LanguageSelectorProps {
  isLightMode?: boolean;
}

export const LanguageSelector = ({ isLightMode = false }: LanguageSelectorProps) => {
  const { language, setLanguage } = useLanguage();

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={cn(
            "gap-2 border transition-all duration-200 hover:scale-105",
            isLightMode 
              ? "bg-white/80 border-border/50 text-foreground hover:bg-white hover:border-border shadow-sm" 
              : "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40 backdrop-blur-sm"
          )}
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline font-medium">{currentLanguage?.flag} {currentLanguage?.label}</span>
          <span className="sm:hidden text-base">{currentLanguage?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="z-[100] bg-background border-border shadow-xl min-w-[180px]"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={cn(
              "cursor-pointer transition-colors",
              language === lang.code 
                ? 'bg-accent text-accent-foreground font-medium' 
                : 'hover:bg-muted'
            )}
          >
            <span className="mr-3 text-base">{lang.flag}</span>
            <span className="font-medium">{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
