import { Meta } from "@/components/seo/Meta";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { FAQSchema } from "@/components/seo/FAQSchema";
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
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { CheckCircle, Users } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const LeyBeckham = () => {
  const { trackPageView } = useAnalytics();
  const { t } = useLanguage();

  useEffect(() => {
    trackPageView("ley-beckham-landing");
  }, [trackPageView]);

  // Generate FAQs for schema
  const faqs = Array.from({ length: 8 }, (_, i) => ({
    question: t(`faq.q${i + 1}`),
    answer: t(`faq.a${i + 1}`)
  }));

  return (
    <>
      <Meta
        title={t("seo.title")}
        description={t("seo.description")}
        keywords={t("seo.keywords")}
      />
      <BreadcrumbSchema items={[
        { name: "Inicio", url: "https://navarrotax.legal/" },
        { name: "Ley Beckham", url: "https://navarrotax.legal/ley-beckham" }
      ]} />
      <FAQSchema faqs={faqs} />

      <div className="min-h-screen">
        <HeroSection />
        
        {/* Breadcrumb Navigation */}
        <div className="bg-muted/30 border-b border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Inicio</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Ley Beckham</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <BenefitsGrid />

        {/* ¿Qué es la Ley Beckham? */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
              <div className="lg:col-span-3">
                <p className="font-mono font-light text-sm md:text-base tracking-tight text-foreground/70 pb-3 border-b border-border/50">
                  {t("whatIs.eyebrow")}
                </p>
              </div>

              <div className="lg:col-span-4">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight">
                  {t("whatIs.title")}
                </h2>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <p className="text-lg font-medium">
                  {t("whatIs.p1")}
                </p>
                <p className="text-body">
                  {t("whatIs.p2")}
                </p>
                <p className="text-body">
                  {t("whatIs.p3")}
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
                {t("profiles.eyebrow")}
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight mb-4">
                {t("profiles.title")}
              </h2>
              <p className="text-body max-w-2xl mx-auto">
                {t("profiles.subtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                {
                  title: t("profiles.executives.title"),
                  description: t("profiles.executives.description"),
                  badge: t("profiles.executives.badge")
                },
                {
                  title: t("profiles.tech.title"),
                  description: t("profiles.tech.description"),
                  badge: t("profiles.tech.badge")
                },
                {
                  title: t("profiles.financial.title"),
                  description: t("profiles.financial.description"),
                  badge: t("profiles.financial.badge")
                },
                {
                  title: t("profiles.consultants.title"),
                  description: t("profiles.consultants.description"),
                  badge: t("profiles.consultants.badge")
                },
                {
                  title: t("profiles.entrepreneurs.title"),
                  description: t("profiles.entrepreneurs.description"),
                  badge: t("profiles.entrepreneurs.badge")
                },
                {
                  title: t("profiles.researchers.title"),
                  description: t("profiles.researchers.description"),
                  badge: t("profiles.researchers.badge")
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
                {t("whyUs.eyebrow")}
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight mb-4">
                {t("whyUs.title")}
              </h2>
              <p className="text-body max-w-2xl mx-auto">
                {t("whyUs.subtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              <StatCard
                label={t("whyUs.stat1.label")}
                value={t("whyUs.stat1.value")}
                description={t("whyUs.stat1.description")}
                delay={0}
              />
              <StatCard
                label={t("whyUs.stat2.label")}
                value={t("whyUs.stat2.value")}
                description={t("whyUs.stat2.description")}
                delay={100}
              />
              <StatCard
                label={t("whyUs.stat3.label")}
                value={t("whyUs.stat3.value")}
                description={t("whyUs.stat3.description")}
                delay={200}
              />
              <StatCard
                label={t("whyUs.stat4.label")}
                value={t("whyUs.stat4.value")}
                description={t("whyUs.stat4.description")}
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
                {t("finalCta.title")}
              </h2>
              <p className="text-lead mb-8">
                {t("finalCta.subtitle")}
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
                  {t("finalCta.button")}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                {t("finalCta.footer")}
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LeyBeckham;