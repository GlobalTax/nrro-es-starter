import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ArrowRight, Briefcase, Scale, Calculator, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface BentoServiceCard {
  title: string;
  description: string;
  category: string;
  features: string[];
  slug?: string;
  size?: 'large' | 'medium' | 'small';
}

interface BentoServicesGridProps {
  services?: BentoServiceCard[];
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'fiscal':
      return Calculator;
    case 'legal':
      return Scale;
    case 'laboral':
      return Users;
    default:
      return Briefcase;
  }
};

const getCategoryGradient = (category: string) => {
  switch (category.toLowerCase()) {
    case 'fiscal':
      return 'from-accent/10 to-accent/5';
    case 'legal':
      return 'from-primary/10 to-primary/5';
    case 'laboral':
      return 'from-muted to-muted/50';
    default:
      return 'from-secondary to-secondary/50';
  }
};

export const BentoServicesGrid = ({ services }: BentoServicesGridProps) => {
  if (!services || services.length === 0) {
    return null;
  }

  // Assign sizes to services (first one large, rest medium/small)
  const servicesWithSize = services.map((service, index) => ({
    ...service,
    size: index === 0 ? 'large' : index < 3 ? 'medium' : 'small'
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
      {servicesWithSize.map((service, index) => {
        const Icon = getCategoryIcon(service.category);
        const gradient = getCategoryGradient(service.category);
        const isLarge = service.size === 'large';

        const cardContent = (
          <Card className={cn(
            "h-full p-6 md:p-8 border-border hover:border-accent transition-all duration-300",
            "hover:shadow-medium hover:-translate-y-1",
            "bg-gradient-to-br",
            gradient
          )}>
            <div className="flex flex-col h-full">
              {/* Icon & Category */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-background/50 group-hover:bg-accent/10 transition-colors">
                  <Icon className="w-5 h-5 text-accent group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  {service.category}
                </span>
              </div>

              {/* Title */}
              <h3 className={cn(
                "font-normal mb-3 group-hover:text-accent transition-colors",
                isLarge ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
              )}>
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground mb-4 leading-relaxed flex-grow">
                {service.description}
              </p>

              {/* Features (only for large card) */}
              {isLarge && service.features && service.features.length > 0 && (
                <ul className="space-y-2 mb-6">
                  {service.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-foreground/80">
                      <span className="text-accent mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* CTA */}
              {service.slug && (
                <div className="flex items-center gap-2 text-accent font-medium text-sm mt-auto">
                  <span>Ver más</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </div>
          </Card>
        );

        return service.slug ? (
          <Link
            key={index}
            to={`/servicios/${service.slug}`}
            className={cn(
              "group",
              isLarge && "md:col-span-2 md:row-span-2"
            )}
          >
            {cardContent}
          </Link>
        ) : (
          <div
            key={index}
            className={cn(
              "group",
              isLarge && "md:col-span-2 md:row-span-2"
            )}
          >
            {cardContent}
          </div>
        );
      })}
    </div>
  );
};
