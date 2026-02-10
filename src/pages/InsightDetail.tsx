import { useParams, Link, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Overline } from "@/components/ui/typography";
import { Meta } from "@/components/seo/Meta";
import { PreviewBanner } from "@/components/ui/preview-banner";
import { usePreviewContent } from "@/hooks/usePreviewContent";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { insights } from "@/data/mockData";
import DOMPurify from "dompurify";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";

const InsightDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { getInsightPath } = useLocalizedPath();
  const [searchParams] = useSearchParams();
  const previewToken = searchParams.get('preview');

  // First get the article ID from slug
  const { data: articleId, isLoading: isIdLoading } = useQuery({
    queryKey: ['article-id', slug, language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news_articles')
        .select('id')
        .or(`slug_es.eq.${slug},slug_ca.eq.${slug},slug_en.eq.${slug}`)
        .single() as any;
      
      if (error) throw error;
      return data?.id;
    },
    enabled: !!slug && !!previewToken,
  });

  // Try preview mode if token exists
  const { data: previewData, isLoading: isPreviewLoading, error: previewError } = usePreviewContent(
    'news_article',
    articleId || '',
    previewToken && articleId ? previewToken : null
  );

  // Fetch from database for published content
  const { data: dbData, isLoading: isDbLoading } = useQuery({
    queryKey: ['news-article', slug, language],
    queryFn: async () => {
      if (!slug) return null;
      const response = await supabase
        .from('news_articles')
        .select('id, title_es, title_ca, title_en, slug_es, slug_ca, slug_en, excerpt_es, excerpt_ca, excerpt_en, content_es, content_ca, content_en, featured_image_url, author_name, author_avatar_url, category, tags, read_time, is_featured, published_at, created_at')
        .or(`slug_es.eq.${slug},slug_ca.eq.${slug},slug_en.eq.${slug}`)
        .eq('is_published', true)
        .single() as any;
      
      if (response.error) throw response.error;
      
      // Map with fallback to Spanish
      const data = response.data;
      return {
        ...data,
        title: data[`title_${language}`] || data.title_es,
        slug: data[`slug_${language}`] || data.slug_es,
        excerpt: data[`excerpt_${language}`] || data.excerpt_es,
        content: data[`content_${language}`] || data.content_es,
      };
    },
    enabled: !previewToken && !!slug,
  });

  // Determine which data source to use
  const isLoading = previewToken ? (isIdLoading || isPreviewLoading) : isDbLoading;
  const dbInsight: any = previewToken ? previewData?.data : dbData;
  const mockInsight = insights.find(i => i.slug === slug);
  const insight = dbInsight || mockInsight;
  const isPreviewMode = !!previewToken && !!previewData;

  // Normalizar URL cuando se carga el insight
  useEffect(() => {
    if (dbInsight) {
      const correctPath = getInsightPath(
        dbInsight.slug_es,
        dbInsight.slug_en
      );
      
      const currentPath = window.location.pathname;
      
      if (currentPath !== correctPath && !previewToken) {
        navigate(correctPath, { replace: true });
      }
    }
  }, [dbInsight, language, navigate, getInsightPath, previewToken]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (previewError) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Preview Not Available</h1>
          <p className="text-muted-foreground mb-8">
            The preview token is invalid or has expired.
          </p>
          <Button asChild>
            <Link to="/insights">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Insights
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!insight) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4">Article not found</h1>
          <Button asChild>
            <Link to="/insights">Back to Insights</Link>
          </Button>
        </div>
      </div>
    );
  }

  const sanitizedContent = DOMPurify.sanitize(insight?.content || '');
  
  // Generate dynamic OG image URL
  const ogImageUrl = insight 
    ? `https://zntotcpagkunvkwpubqu.supabase.co/functions/v1/generate-og-image?type=blog&title=${encodeURIComponent(insight.title)}&description=${encodeURIComponent((insight.excerpt || '').substring(0, 150))}`
    : "https://nrro.es/og-image.png";

  return (
    <>
      {isPreviewMode && previewData?.preview_info && (
        <PreviewBanner 
          expiresAt={previewData.preview_info.expires_at}
          accessedCount={previewData.preview_info.accessed_count}
        />
      )}
      <Meta 
        title={insight.title}
        description={insight.excerpt || ''}
        ogImage={ogImageUrl}
        canonicalUrl={`${window.location.origin}/insights/${insight.slug}`}
      />

      <div className="min-h-screen">
        <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Button variant="ghost" asChild className="mb-8">
            <Link to="/insights">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Insights
            </Link>
          </Button>

          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <header className="mb-12 pb-12 border-b border-border">
              <Overline className="mb-4">{insight.category}</Overline>
              <h1 className="mb-6">{insight.title}</h1>

              <div className="flex items-center gap-4 text-sm text-subtle">
                <span>By {insight.author_name || insight.author}</span>
                <span>•</span>
                <time dateTime={insight.published_at || insight.date}>
                  {new Date(insight.published_at || insight.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {insight.read_time ? `${insight.read_time} min` : insight.readTime}
                </span>
              </div>
            </header>

            {/* Content */}
            <div className="prose-article">
              {insight.excerpt && (
                <p className="text-lead mb-8">{insight.excerpt}</p>
              )}
              <div 
                className="text-body space-y-6"
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(insight.content, {
                    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre'],
                    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target', 'rel'],
                    ALLOW_DATA_ATTR: false
                  })
                }}
              />
            </div>
          </div>
        </article>
      </div>
    </>
  );
};

export default InsightDetail;
