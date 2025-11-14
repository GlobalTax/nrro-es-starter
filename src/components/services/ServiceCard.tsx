import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import * as LucideIcons from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';

interface ServiceCardProps {
  service: {
    id: string;
    name: string;
    slug: string;
    slug_es?: string;
    slug_ca?: string;
    slug_en?: string;
    description: string;
    icon_name: string;
    area: string;
    features?: string[];
  };
  variant?: 'grid' | 'list';
}

const getAreaColor = (area: string) => {
  const colors: Record<string, string> = {
    'Fiscal': 'bg-blue-100 text-blue-800 border-blue-300',
    'Contable': 'bg-green-100 text-green-800 border-green-300',
    'Legal': 'bg-purple-100 text-purple-800 border-purple-300',
    'Laboral': 'bg-orange-100 text-orange-800 border-orange-300',
  };
  return colors[area] || 'bg-gray-100 text-gray-800 border-gray-300';
};

export const ServiceCard = memo(({ service, variant = 'grid' }: ServiceCardProps) => {
  const { t } = useLanguage();
  const { getServicePath } = useLocalizedPath();
  
  // Get the icon dynamically from lucide-react
  const IconComponent = (LucideIcons as any)[service.icon_name] || LucideIcons.FileText;
  
  // Generate localized path
  const servicePath = getServicePath(service.slug_es, service.slug_ca, service.slug_en);

  if (variant === 'list') {
    return (
      <Card className="p-6 hover:shadow-lg transition-smooth">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <IconComponent className="h-8 w-8 text-primary" strokeWidth={1.5} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-medium mb-2">{service.name}</h3>
                <Badge className={getAreaColor(service.area)}>{service.area}</Badge>
              </div>
              <Link to={servicePath}>
                <Button variant="outline" size="sm">
                  {t('services.card.moreInfo')}
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {service.description}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group hover-lift border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-strong">
      <div className="p-6">
        {/* Icon Container */}
        <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
          <IconComponent className="h-6 w-6 text-accent" strokeWidth={1.5} />
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-display font-normal text-foreground mb-3 group-hover:text-accent transition-colors">
          {service.name}
        </h3>
        
        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
          {service.description}
        </p>
        
        {/* Area Badge */}
        <div className="mb-4">
          <Badge variant="outline" className="text-xs">
            {service.area}
          </Badge>
        </div>
        
        {/* Link */}
        <Link
          to={servicePath}
          className="inline-flex items-center text-sm font-medium text-accent hover:text-accent-hover transition-colors"
        >
          {t('services.card.learnMore')} <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </Card>
  );
}, (prevProps, nextProps) => {
  // Only re-render if service id or variant changes
  return prevProps.service.id === nextProps.service.id && 
         prevProps.variant === nextProps.variant;
});
