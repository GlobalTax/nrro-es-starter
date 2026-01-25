import { Building2, ChevronDown, ExternalLink, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTopBar } from "@/hooks/useTopBarConfig";
import { cn } from "@/lib/utils";

interface GroupCompaniesDropdownProps {
  className?: string;
}

export const GroupCompaniesDropdown = ({ className }: GroupCompaniesDropdownProps) => {
  const { currentCompany, otherCompanies, isLoading } = useTopBar();

  if (isLoading || !currentCompany) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white transition-colors focus:outline-none",
          className
        )}
      >
        <Star className="h-3 w-3 fill-current" />
        <span>{currentCompany.name}</span>
        <ChevronDown className="h-3.5 w-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="min-w-[200px] bg-slate-800 border-slate-700 text-white z-[100]"
      >
        {/* Current company - disabled */}
        <DropdownMenuItem
          disabled
          className="flex items-center gap-2 text-white/60 cursor-default focus:bg-transparent focus:text-white/60"
        >
          <Star className="h-3.5 w-3.5 fill-current text-amber-400" />
          <span>{currentCompany.name}</span>
          <span className="ml-auto text-xs text-white/40">(actual)</span>
        </DropdownMenuItem>

        {/* Other companies */}
        {otherCompanies.map((company) => (
          <DropdownMenuItem
            key={company.id}
            asChild
            className="flex items-center gap-2 text-white/80 hover:text-white hover:bg-slate-700 cursor-pointer focus:bg-slate-700 focus:text-white"
          >
            <a
              href={company.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full"
            >
              {company.logo_url ? (
                <img
                  src={company.logo_url}
                  alt={company.name}
                  className="h-4 w-4 object-contain"
                />
              ) : (
                <Building2 className="h-3.5 w-3.5" />
              )}
              <span>{company.name}</span>
              <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
