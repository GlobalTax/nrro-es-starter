import { Building2, Users, Globe, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const WhyChooseUs = () => {
  const credentials = [
    {
      icon: Building2,
      title: '25+ Years Experience',
      description: 'Specialized in international corporate law since 1998',
      stat: '1998',
    },
    {
      icon: Users,
      title: '70+ Professionals',
      description: 'Multidisciplinary team: lawyers, tax advisors, accountants',
      stat: '70+',
    },
    {
      icon: Globe,
      title: 'International Clients',
      description: '40% of our clients are foreign companies',
      stat: '40%',
    },
    {
      icon: CheckCircle2,
      title: '500+ Companies Formed',
      description: '99% success rate in business registrations',
      stat: '99%',
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-normal mb-4">Why Navarro Tax Legal?</h2>
            <p className="text-lg text-muted-foreground">
              Not just lawyers. Your trusted partners in Spain.
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
            <p className="text-sm text-muted-foreground mb-4">Certified by:</p>
            <div className="flex flex-wrap items-center justify-center gap-8 text-xs text-muted-foreground">
              <div>🏛️ Barcelona Bar Association</div>
              <div>•</div>
              <div>📋 Tax Advisors Registry</div>
              <div>•</div>
              <div>🌍 International Legal Network</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
