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
import { useNavigate, useLocation } from "react-router-dom";

interface LanguageSelectorProps {
  variant?: "light" | "dark";
}

export const LanguageSelector = ({ variant = "light" }: LanguageSelectorProps) => {
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const languages = [
    { code: "es" as const, label: "ES", name: "Español" },
    { code: "ca" as const, label: "CA", name: "Català" },
    { code: "en" as const, label: "EN", name: "English" },
  ];

  const pathTranslations: Record<string, Record<string, string>> = {
    '/': { es: '/', ca: '/', en: '/' },
    '/servicios': { es: '/servicios', ca: '/serveis', en: '/services' },
    '/nosotros': { es: '/nosotros', ca: '/nosaltres', en: '/about' },
    '/equipo': { es: '/equipo', ca: '/equip', en: '/team' },
    '/blog': { es: '/blog', ca: '/blog', en: '/blog' },
    '/casos-exito': { es: '/casos-exito', ca: '/casos-exit', en: '/case-studies' },
    '/carreras': { es: '/carreras', ca: '/carreres', en: '/careers' },
    '/contacto': { es: '/contacto', ca: '/contacte', en: '/contact' },
    '/metodologia': { es: '/metodologia', ca: '/metodologia', en: '/methodology' },
    '/estrategia': { es: '/estrategia', ca: '/estrategia', en: '/strategy' },
    '/sectores': { es: '/sectores', ca: '/sectors', en: '/sectors' },
    '/privacidad': { es: '/privacidad', ca: '/privacitat', en: '/privacy' },
    '/aviso-legal': { es: '/aviso-legal', ca: '/avis-legal', en: '/legal-notice' },
    '/cookies': { es: '/cookies', ca: '/cookies', en: '/cookies' },
    '/condiciones-contratacion': { es: '/condiciones-contratacion', ca: '/condicions-contractacio', en: '/terms-conditions' },
  };

  const handleLanguageChange = (newLang: 'es' | 'ca' | 'en') => {
    // Cambiar el idioma en el contexto
    setLanguage(newLang);
    
    // Obtener la ruta actual sin el prefijo de idioma
    let currentPath = location.pathname;
    
    // Remover el prefijo de idioma actual
    if (currentPath.startsWith('/ca/')) {
      currentPath = currentPath.substring(3);
    } else if (currentPath.startsWith('/en/')) {
      currentPath = currentPath.substring(3);
    }
    
    // Si la ruta está vacía, usar '/'
    if (!currentPath || currentPath === '') {
      currentPath = '/';
    }
    
    // Intentar traducir la ruta
    let translatedPath = currentPath;
    for (const [basePath, translations] of Object.entries(pathTranslations)) {
      if (currentPath === basePath || currentPath.startsWith(basePath + '/')) {
        const baseTranslated = translations[newLang];
        if (currentPath === basePath) {
          translatedPath = baseTranslated;
        } else {
          // Mantener el sufijo (por ejemplo, /servicios/detalle -> /services/detalle)
          const suffix = currentPath.substring(basePath.length);
          translatedPath = baseTranslated + suffix;
        }
        break;
      }
    }
    
    // Agregar el prefijo de idioma si es necesario
    let newPath = translatedPath;
    if (newLang === 'ca') {
      newPath = `/ca${translatedPath}`;
    } else if (newLang === 'en') {
      newPath = `/en${translatedPath}`;
    }
    
    // Navegar a la nueva URL
    navigate(newPath, { replace: true });
  };

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
            onClick={() => handleLanguageChange(lang.code)}
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
