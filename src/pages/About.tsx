import { Meta } from '@/components/seo/Meta';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, TrendingUp, Award, Loader2, Briefcase, Rocket, Zap } from 'lucide-react';
import { BadgeHero } from '@/components/ui/badge-hero';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { TeamMemberCard } from '@/components/team/TeamMemberCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function About() {
  const { data: teamMembers, isLoading: teamLoading } = useTeamMembers();
  
  const values = [
    {
      icon: Award,
      title: 'Experiencia consolidada',
      description: '25 años en el sector garantizan conocimiento profundo, visión estratégica y capacidad de anticipación ante cualquier escenario fiscal o legal.',
    },
    {
      icon: Target,
      title: 'Rigor técnico absoluto',
      description: 'Formado en Garrigues, aplico los más altos estándares de calidad. Cada asesoramiento está respaldado por un análisis exhaustivo y actualización normativa constante.',
    },
    {
      icon: Users,
      title: 'Servicio 100% personalizado',
      description: 'Atención directa del socio, sin intermediarios. Conozco tu negocio, tus objetivos y tus preocupaciones. Relación de confianza a largo plazo.',
    },
    {
      icon: TrendingUp,
      title: 'Orientación a resultados',
      description: 'No solo cumplimiento: asesoramiento estratégico orientado a optimizar tu fiscalidad, proteger tu patrimonio e impulsar el crecimiento de tu empresa.',
    },
  ];

  return (
    <>
      <Meta
        title="Nosotros - Samuel L. Navarro"
        description="Samuel L. Navarro: 25 años de experiencia en asesoría fiscal y legal. De Garrigues a obn.es, ahora un proyecto personal en Barcelona con servicio 100% personalizado."
        keywords="samuel navarro, navarro tax legal, asesoría fiscal barcelona, garrigues, experiencia fiscal"
      />

      {/* Hero Section */}
      <section className="bg-black py-32 md:py-48 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <BadgeHero>Nosotros</BadgeHero>
            </div>
            <h1 className="service-hero-title mb-8">
              25 años de experiencia. Un proyecto personal.
            </h1>
            <p className="service-hero-subtitle max-w-3xl mx-auto">
              De Garrigues a obn.es, y ahora navarro. Experiencia consolidada, servicio personalizado, máxima ilusión.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="section-overline mb-4">Mi trayectoria</div>
              <h2 className="text-3xl md:text-4xl font-normal mb-8">
                25 años construyendo relaciones de confianza
              </h2>
              <div className="space-y-4 service-body">
                <p>
                  Soy <span className="font-medium text-foreground">Samuel L. Navarro</span>, y llevo más de 25 años dedicado a la asesoría fiscal y legal empresarial. Mi carrera comenzó en <span className="font-medium text-foreground">Garrigues</span>, donde me formé en los más altos estándares de rigor técnico y excelencia profesional, trabajando en operaciones complejas y clientes de primer nivel.
                </p>
                <p>
                  Durante 9 años, desde 2016 hasta 2025, formé parte del equipo de <span className="font-medium text-foreground">obn.es</span>, donde tuve la oportunidad de asesorar a cerca de <span className="font-medium text-foreground">300 empresas y profesionales</span> en sus decisiones fiscales y estratégicas más importantes. Esos años consolidaron mi especialización y me permitieron desarrollar una metodología de trabajo basada en la cercanía, la anticipación y el compromiso con el resultado.
                </p>
                <p>
                  En 2025 nace <span className="font-medium text-foreground">navarro</span>, mi proyecto personal. Un despacho independiente en el Eixample barcelonés donde puedo ofrecer lo que realmente marca la diferencia: <span className="font-medium text-foreground">atención directa del socio, servicio personalizado y 25 años de experiencia desde el primer día.</span>
                </p>
                <p>
                  En navarro, cada cliente es único. Trabajo personalmente cada caso, sin intermediarios. Y cuando un proyecto requiere capacidades adicionales, cuento con una red consolidada de más de 60 colaboradores especializados en todas las áreas: laboral, contable, jurídica, auditoría. La agilidad de un profesional independiente con la capacidad de un gran equipo.
                </p>
                <p className="font-medium text-foreground pt-4">
                  Más experiencia. Más cercanía. Más compromiso.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="section-overline mb-4">Trayectoria</div>
              <h2 className="text-3xl md:text-4xl font-normal mb-4">
                Experiencia consolidada
              </h2>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-display font-normal text-foreground mb-2">2000-2016</div>
                <div className="text-sm font-medium text-foreground mb-2">Garrigues</div>
                <p className="text-sm text-muted-foreground">
                  Formación en uno de los despachos más prestigiosos de España
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-display font-normal text-foreground mb-2">2016-2025</div>
                <div className="text-sm font-medium text-foreground mb-2">obn.es</div>
                <p className="text-sm text-muted-foreground">
                  9 años asesorando ~300 empresas. Consolidación de especialización.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                  <Rocket className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-display font-normal text-accent mb-2">2025</div>
                <div className="text-sm font-medium text-foreground mb-2">navarro</div>
                <p className="text-sm text-muted-foreground">
                  Fundación del despacho. Oficinas en el Eixample, Barcelona.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-accent" />
                </div>
                <div className="text-4xl font-display font-normal text-accent mb-2">2025+</div>
                <div className="text-sm font-medium text-foreground mb-2">Visión</div>
                <p className="text-sm text-muted-foreground">
                  Consolidar un despacho de referencia basado en la confianza y la especialización
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

      {/* Why Navarro Section */}
      <section className="py-16 md:py-24 bg-white border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="section-overline mb-4">Diferenciación</div>
            <h2 className="text-3xl md:text-4xl font-normal mb-4">
              Por qué elegir navarro
            </h2>
            <p className="text-lead max-w-2xl mx-auto text-body">
              Lo mejor de ambos mundos: experiencia de gran despacho, cercanía de profesional independiente.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-border bg-muted">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center mb-4">
                  <Award className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-medium text-foreground mb-3">
                  Experiencia senior desde el primer día
                </h3>
                <p className="service-body">
                  Trabajas directamente con un profesional de 25 años de experiencia, formado en Garrigues. No junior supervisado, no intermediarios.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-muted">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center mb-4">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-medium text-foreground mb-3">
                  Agilidad y servicio personalizado
                </h3>
                <p className="service-body">
                  Sin burocracia de grandes estructuras. Respuestas rápidas, soluciones a medida. Tu caso es mi prioridad.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-muted">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center mb-4">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-medium text-foreground mb-3">
                  Equipo multidisciplinar cuando lo necesites
                </h3>
                <p className="service-body">
                  Capacidad de movilizar más de 60 colaboradores especializados en todas las áreas. La flexibilidad de un independiente, la capacidad de un gran equipo.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-muted border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center max-w-6xl mx-auto">
            <div>
              <div className="stat-number mb-2">
                25
              </div>
              <p className="text-sm text-body uppercase tracking-wider">
                Años de experiencia profesional
              </p>
            </div>
            <div>
              <div className="stat-number mb-2">
                ~300
              </div>
              <p className="text-sm text-body uppercase tracking-wider">
                Clientes asesorados
              </p>
            </div>
            <div>
              <div className="stat-number mb-2">
                1
              </div>
              <p className="text-sm text-body uppercase tracking-wider">
                Socio · 100% compromiso
              </p>
            </div>
            <div>
              <div className="stat-number mb-2">
                60+
              </div>
              <p className="text-sm text-body uppercase tracking-wider">
                Colaboradores especializados
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section - Fundador */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="section-overline mb-4">Fundador</div>
            <h2 className="text-3xl md:text-4xl font-normal mb-4">
              Samuel L. Navarro
            </h2>
            <p className="text-lead max-w-2xl mx-auto text-body">
              En navarro trabajas directamente conmigo. 25 años de experiencia al servicio de tu empresa, con la cercanía y el compromiso que solo un profesional independiente puede ofrecer.
            </p>
          </div>

          {teamLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : teamMembers && teamMembers.length > 0 ? (
            <div className="max-w-2xl mx-auto">
              {teamMembers.map((member) => (
                <TeamMemberCard
                  key={member.id}
                  name={member.name}
                  position={member.position}
                  bio={member.bio}
                  specialization={member.specialization}
                  linkedin={member.linkedin}
                  email={member.email}
                  avatarUrl={member.avatar_url}
                />
              ))}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto bg-muted rounded-lg p-8 shadow-sm">
              <p className="text-center text-muted-foreground mb-4">
                Perfil profesional en construcción.
              </p>
              <p className="text-center text-sm text-muted-foreground">
                Mientras tanto, puedes contactarme directamente para cualquier consulta.
              </p>
            </div>
          )}

          <div className="mt-16 text-center">
            <h3 className="text-2xl font-normal text-foreground mb-4">
              Red de colaboradores especializados
            </h3>
            <p className="text-body max-w-2xl mx-auto">
              Para proyectos que requieren capacidades multidisciplinares, cuento con una red consolidada de más de 60 profesionales especializados en fiscalidad, laboral, contabilidad, auditoría, derecho mercantil y más. La agilidad de trabajar conmigo, la capacidad de un gran equipo.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary via-primary-hover to-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary-hover/90 to-accent/90" />
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-white mb-6 leading-tight">
              ¿Hablamos de tu proyecto?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              25 años de experiencia. Un nuevo despacho. El mismo compromiso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/contacto">Solicitar consulta</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 border-white text-white hover:bg-white/20 hover:text-white" 
                asChild
              >
                <Link to="/servicios">Ver servicios</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
