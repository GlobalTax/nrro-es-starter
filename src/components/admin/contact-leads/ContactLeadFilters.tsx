import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

export interface ContactLeadFiltersState {
  search: string;
  status: string;
  serviceType: string;
  sourceSite: string;
  dateFrom: string;
  dateTo: string;
}

interface ContactLeadFiltersProps {
  filters: ContactLeadFiltersState;
  onFiltersChange: (filters: ContactLeadFiltersState) => void;
  onClearFilters: () => void;
}

export const ContactLeadFilters = ({
  filters,
  onFiltersChange,
  onClearFilters,
}: ContactLeadFiltersProps) => {
  const hasActiveFilters = 
    filters.search || 
    filters.status !== "all" || 
    filters.serviceType !== "all" ||
    filters.sourceSite !== "all" ||
    filters.dateFrom ||
    filters.dateTo;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-700">Filtros</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-7 text-xs"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        {/* Búsqueda */}
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar nombre, email, empresa..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="pl-9 h-9"
            />
          </div>
        </div>

        {/* Estado */}
        <Select
          value={filters.status}
          onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendientes</SelectItem>
            <SelectItem value="responded">Respondidos</SelectItem>
          </SelectContent>
        </Select>

        {/* Tipo de Servicio */}
        <Select
          value={filters.serviceType}
          onValueChange={(value) => onFiltersChange({ ...filters, serviceType: value })}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Servicio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="tax_advisory">Asesoría Fiscal</SelectItem>
            <SelectItem value="legal_services">Servicios Legales</SelectItem>
            <SelectItem value="accounting">Contabilidad</SelectItem>
            <SelectItem value="payroll">Nóminas</SelectItem>
            <SelectItem value="other">Otro</SelectItem>
          </SelectContent>
        </Select>

        {/* Origen */}
        <Select
          value={filters.sourceSite}
          onValueChange={(value) => onFiltersChange({ ...filters, sourceSite: value })}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Origen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="es">España (ES)</SelectItem>
            <SelectItem value="en">English (EN)</SelectItem>
            <SelectItem value="ca">Català (CA)</SelectItem>
          </SelectContent>
        </Select>

        {/* Fecha Desde */}
        <Input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => onFiltersChange({ ...filters, dateFrom: e.target.value })}
          className="h-9"
          placeholder="Desde"
        />
      </div>
    </div>
  );
};
