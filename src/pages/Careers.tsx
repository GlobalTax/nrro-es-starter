import { Meta } from "@/components/seo/Meta";
import { BadgeHero } from "@/components/ui/badge-hero";
import { SectionHeader } from "@/components/ui/typography";
import { CareerApplicationForm } from "@/components/careers/CareerApplicationForm";
import { SelectionTimeline } from "@/components/careers/SelectionTimeline";
import { Card, CardContent } from "@/components/ui/card";
import {
  Target,
  Users,
  TrendingUp,
  Coffee,
  MapPin,
  Award,
  Scale,
  Briefcase,
  Calculator,
  Building2,
  Code,
  FileText,
} from "lucide-react";

const benefits = [
  {
    icon: Target,
    title: "Desarrollo profesional",
    description: "Formación continua y planes de carrera adaptados a tus objetivos profesionales.",
  },
  {
    icon: Users,
    title: "Ambiente colaborativo",
    description: "Equipo senior que comparte conocimiento y fomenta el trabajo en equipo.",
  },
  {
    icon: TrendingUp,
    title: "Proyectos desafiantes",
    description: "Clientes diversos y casos interesantes que te permitirán crecer profesionalmente.",
  },
  {
    icon: Coffee,
    title: "Work-life balance",
    description: "Horarios flexibles y posibilidad de teletrabajo para equilibrar vida personal y profesional.",
  },
  {
    icon: MapPin,
    title: "Ubicación céntrica",
    description: "Oficinas modernas en el centro de Barcelona con excelentes conexiones.",
  },
  {
    icon: Award,
    title: "Cultura de excelencia",
    description: "Compromiso con la calidad y la innovación en todos nuestros servicios.",
  },
];

const areas = [
  {
    icon: Scale,
    name: "Asesoría Fiscal",
    description: "Planificación y asesoramiento tributario para empresas y particulares.",
  },
  {
    icon: Briefcase,
    name: "Asesoría Laboral",
    description: "Gestión integral de recursos humanos y relaciones laborales.",
  },
  {
    icon: Calculator,
    name: "Contabilidad",
    description: "Servicios contables completos y reporting financiero.",
  },
  {
    icon: FileText,
    name: "Legal",
    description: "Asesoramiento jurídico empresarial y mercantil.",
  },
  {
    icon: Building2,
    name: "Administración",
    description: "Gestión administrativa y soporte operativo.",
  },
  {
    icon: Code,
    name: "Tecnología",
    description: "Desarrollo y mantenimiento de herramientas digitales.",
  },
];

export default function Careers() {
  return (
    <>
      <Meta
        title="Únete al Equipo - Trabaja con Nosotros"
        description="Construye tu carrera profesional en NRRO. Únete a nuestro equipo de asesores fiscales, laborales y contables en Barcelona. Envía tu candidatura."
        keywords="trabajar nrro, empleo asesoría fiscal barcelona, carrera profesional contable, ofertas trabajo fiscal barcelona, trabajar asesoría laboral"
        canonicalUrl={`${window.location.origin}/talento`}
      />

      {/* Hero Section */}
      <section className="bg-black py-32 md:py-48 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <BadgeHero>Únete al Equipo</BadgeHero>
            </div>
            <h1 className="service-hero-title mb-8">
              Construye tu carrera con nosotros
            </h1>
            <p className="service-hero-subtitle max-w-3xl mx-auto">
              Forma parte de un equipo comprometido con la excelencia y el desarrollo profesional continuo
            </p>
          </div>
        </div>
      </section>

      {/* Why NRRO Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            overline="Cultura y Valores"
            title="¿Por qué trabajar en NRRO?"
            description="Más que un trabajo, es una oportunidad para crecer profesionalmente en un entorno estimulante."
            className="text-center"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {benefits.map((benefit, index) => (
              <Card key={index} className="hover-lift border-accent/20">
                <CardContent className="p-6">
                  <div className="rounded-full bg-accent/10 w-12 h-12 flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
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
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            overline="Oportunidades"
            title="Áreas donde podrías trabajar"
            description="Buscamos talento en diferentes áreas de nuestro despacho."
            className="text-center"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {areas.map((area, index) => (
              <Card key={index} className="hover-lift">
                <CardContent className="p-6 text-center">
                  <div className="rounded-full bg-accent/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <area.icon className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{area.name}</h3>
                  <p className="text-sm text-muted-foreground">{area.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section id="aplicar" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <SectionHeader
              overline="Candidatura Espontánea"
              title="Envíanos tu candidatura"
              description="¿No has encontrado ninguna vacante específica? No te preocupes, queremos conocerte igualmente. Envíanos tu CV y te contactaremos cuando surjan oportunidades que encajen con tu perfil."
              className="text-center"
            />

            <div className="mt-12">
              <Card>
                <CardContent className="p-8">
                  <CareerApplicationForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Selection Process Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            overline="Proceso de Selección"
            title="Cómo será tu proceso"
            description="Un proceso transparente y estructurado para conocerte mejor."
            className="text-center"
          />

          <div className="max-w-4xl mx-auto mt-12">
            <SelectionTimeline />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-accent text-accent-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para dar el siguiente paso?
          </h2>
          <p className="text-lg mb-8 text-accent-foreground/90 max-w-2xl mx-auto">
            Envía tu candidatura hoy mismo y forma parte de nuestro equipo de profesionales.
          </p>
          <a
            href="#aplicar"
            className="inline-flex items-center justify-center rounded-md bg-background text-foreground px-8 py-3 text-base font-semibold hover:opacity-90 transition-opacity"
          >
            Enviar mi CV
          </a>
        </div>
      </section>
    </>
  );
}
