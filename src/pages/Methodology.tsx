import { Card } from "@/components/ui/card";
import { Overline, SectionHeader } from "@/components/ui/typography";
import { Meta } from "@/components/seo/Meta";
import { Target, Users, Zap, TrendingUp } from "lucide-react";

const Methodology = () => {
  const steps = [
    {
      icon: Target,
      title: "Análisis Inicial",
      description:
        "Estudiamos tu situación actual para entender tus necesidades específicas y objetivos empresariales.",
    },
    {
      icon: Users,
      title: "Propuesta Personalizada",
      description:
        "Diseñamos una estrategia adaptada a tu negocio con servicios, plazos y honorarios claros.",
    },
    {
      icon: Zap,
      title: "Implementación",
      description:
        "Ejecutamos el plan con eficiencia, manteniéndote informado en todo momento del proceso.",
    },
    {
      icon: TrendingUp,
      title: "Seguimiento Continuo",
      description:
        "Acompañamiento permanente y revisiones periódicas para asegurar el cumplimiento de tus objetivos.",
    },
  ];

  return (
    <>
      <Meta
        title="Nuestra Metodología"
        description="Descubre cómo trabajamos en NRRO: análisis, propuesta personalizada, implementación y seguimiento continuo para tu empresa"
        canonicalUrl={`${window.location.origin}/metodologia`}
      />

      <div className="min-h-screen">
        {/* Hero */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-4xl">
            <Overline className="mb-4">Nuestro Enfoque</Overline>
            <h1 className="mb-6">Metodología de Trabajo</h1>
            <p className="text-lead">
              Trabajamos con un método probado que combina experiencia profesional, 
              trato personalizado y tecnología para ofrecer el mejor servicio a nuestros clientes.
            </p>
          </div>
        </section>

        {/* Nuestra Filosofía */}
        <section className="border-y border-border bg-neutral-100 py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="mb-8">Nuestra Filosofía</h2>
              <div className="space-y-6 text-body leading-relaxed">
                <p>
                  En NRRO creemos que cada empresa es única y requiere soluciones personalizadas.
                  No aplicamos fórmulas estándar, sino que adaptamos nuestros servicios a las
                  necesidades reales de cada cliente.
                </p>
                <p>
                  Combinamos la experiencia de más de 25 años en asesoría con las últimas
                  herramientas tecnológicas para ofrecer un servicio eficiente, transparente
                  y de máxima calidad.
                </p>
                <p>
                  Nuestro compromiso es ser tu socio estratégico, no solo tu asesor. Queremos
                  que tu empresa crezca y nosotros crecer contigo, manteniendo una relación
                  de confianza a largo plazo basada en resultados tangibles.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Proceso de Trabajo */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <SectionHeader
            overline="Proceso"
            title="Cómo Trabajamos Contigo"
            description="Un proceso claro y estructurado en 4 fases"
          />

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
            {steps.map((step, idx) => (
              <Card key={step.title} className="p-8 relative">
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">{idx + 1}</span>
                </div>
                <step.icon className="h-10 w-10 text-accent mb-6" strokeWidth={1.5} />
                <h3 className="text-xl font-serif mb-3">{step.title}</h3>
                <p className="text-body leading-relaxed">{step.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Valores Diferenciales */}
        <section className="bg-neutral-100 py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              overline="Valores"
              title="Lo que nos Diferencia"
              description="Nuestros pilares de trabajo"
            />

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl">
              <Card className="p-8 text-center">
                <h3 className="text-xl font-serif mb-3">Proximidad</h3>
                <p className="text-body leading-relaxed">
                  Trato cercano y personalizado. Tu asesor te conoce y conoce tu negocio.
                </p>
              </Card>
              <Card className="p-8 text-center">
                <h3 className="text-xl font-serif mb-3">Multidisciplinar</h3>
                <p className="text-body leading-relaxed">
                  Equipo experto en todas las áreas: fiscal, contable, legal y laboral.
                </p>
              </Card>
              <Card className="p-8 text-center">
                <h3 className="text-xl font-serif mb-3">Tecnología</h3>
                <p className="text-body leading-relaxed">
                  Plataformas digitales para gestión eficiente y acceso 24/7 a tu información.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Methodology;
