import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader, Overline } from "@/components/ui/typography";
import { TechnologyShowcase } from "@/components/home/TechnologyShowcase";
import { Meta } from "@/components/seo/Meta";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useScrollDepth } from "@/hooks/useScrollDepth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { FeaturedServiceCard } from "@/components/home/FeaturedServiceCard";
import { ArrowRight, Check } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { usePageContent } from "@/hooks/usePageContent";
import { HeroSectionContent, AboutContent, FeaturedServicesContent, LogosContent } from "@/types/pageContent";
import { BadgeHero } from "@/components/ui/badge-hero";
import { useHomeDatos } from "@/hooks/useHomeDatos";
import { StatCard } from "@/components/ui/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import DOMPurify from "dompurify";
import { HomeContactForm } from "@/components/home/HomeContactForm";

const Home = () => {
  const { trackCTAClick, trackPageView } = useAnalytics();
  const { t, language } = useLanguage();
  const { sourceSite } = useSiteConfig();
  useScrollDepth();
  
  // Track page view
  useEffect(() => {
    trackPageView("home");
  }, []);
  
  // Fetch dynamic content from DB
  const { data: heroData } = usePageContent('home', 'hero', language);
  const { data: aboutData } = usePageContent('home', 'about', language);
  const { data: serviciosDestacadosData } = usePageContent('home', 'servicios_destacados', language);
  const { data: tecnologiaData } = usePageContent('home', 'tecnologia', language);
  const { data: clientesData } = usePageContent('home', 'clientes', language);

  // Extract content with fallbacks
  const heroContent = heroData?.[0]?.content as HeroSectionContent | undefined;
  const aboutContent = aboutData?.[0]?.content as AboutContent | undefined;
  const serviciosDestacados = serviciosDestacadosData?.[0]?.content as FeaturedServicesContent | undefined;
  const tecnologiaContent = tecnologiaData?.[0]?.content as LogosContent | undefined;
  const clientesContent = clientesData?.[0]?.content as LogosContent | undefined;
  
  // Fetch datos/stats for the home page
  const { datos, isLoading: datosLoading } = useHomeDatos(language);

  // Fallback data
  const defaultClientLogos = [
    { name: "Empresa 1", logo_url: "https://via.placeholder.com/150x60?text=Logo+1" },
    { name: "Empresa 2", logo_url: "https://via.placeholder.com/150x60?text=Logo+2" },
    { name: "Empresa 3", logo_url: "https://via.placeholder.com/150x60?text=Logo+3" },
    { name: "Empresa 4", logo_url: "https://via.placeholder.com/150x60?text=Logo+4" },
    { name: "Empresa 5", logo_url: "https://via.placeholder.com/150x60?text=Logo+5" },
    { name: "Empresa 6", logo_url: "https://via.placeholder.com/150x60?text=Logo+6" },
    { name: "Empresa 7", logo_url: "https://via.placeholder.com/150x60?text=Logo+7" },
    { name: "Empresa 8", logo_url: "https://via.placeholder.com/150x60?text=Logo+8" },
    { name: "Empresa 9", logo_url: "https://via.placeholder.com/150x60?text=Logo+9" },
    { name: "Empresa 10", logo_url: "https://via.placeholder.com/150x60?text=Logo+10" },
  ];

  const clientLogos = clientesContent?.logos || defaultClientLogos;

  const { data: services } = useQuery({
    queryKey: ['featured-services', language, sourceSite],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select(`id, name_${language}, slug_${language}, name_es, slug_es`)
        .eq('is_active', true)
        .eq('source_site', sourceSite)
        .order('display_order', { ascending: true })
        .limit(4);
      
      if (error) throw error;
      
      // Map to consistent format with fallback to Spanish
      return data?.map((s: any) => ({
        id: s.id,
        name: s[`name_${language}`] || s.name_es,
        slug: s[`slug_${language}`] || s.slug_es,
      })) || [];
    },
  });

  const serviceLogos = (services || []).map((s) => ({ name: s.name }));
  
  // Fetch featured blog posts from Supabase (filtered by source_site)
  const { data: featuredPosts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['featured-blog-posts', language, sourceSite],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .eq('source_site', sourceSite)
        .order('published_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      
      // Map to consistent format with fallback to Spanish
      return data?.map((post: any) => ({
        id: post.id,
        title: post[`title_${language}`] || post.title_es,
        slug: post[`slug_${language}`] || post.slug_es,
        excerpt: post[`excerpt_${language}`] || post.excerpt_es,
        slug_es: post.slug_es,
        slug_en: post.slug_en,
        category: post.category,
        author_name: post.author_name,
        author_specialization: post.author_specialization,
        read_time: post.read_time,
        published_at: post.published_at,
      })) || [];
    },
  });

  return (
    <>
      <Meta
        title={t("index.meta.title")}
        description={t("index.meta.description")}
        canonicalUrl={window.location.href}
      />

      <div className="min-h-screen">
      {/* Hero Section */}
      <section data-dark="true" className="bg-black text-white pt-40 pb-32 md:pt-48 md:pb-40 lg:pt-56 lg:pb-48">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl text-left">
              <div className="mb-6">
                <BadgeHero>{t("home.hero.badge")}</BadgeHero>
              </div>
              <h1 
                className="hero-title mb-6"
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(
                    heroContent?.title || t("home.hero.title"),
                    {
                      ALLOWED_TAGS: ['br', 'strong', 'em'],
                      ALLOWED_ATTR: [],
                      ALLOW_DATA_ATTR: false,
                    }
                  )
                }}
              />
              <p className="text-lead mb-8">
                {heroContent?.subtitle || t("home.hero.subtitle")}
              </p>
              <div className="flex gap-4">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  onClick={() => trackCTAClick("Ver Servicios", "Hero")}
                >
                  <Link to={heroContent?.cta_primary?.link || "/servicios"}>
                    {heroContent?.cta_primary?.text || t("home.hero.cta_primary")}
                  </Link>
                </Button>
                <Button 
                  asChild 
                  size="lg" 
                  variant="outline" 
                  className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                  onClick={() => trackCTAClick("Contactar", "home_hero")}
                >
                  <Link to={heroContent?.cta_secondary?.link || "/contacto"}>
                    {heroContent?.cta_secondary?.text || t("home.hero.cta_secondary")}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="bg-background py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {/* Columna 1: Overline con línea */}
              <div className="relative">
                <h3 className="font-mono font-light text-sm md:text-base tracking-tight text-foreground/70 pb-3">
                  {aboutContent?.overline || t("home.about.overline")}
                </h3>
                {/* Línea horizontal debajo del texto */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-border"></div>
              </div>
              
              {/* Columna 2: Título principal */}
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight">
                  {aboutContent?.title || t("home.about.title")}
                </h2>
              </div>
              
              {/* Columna 3: Contenido */}
              <div className="space-y-6">
                {aboutContent?.paragraphs?.map((paragraph, index) => (
                  <p 
                    key={index} 
                    className={index === 0 ? "text-lg font-medium text-foreground leading-relaxed" : "text-body leading-relaxed"}
                  >
                    {paragraph}
                  </p>
                )) || (
                  <>
                    <p className="text-lg font-medium text-foreground leading-relaxed">
                      {t("home.about.paragraph1")}
                    </p>
                    <p className="text-body leading-relaxed">
                      {t("home.about.paragraph2")}
                    </p>
                  </>
                )}
                
                {aboutContent?.cta && (
                  <div className="pt-4">
                    <Link 
                      to={aboutContent.cta.link} 
                      className="inline-flex items-center text-foreground font-medium hover:text-accent transition-colors group border-b border-foreground hover:border-accent"
                    >
                      {aboutContent.cta.text}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Datos/Stats Section */}
        <section className="bg-neutral-50 py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-mono font-light text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-12 text-center">
              {t("home.stats.overline")}
            </h2>
            
            {datosLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-xl" />
                ))}
              </div>
            ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {datos.map((dato, index) => (
                <StatCard
                  key={index}
                  label={dato.categoria}
                  value={dato.valor}
                  description={dato.descripcion}
                  delay={index * 100}
                />
              ))}
            </div>
            )}
          </div>
        </section>

        {/* Servicios Relevantes */}
        <section className="bg-white py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Encabezado */}
            {serviciosDestacados?.overline && (
              <h2 className="font-mono font-light text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-12">
                {serviciosDestacados.overline}
              </h2>
            )}

            {/* Grid de servicios */}
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {serviciosDestacados?.services?.map((service, index) => (
                <FeaturedServiceCard
                  key={index}
                  title={service.title}
                  description={service.description}
                  category={service.category}
                  features={service.features}
                  slug_es={(service as any).slug_es}
                  slug_ca={(service as any).slug_ca}
                  slug_en={(service as any).slug_en}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Tecnología que usamos */}
        <section className="bg-neutral-50 py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {tecnologiaContent?.overline && (
              <h2 className="font-mono font-light text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-12 text-center">
                {tecnologiaContent.overline || t("home.technology.overline")}
              </h2>
            )}
            
            <TechnologyShowcase />
          </div>
        </section>

        {/* Carrusel de Logos */}
        <section className="bg-white py-16 md:py-20 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {clientesContent?.overline && (
              <h2 className="font-mono font-light text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-12 text-center">
                {clientesContent.overline || t("home.clients.overline")}
              </h2>
            )}
            
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 1500,
                })
              ]}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {clientLogos.map((logo, index) => (
                  <CarouselItem key={index} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5">
                    <div className="flex items-center justify-center h-24 p-4">
                      <img
                        src={logo.logo_url || `https://via.placeholder.com/150x60?text=${logo.name}`}
                        alt={logo.name}
                        className="max-h-full max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </section>

        {/* Contact Form */}
        <HomeContactForm />

        {/* Blog Preview */}
        <section className="bg-background py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-mono font-light text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-12 text-center">
            {t("home.blog.overline")}
          </h2>

            {postsLoading ? (
              <div className="grid md:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-96 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {featuredPosts.map((post) => (
                  <BlogPostCard
                    key={post.id}
                    slug={post.slug}
                    slug_es={post.slug_es}
                    slug_en={post.slug_en}
                    category={post.category}
                    title={post.title}
                    excerpt={post.excerpt}
                    authorName={post.author_name}
                    authorSpecialization={post.author_specialization}
                    publishedAt={post.published_at}
                    readTime={post.read_time}
                  />
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                onClick={() => trackCTAClick("Ver Todos los Artículos", "home_blog_section")}
              >
                <Link to="/blog">{t("home.blog.cta")}</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
