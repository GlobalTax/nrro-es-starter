import React from 'react';
import { Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TopBarData } from '../types';
import { DEFAULT_DATA } from '../utils/defaults';
import { useTopBarOptional } from './TopBarProvider';
import { GroupCompaniesDropdown } from './GroupCompaniesDropdown';
import { TopBarLink } from './TopBarLink';
import { LanguageSelector } from '@/components/ui/language-selector';

interface TopBarProps {
  className?: string;
  /** Pass data directly to use TopBar without a provider */
  data?: TopBarData;
  /** Hide on mobile (default: true) */
  hideOnMobile?: boolean;
}

export function TopBar({ className, data: staticData, hideOnMobile = true }: TopBarProps) {
  // Try to use context, fall back to static data or defaults
  const contextValue = useTopBarOptional();
  const data = staticData || contextValue?.data || DEFAULT_DATA;

  const { config, companies, links } = data;
  
  // Sort companies and links by position
  const sortedCompanies = [...companies].sort((a, b) => a.position - b.position);
  const sortedLinks = [...links].sort((a, b) => a.position - b.position);
  
  const currentCompany = sortedCompanies.find(c => c.isCurrent);
  const otherCompanies = sortedCompanies.filter(c => !c.isCurrent);
  const activeLinks = sortedLinks.filter(l => l.isActive);

  const dynamicStyles: React.CSSProperties = {
    backgroundColor: config.backgroundColor,
    fontFamily: config.fontFamily !== 'inherit' ? config.fontFamily : undefined,
    fontSize: config.fontSize,
  };

  return (
    <div
      className={cn(
        "h-10 border-b border-white/10 z-[60]",
        hideOnMobile && "hidden md:block",
        className
      )}
      style={dynamicStyles}
    >
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Left side: Group Companies + Secondary Links */}
          <div className="flex items-center gap-4">
            {currentCompany && (
              <GroupCompaniesDropdown
                currentCompany={currentCompany}
                otherCompanies={otherCompanies}
                textColor={config.textColor}
                hoverColor={config.hoverColor}
              />
            )}
            
            {activeLinks.length > 0 && currentCompany && (
              <span style={{ color: `${config.textColor}50` }}>|</span>
            )}
            
            {activeLinks.length > 0 && (
              <nav className="flex items-center gap-3">
                {activeLinks.map((link, index) => (
                  <TopBarLink
                    key={link.id}
                    link={link}
                    textColor={config.textColor}
                    hoverColor={config.hoverColor}
                    showSeparator={index < activeLinks.length - 1}
                  />
                ))}
              </nav>
            )}
          </div>

          {/* Right side: Language Selector + Phone */}
          <div className="flex items-center gap-4">
            {config.showLanguageSelector && (
              <LanguageSelector />
            )}
            
            {config.phoneNumber && (
              <a
                href={config.phoneLink || `tel:${config.phoneNumber.replace(/\s/g, '')}`}
                className="flex items-center gap-1.5 text-sm transition-colors"
                style={{ 
                  color: config.textColor,
                  ['--hover-color' as any]: config.hoverColor,
                }}
              >
                <Phone className="h-3.5 w-3.5" />
                <span className="hover:text-[var(--hover-color)]">{config.phoneNumber}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
