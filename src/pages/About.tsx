import { Meta } from '@/components/seo/Meta';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { mainBreadcrumbs } from '@/lib/seoUtils';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, TrendingUp, Award, Briefcase, Rocket, Zap, Building, Handshake, CheckCircle, Sparkles } from 'lucide-react';
import { BadgeHero } from '@/components/ui/badge-hero';
import { usePageContent } from '@/hooks/usePageContent';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useLanguage } from '@/contexts/LanguageContext';

export default function About() {
  const { t, language } = useLanguage();
  const { trackPageView, trackCTAClick } = useAnalytics();
  const { data: heroContent } = usePageContent('about', 'hero', language);
  const { data: storyContent } = usePageContent('about', 'story', language);
  const { data: timelineContent } = usePageContent('about', 'timeline', language);
  const { data: valuesContent } = usePageContent('about', 'values', language);
  const { data: diferenciacionContent } = usePageContent('about', 'diferenciacion', language);
  const { data: statsContent } = usePageContent('about', 'stats', language);
  const { data: founderContent } = usePageContent('about', 'founder', language);
  
  // Track page view
  useEffect(() => {
    trackPageView("nosotros");
  }, []);
  
  const heroData = heroContent?.[0];
  const hero = heroData?.content || {
    overline: 'NOSOTROS',
    title: '25 años de experiencia. Un proyecto personal.',
    subtitle: 'De Garrigues a obn.es, y ahora navarro. Experiencia consolidada, servicio personalizado, máxima ilusión.'
  };

  const storyData = storyContent?.[0];
  const story = storyData?.content || {
    overline: 'Mi trayectoria',
    titulo: '25 años construyendo relaciones de confianza',
    parrafos: [],
    destacado: ''
  };

  const timelineData = timelineContent?.[0];
  const timeline = timelineData?.content || {
    overline: 'Trayectoria',
    hitos: []
  };

  const valuesData = valuesContent?.[0];
  const values = valuesData?.content || {
    overline: 'Nuestros Valores',
    valores: []
  };

  const diferenciacionData = diferenciacionContent?.[0];
  const diferenciacion = diferenciacionData?.content || {
    overline: 'Diferenciación',
    cards: []
  };

  const statsData = statsContent?.[0];
  const stats = statsData?.content || {
    overline: 'Navarro en cifras',
    stats: []
  };

  const founderData = founderContent?.[0];
  const founder = founderData?.content || {
    overline: 'Fundador',
    nombre: 'Samuel L. Navarro',
    parrafos: [],
    cta_texto: 'Conoce al equipo completo',
    cta_url: '/equipo'
  };

  // Icon mapping
  const iconMap: Record<string, any> = {
    Award,
    Target,
    Users,
    TrendingUp,
    Briefcase,
    Rocket,
    Building,
    Handshake,
    CheckCircle,
    Sparkles,
    Zap
  };

  return (
    <>
      <Meta
        title={t('about.meta.title')}
        description={t('about.meta.description')}
        keywords={t('about.meta.keywords')}
      />
      <BreadcrumbSchema items={mainBreadcrumbs.about} />

      {/* Hero Section */}
      <section className="bg-black py-32 md:py-48 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <BadgeHero>{hero.overline}</BadgeHero>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal text-white mb-8 leading-tight">
              {hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              {hero.subtitle}
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
                <BreadcrumbPage>Nosotros</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Story Section */}
      {storyData?.is_active && (
        <section className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h3 className="font-mono text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-8">
                {story.overline}
              </h3>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal mb-8 leading-tight">
                {story.titulo}
              </h2>
              <div className="space-y-4">
                {story.parrafos.map((parrafo, index) => (
                  <p key={index} className="text-base md:text-lg text-foreground/80 leading-relaxed" 
                     dangerouslySetInnerHTML={{ __html: parrafo }} />
                ))}
                {story.destacado && (
                  <p className="text-base md:text-lg text-foreground font-medium pt-4">
                    {story.destacado}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Timeline Section */}
      {timelineData?.is_active && (
        <section className="py-20 md:py-28 bg-neutral-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-mono text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-12 text-center">
                {timeline.overline}
              </h2>
              
              <div className="grid md:grid-cols-4 gap-8">
                {timeline.hitos.map((hito, index) => {
                  const Icon = iconMap[hito.icon] || Briefcase;
                  return (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="text-4xl font-normal text-foreground mb-2">{hito.periodo}</div>
                      <div className="text-sm font-medium text-foreground mb-2">{hito.titulo}</div>
                      <p className="text-sm text-muted-foreground">
                        {hito.descripcion}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Values Section */}
      {valuesData?.is_active && (
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-mono text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-12 text-center">
              {values.overline}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {values.valores.map((valor, index) => {
                const Icon = iconMap[valor.icon] || Award;
                return (
                  <div key={index} className="bg-neutral-50 rounded-lg p-8">
                    <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center mb-4">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-medium text-foreground mb-3">
                      {valor.titulo}
                    </h3>
                    <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
                      {valor.descripcion}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Diferenciacion Section */}
      {diferenciacionData?.is_active && (
        <section className="py-20 md:py-28 bg-neutral-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-mono text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-12 text-center">
              {diferenciacion.overline}
            </h2>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
              {diferenciacion.cards.map((card, index) => {
                const Icon = iconMap[card.icon] || Award;
                return (
                  <div key={index} className="bg-white rounded-lg p-8 lg:p-10">
                    <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center mb-4">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl lg:text-2xl font-normal mb-3">
                      {card.titulo}
                    </h3>
                    <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
                      {card.descripcion}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      {statsData?.is_active && (
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-mono text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-12 text-center">
              {stats.overline}
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center max-w-6xl mx-auto">
              {stats.stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-5xl md:text-6xl font-normal text-foreground mb-2">{stat.valor}</div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">
                    {stat.descripcion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Founder Section */}
      {founderData?.is_active && (
        <section className="py-20 md:py-28 bg-neutral-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-mono text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-12 text-center">
              {founder.overline}
            </h2>
            
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-normal mb-6">
                {founder.nombre}
              </h3>
              {founder.parrafos.map((parrafo, index) => (
                <p key={index} className="text-base md:text-lg text-foreground/80 leading-relaxed mb-8">
                  {parrafo}
                </p>
              ))}
            </div>

            {/* CTA para ver el equipo completo */}
            <div className="max-w-3xl mx-auto text-center mt-12">
              <Link to={founder.cta_url}>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="group"
                  onClick={() => trackCTAClick(founder.cta_texto, "nosotros_team_section")}
                >
                  {founder.cta_texto}
                  <Users className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Final */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary via-primary-hover to-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-white mb-6 leading-tight">
              {t('about.cta.title')}
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              {t('about.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary" 
                asChild
                onClick={() => trackCTAClick(t('about.cta.contactButton'), "nosotros_final_cta")}
              >
                <Link to="/contacto">{t('about.cta.contactButton')}</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20" asChild>
                <Link to="/servicios">{t('about.cta.servicesButton')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
