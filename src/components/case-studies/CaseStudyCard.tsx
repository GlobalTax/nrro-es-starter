import { Link } from 'react-router-dom';
import { CaseStudy } from '@/types/caseStudy';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  variant?: 'grid' | 'list';
}

export const CaseStudyCard = ({ caseStudy, variant = 'grid' }: CaseStudyCardProps) => {
  const { getCaseStudyPath } = useLocalizedPath();
  const caseStudyPath = getCaseStudyPath(
    (caseStudy as any).slug_es,
    (caseStudy as any).slug_ca,
    (caseStudy as any).slug_en
  );
  
  if (variant === 'list') {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
        <Link to={caseStudyPath} className="flex flex-col md:flex-row">
          {caseStudy.hero_image_url && (
            <div className="md:w-1/3 h-64 md:h-auto relative overflow-hidden">
              <img
                src={caseStudy.hero_image_url}
                alt={caseStudy.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
            <div>
              {caseStudy.client_logo_url && (
                <img
                  src={caseStudy.client_logo_url}
                  alt={caseStudy.client_name}
                  className="h-8 mb-4 object-contain"
                />
              )}
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary">{caseStudy.client_industry}</Badge>
                {caseStudy.primary_service && (
                  <Badge variant="outline">{caseStudy.primary_service}</Badge>
                )}
              </div>
              <h3 className="text-2xl font-normal mb-3 leading-tight">
                {caseStudy.hero_title}
              </h3>
              {caseStudy.hero_subtitle && (
                <p className="text-base text-foreground/70 leading-relaxed mb-4">
                  {caseStudy.hero_subtitle}
                </p>
              )}
              {caseStudy.metrics && caseStudy.metrics.length > 0 && (
                <div className="flex flex-wrap gap-4 mb-4">
                  {caseStudy.metrics.slice(0, 3).map((metric, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-semibold text-accent">{metric.value}</div>
                      <div className="text-foreground/60">{metric.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-accent hover:text-accent-hover transition-colors">
              <span>Ver caso de éxito</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <Link to={caseStudyPath}>
        {caseStudy.hero_image_url && (
          <div className="aspect-[16/9] relative overflow-hidden bg-muted">
            <img
              src={caseStudy.hero_image_url}
              alt={caseStudy.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-6">
          {caseStudy.client_logo_url && (
            <img
              src={caseStudy.client_logo_url}
              alt={caseStudy.client_name}
              className="h-8 mb-4 object-contain"
            />
          )}
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary">{caseStudy.client_industry}</Badge>
            {caseStudy.primary_service && (
              <Badge variant="outline" className="text-xs">{caseStudy.primary_service}</Badge>
            )}
          </div>
          <h3 className="text-xl font-normal mb-2 leading-tight line-clamp-2">
            {caseStudy.hero_title}
          </h3>
          {caseStudy.hero_subtitle && (
            <p className="text-sm text-foreground/70 leading-relaxed mb-4 line-clamp-2">
              {caseStudy.hero_subtitle}
            </p>
          )}
          {caseStudy.metrics && caseStudy.metrics.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-4 pt-4 border-t border-border">
              {caseStudy.metrics.slice(0, 3).map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="font-semibold text-accent text-sm">{metric.value}</div>
                  <div className="text-xs text-foreground/60 line-clamp-1">{metric.label}</div>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-accent group-hover:text-accent-hover transition-colors">
            <span>Leer más</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </Card>
  );
};
