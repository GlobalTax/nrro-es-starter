import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LanguageLink } from '@/components/ui/language-link';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';

interface RelatedServicesProps {
  serviceIds: string[];
}

export const RelatedServices = ({ serviceIds }: RelatedServicesProps) => {
  const { getServicePath } = useLocalizedPath();
  
  const { data: services } = useQuery({
    queryKey: ['related-services', serviceIds],
    queryFn: async () => {
      if (!serviceIds || serviceIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from('services')
        .select('id, name_es, name_ca, name_en, slug_es, slug_ca, slug_en, description_es, description_ca, description_en, icon_name')
        .in('id', serviceIds)
        .eq('is_active', true);
      
      if (error) throw error;
      
      // Map to use spanish as default, fallback to other languages
      return data?.map(service => ({
        id: service.id,
        name: service.name_es || service.name_ca || service.name_en,
        slug_es: service.slug_es,
        slug_ca: service.slug_ca,
        slug_en: service.slug_en,
        description: service.description_es || service.description_ca || service.description_en,
        icon_name: service.icon_name,
      })) || [];
    },
    enabled: serviceIds && serviceIds.length > 0,
  });

  if (!services || services.length === 0) return null;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => {
        const servicePath = getServicePath(service.slug_es, service.slug_ca, service.slug_en);
        
        return (
          <Card key={service.id} className="p-6 hover:shadow-lg transition-all duration-300 group">
            <LanguageLink to={servicePath}>
              <h4 className="text-lg font-medium mb-2 group-hover:text-accent transition-colors">
                {service.name}
              </h4>
              <p className="text-sm text-foreground/70 leading-relaxed mb-4 line-clamp-3">
                {service.description}
              </p>
              <div className="flex items-center gap-2 text-sm text-accent">
                <span>Ver servicio</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </LanguageLink>
          </Card>
        );
      })}
    </div>
  );
};
