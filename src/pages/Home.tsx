import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";
import { LogoGrid } from "@/components/ui/logo-grid";
import { SectionHeader, Overline } from "@/components/ui/typography";
import { Meta } from "@/components/seo/Meta";
import { useAnalytics } from "@/hooks/useAnalytics";
import { blogPosts, services } from "@/data/mockData";
import { ArrowRight, Check } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const Home = () => {
  const { trackCTAClick } = useAnalytics();

  const kpis = [
    { label: "Años de Experiencia", value: "25+" },
    { label: "Clientes Activos", value: "500+" },
    { label: "Operaciones Anuales", value: "2.000+" },
    { label: "Satisfacción", value: "98%" },
  ];

  const clientLogos = [
    { name: "Empresa 1", src: "https://via.placeholder.com/150x60?text=Logo+1" },
    { name: "Empresa 2", src: "https://via.placeholder.com/150x60?text=Logo+2" },
    { name: "Empresa 3", src: "https://via.placeholder.com/150x60?text=Logo+3" },
    { name: "Empresa 4", src: "https://via.placeholder.com/150x60?text=Logo+4" },
    { name: "Empresa 5", src: "https://via.placeholder.com/150x60?text=Logo+5" },
    { name: "Empresa 6", src: "https://via.placeholder.com/150x60?text=Logo+6" },
    { name: "Empresa 7", src: "https://via.placeholder.com/150x60?text=Logo+7" },
    { name: "Empresa 8", src: "https://via.placeholder.com/150x60?text=Logo+8" },
    { name: "Empresa 9", src: "https://via.placeholder.com/150x60?text=Logo+9" },
    { name: "Empresa 10", src: "https://via.placeholder.com/150x60?text=Logo+10" },
  ];

  const serviceLogos = services.slice(0, 4).map((s) => ({ name: s.name }));
  const featuredPosts = blogPosts.slice(0, 3);

  return (
    <>
      <Meta
        title="NRRO - Asesoría Fiscal, Contable y Legal en Barcelona"
        description="Soluciones integrales de asesoría fiscal, contable, legal y laboral para empresas y autónomos en Barcelona. Más de 25 años de experiencia."
        keywords="asesoría fiscal Barcelona, gestoría Barcelona, abogados Barcelona, asesor contable"
        canonicalUrl={window.location.origin}
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-32 md:py-48 lg:py-56">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl text-left">
              <h1 className="hero-title mb-6">
                Soluciones fiscales, contables y legales para tu empresa en Barcelona
              </h1>
              <p className="text-lead mb-8">
                Asesoría integral con más de 25 años de experiencia. Servicios personalizados 
                en fiscalidad, contabilidad, derecho mercantil y gestión laboral para empresas 
                y autónomos.
              </p>
              <div className="flex gap-4">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  onClick={() => trackCTAClick("Ver Servicios", "Hero")}
                >
                  <Link to="/servicios">Nuestros Servicios</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                  <Link to="/contacto">Contactar</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* KPIs */}
        <section className="border-y border-border bg-neutral-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {kpis.map((kpi) => (
                <Stat key={kpi.label} label={kpi.label} value={kpi.value} />
              ))}
            </dl>
          </div>
        </section>

        {/* About Section */}
        <section className="bg-background py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {/* Columna 1: Nosotros navarro con línea */}
              <div className="relative">
                <h3 className="font-mono font-light text-sm md:text-base tracking-tight text-foreground/70 pb-3">
                  Nosotros navarro
                </h3>
                {/* Línea horizontal debajo del texto */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-border"></div>
              </div>
              
              {/* Columna 2: Título principal */}
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight">
                  Asesoramiento estratégico y legal para empresas y grupos.
                </h2>
              </div>
              
              {/* Columna 3: Contenido */}
              <div className="space-y-6">
                <p className="text-lg font-medium text-foreground leading-relaxed">
                  En navarro ofrecemos asesoramiento legal, fiscal y estratégico 
                  especializado en empresas familiares y estructuras empresariales 
                  consolidadas.
                </p>
                
                <p className="text-body leading-relaxed">
                  Nuestra visión parte de la comprensión profunda de los retos de 
                  continuidad, gobernanza y crecimiento que enfrentan las compañías 
                  familiares. Aportamos soluciones concretas para planificar el 
                  relevo generacional, proteger el patrimonio y estructurar la 
                  actividad con seguridad jurídica.
                </p>
                
                <p className="text-body leading-relaxed">
                  Nuestro equipo trabaja con rigor técnico, experiencia transversal 
                  y compromiso absoluto con cada cliente.
                </p>
                
                <p className="text-body leading-relaxed">
                  Ya sea en la gestión diaria, la toma de decisiones clave o en 
                  procesos de compraventa, acompañamos a nuestros clientes con total 
                  confidencialidad y enfoque a largo plazo.
                </p>
                
                <div className="pt-4">
                  <Link 
                    to="/equipo" 
                    className="inline-flex items-center text-foreground font-medium hover:text-accent transition-colors group border-b border-foreground hover:border-accent"
                  >
                    Conoce nuestro equipo 
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Servicios Relevantes */}
        <section className="bg-white py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Encabezado */}
            <h2 className="font-mono font-light text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-12">
              Nuestros Servicios Relevantes
            </h2>

            {/* Grid de 4 servicios */}
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              
              {/* Servicio 1: Asesoramiento Fiscal */}
              <div className="bg-neutral-50 rounded-lg p-8 lg:p-10">
                <h3 className="text-3xl lg:text-4xl font-normal mb-4 leading-tight">
                  Asesoramiento Fiscal
                </h3>
                <p className="service-body mb-6">
                  Asesoramos a empresas y socios en todas sus obligaciones fiscales, 
                  con visión estratégica y anticipación
                </p>
                
                <div className="mb-6 pb-4 border-b border-border">
                  <span className="font-mono font-light text-xs tracking-wide uppercase text-foreground/60">
                    Servicios Fiscales
                  </span>
                </div>
                
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-foreground/70">
                    <Check className="h-5 w-5 flex-shrink-0 text-foreground/40 mt-0.5" />
                    <span>Planificación y optimización fiscal</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-foreground/70">
                    <Check className="h-5 w-5 flex-shrink-0 text-foreground/40 mt-0.5" />
                    <span>Procedimiento Tributario e Inspecciones ante la diferentes Administraciones</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-foreground/70">
                    <Check className="h-5 w-5 flex-shrink-0 text-foreground/40 mt-0.5" />
                    <span>Asesoramiento fiscal recurrente a sociedades y sus socios</span>
                  </li>
                </ul>
              </div>

              {/* Servicio 2: Mercantil */}
              <div className="bg-neutral-50 rounded-lg p-8 lg:p-10">
                <h3 className="text-3xl lg:text-4xl font-normal mb-4 leading-tight">
                  Mercantil
                </h3>
                <p className="service-body mb-6">
                  Asesoramiento jurídico-societario para estructuras empresariales con 
                  visión de estabilidad y seguridad en la gestión
                </p>
                
                <div className="mb-6 pb-4 border-b border-border">
                  <span className="font-mono font-light text-xs tracking-wide uppercase text-foreground/60">
                    Servicios Mercantiles
                  </span>
                </div>
                
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-foreground/70">
                    <Check className="h-5 w-5 flex-shrink-0 text-foreground/40 mt-0.5" />
                    <span>Recurrencia legal y mercantil</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-foreground/70">
                    <Check className="h-5 w-5 flex-shrink-0 text-foreground/40 mt-0.5" />
                    <span>Pactos de socios y reorganizaciones societarias</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-foreground/70">
                    <Check className="h-5 w-5 flex-shrink-0 text-foreground/40 mt-0.5" />
                    <span>Protocolos familiares y gobierno corporativo</span>
                  </li>
                </ul>
              </div>

              {/* Servicio 3: Laboral & Contabilidad */}
              <div className="bg-neutral-50 rounded-lg p-8 lg:p-10">
                <h3 className="text-3xl lg:text-4xl font-normal mb-4 leading-tight">
                  Laboral & Contabilidad
                </h3>
                <p className="service-body mb-6">
                  Externalización revisión contable y servicios de asesoramiento laboral, 
                  con enfoque de cumplimiento normativo
                </p>
                
                <div className="mb-6 pb-4 border-b border-border">
                  <span className="font-mono font-light text-xs tracking-wide uppercase text-foreground/60">
                    Sercios de Externalización
                  </span>
                </div>
                
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-foreground/70">
                    <Check className="h-5 w-5 flex-shrink-0 text-foreground/40 mt-0.5" />
                    <span>Consolidación de grupos y reporting financiero</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-foreground/70">
                    <Check className="h-5 w-5 flex-shrink-0 text-foreground/40 mt-0.5" />
                    <span>Revisión de la contabilidad adaptada a normativata</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-foreground/70">
                    <Check className="h-5 w-5 flex-shrink-0 text-foreground/40 mt-0.5" />
                    <span>Externalización de los servicios de confección de nóminas y laboral</span>
                  </li>
                </ul>
              </div>

              {/* Servicio 4: Operaciones M&A */}
              <div className="bg-neutral-50 rounded-lg p-8 lg:p-10">
                <h3 className="text-3xl lg:text-4xl font-normal mb-4 leading-tight">
                  Operaciones M&A
                </h3>
                <p className="service-body mb-6">
                  Acompañamos a empresarios que quieren vender o comprar una empresa. 
                  Nuestro enfoque se basa en el servicios completo
                </p>
                
                <div className="mb-6 pb-4 border-b border-border">
                  <span className="font-mono font-light text-xs tracking-wide uppercase text-foreground/60">
                    Monitoring Services
                  </span>
                </div>
                
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-foreground/70">
                    <Check className="h-5 w-5 flex-shrink-0 text-foreground/40 mt-0.5" />
                    <span>Valoración de empresas y asesoramiento previo</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-foreground/70">
                    <Check className="h-5 w-5 flex-shrink-0 text-foreground/40 mt-0.5" />
                    <span>Búsqueda de comprador o inversor con la máxima confidencialidad</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-foreground/70">
                    <Check className="h-5 w-5 flex-shrink-0 text-foreground/40 mt-0.5" />
                    <span>Asesoramiento en Due Diligence y negociación del contrato de compraventa</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </section>

        {/* Carrusel de Logos */}
        <section className="bg-white py-16 md:py-20 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-mono font-light text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-12 text-center">
              Empresas que confían en nosotros
            </h2>
            
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 3000,
                })
              ]}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {clientLogos.map((logo, index) => (
                  <CarouselItem key={index} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5">
                    <div className="flex items-center justify-center h-24 p-4">
                      <img
                        src={logo.src}
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

        {/* Blog Preview */}
        <section className="bg-background py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              overline="Blog"
              title="Últimas Publicaciones"
              description="Artículos y novedades sobre fiscalidad, contabilidad y derecho empresarial"
            />

            <div className="grid md:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <Card key={post.slug} className="p-6">
                  <Overline className="mb-3">{post.category}</Overline>
                  <h3 className="text-2xl mb-3 font-serif">{post.title}</h3>
                  <p className="text-sm text-body mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-subtle mb-4 pb-4 border-b border-border">
                    <span>{post.author}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-sm font-medium text-primary hover:text-accent inline-flex items-center transition-smooth group"
                  >
                    Leer artículo 
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-smooth" />
                  </Link>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button asChild variant="outline" size="lg">
                <Link to="/blog">Ver Todos los Artículos</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
