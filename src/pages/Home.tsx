import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";
import { LogoGrid } from "@/components/ui/logo-grid";
import { SectionHeader, Overline } from "@/components/ui/typography";
import { Meta } from "@/components/seo/Meta";
import { useAnalytics } from "@/hooks/useAnalytics";
import { ServicesDashboard } from "@/components/home/ServicesDashboard";
import { blogPosts, services } from "@/data/mockData";
import { ArrowRight } from "lucide-react";

const Home = () => {
  const { trackCTAClick } = useAnalytics();

  const kpis = [
    { label: "Años de Experiencia", value: "25+" },
    { label: "Clientes Activos", value: "500+" },
    { label: "Operaciones Anuales", value: "2.000+" },
    { label: "Satisfacción", value: "98%" },
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
        {/* Hero Section - Editorial Two Column */}
        <section className="bg-primary text-primary-foreground py-24 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left: Text */}
              <div>
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
            
            {/* Right: Interactive Dashboard */}
            <div>
              <ServicesDashboard />
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

        {/* Servicios Destacados */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <SectionHeader
            overline="Servicios"
            title="Nuestras Áreas de Especialización"
            description="Servicios integrales en todas las áreas clave para el éxito de tu negocio"
          />
          <LogoGrid logos={serviceLogos} />
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link to="/servicios">Ver Todos los Servicios</Link>
            </Button>
          </div>
        </section>

        {/* Blog Preview */}
        <section className="bg-neutral-100 py-24">
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
