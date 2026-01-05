import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CaseStudy } from '@/types/caseStudy';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Building2, Calendar, Users, TrendingUp } from 'lucide-react';

interface CaseStudyPreviewModalProps {
  open: boolean;
  onClose: () => void;
  caseStudy: CaseStudy | null;
}

export const CaseStudyPreviewModal = ({ open, onClose, caseStudy }: CaseStudyPreviewModalProps) => {
  if (!caseStudy) return null;

  const statusColors = {
    draft: 'bg-slate-500',
    review: 'bg-yellow-500',
    published: 'bg-green-500',
    archived: 'bg-gray-500',
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Vista Previa: {caseStudy.title}</DialogTitle>
            <Badge className={statusColors[caseStudy.status]}>
              {caseStudy.status}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="space-y-6 pr-4">
            {/* Hero Section */}
            {caseStudy.hero_image_url && (
              <div className="relative w-full h-64 rounded-lg overflow-hidden bg-muted">
                <img
                  src={caseStudy.hero_image_url}
                  alt={caseStudy.hero_title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Client Info */}
            <div className="flex items-start gap-4">
              {caseStudy.client_logo_url && (
                <img
                  src={caseStudy.client_logo_url}
                  alt={caseStudy.client_name}
                  className="h-16 w-16 object-contain rounded-lg border"
                />
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-medium">{caseStudy.hero_title}</h2>
                {caseStudy.hero_subtitle && (
                  <p className="text-muted-foreground mt-1">{caseStudy.hero_subtitle}</p>
                )}
              </div>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{caseStudy.client_name}</div>
                  <div className="text-muted-foreground">{caseStudy.client_industry}</div>
                </div>
              </div>
              {caseStudy.client_size && (
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Tamaño</div>
                    <div className="text-muted-foreground">{caseStudy.client_size}</div>
                  </div>
                </div>
              )}
              {caseStudy.project_duration && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Duración</div>
                    <div className="text-muted-foreground">{caseStudy.project_duration}</div>
                  </div>
                </div>
              )}
              {caseStudy.primary_service && (
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Servicio</div>
                    <div className="text-muted-foreground">{caseStudy.primary_service}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Tags */}
            {caseStudy.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {caseStudy.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Content Sections */}
            <div className="space-y-6 border-t pt-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Desafío</h3>
                <p className="text-muted-foreground">{caseStudy.challenge}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Solución</h3>
                <p className="text-muted-foreground">{caseStudy.solution}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Resultados</h3>
                <p className="text-muted-foreground">{caseStudy.results_summary}</p>
              </div>
            </div>

            {/* Metrics */}
            {caseStudy.metrics.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Métricas Clave</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {caseStudy.metrics.map((metric, index) => (
                    <div key={index} className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">{metric.value}</div>
                      <div className="text-sm font-medium mt-1">{metric.label}</div>
                      {metric.description && (
                        <div className="text-xs text-muted-foreground mt-1">{metric.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            {caseStudy.timeline.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Timeline</h3>
                <div className="space-y-4">
                  {caseStudy.timeline.map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-24 text-sm font-medium text-muted-foreground">
                        {event.date}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-muted-foreground mt-1">{event.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Testimonial */}
            {caseStudy.testimonial_text && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Testimonio</h3>
                <div className="bg-muted p-6 rounded-lg">
                  <p className="text-lg italic mb-4">"{caseStudy.testimonial_text}"</p>
                  <div className="flex items-center gap-3">
                    {caseStudy.testimonial_avatar_url && (
                      <img
                        src={caseStudy.testimonial_avatar_url}
                        alt={caseStudy.testimonial_author || ''}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <div className="font-medium">{caseStudy.testimonial_author}</div>
                      <div className="text-sm text-muted-foreground">{caseStudy.testimonial_position}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Gallery */}
            {caseStudy.gallery.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Galería</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {caseStudy.gallery.map((image, index) => (
                    <div key={index} className="space-y-2">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      {image.caption && (
                        <p className="text-sm text-muted-foreground">{image.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Content */}
            {caseStudy.detailed_content && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Contenido Detallado</h3>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{caseStudy.detailed_content}</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
