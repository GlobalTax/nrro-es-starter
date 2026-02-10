import DOMPurify from 'dompurify';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface RelatedServicesProps {
  currentServiceId: string;
  category?: string;
}

export const RelatedServices = ({ currentServiceId, category }: RelatedServicesProps) => {
  const { language, t } = useLanguage();
  const { getServicePath } = useLocalizedPath();

  const { data: services = [] } = useQuery({
    queryKey: ['related-services', currentServiceId, category, language],
    queryFn: async () => {
      const supabaseAny = supabase as any;
      let query = supabaseAny
        .from('services')
        .select('id, name_es, name_ca, name_en, slug_es, slug_ca, slug_en, description_es, description_ca, description_en, category, icon')
        .eq('is_active', true)
        .neq('id', currentServiceId)
        .order('display_order', { ascending: true })
        .limit(3);

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map((service: any) => ({
        ...service,
        name: service[`name_${language}`] || service.name_es,
        slug: service[`slug_${language}`] || service.slug_es,
        description: service[`description_${language}`] || service.description_es,
      }));
    },
  });

  if (!services.length) return null;

  return (
    <section className="bg-white py-16 md:py-24 border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-mono font-light text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-4">
              {t('services.relatedServices')}
            </h2>
            <p className="text-3xl md:text-4xl font-normal text-foreground">
              {t('services.mightInterest')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service) => {
              const servicePath = getServicePath(
                service.slug_es,
                service.slug_ca,
                service.slug_en
              );

              return (
                <Link
                  key={service.id}
                  to={servicePath}
                  className="group"
                >
                  <Card className="h-full border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 space-y-4">
                      {service.icon && (
                        <div className="text-primary text-4xl" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(service.icon) }} />
                      )}
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-2 text-primary text-sm font-medium pt-2">
                        <span>{t('services.card.learnMore')}</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
