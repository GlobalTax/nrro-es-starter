import { Phone } from "lucide-react";
import { GroupCompaniesDropdown } from "./GroupCompaniesDropdown";
import { LanguageSelector } from "@/components/ui/language-selector";
import { LanguageLink } from "@/components/ui/language-link";
import { useTopBar } from "@/hooks/useTopBarConfig";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";

export const TopBar = () => {
  const { config, links, isLoading } = useTopBar();
  const { getLocalizedPath } = useLocalizedPath();

  if (isLoading) {
    return (
      <div className="hidden md:block h-10 bg-slate-900 border-b border-slate-800" />
    );
  }

  return (
    <div className="hidden md:block h-10 bg-slate-900 border-b border-slate-800 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Left side: Group companies dropdown + secondary links */}
          <div className="flex items-center gap-4">
            <GroupCompaniesDropdown />
            
            {links.length > 0 && (
              <>
                <span className="text-white/30">│</span>
                <nav className="flex items-center gap-4">
                  {links.map((link, index) => (
                    <span key={link.id} className="flex items-center gap-4">
                      {link.is_external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-white/70 hover:text-white transition-colors"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <LanguageLink
                          to={link.href}
                          className="text-sm text-white/70 hover:text-white transition-colors"
                        >
                          {link.label}
                        </LanguageLink>
                      )}
                      {index < links.length - 1 && (
                        <span className="text-white/30">│</span>
                      )}
                    </span>
                  ))}
                </nav>
              </>
            )}
          </div>

          {/* Right side: Language selector + phone */}
          <div className="flex items-center gap-4">
            {config?.show_language_selector && (
              <LanguageSelector variant="dark" />
            )}
            
            {config?.phone_number && (
              <a
                href={config.phone_link || `tel:${config.phone_number.replace(/\s/g, "")}`}
                className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>{config.phone_number}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
