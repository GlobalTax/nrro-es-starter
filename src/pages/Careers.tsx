import { Meta } from "@/components/seo/Meta";
import { CareerApplicationForm } from "@/components/careers/CareerApplicationForm";
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal text-white mb-8 leading-tight">
              Construye tu carrera con nosotros
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Forma parte de un equipo comprometido con la excelencia y el desarrollo profesional continuo
            </p>
          </div>
        </div>
      </section>

      {/* Why NRRO Section */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Columna 1: Overline */}
            <div className="relative">
              <h3 className="font-mono font-light text-sm md:text-base tracking-tight text-foreground/70 pb-3">
                Cultura y Valores
              </h3>
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-border"></div>
            </div>
            
            {/* Columna 2: Título */}
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight">
                ¿Por qué trabajar en NRRO?
              </h2>
            </div>
            
            {/* Columna 3: Descripción */}
            <div>
              <p className="text-lg font-normal text-foreground leading-relaxed">
                Más que un trabajo, es una oportunidad para crecer profesionalmente en un entorno estimulante.
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
            Áreas donde podrías trabajar
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

      {/* Application Form Section */}
      <section id="aplicar" className="bg-white py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-mono font-light text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-4">
                Candidatura Espontánea
              </h2>
              <h3 className="text-2xl md:text-3xl font-normal mb-4">
                Envíanos tu candidatura
              </h3>
              <p className="text-body leading-relaxed">
                ¿No has encontrado ninguna vacante específica? No te preocupes, queremos conocerte igualmente. Envíanos tu CV y te contactaremos cuando surjan oportunidades que encajen con tu perfil.
              </p>
            </div>

            <Card>
              <CardContent className="p-8">
                <CareerApplicationForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

    </>
  );
}
