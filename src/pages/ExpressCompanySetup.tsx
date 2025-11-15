import { Meta } from '@/components/seo/Meta';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Clock, CheckCircle2, Shield, ArrowRight } from 'lucide-react';
import { TrustBar } from '@/components/company-setup/shared/TrustBar';
import { CompanySetupForm } from '@/components/company-setup/shared/CompanySetupForm';
import { useState, useEffect } from 'react';

export const ExpressCompanySetup = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 12,
    minutes: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes } = prev;
        minutes--;
        if (minutes < 0) {
          minutes = 59;
          hours--;
          if (hours < 0) {
            hours = 23;
            days--;
            if (days < 0) {
              days = 3; // Reset
            }
          }
        }
        return { days, hours, minutes };
      });
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const diySteps = [
    { week: 'Week 1-2', task: 'NIE application', issue: 'Wait for appointment' },
    { week: 'Week 3-4', task: 'Company name', issue: 'Rejection likely' },
    { week: 'Week 5-6', task: 'Bank account', issue: 'Complicated for foreigners' },
    { week: 'Week 7-8', task: 'Notary deed', issue: 'Translation issues' },
    { week: 'Week 9-12', task: 'Tax registration', issue: 'Complex forms' },
  ];

  const expressSteps = [
    { week: 'Week 1', tasks: ['NIE', 'Name registration', 'Business structure'] },
    { week: 'Week 2', tasks: ['Bank account', 'Capital deposit'] },
    { week: 'Week 3', tasks: ['Public deed', 'Notary signing'] },
    { week: 'Week 4', tasks: ['Tax registration', 'Social Security'] },
  ];

  return (
    <>
      <Meta
        title="Fast Company Registration Spain | 30-Day Guarantee"
        description="Express company setup service. Registered in 30 days or 50% refund. No delays, no hassle. Limited slots available."
      />

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-primary/5 to-background">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-primary text-primary-foreground" variant="default">
              <Zap className="h-4 w-4 mr-2" />
              EXPRESS SERVICE
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Register Your Spanish Company in 30 Days. Guaranteed.
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Fast-track registration. No delays. Money-back guarantee.
            </p>

            {/* Countdown Timer */}
            <Card className="max-w-md mx-auto border-primary bg-primary/5">
              <CardContent className="p-6">
                <div className="text-sm text-muted-foreground mb-3">Next Express Batch Starts:</div>
                <div className="flex justify-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{timeLeft.days}</div>
                    <div className="text-xs text-muted-foreground">Days</div>
                  </div>
                  <div className="text-3xl font-bold">:</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{String(timeLeft.hours).padStart(2, '0')}</div>
                    <div className="text-xs text-muted-foreground">Hours</div>
                  </div>
                  <div className="text-3xl font-bold">:</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{String(timeLeft.minutes).padStart(2, '0')}</div>
                    <div className="text-xs text-muted-foreground">Minutes</div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-destructive font-semibold">
                  ⚠️ Only 5 slots left this month
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <TrustBar />

      {/* Timeline Comparison */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">DIY vs Express Service</h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* DIY Column */}
              <div>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2 text-muted-foreground">DIY Approach</h3>
                  <div className="text-3xl font-bold text-muted-foreground">60-90 Days</div>
                </div>
                <div className="space-y-4">
                  {diySteps.map((step, index) => (
                    <Card key={index} className="border-dashed">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 text-sm font-semibold text-muted-foreground shrink-0">
                            {step.week}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{step.task}</div>
                            <div className="text-xs text-destructive">{step.issue}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Express Column */}
              <div>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2 text-primary">Express Service</h3>
                  <div className="text-3xl font-bold text-primary">30 Days</div>
                </div>
                <div className="space-y-4">
                  {expressSteps.map((step, index) => (
                    <Card key={index} className="border-primary">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 text-sm font-semibold text-primary shrink-0">{step.week}</div>
                          <div className="flex-1">
                            {step.tasks.map((task, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <span>{task}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Fast */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">What Makes Us Fast?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Pre-existing Relationships',
                  description: 'Direct contacts at notaries, banks, and registro mercantil',
                },
                {
                  title: 'Dedicated Express Manager',
                  description: 'Your personal manager available 24/7 via WhatsApp',
                },
                {
                  title: 'Digital-First Process',
                  description: 'No need to travel to Spain. Sign docs online securely.',
                },
                {
                  title: 'Priority Handling',
                  description: 'Your case gets immediate attention at every step',
                },
              ].map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee & Pricing */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Express Guarantee</h2>
              <p className="text-lg text-muted-foreground">
                We stand behind our promise
              </p>
            </div>

            <Card className="border-primary border-2 mb-8">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="text-sm text-muted-foreground mb-2">Express Package</div>
                  <div className="text-5xl font-bold text-primary mb-4">€2,999</div>
                  <div className="text-muted-foreground">Everything included</div>
                </div>

                <div className="space-y-3 mb-8">
                  {[
                    'Complete company registration',
                    'NIE for 2 founders',
                    'Bank account setup',
                    'Tax & social security registration',
                    '1st year compliance',
                    'Dedicated Express Manager',
                    'WhatsApp support 24/7',
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-primary/5 p-6 rounded-lg mb-8">
                  <div className="flex items-center gap-4">
                    <Shield className="h-12 w-12 text-primary shrink-0" />
                    <div>
                      <div className="font-bold text-lg mb-1">30-Day Registration or 50% Refund</div>
                      <div className="text-sm text-muted-foreground">
                        If we don't register your company in 30 days, you get 50% back. No questions asked.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8 p-4 bg-muted rounded-lg">
                  <div className="font-semibold mb-2">Super-Express Available</div>
                  <div className="text-sm text-muted-foreground">
                    Need it even faster? <strong>+€500</strong> for 20-day registration
                  </div>
                </div>

                <CompanySetupForm
                  landingVariant="express"
                  conversionType="express-booking"
                  submitButtonText="Book Express Service Now"
                  showAllFields={false}
                />

                <div className="text-center mt-4 text-sm text-muted-foreground">
                  Get confirmation in 2 hours
                </div>
              </CardContent>
            </Card>

            {/* Testimonial */}
            <Card className="bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">"</div>
                  <div>
                    <p className="text-lg mb-4">
                      Registered in 28 days. Unbelievable. I was prepared for months of bureaucracy.
                    </p>
                    <div className="font-semibold">— John Mitchell, UK</div>
                    <div className="text-sm text-muted-foreground">Tech Startup Founder</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};
