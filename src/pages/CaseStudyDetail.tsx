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
import DOMPurify from 'dompurify';

export default function CaseStudyDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: caseStudy, isLoading } = useQuery({
    queryKey: ['case-study', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .eq('slug_es', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      
      // Increment view count
      await supabase.rpc('increment_case_study_view_count', {
        case_study_id: data.id
      });

      return {
        ...data,
        title: data.title_es,
        slug: data.slug_es,
        hero_title: data.hero_title_es,
        hero_subtitle: data.hero_subtitle_es,
        challenge: data.challenge_es,
        solution: data.solution_es,
        results_summary: data.results_summary_es,
        detailed_content: data.detailed_content_es,
        testimonial_text: data.testimonial_text_es,
        meta_title: data.meta_title_es,
        meta_description: data.meta_description_es,
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
          <h1 className="text-3xl font-normal mb-4">Caso de estudio no encontrado</h1>
          <Link to="/casos-de-exito">
            <Button variant="outline">Volver</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Meta
        title={caseStudy.meta_title || `${caseStudy.hero_title} - Casos de Éxito`}
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
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-48">
          <div className="max-w-4xl">
            <Link to="/casos-de-exito">
              <Button variant="ghost" size="sm" className="mb-8 text-white hover:text-white hover:bg-white/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Casos de Éxito
              </Button>
            </Link>

            {caseStudy.client_logo_url && (
              <img
                src={caseStudy.client_logo_url}
                alt={caseStudy.client_name || 'Cliente'}
                className="h-12 mb-8 brightness-0 invert"
              />
            )}

            <div className="flex flex-wrap gap-2 mb-6">
              {caseStudy.industry && (
                <Badge variant="secondary" className="bg-white/20 text-white border-white/20">
                  {caseStudy.industry}
                </Badge>
              )}
              {caseStudy.service_type && (
                <Badge variant="secondary" className="bg-white/20 text-white border-white/20">
                  {caseStudy.service_type}
                </Badge>
              )}
              {caseStudy.tags?.map((tag: string) => (
                <Badge key={tag} variant="outline" className="border-white/20 text-white">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal mb-6 leading-tight">
              {caseStudy.hero_title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl">
              {caseStudy.hero_subtitle}
            </p>

            <div className="flex flex-wrap gap-6 mt-8 text-sm">
              {caseStudy.client_name && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-white/60" />
                  <span>{caseStudy.client_name}</span>
                </div>
              )}
              {caseStudy.duration && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-white/60" />
                  <span>{caseStudy.duration}</span>
                </div>
              )}
              {caseStudy.team_size && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-white/60" />
                  <span>{caseStudy.team_size} personas</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      {caseStudy.challenge && (
        <section className="bg-background py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-normal text-center mb-4">
              El Desafío
            </h2>
            <div 
              className="prose prose-lg max-w-4xl mx-auto"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(caseStudy.challenge) }}
            />
          </div>
        </section>
      )}

      {/* Solution Section */}
      {caseStudy.solution && (
        <section className="bg-white py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-normal text-center mb-4">
              Nuestra Solución
            </h2>
            <div 
              className="prose prose-lg max-w-4xl mx-auto"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(caseStudy.solution) }}
            />
          </div>
        </section>
      )}

      {/* Metrics Section */}
      {caseStudy.metrics && caseStudy.metrics.length > 0 && (
        <section className="bg-neutral-50 py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-normal text-center mb-12">
              Resultados Clave
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {caseStudy.metrics.map((metric: any, index: number) => (
                <CaseStudyMetricCard key={index} metric={metric} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonial Section */}
      {caseStudy.testimonial_text && (
        <section className="bg-background py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-normal text-center mb-4">
              Testimonio del Cliente
            </h2>
            <p className="text-body text-center mb-12 max-w-2xl mx-auto">
              Lo que dicen sobre nosotros
            </p>
            <CaseStudyTestimonial
              text={caseStudy.testimonial_text}
              authorName={caseStudy.testimonial_author || ''}
              authorPosition={caseStudy.testimonial_position || ''}
              authorImage={caseStudy.testimonial_author_image}
            />
          </div>
        </section>
      )}

      {/* Detailed Content */}
      {caseStudy.detailed_content && (
        <section className="bg-white py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div 
              className="prose prose-lg max-w-4xl mx-auto"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(caseStudy.detailed_content) }}
            />
          </div>
        </section>
      )}

      {/* Gallery */}
      {caseStudy.gallery && caseStudy.gallery.length > 0 && (
        <section className="bg-neutral-50 py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <CaseStudyGallery images={caseStudy.gallery} />
          </div>
        </section>
      )}

      {/* Timeline */}
      {caseStudy.timeline && caseStudy.timeline.length > 0 && (
        <section className="bg-white py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-normal text-center mb-12">
              Cronología del Proyecto
            </h2>
            <CaseStudyTimeline events={caseStudy.timeline} />
          </div>
        </section>
      )}

      {/* Related Services */}
      {caseStudy.related_services && caseStudy.related_services.length > 0 && (
        <section className="bg-neutral-50 py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-normal mb-4">
              Servicios Relacionados
            </h2>
            <RelatedServices serviceIds={caseStudy.related_services} />
          </div>
        </section>
      )}

      {/* Related Cases */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-normal mb-4">
            Otros Casos de Éxito
          </h2>
          {/* TODO: Add related cases carousel */}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-neutral-50 py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-normal mb-4">
              ¿Tienes un Proyecto Similar?
            </h2>
            <p className="text-body mb-8">
              Contacta con nosotros y descubre cómo podemos ayudarte
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/contacto">
                  Contactar
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/servicios">
                  Ver Servicios
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
