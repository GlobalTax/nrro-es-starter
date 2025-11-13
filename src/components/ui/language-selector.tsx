import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
  variant?: "light" | "dark";
}

export const LanguageSelector = ({ variant = "light" }: LanguageSelectorProps) => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: "es" as const, label: "ES", name: "Español" },
    { code: "ca" as const, label: "CA", name: "Català" },
    { code: "en" as const, label: "EN", name: "English" },
  ];

  const currentLang = languages.find(lang => lang.code === language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center gap-2 font-medium transition-colors",
            variant === "light"
              ? "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
              : "text-white/90 hover:text-white hover:bg-white/10"
          )}
        >
          <Globe className="w-4 h-4" />
          {currentLang.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={cn(
              "cursor-pointer",
              language === lang.code && "bg-accent text-accent-foreground"
            )}
          >
            <span className="font-mono text-xs uppercase tracking-wider mr-2">
              {lang.label}
            </span>
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
