import { Link } from 'react-router-dom';
import { Service } from '@/types/service';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import * as LucideIcons from 'lucide-react';

interface ServicePreviewModalProps {
  open: boolean;
  onClose: () => void;
  service: Service;
}

export const ServicePreviewModal = ({ open, onClose, service }: ServicePreviewModalProps) => {
  const Icon = LucideIcons[service.icon_name as keyof typeof LucideIcons];

  const getAreaColor = (area: string) => {
    const colors = {
      Fiscal: 'bg-blue-100 text-blue-800 border-blue-200',
      Contable: 'bg-green-100 text-green-800 border-green-200',
      Legal: 'bg-purple-100 text-purple-800 border-purple-200',
      Laboral: 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[area as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Service Preview: {service.name}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-120px)]">
          <div className="bg-background p-8 space-y-8">
            {/* Hero Section */}
            <div className="border-b pb-8">
              <div className="flex items-start gap-4 mb-4">
                {Icon && <Icon className="h-12 w-12 text-primary" />}
                <div className="flex-1">
                  <Badge variant="outline" className={`${getAreaColor(service.area)} mb-2`}>
                    {service.area}
                  </Badge>
                  <h1 className="text-4xl font-bold mb-2">{service.name}</h1>
                  <p className="text-lg text-muted-foreground">{service.description}</p>
                </div>
              </div>
            </div>

            {/* Features */}
            {service.features && service.features.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Features</h2>
                <ul className="list-disc list-inside space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="text-foreground">{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Typical Clients */}
            {service.typical_clients && service.typical_clients.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Typical Clients</h2>
                <ul className="list-disc list-inside space-y-2">
                  {service.typical_clients.map((client, idx) => (
                    <li key={idx} className="text-foreground">{client}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {service.benefits && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Benefits</h2>
                <p className="text-foreground whitespace-pre-wrap">{service.benefits}</p>
              </div>
            )}

            {/* Metodología */}
            {service.metodologia && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Metodología</h2>
                <div className="bg-muted p-6 rounded-lg space-y-4">
                  <p className="text-sm text-muted-foreground">{service.metodologia.overline}</p>
                  <div>
                    {service.metodologia.titulos.map((titulo, idx) => (
                      <h3 key={idx} className="text-xl font-semibold">{titulo}</h3>
                    ))}
                  </div>
                  <p>{service.metodologia.introduccion}</p>
                  {service.metodologia.pilares && service.metodologia.pilares.map((pilar, idx) => (
                    <div key={idx} className="mt-4">
                      <h4 className="font-semibold">{pilar.numero}. {pilar.titulo}</h4>
                      <ul className="list-disc list-inside ml-4 mt-2">
                        {pilar.puntos.map((punto, pIdx) => (
                          <li key={pIdx}>{punto}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            {service.stats && service.stats.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {service.stats.map((stat, idx) => (
                    <div key={idx} className="bg-muted p-4 rounded-lg">
                      <div className="text-3xl font-bold mb-1">{stat.value}</div>
                      <div className="text-sm font-medium mb-1">{stat.label}</div>
                      <div className="text-xs text-muted-foreground">{stat.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Meta Info */}
            <div className="border-t pt-4 text-sm text-muted-foreground">
              <p><strong>Status:</strong> {service.is_active ? 'Active' : 'Inactive'}</p>
              <p><strong>Display Order:</strong> {service.display_order}</p>
              <p><strong>Slug:</strong> {service.slug}</p>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          {service.is_active && (
            <Button asChild variant="outline">
              <Link to={`/servicios/${service.slug}`} target="_blank">
                View Live Page
              </Link>
            </Button>
          )}
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
