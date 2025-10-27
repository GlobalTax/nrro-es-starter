import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import * as LucideIcons from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Overline } from "@/components/ui/typography";
import { Meta } from "@/components/seo/Meta";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { services as mockServices } from "@/data/mockData";

const ServiceDetail = () => {
  const { slug } = useParams();

  // Fetch from database
  const { data: dbService, isLoading } = useQuery({
    queryKey: ['service', slug],
    queryFn: async () => {
      if (!slug) return null;
      // @ts-ignore - New tables not in types yet
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4">Servicio no encontrado</h1>
          <Button asChild>
            <Link to="/servicios">Volver a Servicios</Link>
          </Button>
        </div>
      </div>
    );
  }

  const IconComponent = (LucideIcons as any)[service.icon_name] || LucideIcons.FileText;

  const getAreaColor = (area: string) => {
    const colors: Record<string, string> = {
      'Fiscal': 'bg-blue-100 text-blue-800 border-blue-300',
      'Contable': 'bg-green-100 text-green-800 border-green-300',
      'Legal': 'bg-purple-100 text-purple-800 border-purple-300',
      'Laboral': 'bg-orange-100 text-orange-800 border-orange-300',
    };
    return colors[area] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <>
      <Meta 
        title={service.name}
        description={service.description}
        canonicalUrl={`${window.location.origin}/servicios/${service.slug}`}
      />

      <div className="min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Button variant="ghost" asChild className="mb-8">
            <Link to="/servicios">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Servicios
            </Link>
          </Button>

          <div className="max-w-4xl">
            {/* Header */}
            <div className="mb-12 pb-12 border-b border-border">
              <div className="flex items-start gap-8 mb-8">
                {/* Icon */}
                <div className="w-32 h-32 bg-primary/10 rounded-lg flex items-center justify-center p-4 flex-shrink-0">
                  <IconComponent className="h-20 w-20 text-primary" strokeWidth={1.5} />
                </div>

                <div className="flex-1">
                  <Badge className={getAreaColor(service.area)}>{service.area}</Badge>
                  <h1 className="mb-4 text-4xl mt-4">{service.name}</h1>
                  <p className="text-lead text-body">{service.description}</p>
                </div>
              </div>

              <Button asChild size="lg" className="mt-6">
                <Link to="/contacto">Solicitar Información</Link>
              </Button>
            </div>

            {/* Features */}
            {service.features && Array.isArray(service.features) && service.features.length > 0 && (
              <Card className="p-8 mb-8">
                <h2 className="text-2xl mb-6">¿Qué Incluye Este Servicio?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-body">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Benefits */}
            {service.benefits && (
              <Card className="p-8 mb-8 bg-primary/5">
                <h2 className="text-2xl mb-4">Beneficios Clave</h2>
                <p className="text-body text-lg">{service.benefits}</p>
              </Card>
            )}

            {/* Typical Clients */}
            {service.typical_clients && Array.isArray(service.typical_clients) && service.typical_clients.length > 0 && (
              <Card className="p-8 mb-8">
                <h2 className="text-2xl mb-6">Ideal Para</h2>
                <div className="flex flex-wrap gap-3">
                  {service.typical_clients.map((client, idx) => (
                    <Badge key={idx} variant="secondary" className="text-sm px-4 py-2">
                      {client}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* CTA */}
            <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 text-center">
              <h2 className="text-2xl mb-4">¿Listo para Empezar?</h2>
              <p className="text-body mb-6">
                Contáctanos y te asesoraremos sobre cómo podemos ayudarte con {service.name.toLowerCase()}.
              </p>
              <Button asChild size="lg">
                <Link to="/contacto">Solicitar Consulta Gratuita</Link>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceDetail;
