import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Meta } from "@/components/seo/Meta";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { mainBreadcrumbs } from "@/lib/seoUtils";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useScrollDepth } from "@/hooks/useScrollDepth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { useBlogSearch, useBlogFilterOptions } from "@/hooks/useBlogSearch";
import { BadgeHero } from "@/components/ui/badge-hero";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { BadgeFilter } from "@/components/ui/badge-filter";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 9;

const Blog = () => {
  const { t, language } = useLanguage();
  const { trackPageView, trackEvent } = useAnalytics();
  useScrollDepth();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Get filter options
  const { data: filterOptions } = useBlogFilterOptions();
  
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
    category: selectedCategory || undefined,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
    status: "published",
    limit: ITEMS_PER_PAGE,
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
    sourceSite: "int",
  }, language);

  const posts = data?.posts || [];
  const totalPages = Math.ceil((data?.totalCount || 0) / ITEMS_PER_PAGE);
  
  const hasActiveFilters = selectedCategory || selectedTags.length > 0;
  
  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSelectedTags([]);
    setCurrentPage(1);
  };

  return (
    <>
      <Meta
        title={t('blog.meta.title')}
        description={t('blog.meta.description')}
        keywords={t('blog.meta.keywords')}
      />
      <BreadcrumbSchema items={mainBreadcrumbs.blog} />

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
                <BreadcrumbPage>Blog</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* Search and Filters */}
          <div className="mb-8 space-y-6">
            {/* Search bar */}
            <div className="max-w-xl">
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

            {/* Category filters */}
            {filterOptions?.categories && filterOptions.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium text-muted-foreground mr-2">
                  {t('blog.filters.category')}:
                </span>
                {filterOptions.categories.map((category) => (
                  <BadgeFilter
                    key={category}
                    label={category}
                    active={selectedCategory === category}
                    onClick={() => {
                      setSelectedCategory(selectedCategory === category ? null : category);
                      setCurrentPage(1);
                    }}
                  />
                ))}
              </div>
            )}

            {/* Tag filters */}
            {filterOptions?.all_tags && filterOptions.all_tags.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium text-muted-foreground mr-2">
                  {t('blog.filters.tags')}:
                </span>
                {filterOptions.all_tags.slice(0, 10).map((tag) => (
                  <BadgeFilter
                    key={tag}
                    label={tag}
                    active={selectedTags.includes(tag)}
                    onClick={() => {
                      setSelectedTags(prev => 
                        prev.includes(tag) 
                          ? prev.filter(t => t !== tag)
                          : [...prev, tag]
                      );
                      setCurrentPage(1);
                    }}
                  />
                ))}
              </div>
            )}

            {/* Active filters indicator */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 items-center pt-4 border-t border-border/50">
                <span className="text-sm text-muted-foreground">
                  {t('blog.filters.active')}:
                </span>
                {selectedCategory && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(null);
                      setCurrentPage(1);
                    }}
                    className="h-7 gap-1"
                  >
                    {selectedCategory}
                    <X className="h-3 w-3" />
                  </Button>
                )}
                {selectedTags.map(tag => (
                  <Button
                    key={tag}
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSelectedTags(prev => prev.filter(t => t !== tag));
                      setCurrentPage(1);
                    }}
                    className="h-7 gap-1"
                  >
                    {tag}
                    <X className="h-3 w-3" />
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-7 text-primary hover:text-primary/80"
                >
                  {t('blog.filters.clearAll')}
                </Button>
              </div>
            )}
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
