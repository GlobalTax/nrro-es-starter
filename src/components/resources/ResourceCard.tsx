import { FileText, Video, FileCheck, Download, Globe, ArrowRight, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Resource } from "@/hooks/useResources";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { es, ca, enUS } from "date-fns/locale";

interface ResourceCardProps {
  resource: Resource;
  onDownload: (resource: Resource) => void;
}

// Based on actual enum values: country_guide, template, webinar, white_paper
const typeIcons: Record<string, React.ElementType> = {
  country_guide: Globe,
  template: FileCheck,
  webinar: Video,
  white_paper: FileText,
};

const typeColors: Record<string, string> = {
  country_guide: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  template: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  webinar: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  white_paper: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

export const ResourceCard = ({ resource, onDownload }: ResourceCardProps) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const Icon = typeIcons[resource.type] || FileText;
  const dateLocale = language === 'ca' ? ca : language === 'en' ? enUS : es;

  const getLocalizedPath = (path: string) => {
    if (language === "es") return path;
    return `/${language}${path}`;
  };

  const resourceUrl = resource.slug 
    ? getLocalizedPath(`/recursos/${resource.slug}`)
    : "#";

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50">
      <Link to={resourceUrl} className="block">
        {/* Thumbnail */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {resource.thumbnail_url ? (
            <img
              src={resource.thumbnail_url}
              alt={resource.title}
              className="w-full h-full object-cover transition-all duration-500 grayscale group-hover:scale-105 group-hover:grayscale-0"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
              <Icon className="h-16 w-16 text-primary/40" />
            </div>
          )}
          
          {/* Featured badge */}
          {resource.is_featured && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
              {t("resources.featured", "Destacado")}
            </Badge>
          )}
          
          {/* Type badge */}
          <Badge className={`absolute top-3 right-3 ${typeColors[resource.type] || "bg-muted"}`}>
            <Icon className="h-3 w-3 mr-1" />
            {t(`resources.types.${resource.type}`, resource.type)}
          </Badge>
        </div>

        <CardContent className="p-5">
          {/* Category */}
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            {t(`resources.categories.${resource.category}`, resource.category)}
          </p>

          {/* Title */}
          <h3 className="font-display font-normal text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {resource.title}
          </h3>

          {/* Description */}
          {resource.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {resource.description}
            </p>
          )}

          {/* Stats & CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {resource.published_at && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(resource.published_at), "d MMM yyyy", { locale: dateLocale })}
                </span>
              )}
              {resource.download_count && resource.download_count > 0 && (
                <span>• {resource.download_count} {t("resources.downloads", "descargas")}</span>
              )}
            </div>
            
            <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              {t("resources.viewMore", "Ver más")}
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};
