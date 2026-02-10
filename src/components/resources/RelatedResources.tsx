import { Link, useNavigate } from "react-router-dom";
import { useResources } from "@/hooks/useResources";
import { ResourceCard } from "./ResourceCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface RelatedResourcesProps {
  currentResourceId: string;
  category: string | null;
}

export const RelatedResources = ({ currentResourceId, category }: RelatedResourcesProps) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { data: resources } = useResources({ category: category || undefined });

  const getLocalizedPath = (path: string) => {
    if (language === "es") return path;
    return `/${language}${path}`;
  };

  // Filter out current resource and limit to 3
  const relatedResources = resources
    ?.filter(r => r.id !== currentResourceId)
    .slice(0, 3) || [];

  if (relatedResources.length === 0) return null;

  const title = {
    es: "Recursos relacionados",
    en: "Related resources",
    ca: "Recursos relacionats",
  };

  const handleDownload = (resource: any) => {
    navigate(getLocalizedPath(`/recursos/${(resource as any).slug || resource.id}`));
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-display font-normal text-foreground mb-8 text-center">
          {title[language] || title.es}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedResources.map((resource) => (
            <Link 
              key={resource.id} 
              to={getLocalizedPath(`/recursos/${(resource as any).slug || resource.id}`)}
              className="block"
            >
              <ResourceCard 
                resource={resource} 
                onDownload={() => handleDownload(resource)} 
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
