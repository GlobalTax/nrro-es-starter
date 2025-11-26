import { Building2, Users, Globe, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

export const WhyChooseUs = () => {
  const { t } = useLanguage();

  const credentials = [
    {
      icon: Building2,
      title: t('shared.whyChooseUs.experience.title'),
      description: t('shared.whyChooseUs.experience.desc'),
      stat: t('shared.whyChooseUs.experience.stat'),
    },
    {
      icon: Users,
      title: t('shared.whyChooseUs.professionals.title'),
      description: t('shared.whyChooseUs.professionals.desc'),
      stat: t('shared.whyChooseUs.professionals.stat'),
    },
    {
      icon: Globe,
      title: t('shared.whyChooseUs.international.title'),
      description: t('shared.whyChooseUs.international.desc'),
      stat: t('shared.whyChooseUs.international.stat'),
    },
    {
      icon: CheckCircle2,
      title: t('shared.whyChooseUs.success.title'),
      description: t('shared.whyChooseUs.success.desc'),
      stat: t('shared.whyChooseUs.success.stat'),
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-normal mb-4">{t('shared.whyChooseUs.title')}</h2>
            <p className="text-lg text-muted-foreground">
              {t('shared.whyChooseUs.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {credentials.map((credential, index) => {
              const Icon = credential.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="mb-4 flex justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-primary mb-2">{credential.stat}</div>
                    <h3 className="font-semibold mb-2">{credential.title}</h3>
                    <p className="text-sm text-muted-foreground">{credential.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Certifications */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-4">{t('shared.whyChooseUs.certifications.title')}</p>
            <div className="flex flex-wrap items-center justify-center gap-8 text-xs text-muted-foreground">
              <div>{t('shared.whyChooseUs.certifications.barAssociation')}</div>
              <div>•</div>
              <div>{t('shared.whyChooseUs.certifications.taxRegistry')}</div>
              <div>•</div>
              <div>{t('shared.whyChooseUs.certifications.network')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
