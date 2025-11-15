import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Meta } from "@/components/seo/Meta";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Users, Lightbulb, Target, Heart, TrendingUp, Code, Scale, Calculator, Building2, UserCheck, Briefcase } from "lucide-react";
import { OpenPositionsSection } from "@/components/careers/OpenPositionsSection";
import { CareersFAQSection } from "@/components/careers/CareersFAQSection";
import { CareerApplicationForm } from "@/components/careers/CareerApplicationForm";
import { JobPositionModal } from "@/components/careers/JobPositionModal";
import { JobPosition } from "@/types/jobPosition";
import { BadgeHero } from "@/components/ui/badge-hero";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

const Careers = () => {
  const { t, language } = useLanguage();
  const { trackPageView } = useAnalytics();
  const formRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<JobPosition | null>(null);
  
  // Refs para animaciones
  const benefitsRef = useRef<HTMLDivElement>(null);
  const areasRef = useRef<HTMLDivElement>(null);
  const isBenefitsInView = useInView(benefitsRef, { once: true, margin: "-100px" });
  const isAreasInView = useInView(areasRef, { once: true, margin: "-100px" });

  const handleApplyToPosition = (position: JobPosition) => {
    setSelectedPosition(position);
    setIsModalOpen(true);
  };

  // Generate FAQs for schema
  const faqs = Array.from({ length: 10 }, (_, i) => ({
    question: t(`careers.faq.items.${i}.question`),
    answer: t(`careers.faq.items.${i}.answer`)
  }));

  const benefits = [
    {
      icon: Trophy,
      title: t('careers.benefits.0.title'),
      description: t('careers.benefits.0.description')
    },
    {
      icon: Users,
      title: t('careers.benefits.1.title'),
      description: t('careers.benefits.1.description')
    },
    {
      icon: Lightbulb,
      title: t('careers.benefits.2.title'),
      description: t('careers.benefits.2.description')
    },
    {
      icon: Target,
      title: t('careers.benefits.3.title'),
      description: t('careers.benefits.3.description')
    },
    {
      icon: Heart,
      title: t('careers.benefits.4.title'),
      description: t('careers.benefits.4.description')
    },
    {
      icon: TrendingUp,
      title: t('careers.benefits.5.title'),
      description: t('careers.benefits.5.description')
    }
  ];

  const areas = [
    {
      icon: Scale,
      name: t('careers.areas.items.0.name'),
      description: t('careers.areas.items.0.description')
    },
    {
      icon: Calculator,
      name: t('careers.areas.items.1.name'),
      description: t('careers.areas.items.1.description')
    },
    {
      icon: Building2,
      name: t('careers.areas.items.2.name'),
      description: t('careers.areas.items.2.description')
    },
    {
      icon: UserCheck,
      name: t('careers.areas.items.3.name'),
      description: t('careers.areas.items.3.description')
    },
    {
      icon: Code,
      name: t('careers.areas.items.4.name'),
      description: t('careers.areas.items.4.description')
    },
    {
      icon: Briefcase,
      name: t('careers.areas.items.5.name'),
      description: t('careers.areas.items.5.description')
    }
  ];

  return (
    <>
      <Meta
        title={t('careers.meta.title')}
        description={t('careers.meta.description')}
        canonicalUrl={`${window.location.origin}/carreras`}
      />
      <BreadcrumbSchema items={[
        { name: "Inicio", url: "https://navarrotax.legal/" },
        { name: "Únete al Equipo", url: "https://navarrotax.legal/carreras" }
      ]} />
      <FAQSchema faqs={faqs} />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-black py-32 md:py-48 text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <BadgeHero>{t('careers.hero.badge')}</BadgeHero>
              </div>
              <h1 className="service-hero-title mb-8">
                {t('careers.hero.title')}
              </h1>
              <p className="service-hero-subtitle max-w-3xl mx-auto">
                {t('careers.hero.subtitle')}
              </p>
            </div>
          </div>
        </section>

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
                  <BreadcrumbPage>Únete al Equipo</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Culture & Values Section */}
        <section className="bg-background py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {/* Columna 1: Overline */}
              <div className="relative">
                <h3 className="font-mono font-light text-sm md:text-base tracking-tight text-foreground/70 pb-3">
                  {t('careers.whyUs.overline')}
                </h3>
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-border"></div>
              </div>
              
              {/* Columna 2: Título */}
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight">
                  {t('careers.whyUs.title')}
                </h2>
              </div>
              
              {/* Columna 3: Descripción */}
              <div>
                <p className="text-lg font-normal text-foreground leading-relaxed">
                  {t('careers.whyUs.description')}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16" ref={benefitsRef}>
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isBenefitsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                >
                  <Card className="hover-lift border-accent/20 h-full">
                    <CardContent className="p-6">
                      <div className="rounded-full bg-accent/10 w-12 h-12 flex items-center justify-center mb-4">
                        <benefit.icon className="h-6 w-6 text-accent" />
                      </div>
                      <h3 className="text-xl font-normal mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Areas Section */}
        <section className="bg-neutral-50 py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-mono font-light text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-12 text-center">
              {t('careers.areas.overline')}
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" ref={areasRef}>
              {areas.map((area, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isAreasInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                >
                  <Card className="hover-lift h-full">
                    <CardContent className="p-6 text-center">
                      <div className="rounded-full bg-accent/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <area.icon className="h-8 w-8 text-accent" />
                      </div>
                      <h3 className="text-lg font-normal mb-2">{area.name}</h3>
                      <p className="text-sm text-muted-foreground">{area.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions Section */}
        <OpenPositionsSection onApply={handleApplyToPosition} language={language} />

        {/* FAQ Section */}
        <CareersFAQSection />

        {/* Application Form Section */}
        <section ref={formRef} id="aplicar" className="bg-white py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-mono font-light text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-4">
                  {t('careers.application.overline')}
                </h2>
                <h3 className="text-2xl md:text-3xl font-normal mb-4">
                  {t('careers.application.title')}
                </h3>
                <p className="text-body leading-relaxed">
                  {t('careers.application.description')}
                </p>
              </div>

              <CareerApplicationForm 
                prefilledPosition={selectedPosition?.title}
                jobPositionId={selectedPosition?.id}
              />
            </div>
          </div>
        </section>

      </div>

      {/* Job Position Modal */}
        <JobPositionModal 
          position={selectedPosition}
          open={isModalOpen}
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) setSelectedPosition(null);
          }}
          onApply={(position) => {
            setIsModalOpen(false);
            setSelectedPosition(position);
            formRef.current?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
    </>
  );
};

export default Careers;
