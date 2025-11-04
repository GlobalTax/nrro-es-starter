import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface LeadFiltersProps {
  filters: {
    status?: string;
    priority?: string;
    country?: string;
    job_situation?: string;
    search?: string;
  };
  onFilterChange: (filters: any) => void;
}

export const LeadFilters = ({ filters, onFilterChange }: LeadFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar por nombre, email..."
          value={filters.search || ""}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          className="pl-10"
        />
      </div>

      <Select
        value={filters.status || "all"}
        onValueChange={(value) => onFilterChange({ ...filters, status: value === "all" ? undefined : value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los estados</SelectItem>
          <SelectItem value="nuevo">Nuevo</SelectItem>
          <SelectItem value="contactado">Contactado</SelectItem>
          <SelectItem value="documentacion">Documentación</SelectItem>
          <SelectItem value="en_proceso">En proceso</SelectItem>
          <SelectItem value="completado">Completado</SelectItem>
          <SelectItem value="descartado">Descartado</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.priority || "all"}
        onValueChange={(value) => onFilterChange({ ...filters, priority: value === "all" ? undefined : value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Prioridad" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las prioridades</SelectItem>
          <SelectItem value="urgente">🔴 Urgente</SelectItem>
          <SelectItem value="alta">🟠 Alta</SelectItem>
          <SelectItem value="media">🟡 Media</SelectItem>
          <SelectItem value="baja">🟢 Baja</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.job_situation || "all"}
        onValueChange={(value) => onFilterChange({ ...filters, job_situation: value === "all" ? undefined : value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Situación Laboral" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las situaciones</SelectItem>
          <SelectItem value="contrato_espana">Contrato en España</SelectItem>
          <SelectItem value="oferta_empleo">Oferta de empleo</SelectItem>
          <SelectItem value="emprendedor">Emprendedor</SelectItem>
          <SelectItem value="autonomo">Autónomo</SelectItem>
          <SelectItem value="investigador">Investigador</SelectItem>
          <SelectItem value="otro">Otro</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.country || "all"}
        onValueChange={(value) => onFilterChange({ ...filters, country: value === "all" ? undefined : value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="País" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los países</SelectItem>
          <SelectItem value="Argentina">Argentina</SelectItem>
          <SelectItem value="Brasil">Brasil</SelectItem>
          <SelectItem value="Chile">Chile</SelectItem>
          <SelectItem value="Colombia">Colombia</SelectItem>
          <SelectItem value="México">México</SelectItem>
          <SelectItem value="Perú">Perú</SelectItem>
          <SelectItem value="Venezuela">Venezuela</SelectItem>
          <SelectItem value="Uruguay">Uruguay</SelectItem>
          <SelectItem value="Estados Unidos">Estados Unidos</SelectItem>
          <SelectItem value="Reino Unido">Reino Unido</SelectItem>
          <SelectItem value="Francia">Francia</SelectItem>
          <SelectItem value="Alemania">Alemania</SelectItem>
          <SelectItem value="Italia">Italia</SelectItem>
          <SelectItem value="Otro">Otro</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
