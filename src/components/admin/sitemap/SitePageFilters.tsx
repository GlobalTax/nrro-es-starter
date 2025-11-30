import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { SitePageFilters as Filters } from "@/hooks/useSitePages";

interface SitePageFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const PAGE_TYPES = [
  { value: "home", label: "Inicio" },
  { value: "service", label: "Servicio" },
  { value: "landing", label: "Landing" },
  { value: "blog", label: "Blog" },
  { value: "case_study", label: "Caso de Éxito" },
  { value: "legal", label: "Legal" },
  { value: "contact", label: "Contacto" },
  { value: "about", label: "Nosotros" },
  { value: "careers", label: "Empleo" },
  { value: "job_position", label: "Oferta" },
  { value: "other", label: "Otra" },
];

const LANGUAGES = [
  { value: "es", label: "Español" },
  { value: "ca", label: "Catalán" },
  { value: "en", label: "Inglés" },
];

const STATUSES = [
  { value: "published", label: "Publicada" },
  { value: "draft", label: "Borrador" },
  { value: "archived", label: "Archivada" },
  { value: "redirect", label: "Redirección" },
];

const BUSINESS_AREAS = [
  "Fiscal",
  "Mercantil",
  "Laboral",
  "M&A",
  "Empresa Familiar",
  "Venture Capital",
  "Contabilidad",
];

export const SitePageFilters = ({ filters, onFiltersChange }: SitePageFiltersProps) => {
  const updateFilter = (key: keyof Filters, value: string | boolean | undefined) => {
    onFiltersChange({ ...filters, [key]: value || undefined });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="lg:col-span-2">
        <Label htmlFor="search">Buscar</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Buscar por título o URL..."
            value={filters.search || ""}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="page-type">Tipo de página</Label>
        <Select
          value={filters.page_type || "all"}
          onValueChange={(value) => updateFilter("page_type", value === "all" ? undefined : value)}
        >
          <SelectTrigger id="page-type">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            {PAGE_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="language">Idioma</Label>
        <Select
          value={filters.language || "all"}
          onValueChange={(value) => updateFilter("language", value === "all" ? undefined : value)}
        >
          <SelectTrigger id="language">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los idiomas</SelectItem>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="status">Estado</Label>
        <Select
          value={filters.status || "all"}
          onValueChange={(value) => updateFilter("status", value === "all" ? undefined : value)}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            {STATUSES.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="business-area">Área de práctica</Label>
        <Select
          value={filters.business_area || "all"}
          onValueChange={(value) => updateFilter("business_area", value === "all" ? undefined : value)}
        >
          <SelectTrigger id="business-area">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las áreas</SelectItem>
            {BUSINESS_AREAS.map((area) => (
              <SelectItem key={area} value={area}>
                {area}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="is-landing">Tipo de contenido</Label>
        <Select
          value={
            filters.is_landing === true
              ? "landing"
              : filters.is_landing === false
              ? "page"
              : "all"
          }
          onValueChange={(value) =>
            updateFilter(
              "is_landing",
              value === "all" ? undefined : value === "landing"
            )
          }
        >
          <SelectTrigger id="is-landing">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todo el contenido</SelectItem>
            <SelectItem value="page">Solo páginas</SelectItem>
            <SelectItem value="landing">Solo landings</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};