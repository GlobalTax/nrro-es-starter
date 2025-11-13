import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLanguage } from "@/contexts/LanguageContext";

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

const ITEMS_PER_PAGE = 12;

const Services = () => {
  const { t, language } = useLanguage();
  const { trackPageView, trackEvent } = useAnalytics();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeArea, setActiveArea] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Track page view
  useEffect(() => {
    trackPageView("servicios");
  }, []);
  
  // Track search (debounced)
  useEffect(() => {
    if (searchTerm) {
      const timer = setTimeout(() => {
        trackEvent("search", { search_term: searchTerm, search_location: "servicios" });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [searchTerm]);
  
  // Track filter changes
  useEffect(() => {
    if (activeArea) {
      trackEvent("filter_applied", { filter_type: "area", filter_value: activeArea, page: "servicios" });
    }
  }, [activeArea]);

  // Fetch filter options from database
  const { data: filterOptions, isLoading: isLoadingOptions, isError: isErrorOptions } = useServicesFilterOptions(language);

  // Fetch services with search and filters
  const { data: dbServices, isLoading: isLoadingServices, isError: isErrorServices } = useServicesSearch({
    searchQuery: searchTerm || undefined,
    area: activeArea || undefined,
    limit: ITEMS_PER_PAGE,
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
  }, language);

  // Use database data
  const services = dbServices?.services || [];
  const totalCount = dbServices?.totalCount || 0;
  const areas = filterOptions?.areas || [];

  const isLoading = isLoadingOptions || isLoadingServices;
  const hasError = !isLoading && (isErrorOptions || isErrorServices);
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

  console.log('Services Debug:', {
    servicesCount: services.length,
    totalCount,
    totalPages,
    currentPage,
    isLoading
  });

  return (
    <>
      <Meta
        title={t('services.meta.title')}
        description={t('services.meta.description')}
        canonicalUrl={`${window.location.origin}/servicios`}
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-black py-32 md:py-48 text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal text-white mb-8 leading-tight">
                {t('services.hero.title')}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                {t('services.hero.subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Filters and Results Section */}
        <section className="bg-background pb-20 md:pb-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">

            {/* Filters Row */}
            <div className="max-w-7xl mx-auto -mt-12 relative z-10 mb-12">
              <div className="bg-background rounded-lg shadow-strong p-6">
                <div className="flex items-center justify-between flex-wrap gap-6">
                  
                  {/* Left: View Toggle + Area Filters */}
                  <div className="flex items-center gap-6 flex-wrap">
                    <ViewToggle value={viewMode} onChange={setViewMode} />
                    
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-sm font-medium text-muted-foreground">{t('services.filters.filterBy')}</span>
                      <BadgeFilter
                        label={t('services.filters.all')}
                        active={activeArea === null}
                        onClick={() => {
                          setActiveArea(null);
                          setCurrentPage(1);
                        }}
                      />
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

                  {/* Right: Search */}
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder={t('services.filters.search')}
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
              </div>
            </div>

            {/* Services Grid */}
            <div className="max-w-7xl mx-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : hasError ? (
                <EmptyState
                  title={t('services.empty.error') || 'Error al cargar servicios'}
                  description={t('services.empty.errorDescription') || 'Por favor, intenta recargar la página'}
                />
              ) : services.length === 0 ? (
                <EmptyState
                  title={t('services.empty.title')}
                  description={t('services.empty.description')}
                />
              ) : (
                <>
                  <div className={cn(
                    "mb-12",
                    viewMode === 'grid'
                      ? "grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
                      : "space-y-6"
                  )}>
                    {services.map((service: any) => (
                      <div 
                        key={service.id}
                        onClick={() => trackEvent("service_card_click", { 
                          service_name: service.name, 
                          service_slug: service.slug 
                        })}
                      >
                        <ServiceCard
                          service={service}
                          variant={viewMode}
                        />
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-center">
                      <CustomPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Services;
