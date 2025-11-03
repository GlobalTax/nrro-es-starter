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
        title: 'Mensaje enviado',
        description: 'Nos pondremos en contacto contigo en breve.',
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
        title: 'Error al enviar',
        description: 'Por favor, inténtalo de nuevo más tarde.',
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
        description="Contacta con NRRO - Navarro Tax Legal. Estamos en Barcelona para ayudarte con tu asesoría fiscal, contable y legal."
        keywords="contacto asesoría fiscal Barcelona, contacto navarro tax legal, consulta gratuita fiscal"
      />

      {/* Hero Section */}
      <section className="bg-black py-32 md:py-48 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <BadgeHero>Contacto</BadgeHero>
            </div>
            <h1 className="service-hero-title mb-8">
              Hablemos de tu proyecto
            </h1>
            <p className="service-hero-subtitle max-w-3xl mx-auto">
              Estamos aquí para ayudarte. Contáctanos y descubre cómo podemos impulsar tu negocio.
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
                      <Label htmlFor="name">Nombre completo *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Juan Pérez"
                        required
                        className="border-border/50 focus:border-accent"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="juan@ejemplo.com"
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
                          placeholder="+34 600 000 000"
                          className="border-border/50 focus:border-accent"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Asunto *</Label>
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
                      <Label htmlFor="message">Mensaje *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Cuéntanos más sobre tu situación..."
                        rows={6}
                        required
                        className="border-border/50 focus:border-accent resize-none"
                      />
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
                  Estamos ubicados en el corazón de Barcelona. No dudes en visitarnos o contactarnos por cualquier medio.
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
                      <span className="text-muted-foreground">Lunes - Viernes</span>
                      <span className="font-medium text-foreground">9:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sábado - Domingo</span>
                      <span className="font-medium text-foreground">Cerrado</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Map */}
              <Card className="border-border/50 shadow-soft overflow-hidden">
                <CardContent className="p-0">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2993.253988876!2d2.173682!3d41.393119!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4a2f8f8f8f8f8%3A0x8f8f8f8f8f8f8f8!2sCarrer%20Ausias%20March%2C%2036%2C%2008010%20Barcelona!5e0!3m2!1sen!2ses!4v1234567890"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación de NRRO"
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
