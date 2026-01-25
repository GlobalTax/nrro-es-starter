import React from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TopBarCompany } from '../types';

interface GroupCompaniesDropdownProps {
  currentCompany: TopBarCompany;
  otherCompanies: TopBarCompany[];
  textColor: string;
  hoverColor: string;
}

export function GroupCompaniesDropdown({
  currentCompany,
  otherCompanies,
  textColor,
  hoverColor,
}: GroupCompaniesDropdownProps) {
  if (otherCompanies.length === 0) {
    // No dropdown, just show current company name
    return (
      <span 
        className="text-sm font-medium"
        style={{ color: textColor }}
      >
        {currentCompany.name}
      </span>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-100 focus:outline-none"
          style={{ 
            color: textColor,
            ['--hover-color' as any]: hoverColor,
          }}
        >
          <span className="hover:text-[var(--hover-color)]">{currentCompany.name}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="min-w-[180px] bg-background/95 backdrop-blur-sm border border-border"
      >
        {otherCompanies.map((company) => (
          <DropdownMenuItem key={company.id} asChild>
            <a
              href={company.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 cursor-pointer"
            >
              <span>{company.name}</span>
              <ExternalLink className="h-3 w-3 opacity-50" />
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
