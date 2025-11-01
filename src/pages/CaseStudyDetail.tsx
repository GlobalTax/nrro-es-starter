import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Meta } from '@/components/seo/Meta';
import { CaseStudy } from '@/types/caseStudy';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CaseStudyMetricCard } from '@/components/case-studies/CaseStudyMetricCard';
import { CaseStudyTestimonial } from '@/components/case-studies/CaseStudyTestimonial';
import { CaseStudyTimeline } from '@/components/case-studies/CaseStudyTimeline';
import { CaseStudyGallery } from '@/components/case-studies/CaseStudyGallery';
import { RelatedServices } from '@/components/case-studies/RelatedServices';
import { ArrowLeft, Calendar, Building2, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function CaseStudyDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: caseStudy, isLoading } = useQuery({
    queryKey: ['case-study', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      
      // Increment view count
      await supabase.rpc('increment_case_study_view_count', {
        case_study_id: data.id
      });

      return {
        ...data,
        metrics: (data.metrics as any) || [],
        timeline: (data.timeline as any) || [],
        gallery: (data.gallery as any) || [],
        related_services: (data.related_services as any) || [],
        tags: (data.tags as any) || [],
      } as CaseStudy;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Skeleton className="w-full h-96" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!caseStudy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-normal mb-4">Caso de éxito no encontrado</h1>
          <Link to="/casos-de-exito">
            <Button variant="outline">Volver a casos de éxito</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Meta
        title={caseStudy.meta_title || `${caseStudy.hero_title} - Caso de Éxito`}
        description={caseStudy.meta_description || caseStudy.hero_subtitle || caseStudy.results_summary}
      />

      {/* Hero Section */}
      <section className="relative bg-black text-white">
        {caseStudy.hero_image_url && (
          <div className="absolute inset-0 opacity-30">
            <img
              src={caseStudy.hero_image_url}
              alt={caseStudy.hero_title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <Link to="/casos-de-exito">
            <Button variant="outline" size="sm" className="mb-8 border-white/20 bg-white/10 text-white hover:bg-white/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a casos de éxito
            </Button>
          </Link>
          
          {caseStudy.client_logo_url && (
            <img
              src={caseStudy.client_logo_url}
              alt={caseStudy.client_name}
              className="h-16 mb-6 object-contain"
            />
          )}
          
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge className="bg-white/20 text-white border-white/30">{caseStudy.client_industry}</Badge>
            {caseStudy.primary_service && (
              <Badge variant="outline" className="border-white/30 text-white">{caseStudy.primary_service}</Badge>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-normal leading-tight mb-6 max-w-4xl">
            {caseStudy.hero_title}
          </h1>
          
          {caseStudy.hero_subtitle && (
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-3xl mb-8">
              {caseStudy.hero_subtitle}
            </p>
          )}

          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-white/60" />
              <span className="text-white/80">{caseStudy.client_name}</span>
            </div>
            {caseStudy.client_size && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-white/60" />
                <span className="text-white/80">{caseStudy.client_size}</span>
              </div>
            )}
            {caseStudy.project_duration && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-white/60" />
                <span className="text-white/80">{caseStudy.project_duration}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Executive Summary */}
      <section className="bg-white py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div>
              <h3 className="font-mono font-light text-sm md:text-base tracking-tight text-foreground/70 mb-4">
                EL DESAFÍO
              </h3>
              <p className="text-base text-foreground/70 leading-relaxed">
                {caseStudy.challenge}
              </p>
            </div>
            <div>
              <h3 className="font-mono font-light text-sm md:text-base tracking-tight text-foreground/70 mb-4">
                LA SOLUCIÓN
              </h3>
              <p className="text-base text-foreground/70 leading-relaxed">
                {caseStudy.solution}
              </p>
            </div>
            <div>
              <h3 className="font-mono font-light text-sm md:text-base tracking-tight text-foreground/70 mb-4">
                LOS RESULTADOS
              </h3>
              <p className="text-base text-foreground/70 leading-relaxed">
                {caseStudy.results_summary}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      {caseStudy.metrics && caseStudy.metrics.length > 0 && (
        <section className="bg-neutral-50 py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-normal leading-tight mb-4">
                Resultados medibles
              </h2>
              <p className="text-base text-foreground/70 leading-relaxed max-w-2xl mx-auto">
                Los números que demuestran el impacto real de nuestro trabajo
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {caseStudy.metrics.map((metric, index) => (
                <CaseStudyMetricCard key={index} metric={metric} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Detailed Content */}
      {caseStudy.detailed_content && (
        <section className="bg-white py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto prose prose-base">
              <div dangerouslySetInnerHTML={{ __html: caseStudy.detailed_content }} />
            </div>
          </div>
        </section>
      )}

      {/* Timeline */}
      {caseStudy.timeline && caseStudy.timeline.length > 0 && (
        <section className="bg-neutral-50 py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-normal leading-tight mb-12 text-center">
                Línea de tiempo del proyecto
              </h2>
              <CaseStudyTimeline timeline={caseStudy.timeline} />
            </div>
          </div>
        </section>
      )}

      {/* Testimonial */}
      {caseStudy.testimonial_text && caseStudy.testimonial_author && (
        <section className="bg-white py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <CaseStudyTestimonial
              text={caseStudy.testimonial_text}
              author={caseStudy.testimonial_author}
              position={caseStudy.testimonial_position || ''}
              avatarUrl={caseStudy.testimonial_avatar_url}
            />
          </div>
        </section>
      )}

      {/* Gallery */}
      {caseStudy.gallery && caseStudy.gallery.length > 0 && (
        <section className="bg-neutral-50 py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-normal leading-tight mb-12 text-center">
              Galería del proyecto
            </h2>
            <CaseStudyGallery gallery={caseStudy.gallery} />
          </div>
        </section>
      )}

      {/* Related Services */}
      {caseStudy.related_services && caseStudy.related_services.length > 0 && (
        <section className="bg-white py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-normal leading-tight mb-12 text-center">
              Servicios relacionados
            </h2>
            <RelatedServices serviceIds={caseStudy.related_services} />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-black text-white py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal leading-tight mb-6">
            ¿Listo para escribir tu propia historia de éxito?
          </h2>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto mb-8">
            Descubre cómo podemos ayudarte a alcanzar tus objetivos empresariales
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contacto">
              <Button variant="secondary" size="lg">
                Contactar con nosotros
              </Button>
            </Link>
            <Link to="/casos-de-exito">
              <Button variant="outline" size="lg" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                Ver más casos de éxito
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
