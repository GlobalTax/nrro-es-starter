import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export const RequirementsChecklist = () => {
  const { t, tDynamic } = useLanguage();

  return (
    <section id="requisitos" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="font-mono font-light text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-4">
            {t('leyBeckham.requirements.overline')}
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight mb-4">
            {t('leyBeckham.requirements.title')}
          </h2>
          <p className="text-body max-w-2xl mx-auto">
            {t('leyBeckham.requirements.description')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {[0, 1, 2, 3, 4].map((index) => {
            const isImportant = tDynamic(`leyBeckham.requirements.items.${index}.isKey`) === 'true';
            
            return (
              <Card key={index} className="border-l-4 border-l-primary bg-card border border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {isImportant ? (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <AlertCircle className="w-5 h-5 text-primary" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-accent" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-normal text-lg">
                          {index + 1}. {tDynamic(`leyBeckham.requirements.items.${index}.title`)}
                        </h3>
                        {isImportant && (
                          <span className="text-xs font-normal text-primary bg-primary/10 px-2 py-1 rounded-full whitespace-nowrap">
                            {t('leyBeckham.requirements.keyRequirement')}
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground">
                        {tDynamic(`leyBeckham.requirements.items.${index}.description`)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto bg-neutral-50 border border-border/50">
            <CardContent className="p-6">
              <p className="text-lead mb-4">
                {t('leyBeckham.requirements.uncertain.title')}
              </p>
              <p className="text-muted-foreground mb-6">
                {t('leyBeckham.requirements.uncertain.description')}
              </p>
              <a
                href="#contacto"
                className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent bg-primary text-primary-foreground hover:bg-primary-hover shadow-soft h-10 px-6"
              >
                {t('leyBeckham.requirements.uncertain.button')}
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
