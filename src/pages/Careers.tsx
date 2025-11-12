import { useRef, useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Meta } from "@/components/seo/Meta";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Users, Lightbulb, Target, Heart, TrendingUp, Code, Scale, Calculator, Building2, UserCheck, Briefcase } from "lucide-react";
import { OpenPositionsSection } from "@/components/careers/OpenPositionsSection";

import { CareerApplicationForm } from "@/components/careers/CareerApplicationForm";
import { JobPositionModal } from "@/components/careers/JobPositionModal";
import { JobPosition } from "@/types/jobPosition";
import { BadgeHero } from "@/components/ui/badge-hero";

const Careers = () => {
  const { trackPageView } = useAnalytics();
  const formRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<JobPosition | null>(null);

  const handleApplyToPosition = (position: JobPosition) => {
    setSelectedPosition(position);
    setIsModalOpen(true);
  };

  const benefits = [
    {
      icon: Trophy,
      title: "Excelencia Profesional",
      description: "Trabaja en proyectos de alto impacto con clientes líderes"
    },
    {
      icon: Users,
      title: "Equipo de Expertos",
      description: "Colabora con profesionales experimentados"
    },
    {
      icon: Lightbulb,
      title: "Innovación Continua",
      description: "Acceso a las últimas tecnologías y metodologías"
    },
    {
      icon: Target,
      title: "Desarrollo Profesional",
      description: "Formación continua y planes de carrera personalizados"
    },
    {
      icon: Heart,
      title: "Equilibrio Vida-Trabajo",
      description: "Horarios flexibles y teletrabajo"
    },
    {
      icon: TrendingUp,
      title: "Crecimiento",
      description: "Oportunidades reales de promoción interna"
    }
  ];

  const areas = [
    {
      icon: Scale,
      name: "Legal",
      description: "Asesoría jurídica especializada"
    },
    {
      icon: Calculator,
      name: "Fiscal",
      description: "Planificación y optimización fiscal"
    },
    {
      icon: Building2,
      name: "Contable",
      description: "Gestión contable y financiera"
    },
    {
      icon: UserCheck,
      name: "Laboral",
      description: "Recursos humanos y relaciones laborales"
    },
    {
      icon: Code,
      name: "Tecnología",
      description: "Transformación digital y sistemas"
    },
    {
      icon: Briefcase,
      name: "Consultoría",
      description: "Estrategia empresarial y M&A"
    }
  ];

  return (
    <>
      <Meta
        title="Trabaja con Nosotros - Únete a Nuestro Equipo"
        description="Únete a nuestro equipo de expertos y desarrolla tu carrera profesional en un entorno de excelencia"
        canonicalUrl={`${window.location.origin}/carreras`}
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-black py-32 md:py-48 text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <BadgeHero>Carreras</BadgeHero>
              </div>
              <h1 className="service-hero-title mb-8">
                Construye tu Futuro Profesional con Nosotros
              </h1>
              <p className="service-hero-subtitle max-w-3xl mx-auto">
                Únete a nuestro equipo de expertos y desarrolla tu carrera profesional en un entorno de excelencia.
              </p>
            </div>
          </div>
        </section>

        {/* Culture & Values Section */}
        <section className="bg-background py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {/* Columna 1: Overline */}
              <div className="relative">
                <h3 className="font-mono font-light text-sm md:text-base tracking-tight text-foreground/70 pb-3">
                  Por Qué Elegirnos
                </h3>
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-border"></div>
              </div>
              
              {/* Columna 2: Título */}
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight">
                  Un Lugar para Crecer
                </h2>
              </div>
              
              {/* Columna 3: Descripción */}
              <div>
                <p className="text-lg font-normal text-foreground leading-relaxed">
                  En NRRO, creemos en el desarrollo continuo de nuestro equipo. Ofrecemos un ambiente de trabajo colaborativo donde la excelencia profesional se combina con el equilibrio personal.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
              {benefits.map((benefit, index) => (
                <Card key={index} className="hover-lift border-accent/20">
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
              ))}
            </div>
          </div>
        </section>

        {/* Areas Section */}
        <section className="bg-neutral-50 py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-mono font-light text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-12 text-center">
              Áreas de Trabajo
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {areas.map((area, index) => (
                <Card key={index} className="hover-lift">
                  <CardContent className="p-6 text-center">
                    <div className="rounded-full bg-accent/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <area.icon className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="text-lg font-normal mb-2">{area.name}</h3>
                    <p className="text-sm text-muted-foreground">{area.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions Section */}
        <OpenPositionsSection onApply={handleApplyToPosition} />

        {/* Application Form Section */}
        <section ref={formRef} id="aplicar" className="bg-white py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-mono font-light text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-4">
                  Aplica Ahora
                </h2>
                <h3 className="text-2xl md:text-3xl font-normal mb-4">
                  Únete a Nuestro Equipo
                </h3>
                <p className="text-body leading-relaxed">
                  Envíanos tu candidatura y nos pondremos en contacto contigo
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
