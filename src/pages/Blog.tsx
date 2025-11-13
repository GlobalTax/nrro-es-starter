import { useState, useEffect } from "react";
import { Meta } from "@/components/seo/Meta";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useScrollDepth } from "@/hooks/useScrollDepth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { useBlogSearch } from "@/hooks/useBlogSearch";
import { BadgeHero } from "@/components/ui/badge-hero";
import { BlogPostCard } from "@/components/blog/BlogPostCard";

const ITEMS_PER_PAGE = 9;

const Blog = () => {
  const { t, language } = useLanguage();
  const { trackPageView, trackEvent } = useAnalytics();
  useScrollDepth();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Track page view
  useEffect(() => {
    trackPageView("blog");
  }, []);
  
  // Track search (debounced)
  useEffect(() => {
    if (searchQuery) {
      const timer = setTimeout(() => {
        trackEvent("search", { search_term: searchQuery, search_location: "blog" });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  const { data, isLoading } = useBlogSearch({
    searchQuery: searchQuery || undefined,
    status: "published",
    limit: ITEMS_PER_PAGE,
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
  }, language);

  // Process posts with fallback based on language
  const posts = (data?.posts || []).map((post: any) => ({
    ...post,
    title: post[`title_${language}`] || post.title_es,
    slug: post[`slug_${language}`] || post.slug_es,
    excerpt: post[`excerpt_${language}`] || post.excerpt_es,
    // Preserve all slugs for BlogPostCard
    slug_es: post.slug_es,
    slug_ca: post.slug_ca,
    slug_en: post.slug_en,
  }));
  
  const totalPages = Math.ceil((data?.totalCount || 0) / ITEMS_PER_PAGE);

  return (
    <>
      <Meta
        title={t('blog.meta.title')}
        description={t('blog.meta.description')}
        keywords={t('blog.meta.keywords')}
      />

      {/* Hero Section */}
      <section className="bg-black py-32 md:py-48 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <BadgeHero>{t('blog.hero.badge')}</BadgeHero>
            </div>
            <h1 className="service-hero-title mb-8">
              {t('blog.hero.title')}
            </h1>
            <p className="service-hero-subtitle max-w-3xl mx-auto">
              {t('blog.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-12 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('blog.search')}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full rounded-t-lg" />
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {posts.map((post) => (
                  <div 
                    key={post.id}
                    onClick={() => trackEvent("blog_card_click", { 
                      blog_title: post.title,
                      blog_category: post.category 
                    })}
                  >
                    <BlogPostCard
                      slug={post.slug}
                      category={post.category}
                      title={post.title}
                      excerpt={post.excerpt}
                      authorName={post.author_name}
                      authorSpecialization={post.author_specialization}
                      publishedAt={post.published_at}
                      readTime={post.read_time}
                    />
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <CustomPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                {t('blog.empty')}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Blog;
