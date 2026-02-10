import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Loader2, Phone, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Meta } from "@/components/seo/Meta";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { ServiceSchema } from "@/components/seo/ServiceSchema";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useScrollDepth } from "@/hooks/useScrollDepth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { services as mockServices } from "@/data/mockData";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ServiceContactForm } from "@/components/services/ServiceContactForm";
import { StatCard } from "@/components/ui/stat-card";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import { mainBreadcrumbs, createDynamicBreadcrumb } from "@/lib/seoUtils";
import { RelatedServices } from "@/components/services/RelatedServices";

const ServiceDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { trackPageView, trackContactClick } = useAnalytics();
  useScrollDepth();
  const { language, t } = useLanguage();
  const { getServicePath } = useLocalizedPath();

  // Fetch from database
  const { data: dbService, isLoading } = useQuery({
    queryKey: ['service', slug, language],
    queryFn: async () => {
      if (!slug) return null;
      const supabaseAny = supabase as any;
      const response = await supabaseAny
        .from('services')
        .select('*')
        .or(`slug_es.eq.${slug},slug_ca.eq.${slug},slug_en.eq.${slug}`)
        .eq('is_active', true)
        .single();
      
      if (response.error) throw response.error;
      
      // Map localized fields with fallback to Spanish
      const data = response.data;
      return {
        ...data,
        name: data[`name_${language}`] || data.name_es,
        slug: data[`slug_${language}`] || data.slug_es,
        description: data[`description_${language}`] || data.description_es,
        features: data[`features_${language}`] || data.features_es || [],
        typical_clients: data[`typical_clients_${language}`] || data.typical_clients_es || [],
        benefits: data[`benefits_${language}`] || data.benefits_es,
        meta_title: data[`meta_title_${language}`] || data.meta_title_es,
        meta_description: data[`meta_description_${language}`] || data.meta_description_es,
        metodologia: data[`metodologia_${language}`] || data.metodologia_es || data.metodologia,
        servicios_transversales: data[`servicios_transversales_${language}`] || data.servicios_transversales_es || data.servicios_transversales,
        stats: data[`stats_${language}`] || data.stats_es || data.stats,
      };
    },
    enabled: !!slug,
  });
  
  // Fallback to mock data
  const mockService = mockServices.find(s => s.slug === slug);
  const service: any = dbService || mockService;
  
  // Breadcrumb items
  const breadcrumbItems = service 
    ? createDynamicBreadcrumb(mainBreadcrumbs.services, service.name)
    : mainBreadcrumbs.services;
  
  // Normalize URL to correct language path
  useEffect(() => {
    if (dbService) {
      const correctPath = getServicePath(
        dbService.slug_es,
        dbService.slug_ca,
        dbService.slug_en
      );
      
      const currentPath = window.location.pathname;
      
      if (currentPath !== correctPath) {
        navigate(correctPath, { replace: true });
      }
    }
  }, [dbService, language, navigate, getServicePath]);

  // Track page view when service is loaded
  useEffect(() => {
    if (service) {
      trackPageView("servicio_detalle");
    }
  }, [service, slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center text-white">
          <h1 className="mb-4 text-4xl">{t('services.notFound.title')}</h1>
          <Button asChild variant="outline" className="text-white border-white hover:bg-white hover:text-black">
            <Link to="/servicios">{t('services.notFound.backLink')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Generate dynamic OG image URL
  const ogImageUrl = service 
    ? `https://zntotcpagkunvkwpubqu.supabase.co/functions/v1/generate-og-image?type=service&title=${encodeURIComponent(service.name)}&description=${encodeURIComponent(service.description.substring(0, 150))}`
    : "https://nrro.es/og-image.png";

  return (
    <>
      <Meta 
        title={service.meta_title || service.name}
        description={service.meta_description || service.description}
        ogImage={ogImageUrl}
        canonicalUrl={`${window.location.origin}/servicios/${service.slug}`}
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <ServiceSchema
        name={service.name}
        description={service.description}
        serviceUrl={`https://navarrotax.legal/servicios/${service.slug}`}
        serviceType={service.area_es || service.area}
      />

      {/* Hero Section - Black background, centered text */}
      <section 
        data-dark="true"
        className="relative w-full flex items-center justify-center"
        style={{
          backgroundColor: '#000000',
          minHeight: '759px',
          height: 'auto'
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          {/* Overline */}
          <div className="service-hero-overline mb-6">
            {t('nav.services')}
          </div>
          
          {/* Title */}
          <h1 className="service-hero-title mb-8 max-w-5xl mx-auto">
            {service.name}
          </h1>
          
          {/* Subtitle */}
          <div className="service-hero-subtitle max-w-3xl mx-auto prose prose-invert prose-lg">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {service.description}
            </ReactMarkdown>
          </div>
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <div className="bg-muted/30 border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">{t('breadcrumb.home')}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/servicios">{t('nav.services')}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{service?.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Cómo Trabajamos Section - 3 columns */}
      {service.metodologia && (
        <section className="bg-white py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              
              {/* Columna 1: Overline con línea */}
              <div className="relative">
                <h3 className="font-mono font-light text-sm md:text-base tracking-tight text-foreground/70 pb-3">
                  {service.metodologia.overline}
                </h3>
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-border"></div>
              </div>
              
              {/* Columna 2: Títulos */}
              <div>
                {service.metodologia.titulos.map((titulo: string, idx: number) => (
                  <h2 key={idx} className="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight">
                    {titulo}
                  </h2>
                ))}
              </div>
              
              {/* Columna 3: Contenido */}
              <div className="space-y-6">
                <div className="text-lg font-medium text-foreground leading-relaxed prose prose-base max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {service.metodologia.introduccion}
                  </ReactMarkdown>
                </div>
                
                {service.metodologia.pilares.map((pilar: any) => (
                  <div key={pilar.numero}>
                    <p className="text-lg font-semibold text-foreground mb-2">
                      {pilar.titulo}
                    </p>
                    <div className="space-y-2">
                      {pilar.puntos.map((punto: string, idx: number) => (
                        <div key={idx} className="text-body leading-relaxed whitespace-pre-wrap">
                          — {punto}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {service.metodologia.contacto && (
                  <div className="pt-4 space-y-2">
                    <a 
                      href={`tel:${service.metodologia.contacto.telefono}`}
                      onClick={() => trackContactClick('phone', service.metodologia.contacto.telefono, `service_detail_${service.slug}`)}
                      className="flex items-center gap-2 text-foreground hover:text-accent transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      {service.metodologia.contacto.telefono}
                    </a>
                    <a 
                      href={`mailto:${service.metodologia.contacto.email}`}
                      onClick={() => trackContactClick('email', service.metodologia.contacto.email, `service_detail_${service.slug}`)}
                      className="flex items-center gap-2 text-foreground hover:text-accent transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      {service.metodologia.contacto.email}
                    </a>
                  </div>
                )}
              </div>
              
            </div>
          </div>
        </section>
      )}

      {/* Servicios Transversales Section - 2 columns layout */}
      {service.servicios_transversales && service.servicios_transversales.length > 0 && (
        <section className="bg-white py-16 md:py-24 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              
              {/* Columna 1: Overline con línea */}
              <div className="relative">
                <h3 className="font-mono font-light text-sm md:text-base tracking-tight text-foreground/70 pb-3">
                  {t('services.crossServices')}
                </h3>
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-border"></div>
              </div>
              
              {/* Columna 2 y 3: Título + Accordion en 2 columnas */}
              <div className="md:col-span-2 space-y-6">
                <h2 className="text-[48px] leading-[52.8px] font-normal tracking-normal text-black">
                  {t('services.whatElse')}
                </h2>
                
                {/* Accordion vertical - todos los items uno debajo del otro */}
                <Accordion type="single" collapsible className="w-full">
                  {service.servicios_transversales.map((item: any, idx: number) => (
                    <AccordionItem key={idx} value={`item-${idx}`}>
                      <AccordionTrigger className="text-[24px] leading-[31.2px] font-normal tracking-normal text-black hover:no-underline">
                        {item.titulo}
                      </AccordionTrigger>
                      <AccordionContent className="text-base pt-2 text-foreground/80 leading-relaxed prose max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {item.contenido}
                        </ReactMarkdown>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
              
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      {service.stats && service.stats.length > 0 && (
        <section className="bg-neutral-50 py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-mono font-light text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-12 text-center">
              {t('services.keyData')}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.stats.map((stat: any, index: number) => (
                <StatCard
                  key={index}
                  label={stat.label}
                  value={stat.value}
                  description={stat.description}
                  delay={index * 100}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Services */}
      {service.id && (
        <RelatedServices 
          currentServiceId={service.id} 
          category={service.category}
        />
      )}

      {/* Contact Form */}
      <section className="bg-muted py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <h2 className="text-4xl font-normal text-center mb-4">
            {t('services.letsChat')}
          </h2>
          <p className="service-body text-center mb-12 text-muted-foreground">
            {t('services.contactSubtitle')}
          </p>
          
          <ServiceContactForm serviceName={service.name} />
        </div>
      </section>

    </>
  );
};

export default ServiceDetail;
