import { Meta } from '@/components/seo/Meta';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Blog() {
  const articles = [
    {
      id: 1,
      title: 'Novedades fiscales 2025: Lo que tu empresa debe saber',
      excerpt: 'Análisis completo de los cambios tributarios que entrarán en vigor este año y cómo afectarán a tu negocio.',
      category: 'Fiscal',
      date: '2025-01-15',
      readTime: '5 min',
      slug: 'novedades-fiscales-2025',
    },
    {
      id: 2,
      title: 'Optimización fiscal para pymes: Estrategias efectivas',
      excerpt: 'Descubre las mejores prácticas para reducir la carga fiscal de tu empresa de forma legal y eficiente.',
      category: 'Estrategia',
      date: '2025-01-10',
      readTime: '7 min',
      slug: 'optimizacion-fiscal-pymes',
    },
    {
      id: 3,
      title: 'Gestión contable digital: El futuro es ahora',
      excerpt: 'Cómo la digitalización está transformando la contabilidad empresarial y qué herramientas debes conocer.',
      category: 'Tecnología',
      date: '2025-01-05',
      readTime: '6 min',
      slug: 'gestion-contable-digital',
    },
  ];

  return (
    <>
      <Meta
        title="Blog"
        description="Artículos y recursos sobre asesoría fiscal, contabilidad y gestión empresarial por el equipo de Navarro Tax Legal."
        keywords="blog fiscal, artículos contabilidad, novedades tributarias, consejos fiscales Barcelona"
      />

      {/* Hero Section */}
      <section className="bg-black py-32 md:py-48 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="service-hero-overline mb-6">Blog</div>
            <h1 className="service-hero-title mb-8">
              Blog y Recursos
            </h1>
            <p className="service-hero-subtitle max-w-3xl mx-auto">
              Mantente informado con las últimas novedades fiscales, consejos contables y estrategias para tu negocio.
            </p>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <Card
                key={article.id}
                className="hover-lift border-border/50 hover:border-accent/50 transition-all animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <Badge className="mb-4 bg-accent/10 text-accent hover:bg-accent/20">
                    {article.category}
                  </Badge>
                  
                  <h3 className="text-2xl font-serif font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(article.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                  
                  <Link
                    to={`/blog/${article.slug}`}
                    className="text-accent hover:text-accent-hover font-medium inline-flex items-center transition-colors"
                  >
                    Leer más →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Coming Soon Message */}
          <div className="mt-16 text-center animate-fade-in">
            <p className="text-muted-foreground">
              Más artículos próximamente. Síguenos en{' '}
              <a
                href="https://www.linkedin.com/company/navarro-tax-legal/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-hover font-medium transition-colors"
              >
                LinkedIn
              </a>
              {' '}para no perderte ninguna actualización.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
