import { Meta } from '@/components/seo/Meta';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Clock, Shield, X } from 'lucide-react';
import { TrustBar } from '@/components/company-setup/shared/TrustBar';
import { CompanySetupForm } from '@/components/company-setup/shared/CompanySetupForm';
import { WhyChooseUs } from '@/components/company-setup/shared/WhyChooseUs';

export const NIEServiceSpain = () => {
  const painPoints = [
    '3+ hour queues at immigration office',
    'Appointments 2 months away',
    'Rejected applications (incorrect docs)',
    'Language barriers',
    'Lost time = lost business opportunities',
  ];

  const process = [
    { day: 'Day 1', action: 'Document review & preparation', status: 'We check everything' },
    { day: 'Day 2-3', action: 'Appointment secured', status: 'Using our contacts' },
    { day: 'Day 4-5', action: 'Application submission', status: 'We go for you' },
    { day: 'Day 6-7', action: 'NIE delivered', status: 'To your door' },
  ];

  return (
    <>
      <Meta
        title="Get Your Spanish NIE in 7 Days | Express Service"
        description="Skip the queues and bureaucracy. Express NIE service for foreigners. 99% success rate. Money-back guarantee. Book now."
      />

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-destructive/5 to-background">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-destructive text-destructive-foreground" variant="default">
              🚨 STOP THE NIE FRUSTRATION
            </Badge>
            <h1 className="text-4xl md:text-6xl font-normal mb-6">
              Get Your Spanish NIE Without the Bureaucratic Nightmare
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              7-day express service. No queues. No rejections. Guaranteed.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>500+ NIEs processed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>99% success rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustBar />

      {/* Pain Points Section */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h2 className="text-3xl font-normal mb-4">Tired of the NIE Nightmare?</h2>
              <p className="text-lg text-muted-foreground">
                Sound familiar? There's a better way.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {painPoints.map((point, index) => (
                <Card key={index} className="border-destructive/20">
                  <CardContent className="p-6 flex items-center gap-4">
                    <X className="h-6 w-6 text-destructive shrink-0" />
                    <span className="text-lg">{point}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Clock className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-normal mb-4">Our Express NIE Process</h2>
              <p className="text-lg text-muted-foreground">
                From application to delivery in just 7 days
              </p>
            </div>

            <div className="space-y-6">
              {process.map((step, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <div className="w-24 shrink-0">
                        <div className="text-lg font-bold text-primary">{step.day}</div>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-lg mb-1">{step.action}</div>
                        <div className="text-sm text-muted-foreground">{step.status}</div>
                      </div>
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <Card className="bg-primary/5">
                <CardContent className="p-6 text-center">
                  <div className="font-semibold mb-2">You do:</div>
                  <div className="text-muted-foreground">Send us scanned docs</div>
                </CardContent>
              </Card>
              <Card className="bg-primary/5">
                <CardContent className="p-6 text-center">
                  <div className="font-semibold mb-2">We do:</div>
                  <div className="text-muted-foreground">Everything else</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <WhyChooseUs />

      {/* Pricing Section */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-normal mb-4">Transparent Pricing</h2>
              <p className="text-lg text-muted-foreground">
                No hidden fees. No surprises.
              </p>
            </div>

            <Card className="border-primary border-2">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="text-sm text-muted-foreground mb-2">NIE Express Service</div>
                  <div className="text-5xl font-bold text-primary mb-4">€350</div>
                  <div className="text-muted-foreground">Complete service</div>
                </div>

                <div className="space-y-3 mb-8">
                  {[
                    'Document review & preparation',
                    'Appointment secured within 48h',
                    'Application submission',
                    'NIE delivered to your door',
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-6 mb-8">
                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <Shield className="h-8 w-8 text-primary shrink-0" />
                    <div>
                      <div className="font-semibold">Money-Back Guarantee</div>
                      <div className="text-sm text-muted-foreground">
                        If we don't get your NIE, full refund
                      </div>
                    </div>
                  </div>
                </div>

                <CompanySetupForm
                  landingVariant="nie-hell"
                  conversionType="nie-service"
                  submitButtonText="Secure My NIE Service"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Who Needs NIE */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-normal mb-8 text-center">Who Needs a NIE?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Opening a company in Spain',
                'Buying property',
                'Opening a bank account',
                'Hiring employees',
                'Signing contracts',
                'Registering for taxes',
              ].map((reason, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-background rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
