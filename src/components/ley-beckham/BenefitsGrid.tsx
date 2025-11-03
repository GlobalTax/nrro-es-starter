import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, Calendar, Globe, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export const BenefitsGrid = () => {
  const { t, tDynamic } = useLanguage();

  return (
    <section className="py-20 md:py-28 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="font-mono font-light text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-4">
            {t('leyBeckham.benefits.overline')}
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight mb-4">
            {t('leyBeckham.benefits.title')}
          </h2>
          <p className="text-body max-w-2xl mx-auto">
            {t('leyBeckham.benefits.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {[0, 1, 2, 3].map((index) => {
            const icons = [TrendingDown, Calendar, Globe, ShieldCheck];
            const Icon = icons[index];
            
            return (
              <Card 
                key={index} 
                className="bg-card border border-border/50"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-normal mb-2">
                      {tDynamic(`leyBeckham.benefits.items.${index}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tDynamic(`leyBeckham.benefits.items.${index}.description`)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
