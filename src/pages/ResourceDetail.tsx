import { useParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useResourceBySlug } from "@/hooks/useResources";
import { Meta } from "@/components/seo/Meta";
import { ResourceHero } from "@/components/resources/ResourceHero";
import { ResourceTOC } from "@/components/resources/ResourceTOC";
import { ResourceDownloadForm } from "@/components/resources/ResourceDownloadForm";
import { ResourceBenefits } from "@/components/resources/ResourceBenefits";
import { ResourceContent } from "@/components/resources/ResourceContent";
import { ResourceCTA } from "@/components/resources/ResourceCTA";
import { RelatedResources } from "@/components/resources/RelatedResources";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ResourceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const { data: resource, isLoading, error } = useResourceBySlug(slug || "");

  const getLocalizedPath = (path: string) => {
    if (language === "es") return path;
    return `/${language}${path}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-8" />
          <Skeleton className="h-64 w-full mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-96 w-full" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display text-foreground mb-4">
            {language === "en" ? "Resource not found" : language === "ca" ? "Recurs no trobat" : "Recurso no encontrado"}
          </h1>
          <Link to={getLocalizedPath("/recursos")} className="text-primary hover:underline">
            {language === "en" ? "Back to resources" : language === "ca" ? "Tornar a recursos" : "Volver a recursos"}
          </Link>
        </div>
      </div>
    );
  }

  const seoTitle = resource.title;
  const seoDescription = resource.description || "";

  return (
    <>
      <Meta
        title={seoTitle}
        description={seoDescription}
      />

      <div className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 pt-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={getLocalizedPath("/")} className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                    <Home className="h-4 w-4" />
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={getLocalizedPath("/recursos")} className="text-muted-foreground hover:text-foreground">
                    {language === "en" ? "Resources" : "Recursos"}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-foreground font-medium">
                  {resource.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          {/* Back button */}
          <Button 
            variant="ghost" 
            size="sm" 
            asChild 
            className="mt-4 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <Link to={getLocalizedPath("/recursos")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {language === "en" ? "Back to Resources" : language === "ca" ? "Tornar a Recursos" : "Volver a Recursos"}
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <ResourceHero resource={resource} />

        {/* Main Content Grid */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: TOC + Content */}
            <div className="lg:col-span-2 space-y-8">
              {resource.toc && resource.toc.length > 0 && (
                <ResourceTOC items={resource.toc} />
              )}
              
              {resource.benefits && resource.benefits.length > 0 && (
                <ResourceBenefits benefits={resource.benefits} />
              )}

              {resource.content && (
                <ResourceContent content={resource.content} />
              )}
            </div>

            {/* Right Column: Download Form (Sticky) */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <ResourceDownloadForm resource={resource} />
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <ResourceCTA />

        {/* Related Resources */}
        <RelatedResources 
          currentResourceId={resource.id} 
          category={resource.category} 
        />
      </div>
    </>
  );
};

export default ResourceDetail;
