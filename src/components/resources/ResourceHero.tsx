import { Badge } from "@/components/ui/badge";
import { Clock, Download, FileText, Video, BookOpen, FileSpreadsheet } from "lucide-react";
import { Resource } from "@/hooks/useResources";
import { useLanguage } from "@/contexts/LanguageContext";

interface ResourceHeroProps {
  resource: Resource;
}

const typeIcons: Record<string, React.ElementType> = {
  country_guide: BookOpen,
  template: FileSpreadsheet,
  webinar: Video,
  white_paper: FileText,
};

const typeLabels: Record<string, Record<string, string>> = {
  country_guide: { es: "Guía de país", en: "Country Guide", ca: "Guia de país" },
  template: { es: "Plantilla", en: "Template", ca: "Plantilla" },
  webinar: { es: "Webinar", en: "Webinar", ca: "Webinar" },
  white_paper: { es: "White Paper", en: "White Paper", ca: "White Paper" },
};

const categoryLabels: Record<string, Record<string, string>> = {
  accounting: { es: "Contabilidad", en: "Accounting", ca: "Comptabilitat" },
  corporate_legal: { es: "Legal Corporativo", en: "Corporate Legal", ca: "Legal Corporatiu" },
  governance: { es: "Gobierno Corporativo", en: "Governance", ca: "Govern Corporatiu" },
  payroll: { es: "Nóminas", en: "Payroll", ca: "Nòmines" },
  tax: { es: "Fiscal", en: "Tax", ca: "Fiscal" },
  transfer_pricing: { es: "Precios de Transferencia", en: "Transfer Pricing", ca: "Preus de Transferència" },
  treasury: { es: "Tesorería", en: "Treasury", ca: "Tresoreria" },
};

export const ResourceHero = ({ resource }: ResourceHeroProps) => {
  const { language } = useLanguage();
  const Icon = typeIcons[resource.type] || FileText;
  const typeLabel = typeLabels[resource.type]?.[language] || resource.type;
  const categoryLabel = resource.category 
    ? categoryLabels[resource.category]?.[language] || resource.category 
    : null;

  return (
    <section className="bg-gradient-to-br from-muted/50 to-background border-b border-border">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="secondary" className="flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5" />
              {typeLabel}
            </Badge>
            {categoryLabel && (
              <Badge variant="outline">{categoryLabel}</Badge>
            )}
            {resource.is_featured && (
              <Badge className="bg-primary text-primary-foreground">
                {language === "en" ? "Featured" : language === "ca" ? "Destacat" : "Destacado"}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-normal text-foreground mb-6">
            {resource.title}
          </h1>

          {/* Description */}
          {resource.description && (
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              {resource.description}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Icon className="h-4 w-4" />
              <span>{typeLabel}</span>
            </div>
            {(resource as any).read_time && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{(resource as any).read_time} min</span>
              </div>
            )}
            {resource.download_count && resource.download_count > 0 && (
              <div className="flex items-center gap-1.5">
                <Download className="h-4 w-4" />
                <span>
                  {resource.download_count} {language === "en" ? "downloads" : language === "ca" ? "descàrregues" : "descargas"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
