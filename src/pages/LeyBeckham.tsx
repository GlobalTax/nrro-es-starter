import { Meta } from "@/components/seo/Meta";
import { HeroSection } from "@/components/ley-beckham/HeroSection";
import { BenefitsGrid } from "@/components/ley-beckham/BenefitsGrid";
import { RequirementsChecklist } from "@/components/ley-beckham/RequirementsChecklist";
import { FiscalComparison } from "@/components/ley-beckham/FiscalComparison";
import { ProcessTimeline } from "@/components/ley-beckham/ProcessTimeline";
import { FAQSection } from "@/components/ley-beckham/FAQSection";
import { LeyBeckhamContactForm } from "@/components/ley-beckham/LeyBeckhamContactForm";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useEffect } from "react";

const LeyBeckham = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView("ley-beckham-landing");
  }, [trackPageView]);

  return (
    <>
      <Meta
        title="Ley Beckham 2025 | Régimen Impatriados España"
        description="Reduce tu IRPF hasta un 76% con la Ley Beckham. Especialistas en régimen especial de impatriados. Consulta gratuita. +25 años de experiencia."
        keywords="ley beckham, régimen impatriados españa, fiscal impatriados, artículo 93 irpf, tributación impatriados, beckham law spain"
        canonicalUrl="https://nrro.es/ley-beckham"
      />

      <div className="min-h-screen">
        <HeroSection />
        <BenefitsGrid />

        {/* ¿Qué es la Ley Beckham? */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
              <div className="lg:col-span-3">
                <p className="font-mono font-light text-sm md:text-base tracking-tight text-foreground/70 pb-3 border-b border-border/50">
                  Régimen Especial
                </p>
              </div>

              <div className="lg:col-span-4">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight">
                  ¿Qué es la Ley Beckham?
                </h2>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <p className="text-lg font-medium">
                  La Ley Beckham es el nombre popular del régimen especial de tributación para trabajadores desplazados a España, regulado en el artículo 93 de la Ley del IRPF.
                </p>
                <p className="text-body">
                  Este régimen permite a profesionales extranjeros que se trasladan a España tributar como no residentes fiscales, con un tipo fijo del 24% sobre sus rendimientos del trabajo, en lugar del IRPF progresivo que puede llegar hasta el 47%.
                </p>
                <p className="text-body">
                  Establecido en 2005 tras la llegada del futbolista David Beckham al Real Madrid, este régimen busca atraer talento internacional a España ofreciendo importantes ventajas fiscales durante un periodo de hasta 6 años.
                </p>
              </div>
            </div>
          </div>
        </section>

        <RequirementsChecklist />

        {/* Perfiles Beneficiarios */}
        <section className="py-20 md:py-28 bg-neutral-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <p className="font-mono font-light text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-4">
                ¿Para quién?
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight mb-4">
                Perfiles que se Benefician de la Ley Beckham
              </h2>
              <p className="text-body max-w-2xl mx-auto">
                Este régimen fiscal especial está diseñado para diversos profesionales internacionales
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                {
                  title: "Ejecutivos y Directivos",
                  description: "C-level, directores generales, altos cargos en empresas multinacionales",
                  badge: "Alta Demanda"
                },
                {
                  title: "Profesionales Tech",
                  description: "Ingenieros, developers, CTOs, product managers, data scientists",
                  badge: "Sector Tech"
                },
                {
                  title: "Sector Financiero",
                  description: "Banqueros, traders, analistas financieros, consultores de inversión",
                  badge: "Finanzas"
                },
                {
                  title: "Consultores",
                  description: "Consultores estratégicos, auditores, expertos en transformación digital",
                  badge: "Consulting"
                },
                {
                  title: "Emprendedores",
                  description: "Fundadores de startups, inversores, business angels relocalizándose",
                  badge: "Startups"
                },
                {
                  title: "Investigadores",
                  description: "Profesores universitarios, investigadores científicos, expertos académicos",
                  badge: "Academia"
                }
              ].map((profile, index) => (
                <Card key={index} className="bg-card border border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Users className="w-8 h-8 text-accent" />
                      <Badge variant="secondary" className="text-xs">
                        {profile.badge}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-normal mb-2">{profile.title}</h3>
                    <p className="text-sm text-muted-foreground">{profile.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <FiscalComparison />
        <ProcessTimeline />

        {/* Por Qué Elegirnos - usando StatCard */}
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <p className="font-mono font-light text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-4">
                Expertos en Fiscalidad Internacional
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight mb-4">
                Por Qué Confiar en NRRO
              </h2>
              <p className="text-body max-w-2xl mx-auto">
                Más de 25 años de experiencia ayudando a profesionales internacionales
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              <StatCard
                label="Años de Experiencia"
                value="25+"
                description="Liderando la fiscalidad internacional en España"
                delay={0}
              />
              <StatCard
                label="Tasa de Éxito"
                value="98%"
                description="Solicitudes aprobadas por la Agencia Tributaria"
                delay={100}
              />
              <StatCard
                label="Clientes Asesorados"
                value="500+"
                description="Profesionales de más de 40 países"
                delay={200}
              />
              <StatCard
                label="Confidencialidad"
                value="100%"
                description="Garantía total de privacidad y seguridad"
                delay={300}
              />
            </div>
          </div>
        </section>

        <FAQSection />
        
        {/* Contact Form */}
        <div id="contact-form">
          <LeyBeckhamContactForm />
        </div>

        {/* CTA Final */}
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight mb-4">
                No Pierdas la Oportunidad de Optimizar tu Fiscalidad
              </h2>
              <p className="text-lead mb-8">
                Los plazos para acogerse a la Ley Beckham son limitados. Solicita tu consulta gratuita hoy y descubre cuánto puedes ahorrar.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => {
                    const { trackCTAClick } = useAnalytics();
                    trackCTAClick("solicitar-consulta-final", "ley-beckham-cta-final");
                    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Solicitar Consulta Gratuita
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                Respuesta en menos de 24 horas • 100% Confidencial • Sin compromiso
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LeyBeckham;
