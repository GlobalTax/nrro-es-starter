import { useState } from 'react';
import { Meta } from '@/components/seo/Meta';
import { useCaseStudies, useCaseStudyFilterOptions } from '@/hooks/useCaseStudies';
import { CaseStudyCard } from '@/components/case-studies/CaseStudyCard';
import { CaseStudySkeleton } from '@/components/case-studies/CaseStudySkeleton';
import { ViewToggle } from '@/components/portfolio/ViewToggle';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CustomPagination } from '@/components/ui/custom-pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { BadgeFilter } from '@/components/ui/badge-filter';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Filter, FileText } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

export default function CaseStudies() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilters, setActiveFilters] = useState({
    industry: '',
    service: '',
    tags: [] as string[],
  });

  const { data: filterOptions } = useCaseStudyFilterOptions();
  
  const { data: caseStudies, isLoading } = useCaseStudies({
    searchQuery: searchTerm,
    industry: activeFilters.industry,
    service: activeFilters.service,
    tags: activeFilters.tags.length > 0 ? activeFilters.tags : undefined,
    status: 'published',
    limit: ITEMS_PER_PAGE,
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
  });

  const totalPages = Math.ceil((caseStudies?.length || 0) / ITEMS_PER_PAGE);

  const clearFilters = () => {
    setActiveFilters({ industry: '', service: '', tags: [] });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const hasActiveFilters = activeFilters.industry || activeFilters.service || 
                          activeFilters.tags.length > 0 || searchTerm;

  return (
    <>
      <Meta
        title="Casos de Éxito - Navarro Investment"
        description="Descubre cómo hemos ayudado a nuestros clientes a alcanzar sus objetivos empresariales y transformar sus negocios."
      />

      {/* Hero Section */}
      <section className="bg-black text-white py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="font-mono font-light text-sm md:text-base tracking-tight text-white/70 mb-4">
              CASOS DE ÉXITO
            </h3>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal leading-tight mb-6">
              Resultados reales, impacto medible
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
              Descubre cómo hemos ayudado a empresas de diversos sectores a alcanzar sus objetivos estratégicos y transformar sus negocios.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {!isLoading && caseStudies && (
        <section className="bg-white py-12 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-semibold text-accent mb-2">
                  {caseStudies.length}+
                </div>
                <div className="text-sm text-foreground/60">Casos de éxito</div>
              </div>
              <div>
                <div className="text-4xl font-semibold text-accent mb-2">
                  {filterOptions?.industries.length || 0}
                </div>
                <div className="text-sm text-foreground/60">Sectores</div>
              </div>
              <div>
                <div className="text-4xl font-semibold text-accent mb-2">
                  {filterOptions?.services.length || 0}
                </div>
                <div className="text-sm text-foreground/60">Servicios</div>
              </div>
              <div>
                <div className="text-4xl font-semibold text-accent mb-2">98%</div>
                <div className="text-sm text-foreground/60">Satisfacción</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filters & Search */}
      <section className="bg-background py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex items-center gap-3">
              <ViewToggle value={viewMode} onChange={setViewMode} />
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filtros
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="start">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Sector</label>
                      <select
                        className="w-full p-2 border rounded-md text-sm"
                        value={activeFilters.industry}
                        onChange={(e) => setActiveFilters({ ...activeFilters, industry: e.target.value })}
                      >
                        <option value="">Todos los sectores</option>
                        {filterOptions?.industries.map((industry) => (
                          <option key={industry} value={industry}>{industry}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Servicio</label>
                      <select
                        className="w-full p-2 border rounded-md text-sm"
                        value={activeFilters.service}
                        onChange={(e) => setActiveFilters({ ...activeFilters, service: e.target.value })}
                      >
                        <option value="">Todos los servicios</option>
                        {filterOptions?.services.map((service) => (
                          <option key={service} value={service}>{service}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/50" />
              <Input
                placeholder="Buscar casos de éxito..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-sm text-foreground/60">Filtros activos:</span>
              {activeFilters.industry && (
                <BadgeFilter
                  label={activeFilters.industry}
                  onRemove={() => setActiveFilters({ ...activeFilters, industry: '' })}
                />
              )}
              {activeFilters.service && (
                <BadgeFilter
                  label={activeFilters.service}
                  onRemove={() => setActiveFilters({ ...activeFilters, service: '' })}
                />
              )}
              {activeFilters.tags.map((tag) => (
                <BadgeFilter
                  key={tag}
                  label={tag}
                  onRemove={() => setActiveFilters({
                    ...activeFilters,
                    tags: activeFilters.tags.filter(t => t !== tag)
                  })}
                />
              ))}
              {searchTerm && (
                <BadgeFilter
                  label={`Búsqueda: ${searchTerm}`}
                  onRemove={() => setSearchTerm('')}
                />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
              >
                Limpiar todos
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className={viewMode === 'grid' 
              ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8' 
              : 'space-y-6'
            }>
              {[...Array(6)].map((_, i) => (
                <CaseStudySkeleton key={i} variant={viewMode} />
              ))}
            </div>
          ) : !caseStudies || caseStudies.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No se encontraron casos de éxito"
              description="Intenta ajustar los filtros o la búsqueda para ver más resultados."
            />
          ) : (
            <>
              <div className={viewMode === 'grid' 
                ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8' 
                : 'space-y-6'
              }>
                {caseStudies.map((caseStudy) => (
                  <CaseStudyCard
                    key={caseStudy.id}
                    caseStudy={caseStudy}
                    variant={viewMode}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-12">
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
      </section>
    </>
  );
}
