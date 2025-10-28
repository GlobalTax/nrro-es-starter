import { Meta } from '@/components/seo/Meta';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, TrendingUp, Award } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: Users,
      title: 'Compromiso con el cliente',
      description: 'Construimos relaciones duraderas basadas en la confianza y el servicio excepcional.',
    },
    {
      icon: Target,
      title: 'Precisión y rigor',
      description: 'Aplicamos los más altos estándares de calidad en cada proyecto que desarrollamos.',
    },
    {
      icon: TrendingUp,
      title: 'Orientación a resultados',
      description: 'Nos enfocamos en soluciones que generen valor real y tangible para nuestros clientes.',
    },
    {
      icon: Award,
      title: 'Excelencia profesional',
      description: 'Nuestro equipo se mantiene constantemente actualizado en las últimas normativas.',
    },
  ];

  return (
    <>
      <Meta
        title="Nosotros"
        description="Conoce a Navarro Tax Legal - NRRO. Más de 25 años de experiencia en asesoría fiscal, contable y legal en Barcelona."
        keywords="sobre navarro tax legal, quienes somos nrro, asesoría fiscal Barcelona historia"
      />

      {/* Hero Section */}
      <section className="bg-black py-32 md:py-48 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="service-hero-overline mb-6">Nosotros</div>
            <h1 className="service-hero-title mb-8">
              Sobre Nosotros
            </h1>
            <p className="service-hero-subtitle max-w-3xl mx-auto">
              Más de 25 años transformando la gestión fiscal y contable en un verdadero impulso para empresas y profesionales.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="section-overline mb-4">Nuestra Historia</div>
              <h2 className="text-3xl md:text-4xl font-normal mb-8">
                Creciendo junto a nuestros clientes
              </h2>
              <div className="space-y-4 service-body">
                <p>
                  Fundada con la visión de ofrecer servicios de asesoría fiscal y contable de máxima calidad, 
                  <span className="font-medium text-foreground"> navarro</span> se ha consolidado como un referente en Barcelona 
                  gracias a nuestro compromiso inquebrantable con la excelencia y el servicio personalizado.
                </p>
                <p>
                  A lo largo de más de 25 años, hemos acompañado a cientos de empresas y profesionales en su crecimiento, 
                  adaptándonos constantemente a los cambios normativos y las necesidades del mercado. Nuestra filosofía se 
                  basa en convertir la gestión fiscal y contable en una ventaja competitiva para nuestros clientes.
                </p>
                <p>
                  En 2025, dimos un paso más en nuestra evolución trasladándonos a nuestras nuevas oficinas en el corazón del 
                  Eixample barcelonés, un espacio diseñado para ofrecer el mejor servicio en un entorno profesional de primer nivel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="section-overline mb-4">Nuestros Valores</div>
            <h2 className="text-3xl md:text-4xl font-normal mb-4">
              Los principios que guían nuestro trabajo
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card
                  key={value.title}
                  className="border-border bg-white"
                >
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center mb-4">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-medium text-foreground mb-3">
                      {value.title}
                    </h3>
                    <p className="service-body">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-white border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center max-w-5xl mx-auto">
            <div>
              <div className="stat-number mb-2">
                25+
              </div>
              <p className="text-sm text-body uppercase tracking-wider">
                Años de experiencia
              </p>
            </div>
            <div>
              <div className="stat-number mb-2">
                500+
              </div>
              <p className="text-sm text-body uppercase tracking-wider">
                Clientes satisfechos
              </p>
            </div>
            <div>
              <div className="stat-number mb-2">
                100%
              </div>
              <p className="text-sm text-body uppercase tracking-wider">
                Compromiso con la calidad
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
