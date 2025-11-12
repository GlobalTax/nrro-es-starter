import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

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
  const { trackPageView, trackFormSubmit, trackCTAClick } = useAnalytics();
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
          company: formData.phone, // Using phone field as company for compatibility
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
        title: "Mensaje enviado",
        description: "Nos pondremos en contacto contigo pronto.",
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
        title: "Error",
        description: "Ha ocurrido un error. Por favor, inténtalo de nuevo.",
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Teléfono',
      value: '93 459 36 00',
      href: 'tel:+34934593600',
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'info@nrro.es',
      href: 'mailto:info@nrro.es',
    },
    {
      icon: MapPin,
      title: 'Dirección',
      value: 'Carrer Ausias March número 36, 08010 Barcelona',
      href: 'https://maps.app.goo.gl/JjwmToznoU9Vx7zu9',
    },
  ];

  return (
    <>
      <Meta
        title="Contacto"
        description="Ponte en contacto con nuestro equipo de asesores fiscales, legales y laborales"
        keywords="contacto asesoría fiscal Barcelona, contacto navarro tax legal, consulta gratuita fiscal"
        canonicalUrl={`${window.location.origin}/contacto`}
      />

      {/* Hero Section */}
      <section className="bg-black py-32 md:py-48 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <BadgeHero>Contacto</BadgeHero>
            </div>
            <h1 className="service-hero-title mb-8">
              Hablemos
            </h1>
            <p className="service-hero-subtitle max-w-3xl mx-auto">
              Cuéntanos cómo podemos ayudarte
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
                  <CardTitle className="text-2xl font-serif">Envíanos un mensaje</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Tu nombre"
                        required
                        className="border-border/50 focus:border-accent"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="tu@email.com"
                          required
                          className="border-border/50 focus:border-accent"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+34 123 456 789"
                          className="border-border/50 focus:border-accent"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Asunto</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="¿En qué podemos ayudarte?"
                        required
                        className="border-border/50 focus:border-accent"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Mensaje (mínimo 10 caracteres)</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Cuéntanos más sobre tu consulta..."
                        rows={6}
                        required
                        minLength={10}
                        className="border-border/50 focus:border-accent resize-none"
                      />
                      {formData.message.length > 0 && formData.message.length < 10 && (
                        <p className="text-sm text-destructive">El mensaje debe tener al menos 10 caracteres</p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      disabled={isSubmitting}
                      className="w-full bg-accent hover:bg-accent-hover text-accent-foreground shadow-soft"
                    >
                      {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
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
                  Información de contacto
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Estamos aquí para ayudarte. Contáctanos por cualquiera de estos medios.
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
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
                              onClick={() => trackCTAClick(item.title, "contacto_info")}
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
                    Horario de atención
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lunes a Viernes</span>
                      <span className="font-medium text-foreground">9:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fines de semana</span>
                      <span className="font-medium text-foreground">Cerrado</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Map */}
              <Card className="border-border/50 shadow-soft overflow-hidden">
                <CardContent className="p-0">
                  <LocationMap
                    address="Carrer Ausias March número 36, 08010 Barcelona"
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
