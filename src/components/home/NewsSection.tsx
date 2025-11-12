import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SectionHeader } from "@/components/ui/typography";
import { NewsSkeleton } from "./NewsSkeleton";
import { useNewsSearch } from "@/hooks/useNewsSearch";
import { Clock, ArrowRight, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const NewsSection = () => {
  const { data: articles, isLoading } = useNewsSearch({ 
    limit: 4, 
    offset: 0 
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="container">
          <SectionHeader
            overline="Últimas noticias"
            title="Mantente informado"
            description="Artículos, análisis y actualizaciones sobre derecho tributario, fiscal y mercantil"
            className="text-center mx-auto"
          />
          <NewsSkeleton />
        </div>
      </section>
    );
  }

  if (!articles || articles.length === 0) {
    return null;
  }

  const [featuredArticle, ...gridArticles] = articles;

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <SectionHeader
          overline="Últimas noticias"
          title="Mantente informado"
          description="Artículos, análisis y actualizaciones sobre derecho tributario, fiscal y mercantil"
          className="text-center mx-auto"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured Article */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <Link to={`/blog/${featuredArticle.slug}`}>
              <Card className="group overflow-hidden hover:shadow-large transition-all duration-300">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image with Gradient Overlay */}
                  <div className="relative h-[300px] md:h-[400px] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/80 via-primary/40 to-transparent z-10 group-hover:from-primary/60 transition-colors duration-300" />
                    <img
                      src={featuredArticle.featured_image_url || "/placeholder.svg"}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-6 left-6 z-20">
                      <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                        {featuredArticle.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 md:p-10 flex flex-col justify-center bg-card">
                    <Badge variant="outline" className="w-fit mb-4 text-xs">
                      ⭐ Destacado
                    </Badge>
                    
                    <h3 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-accent transition-colors line-clamp-2">
                      {featuredArticle.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-base md:text-lg mb-6 line-clamp-3">
                      {featuredArticle.excerpt}
                    </p>

                    {/* Author & Meta */}
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar className="h-12 w-12 border-2 border-border">
                        <AvatarImage src={featuredArticle.author_avatar_url || ""} />
                        <AvatarFallback>
                          {featuredArticle.author_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">
                          {featuredArticle.author_name}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(featuredArticle.published_at), "d 'de' MMMM, yyyy", { locale: es })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {featuredArticle.read_time} min
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center text-accent group-hover:text-accent-hover transition-colors">
                      <span className="font-semibold text-sm">Leer artículo completo</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>

          {/* Grid Articles */}
          {gridArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={`/blog/${article.slug}`}>
                <Card className="group h-full overflow-hidden hover:shadow-medium hover:-translate-y-1 transition-all duration-300">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/60 z-10" />
                    <img
                      src={article.featured_image_url || "/placeholder.svg"}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 z-20">
                      <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-xs">
                        {article.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h4 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors line-clamp-2">
                      {article.title}
                    </h4>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>

                    {/* Author & Meta */}
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-border">
                        <AvatarImage src={article.author_avatar_url || ""} />
                        <AvatarFallback className="text-xs">
                          {article.author_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs truncate">
                          {article.author_name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {article.read_time} min
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-10"
        >
          <Button asChild size="lg" variant="outline" className="group">
            <Link to="/blog">
              Ver todas las noticias
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
