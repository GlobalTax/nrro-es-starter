import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useScrollDepth } from '@/hooks/useScrollDepth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteConfig } from '@/hooks/useSiteConfig';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Meta } from '@/components/seo/Meta';
import { useToast } from '@/hooks/use-toast';
import { BadgeHero } from '@/components/ui/badge-hero';
import { supabase } from '@/integrations/supabase/client';
import { LocationMap } from '@/components/map/LocationMap';

const SERVICE_TYPES = [
  { value: 'fiscal', label: 'Fiscal' },
  { value: 'contable', label: 'Contable' },
  { value: 'laboral', label: 'Laboral' },
  { value: 'mercantil', label: 'Mercantil' },
  { value: 'legal', label: 'Legal' },
  { value: 'internacional', label: 'Internacional' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'otra', label: 'Otra' },
];

export default function Contact() {
  const { trackPageView, trackFormSubmit, trackCTAClick, trackContactClick } = useAnalytics();
  useScrollDepth();
  const { t } = useLanguage();
  const siteConfig = useSiteConfig();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceType: '',
    subject: '',
    message: '',
  });
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    trackPageView("contacto");
  }, []);

  // Inject LocalBusiness schema
  useEffect(() => {
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "NRRO - Navarro Tax & Legal",
      "image": "https://nrro.es/assets/logos/navarro-tax-legal.svg",
      "url": "https://nrro.es",
      "telephone": "+34934593600",
      "email": "info@nrro.es",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Ausiàs March 36, Principal",
        "addressLocality": "Barcelona",
        "postalCode": "08010",
        "addressRegion": "Catalunya",
        "addressCountry": "ES"
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday"],
          "opens": "09:00",
          "closes": "18:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "Friday",
          "opens": "09:00",
          "closes": "15:00"
        }
      ],
      "priceRange": "€€"
    };

    const scriptId = "localbusiness-schema";
    let script = document.querySelector(`script#${scriptId}`);
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      (script as HTMLScriptElement).type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(localBusinessSchema);

    return () => {
      const s = document.querySelector(`script#${scriptId}`);
      if (s) s.remove();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptPrivacy) {
      toast({
        title: "Política de privacidad",
        description: "Debes aceptar la política de privacidad para continuar.",
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('submit-contact', {
        body: {
          name: formData.name,
          email: formData.email,
          company: formData.company,
          phone: formData.phone,
          subject: formData.serviceType ? `[${formData.serviceType}] ${formData.subject}` : formData.subject,
          message: formData.message,
          service_type: formData.serviceType || null,
          source_site: siteConfig.sourceSite,
        },
      });

      if (error) throw error;

      trackFormSubmit("contact_form_submit", {
        subject: formData.subject,
        service_type: formData.serviceType,
        has_phone: !!formData.phone,
        has_company: !!formData.company,
      });

      toast({
        title: t("contact.form.successTitle"),
        description: t("contact.form.successDescription"),
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        serviceType: '',
        subject: '',
        message: '',
      });
      setAcceptPrivacy(false);
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
      value: '+34 934 593 600',
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
      value: 'Ausiàs March 36, Principal, 08010 Barcelona',
      href: 'https://maps.app.goo.gl/JjwmToznoU9Vx7zu9',
    },
  ];

  return (
    <>
      <Meta
        title="Contacto | NRRO Navarro Tax & Legal Barcelona"
        description="Contacta con NRRO en Barcelona. Ausiàs March 36, Principal. Tel: 934 593 600. Primera consulta gratuita. Asesoría fiscal, laboral, contable y legal."
        keywords={t("contact.meta.keywords")}
        canonicalUrl="https://nrro.es/es/contacto"
      />

      {/* Hero Section */}
      <section className="bg-black py-32 md:py-48 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <BadgeHero>{t("contact.hero.badge")}</BadgeHero>
            </div>
            <h1 className="service-hero-title mb-8">
              Contacta con nosotros
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
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t("contact.form.name")}</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t("contact.form.namePlaceholder")}
                        required
                        maxLength={100}
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
                          maxLength={255}
                          className="border-border/50 focus:border-accent"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder={t("contact.form.phonePlaceholder")}
                          required
                          className="border-border/50 focus:border-accent"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Empresa (opcional)</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Nombre de tu empresa"
                        maxLength={200}
                        className="border-border/50 focus:border-accent"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="serviceType">Tipo de consulta</Label>
                      <Select
                        value={formData.serviceType}
                        onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
                      >
                        <SelectTrigger className="border-border/50 focus:border-accent">
                          <SelectValue placeholder="Selecciona un área" />
                        </SelectTrigger>
                        <SelectContent>
                          {SERVICE_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">{t("contact.form.subject")}</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder={t("contact.form.subjectPlaceholder")}
                        required
                        maxLength={200}
                        className="border-border/50 focus:border-accent"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Cuéntanos tu caso *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={t("contact.form.messagePlaceholder")}
                        rows={5}
                        required
                        minLength={10}
                        maxLength={2000}
                        className="border-border/50 focus:border-accent resize-none"
                      />
                      {formData.message.length > 0 && formData.message.length < 10 && (
                        <p className="text-sm text-destructive">{t("contact.form.messageError")}</p>
                      )}
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="privacy"
                        checked={acceptPrivacy}
                        onCheckedChange={(checked) => setAcceptPrivacy(checked === true)}
                      />
                      <Label htmlFor="privacy" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                        Acepto la{' '}
                        <a href="/privacidad" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                          política de privacidad
                        </a>
                        {' '}y el tratamiento de mis datos personales.
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting || !acceptPrivacy}
                      className="w-full bg-accent hover:bg-accent-hover text-accent-foreground shadow-soft"
                    >
                      {isSubmitting ? t("contact.form.submitting") : 'Enviar consulta'}
                      <Send className="ml-2 h-4 w-4" />
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      Respuesta garantizada en menos de 24 horas laborables.
                    </p>
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
                              target={!isPhone && !isEmail ? '_blank' : undefined}
                              rel={!isPhone && !isEmail ? 'noopener noreferrer' : undefined}
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
                  <h3 className="font-display font-normal text-foreground mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-accent" />
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

              {/* Other Offices */}
              <Card className="border-border/50 shadow-soft">
                <CardContent className="p-6">
                  <h3 className="font-display font-normal text-foreground mb-3">
                    {t("contact.info.otherOffices")}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {t("contact.info.otherOfficesValue")}
                  </p>
                </CardContent>
              </Card>

              {/* Map */}
              <Card className="border-border/50 shadow-soft overflow-hidden">
                <CardContent className="p-0">
                  <LocationMap
                    address={t("contact.info.addressValue")}
                    lat={41.3915}
                    lng={2.1745}
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
