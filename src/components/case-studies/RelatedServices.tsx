import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface RelatedServicesProps {
  serviceIds: string[];
}

export const RelatedServices = ({ serviceIds }: RelatedServicesProps) => {
  const { data: services } = useQuery({
    queryKey: ['related-services', serviceIds],
    queryFn: async () => {
      if (!serviceIds || serviceIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from('services')
        .select('id, name, slug, description, icon_name')
        .in('id', serviceIds)
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    },
    enabled: serviceIds && serviceIds.length > 0,
  });

  if (!services || services.length === 0) return null;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <Card key={service.id} className="p-6 hover:shadow-lg transition-all duration-300 group">
          <Link to={`/servicios/${service.slug}`}>
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
          </Link>
        </Card>
      ))}
    </div>
  );
};
