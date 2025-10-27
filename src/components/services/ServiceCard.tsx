import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  service: {
    id: string;
    name: string;
    slug: string;
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

export const ServiceCard = ({ service, variant = 'grid' }: ServiceCardProps) => {
  // Get the icon dynamically from lucide-react
  const IconComponent = (LucideIcons as any)[service.icon_name] || LucideIcons.FileText;

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
              <Link to={`/servicios/${service.slug}`}>
                <Button variant="outline" size="sm">
                  Más información
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
    <Card className="group relative overflow-hidden hover-lift hover:shadow-2xl transition-all duration-300">
      <div className="aspect-square bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-8">
        <IconComponent className="h-20 w-20 text-primary group-hover:scale-110 transition-transform" strokeWidth={1.5} />
      </div>

      <div className="p-6 space-y-4">
        <div>
          <Badge className={cn("mb-3", getAreaColor(service.area))}>{service.area}</Badge>
          <h3 className="text-xl font-medium mb-2 group-hover:text-primary transition-colors">
            {service.name}
          </h3>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3">
          {service.description}
        </p>

        {service.features && service.features.length > 0 && (
          <ul className="text-xs text-muted-foreground space-y-1">
            {service.features.slice(0, 3).map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary" />
                {feature}
              </li>
            ))}
          </ul>
        )}

        <Link
          to={`/servicios/${service.slug}`}
          className="text-sm font-medium text-primary hover:text-primary/80 transition-smooth inline-block pt-2"
        >
          Más información →
        </Link>
      </div>
    </Card>
  );
};
