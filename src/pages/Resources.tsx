import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BookOpen, Search } from "lucide-react";
import { Meta } from "@/components/seo/Meta";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useResources, Resource } from "@/hooks/useResources";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { ResourceFilters } from "@/components/resources/ResourceFilters";
import { ResourceDownloadModal } from "@/components/resources/ResourceDownloadModal";
import { useLanguage } from "@/contexts/LanguageContext";

const Resources = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  
  const [activeType, setActiveType] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: resources, isLoading } = useResources({
    type: activeType,
    category: activeCategory,
  });

  // Filter by search query
  const filteredResources = resources?.filter((resource) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      resource.title.toLowerCase().includes(query) ||
      resource.description?.toLowerCase().includes(query)
    );
  });

  const handleDownload = (resource: Resource) => {
    setSelectedResource(resource);
    setIsModalOpen(true);
  };

  // SEO metadata by language
  const seoMeta = {
    es: {
      title: "Centro de Recursos | Guías, Ebooks y Herramientas | navarro",
      description: "Descarga guías fiscales, ebooks, plantillas y herramientas gratuitas para empresas. Recursos prácticos sobre fiscalidad, mercantil, laboral y M&A.",
    },
    en: {
      title: "Resource Center | Guides, Ebooks & Tools | navarro",
      description: "Download free tax guides, ebooks, templates and tools for businesses. Practical resources on taxation, corporate law, labor and M&A.",
    },
    ca: {
      title: "Centre de Recursos | Guies, Ebooks i Eines | navarro",
      description: "Descarrega guies fiscals, ebooks, plantilles i eines gratuïtes per a empreses. Recursos pràctics sobre fiscalitat, mercantil, laboral i M&A.",
    },
  };

  const currentMeta = seoMeta[language as keyof typeof seoMeta] || seoMeta.es;

  return (
    <>
      <Meta
        title={currentMeta.title}
        description={currentMeta.description}
      />

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-b from-muted/50 to-background overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <BookOpen className="h-4 w-4" />
              {t("resources.badge", "Centro de Recursos")}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {t("resources.heroTitle", "Recursos para tu empresa")}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              {t(
                "resources.heroSubtitle",
                "Guías prácticas, ebooks, webinars y herramientas para ayudarte en la gestión fiscal, legal y empresarial."
              )}
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("resources.searchPlaceholder", "Buscar recursos...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-background border-border/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="py-12 md:py-16">
        <div className="container">
          {/* Filters */}
          <ResourceFilters
            activeType={activeType}
            activeCategory={activeCategory}
            onTypeChange={setActiveType}
            onCategoryChange={setActiveCategory}
          />

          {/* Results count */}
          <div className="mt-8 mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {isLoading
                ? t("resources.loading", "Cargando recursos...")
                : t("resources.results", "{{count}} recursos encontrados", {
                    count: filteredResources?.length || 0,
                  })}
            </p>
          </div>

          {/* Resources grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[16/10] w-full" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : filteredResources && filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {t("resources.noResults", "No se encontraron recursos")}
              </h3>
              <p className="text-muted-foreground">
                {t(
                  "resources.noResultsHint",
                  "Prueba con otros filtros o términos de búsqueda"
                )}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Download Modal */}
      <ResourceDownloadModal
        resource={selectedResource}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
};

export default Resources;
