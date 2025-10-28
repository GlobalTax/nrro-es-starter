import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { BadgeFilter } from "@/components/ui/badge-filter";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { Overline } from "@/components/ui/typography";
import { Meta } from "@/components/seo/Meta";
import { useServicesSearch, useServicesFilterOptions } from "@/hooks/useServicesSearch";
import { Search, Loader2 } from "lucide-react";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ViewToggle } from "@/components/portfolio/ViewToggle";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ITEMS_PER_PAGE = 12;

const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeArea, setActiveArea] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch filter options from database
  const { data: filterOptions, isLoading: isLoadingOptions } = useServicesFilterOptions();

  // Fetch services with search and filters
  const { data: dbServices, isLoading: isLoadingServices } = useServicesSearch({
    searchQuery: searchTerm || undefined,
    area: activeArea || undefined,
    limit: ITEMS_PER_PAGE,
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
  });

  // Use database data
  const services = dbServices || [];
  const areas = filterOptions?.areas || ['Fiscal', 'Contable', 'Legal', 'Laboral'];

  const isLoading = isLoadingOptions || isLoadingServices;
  const totalPages = Math.max(1, Math.ceil(services.length / ITEMS_PER_PAGE));

  return (
    <>
      <Meta
        title="Nuestros Servicios"
        description="Servicios integrales de asesoría fiscal, contable, legal y laboral para empresas y autónomos en Barcelona"
        canonicalUrl={`${window.location.origin}/servicios`}
      />

      <div className="min-h-screen">
        {/* Hero */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-4xl mb-16 text-center mx-auto">
            <Overline className="mb-6">Nuestros Servicios</Overline>
            <h1 className="mb-6 text-5xl lg:text-6xl">
              Soluciones Integrales para tu Empresa
            </h1>
            <p className="text-lead text-xl text-muted-foreground">
              Asesoría fiscal, contable, legal y laboral personalizada para empresas y autónomos en Barcelona.
            </p>
          </div>

          {/* Stats */}
          {!isLoading && services.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  25+
                </div>
                <div className="text-sm text-muted-foreground">Años de Experiencia</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  500+
                </div>
                <div className="text-sm text-muted-foreground">Clientes Activos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {areas.length}
                </div>
                <div className="text-sm text-muted-foreground">Áreas de Práctica</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  98%
                </div>
                <div className="text-sm text-muted-foreground">Satisfacción</div>
              </div>
            </div>
          )}

          {/* Filters Row */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              {/* View Toggle */}
              <ViewToggle value={viewMode} onChange={setViewMode} />

              {/* Area filters */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium text-subtle">Área:</span>
                {areas.map((area: string) => (
                  <BadgeFilter
                    key={area}
                    label={area}
                    active={activeArea === area}
                    onClick={() => {
                      setActiveArea(activeArea === area ? null : area);
                      setCurrentPage(1);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar servicios..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
                aria-label="Buscar servicios"
              />
            </div>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : services.length === 0 ? (
            <EmptyState
              title="No se encontraron servicios"
              description="Intenta ajustar los filtros o el término de búsqueda"
            />
          ) : (
            <>
              <div className={cn(
                "mb-8",
                viewMode === 'grid'
                  ? "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              )}>
                {services.map((service: any) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    variant={viewMode}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <CustomPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </section>
      </div>
    </>
  );
};

export default Services;
