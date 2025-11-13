import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Calculator, Scale, Users, TrendingUp } from "lucide-react";
import { LanguageLink } from "@/components/ui/language-link";
import * as LucideIcons from "lucide-react";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";

interface FeaturedServiceCardProps {
  title: string;
  description: string;
  category: string;
  features: string[];
  icon_name?: string;
  slug?: string;
  slug_es?: string;
  slug_ca?: string;
  slug_en?: string;
}

const defaultIcons: Record<string, any> = {
  "Asesoramiento Fiscal": Calculator,
  "Mercantil": Scale,
  "Laboral & Contabilidad": Users,
  "Operaciones M&A": TrendingUp,
};

export const FeaturedServiceCard = ({
  title,
  description,
  category,
  features,
  icon_name,
  slug,
  slug_es,
  slug_ca,
  slug_en
}: FeaturedServiceCardProps) => {
  const { getServicePath } = useLocalizedPath();
  
  // Resolver icono dinámicamente
  const IconComponent = icon_name 
    ? (LucideIcons as any)[icon_name] || Calculator
    : defaultIcons[title] || Calculator;
  
  // Generar path localizado
  const servicePath = getServicePath(slug_es, slug_ca, slug_en);

  const content = (
    <Card className="group p-8 lg:p-10 hover:shadow-lg hover:border-accent/50 transition-all duration-300 h-full flex flex-col">
      {/* Icono */}
      <div className="w-12 h-12 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300 flex items-center justify-center mb-6">
        <IconComponent className="h-6 w-6 text-accent" />
      </div>

      {/* Título */}
      <h3 className="text-3xl lg:text-4xl mb-4 group-hover:text-accent transition-colors duration-300">
        {title}
      </h3>

      {/* Category Badge */}
      <Badge variant="outline" className="w-fit mb-4 text-xs">
        {category}
      </Badge>

      {/* Descripción */}
      <p className="text-foreground/70 leading-relaxed mb-6">
        {description}
      </p>

      {/* Features */}
      <ul className="space-y-3 mt-auto">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
            <span className="text-sm text-foreground/80">{feature}</span>
          </li>
        ))}
      </ul>
    </Card>
  );

  if (slug_es || slug_ca || slug_en) {
    return (
      <LanguageLink to={servicePath} className="block h-full">
        {content}
      </LanguageLink>
    );
  }

  return content;
};
