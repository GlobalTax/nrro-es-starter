import { useParams, Link } from "react-router-dom";
import { Loader2, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Meta } from "@/components/seo/Meta";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { services as mockServices } from "@/data/mockData";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ServiceContactForm } from "@/components/services/ServiceContactForm";

const ServiceDetail = () => {
  const { slug } = useParams();

  // Fetch from database
  const { data: dbService, isLoading } = useQuery({
    queryKey: ['service', slug],
    queryFn: async () => {
      if (!slug) return null;
      const supabaseAny = supabase as any;
      const response = await supabaseAny
        .from('services')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();
      
      if (response.error) throw response.error;
      return response.data;
    },
    enabled: !!slug,
  });

  // Fallback to mock data
  const mockService = mockServices.find(s => s.slug === slug);
  const service: any = dbService || mockService;

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
          <h1 className="mb-4 text-4xl">Servicio no encontrado</h1>
          <Button asChild variant="outline" className="text-white border-white hover:bg-white hover:text-black">
            <Link to="/servicios">Volver a Servicios</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Meta 
        title={service.name}
        description={service.description}
        canonicalUrl={`${window.location.origin}/servicios/${service.slug}`}
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
            SERVICIOS
          </div>
          
          {/* Title */}
          <h1 className="service-hero-title mb-8 max-w-5xl mx-auto">
            {service.name}
          </h1>
          
          {/* Subtitle */}
          <p className="service-hero-subtitle max-w-3xl mx-auto">
            {service.description}
          </p>
        </div>
      </section>

      {/* Cómo Trabajamos Section - 2 columns */}
      {service.metodologia && (
        <section className="bg-white py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
              
              {/* Columna Izquierda */}
              <div>
                <div className="section-overline mb-6">
                  {service.metodologia.overline}
                </div>
                
                <div className="space-y-2">
                  {service.metodologia.titulos.map((titulo: string, idx: number) => (
                    <h2 key={idx} className="metodologia-title">
                      {titulo}
                    </h2>
                  ))}
                </div>
                
                {service.metodologia.contacto && (
                  <div className="mt-12 space-y-4">
                    <a 
                      href={`tel:${service.metodologia.contacto.telefono}`}
                      className="flex items-center gap-3 text-lg hover:text-primary transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      {service.metodologia.contacto.telefono}
                    </a>
                    <a 
                      href={`mailto:${service.metodologia.contacto.email}`}
                      className="flex items-center gap-3 text-lg hover:text-primary transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      {service.metodologia.contacto.email}
                    </a>
                  </div>
                )}
              </div>
              
              {/* Columna Derecha */}
              <div>
                <p className="service-body text-lg mb-8">
                  {service.metodologia.introduccion}
                </p>
                
                <div className="space-y-8">
                  {service.metodologia.pilares.map((pilar: any) => (
                    <div key={pilar.numero}>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-semibold text-lg">
                          {pilar.numero}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-4">
                            {pilar.titulo}
                          </h3>
                          <ul className="space-y-2">
                            {pilar.puntos.map((punto: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-3">
                                <span className="text-foreground/60 mt-2">—</span>
                                <span className="service-body flex-1">{punto}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
            </div>
          </div>
        </section>
      )}

      {/* Servicios Transversales Accordion */}
      {service.servicios_transversales && service.servicios_transversales.length > 0 && (
        <section className="bg-white py-16 md:py-24 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="section-overline text-center mb-4">
              SERVICIOS PREMIUM
            </div>
            <h2 className="text-5xl font-normal text-center mb-12">
              Nuestros servicios transversales
            </h2>
            
            <Accordion type="single" collapsible className="w-full">
              {service.servicios_transversales.map((item: any, idx: number) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger className="text-xl hover:no-underline">
                    {item.titulo}
                  </AccordionTrigger>
                  <AccordionContent className="service-body text-base pt-2">
                    {item.contenido}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* Stats/Datos Grid */}
      {service.stats && service.stats.length > 0 && (
        <section className="bg-white py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="section-overline mb-12">DATOS</div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {service.stats.map((stat: any, idx: number) => (
                <div key={idx} className="bg-muted p-8 rounded-lg">
                  <div className="text-xs font-medium tracking-wider text-muted-foreground mb-4">
                    {stat.label}
                  </div>
                  <div className="stat-number mb-4">{stat.value}</div>
                  <p className="service-body text-sm">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Form */}
      <section className="bg-muted py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <h2 className="text-4xl font-normal text-center mb-4">
            ¿Necesitas más información?
          </h2>
          <p className="service-body text-center mb-12 text-muted-foreground">
            Completa el formulario y te responderemos en breve
          </p>
          
          <ServiceContactForm serviceName={service.name} />
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-black text-white py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-normal mb-4">
            ¿Listo para optimizar tu {service.area.toLowerCase()}?
          </h2>
          <p className="service-hero-subtitle mb-8 max-w-2xl mx-auto">
            Contáctanos y te asesoraremos de forma personalizada
          </p>
          <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
            <Link to="/contacto">Solicitar Consulta</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default ServiceDetail;
