import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import type { LeadFilters } from '@/hooks/useCompanySetupLeads';

interface UTMFiltersProps {
  filters: LeadFilters;
  onFilterChange: (filters: LeadFilters) => void;
  availableValues: {
    campaigns: string[];
    sources: string[];
    mediums: string[];
  };
}

export const LeadUTMFilters = ({
  filters,
  onFilterChange,
  availableValues,
}: UTMFiltersProps) => {
  const hasActiveFilters = filters.utm_campaign || filters.utm_source || filters.utm_medium;

  const clearUTMFilters = () => {
    onFilterChange({
      ...filters,
      utm_campaign: undefined,
      utm_source: undefined,
      utm_medium: undefined,
    });
  };

  if (
    availableValues.campaigns.length === 0 &&
    availableValues.sources.length === 0 &&
    availableValues.mediums.length === 0
  ) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100">
      {/* Campaigns */}
      {availableValues.campaigns.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-slate-500">Campañas:</span>
          {availableValues.campaigns.map((campaign) => (
            <Badge
              key={campaign}
              variant="outline"
              className={cn(
                'cursor-pointer transition-all text-xs',
                filters.utm_campaign === campaign
                  ? 'bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200'
                  : 'hover:bg-slate-100 text-slate-600'
              )}
              onClick={() =>
                onFilterChange({
                  ...filters,
                  utm_campaign: filters.utm_campaign === campaign ? undefined : campaign,
                })
              }
            >
              {campaign}
            </Badge>
          ))}
        </div>
      )}

      {/* Sources */}
      {availableValues.sources.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-slate-500">Fuentes:</span>
          {availableValues.sources.map((source) => (
            <Badge
              key={source}
              variant="outline"
              className={cn(
                'cursor-pointer transition-all text-xs',
                filters.utm_source === source
                  ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200'
                  : 'hover:bg-slate-100 text-slate-600'
              )}
              onClick={() =>
                onFilterChange({
                  ...filters,
                  utm_source: filters.utm_source === source ? undefined : source,
                })
              }
            >
              {source}
            </Badge>
          ))}
        </div>
      )}

      {/* Mediums */}
      {availableValues.mediums.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-slate-500">Medios:</span>
          {availableValues.mediums.map((medium) => (
            <Badge
              key={medium}
              variant="outline"
              className={cn(
                'cursor-pointer transition-all text-xs',
                filters.utm_medium === medium
                  ? 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200'
                  : 'hover:bg-slate-100 text-slate-600'
              )}
              onClick={() =>
                onFilterChange({
                  ...filters,
                  utm_medium: filters.utm_medium === medium ? undefined : medium,
                })
              }
            >
              {medium}
            </Badge>
          ))}
        </div>
      )}

      {/* Clear filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearUTMFilters}
          className="text-xs text-slate-500 hover:text-slate-700 h-7 px-2"
        >
          <X className="h-3 w-3 mr-1" />
          Limpiar
        </Button>
      )}
    </div>
  );
};
