import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { es, ca, enUS } from "date-fns/locale";

interface NewsItem {
  id: string;
  excerpt: string;
  source_name: string;
  published_at: string;
}

export const NewsSection = () => {
  const { sourceSite } = useSiteConfig();
  const { language, t } = useLanguage();

  const dateLocale = language === "ca" ? ca : language === "en" ? enUS : es;

  const { data: news = [], isLoading } = useQuery({
    queryKey: ["home-news", language, sourceSite],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news_articles")
        .select("*")
        .eq("is_published", true)
        .eq("source_site", sourceSite)
        .order("published_at", { ascending: false })
        .limit(4);

      if (error) throw error;

      return (data || []).map((article: any) => ({
        id: article.id,
        excerpt: article[`excerpt_${language}`] || article.excerpt_es || "",
        source_name: article.source_name || article.author_name || "",
        published_at: article.published_at,
      })) as NewsItem[];
    },
  });

  if (isLoading) {
    return (
      <section className="bg-neutral-50 py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-mono font-light text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-8 text-center">
            {t("home.news.overline")}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (news.length === 0) {
    return null;
  }

  return (
    <section className="bg-neutral-50 py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-mono font-light text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-8 text-center">
          {t("home.news.overline")}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {news.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-lg p-5 border border-border"
            >
              <p className="text-foreground text-sm leading-relaxed mb-3 line-clamp-3">
                {item.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium">{item.source_name}</span>
                <time dateTime={item.published_at}>
                  {format(new Date(item.published_at), "d MMM yyyy", {
                    locale: dateLocale,
                  })}
                </time>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
