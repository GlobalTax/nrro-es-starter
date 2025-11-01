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
import { ViewToggle } from "@/components/ui/view-toggle";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { IntroduccionSection } from "@/components/services/IntroduccionSection";
import { AreasDestacadasSection } from "@/components/services/AreasDestacadasSection";
import { MetodologiaSection } from "@/components/services/MetodologiaSection";
import { CTASection } from "@/components/services/CTASection";
import { FAQsSection } from "@/components/services/FAQsSection";
import { CTAFinalSection } from "@/components/services/CTAFinalSection";
import { BadgeHero } from "@/components/ui/badge-hero";

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
        {/* Hero Section */}
        <section data-dark="true" className="bg-black text-white py-32 md:py-48">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-6">
                <BadgeHero>Nuestros Servicios</BadgeHero>
              </div>
              <h1 className="service-hero-title mb-6">
                Soluciones Integrales para tu Empresa
              </h1>
              <p className="service-hero-subtitle">
                Asesoría fiscal, contable, legal y laboral personalizada para empresas y autónomos en Barcelona.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        {!isLoading && services.length > 0 && (
          <section className="bg-muted py-16 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                <div className="text-center">
                  <div className="stat-number mb-2">25+</div>
                  <div className="text-body uppercase tracking-wider">Años de Experiencia</div>
                </div>
                <div className="text-center">
                  <div className="stat-number mb-2">500+</div>
                  <div className="text-body uppercase tracking-wider">Clientes Activos</div>
                </div>
                <div className="text-center">
                  <div className="stat-number mb-2">{areas.length}</div>
                  <div className="text-body uppercase tracking-wider">Áreas de Práctica</div>
                </div>
                <div className="text-center">
                  <div className="stat-number mb-2">98%</div>
                  <div className="text-body uppercase tracking-wider">Satisfacción</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Introducción Section */}
        <IntroduccionSection />

        {/* Áreas Destacadas Section */}
        <AreasDestacadasSection />

        {/* Filters and Results Section */}
        <section className="bg-white py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">

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
          </div>
        </section>

        {/* Metodología Section */}
        <MetodologiaSection />

        {/* CTA Consulta Section */}
        <CTASection />

        {/* FAQs Section */}
        <FAQsSection />

        {/* CTA Final Section */}
        <CTAFinalSection />
      </div>
    </>
  );
};

export default Services;
