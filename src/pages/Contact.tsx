import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useScrollDepth } from '@/hooks/useScrollDepth';
import { useLanguage } from '@/contexts/LanguageContext';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Meta } from '@/components/seo/Meta';
import { useToast } from '@/hooks/use-toast';
import { BadgeHero } from '@/components/ui/badge-hero';
import { supabase } from '@/integrations/supabase/client';
import { LocationMap } from '@/components/map/LocationMap';

export default function Contact() {
  const { trackPageView, trackFormSubmit, trackCTAClick, trackContactClick } = useAnalytics();
  useScrollDepth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Track page view
  useEffect(() => {
    trackPageView("contacto");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('submit-contact', {
        body: {
          name: formData.name,
          email: formData.email,
          company: '', // Company field - can be added to form if needed
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        },
      });

      if (error) throw error;

      // Track form submission
      trackFormSubmit("contacto_general", {
        subject: formData.subject,
        has_phone: !!formData.phone,
      });

      toast({
        title: t("contact.form.successTitle"),
        description: t("contact.form.successDescription"),
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: t("contact.form.errorTitle"),
        description: t("contact.form.errorDescription"),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: t("contact.info.phone"),
      value: '93 459 36 00',
      href: 'tel:+34934593600',
    },
    {
      icon: Mail,
      title: t("contact.info.email"),
      value: 'info@nrro.es',
      href: 'mailto:info@nrro.es',
    },
    {
      icon: MapPin,
      title: t("contact.info.address"),
      value: t("contact.info.addressValue"),
      href: 'https://maps.app.goo.gl/JjwmToznoU9Vx7zu9',
    },
  ];

  return (
    <>
      <Meta
        title={t("contact.meta.title")}
        description={t("contact.meta.description")}
        keywords={t("contact.meta.keywords")}
        canonicalUrl={`${window.location.origin}/contacto`}
      />

      {/* Hero Section */}
      <section className="bg-black py-32 md:py-48 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <BadgeHero>{t("contact.hero.badge")}</BadgeHero>
            </div>
            <h1 className="service-hero-title mb-8">
              {t("contact.hero.title")}
            </h1>
            <p className="service-hero-subtitle max-w-3xl mx-auto">
              {t("contact.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="animate-slide-up">
                <Card className="shadow-medium border-border/50">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif">{t("contact.form.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t("contact.form.name")}</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t("contact.form.namePlaceholder")}
                        required
                        className="border-border/50 focus:border-accent"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">{t("contact.form.email")}</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder={t("contact.form.emailPlaceholder")}
                          required
                          className="border-border/50 focus:border-accent"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">{t("contact.form.phone")}</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder={t("contact.form.phonePlaceholder")}
                          className="border-border/50 focus:border-accent"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">{t("contact.form.subject")}</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder={t("contact.form.subjectPlaceholder")}
                        required
                        className="border-border/50 focus:border-accent"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">{t("contact.form.message")}</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={t("contact.form.messagePlaceholder")}
                        rows={6}
                        required
                        minLength={10}
                        className="border-border/50 focus:border-accent resize-none"
                      />
                      {formData.message.length > 0 && formData.message.length < 10 && (
                        <p className="text-sm text-destructive">{t("contact.form.messageError")}</p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      disabled={isSubmitting}
                      className="w-full bg-accent hover:bg-accent-hover text-accent-foreground shadow-soft"
                    >
                      {isSubmitting ? t("contact.form.submitting") : t("contact.form.submit")}
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
                  {t("contact.info.title")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("contact.info.subtitle")}
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  const isPhone = item.href.startsWith('tel:');
                  const isEmail = item.href.startsWith('mailto:');
                  
                  return (
                    <Card
                      key={index}
                      className="hover-lift border-border/50 hover:border-accent/50 transition-all"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="h-6 w-6 text-accent" />
                          </div>
                          <div>
                            <h3 className="font-display font-normal text-foreground mb-1">
                              {item.title}
                            </h3>
                            <a
                              href={item.href}
                              target={item.title === 'Dirección' ? '_blank' : undefined}
                              rel={item.title === 'Dirección' ? 'noopener noreferrer' : undefined}
                              className="text-muted-foreground hover:text-accent transition-colors"
                              onClick={() => {
                                if (isPhone) {
                                  trackContactClick('phone', item.value, 'contact_page_info');
                                } else if (isEmail) {
                                  trackContactClick('email', item.value, 'contact_page_info');
                                } else {
                                  trackCTAClick(item.title, "contacto_info");
                                }
                              }}
                            >
                              {item.value}
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Office Hours */}
              <Card className="border-border/50 shadow-soft">
                <CardContent className="p-6">
                  <h3 className="font-display font-normal text-foreground mb-4">
                    {t("contact.info.hours")}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("contact.info.weekdays")}</span>
                      <span className="font-medium text-foreground">{t("contact.info.weekdaysValue")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("contact.info.weekend")}</span>
                      <span className="font-medium text-foreground">{t("contact.info.weekendValue")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Map */}
              <Card className="border-border/50 shadow-soft overflow-hidden">
                <CardContent className="p-0">
                  <LocationMap
                    address={t("contact.info.addressValue")}
                    lat={41.3931}
                    lng={2.1737}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
