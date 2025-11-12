import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NewsCard } from "@/components/news/NewsCard";
import { NewsSkeleton } from "@/components/news/NewsSkeleton";
import { useNewsSearch } from "@/hooks/useNewsSearch";
import { useAnalytics } from "@/hooks/useAnalytics";

export const NewsPreview = () => {
  const { trackCTAClick } = useAnalytics();
  
  const { data: featuredNews = [], isLoading } = useNewsSearch({
    limit: 3,
  });

  return (
    <section className="bg-neutral-50 py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-mono font-light text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-12 text-center">
          Actualidad
        </h2>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <NewsSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {featuredNews.map((news) => (
              <NewsCard
                key={news.id}
                id={news.id}
                title={news.title}
                slug={news.slug}
                excerpt={news.excerpt}
                featured_image_url={news.featured_image_url}
                author_name={news.author_name}
                category={news.category}
                published_at={news.published_at}
                read_time={news.read_time}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button 
            asChild 
            variant="outline" 
            size="lg"
            onClick={() => trackCTAClick("Ver Todas las Noticias", "home_news_section")}
          >
            <Link to="/noticias">Ver todas las noticias</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
