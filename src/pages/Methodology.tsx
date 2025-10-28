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
        <section className="bg-black py-32 md:py-48 text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="service-hero-overline mb-6">Nuestro Enfoque</div>
              <h1 className="service-hero-title mb-8">
                Metodología de Trabajo
              </h1>
              <p className="service-hero-subtitle max-w-3xl mx-auto">
                Trabajamos con un método probado que combina experiencia profesional, 
                trato personalizado y tecnología para ofrecer el mejor servicio a nuestros clientes.
              </p>
            </div>
          </div>
        </section>

        {/* Nuestra Filosofía */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <div className="section-overline mb-4">Nuestra Filosofía</div>
              <h2 className="text-3xl md:text-4xl font-normal mb-8">
                Soluciones personalizadas para cada cliente
              </h2>
              <div className="space-y-4 service-body">
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
        <section className="py-16 md:py-24 bg-muted">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="section-overline mb-4">Proceso</div>
              <h2 className="text-3xl md:text-4xl font-normal mb-4">
                Cómo Trabajamos Contigo
              </h2>
              <p className="service-body max-w-2xl mx-auto">
                Un proceso claro y estructurado en 4 fases
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <Card key={step.title} className="border-border bg-white">
                    <div className="p-8 relative">
                      <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black flex items-center justify-center">
                        <span className="text-white font-medium text-lg">{idx + 1}</span>
                      </div>
                      <Icon className="h-10 w-10 text-foreground/40 mb-6" strokeWidth={1.5} />
                      <h3 className="text-xl font-medium mb-3">{step.title}</h3>
                      <p className="service-body">{step.description}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Valores Diferenciales */}
        <section className="py-16 md:py-24 bg-white border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="section-overline mb-4">Valores</div>
              <h2 className="text-3xl md:text-4xl font-normal mb-4">
                Lo que nos Diferencia
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="border-border bg-white">
                <div className="p-8 text-center">
                  <h3 className="text-xl font-medium mb-3">Proximidad</h3>
                  <p className="service-body">
                    Trato cercano y personalizado. Tu asesor te conoce y conoce tu negocio.
                  </p>
                </div>
              </Card>
              <Card className="border-border bg-white">
                <div className="p-8 text-center">
                  <h3 className="text-xl font-medium mb-3">Multidisciplinar</h3>
                  <p className="service-body">
                    Equipo experto en todas las áreas: fiscal, contable, legal y laboral.
                  </p>
                </div>
              </Card>
              <Card className="border-border bg-white">
                <div className="p-8 text-center">
                  <h3 className="text-xl font-medium mb-3">Tecnología</h3>
                  <p className="service-body">
                    Plataformas digitales para gestión eficiente y acceso 24/7 a tu información.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Methodology;
