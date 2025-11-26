import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, Calendar, Globe, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const BenefitsGrid = () => {
  const { t } = useLanguage();
  
  const benefits = [
    {
      icon: TrendingDown,
      title: t("leyBeckham.benefits.tax.title"),
      description: t("leyBeckham.benefits.tax.description")
    },
    {
      icon: Calendar,
      title: t("leyBeckham.benefits.duration.title"),
      description: t("leyBeckham.benefits.duration.description")
    },
    {
      icon: Globe,
      title: t("leyBeckham.benefits.worldwide.title"),
      description: t("leyBeckham.benefits.worldwide.description")
    },
    {
      icon: ShieldCheck,
      title: t("leyBeckham.benefits.security.title"),
      description: t("leyBeckham.benefits.security.description")
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="font-mono font-light text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-4">
            {t("leyBeckham.benefits.eyebrow")}
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight mb-4">
            {t("leyBeckham.benefits.title")}
          </h2>
          <p className="text-body max-w-2xl mx-auto">
            {t("leyBeckham.benefits.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            
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
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {benefit.description}
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