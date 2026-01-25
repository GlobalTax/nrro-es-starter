import { useState } from "react";
import { Phone } from "lucide-react";
import { GroupCompaniesDropdown } from "./GroupCompaniesDropdown";
import { LanguageSelector } from "@/components/ui/language-selector";
import { LanguageLink } from "@/components/ui/language-link";
import { useTopBar } from "@/hooks/useTopBarConfig";

export const TopBar = () => {
  const { config, links, isLoading } = useTopBar();

  // Dynamic styles from config
  const backgroundColor = config?.background_color || "#0f172a";
  const textColor = config?.text_color || "rgba(255,255,255,0.7)";
  const hoverColor = config?.hover_color || "#ffffff";
  const fontFamily = config?.font_family || "inherit";
  const fontSize = config?.font_size || "0.875rem";

  if (isLoading) {
    return (
      <div className="hidden md:block h-10 border-b border-slate-800" style={{ backgroundColor }} />
    );
  }

  return (
    <div 
      className="hidden md:block h-10 border-b z-50"
      style={{ 
        backgroundColor,
        borderColor: `${backgroundColor}80`,
        fontFamily,
        fontSize,
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Left side: Group companies dropdown + secondary links */}
          <div className="flex items-center gap-4">
            <GroupCompaniesDropdown 
              textColor={textColor}
              hoverColor={hoverColor}
            />
            
            {links.length > 0 && (
              <>
                <span style={{ color: `${textColor}50` }}>│</span>
                <nav className="flex items-center gap-4">
                  {links.map((link, index) => (
                    <span key={link.id} className="flex items-center gap-4">
                      {link.is_external ? (
                        <TopBarLink
                          href={link.href}
                          isExternal
                          textColor={textColor}
                          hoverColor={hoverColor}
                        >
                          {link.label}
                        </TopBarLink>
                      ) : (
                        <TopBarInternalLink
                          to={link.href}
                          textColor={textColor}
                          hoverColor={hoverColor}
                        >
                          {link.label}
                        </TopBarInternalLink>
                      )}
                      {index < links.length - 1 && (
                        <span style={{ color: `${textColor}50` }}>│</span>
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
                className="flex items-center gap-1.5 transition-colors"
                style={{ color: textColor }}
                onMouseEnter={(e) => e.currentTarget.style.color = hoverColor}
                onMouseLeave={(e) => e.currentTarget.style.color = textColor}
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

// Helper component for external links
const TopBarLink = ({ 
  href, 
  children, 
  isExternal, 
  textColor, 
  hoverColor 
}: { 
  href: string; 
  children: React.ReactNode; 
  isExternal?: boolean; 
  textColor: string; 
  hoverColor: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="transition-colors"
      style={{ color: isHovered ? hoverColor : textColor }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </a>
  );
};

// Helper component for internal links
const TopBarInternalLink = ({ 
  to, 
  children, 
  textColor, 
  hoverColor 
}: { 
  to: string; 
  children: React.ReactNode; 
  textColor: string; 
  hoverColor: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <LanguageLink
      to={to}
      className="transition-colors"
      style={{ color: isHovered ? hoverColor : textColor }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </LanguageLink>
  );
};
