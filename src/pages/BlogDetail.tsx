import { useParams, Link, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Clock, Loader2 } from "lucide-react";
import DOMPurify from "dompurify";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useScrollDepth } from "@/hooks/useScrollDepth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import { Button } from "@/components/ui/button";
import { Overline } from "@/components/ui/typography";
import { Meta } from "@/components/seo/Meta";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { ArticleSchema } from "@/components/seo/ArticleSchema";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { PreviewBanner } from "@/components/ui/preview-banner";
import { usePreviewContent } from "@/hooks/usePreviewContent";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RelatedBlogPosts } from "@/components/blog/RelatedBlogPosts";
import { BlogCTASection } from "@/components/blog/BlogCTASection";
import { AuthorCard } from "@/components/blog/AuthorCard";
import { BlogContactForm } from "@/components/blog/BlogContactForm";
import { mainBreadcrumbs, createDynamicBreadcrumb } from "@/lib/seoUtils";

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { trackPageView } = useAnalytics();
  useScrollDepth();
  const { t } = useLanguage();
  const { sourceSite, language } = useSiteConfig();
  const { getBlogPath, getLocalizedPath } = useLocalizedPath();
  const [searchParams] = useSearchParams();
  const previewToken = searchParams.get("preview");
  const queryClient = useQueryClient();

  // Guard: redirect if slug is invalid
  useEffect(() => {
    if (!slug || slug === 'undefined') {
      navigate(getLocalizedPath('/blog'), { replace: true });
    }
  }, [slug, navigate, getLocalizedPath]);

  // Get article ID from slug for preview mode
  const { data: articleId, isLoading: isIdLoading } = useQuery({
    queryKey: ["blog-post-id", slug, language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id")
        .or(`slug_es.eq.${slug},slug_en.eq.${slug}`)
        .single();

      if (error) throw error;
      return data?.id;
    },
    enabled: !!slug && !!previewToken,
  });

  // Preview mode
  const {
    data: previewData,
    isLoading: isPreviewLoading,
    error: previewError,
  } = usePreviewContent(
    "blog_post",
    articleId || "",
    previewToken && articleId ? previewToken : null
  );

  // Published content
  const { data: dbData, isLoading: isDbLoading } = useQuery({
    queryKey: ["blog-post", slug, language],
    queryFn: async () => {
      if (!slug) return null;
      const response = await supabase
        .from("blog_posts")
        .select("*")
        .or(`slug_es.eq.${slug},slug_en.eq.${slug}`)
        .eq("status", "published")
        .single();

      if (response.error) throw response.error;
      
      // Dynamic content based on site configuration
      const post: any = response.data;
      return {
        ...post,
        title: post[`title_${language}`] || post.title_es,
        slug: post[`slug_${language}`] || post.slug_es,
        excerpt: post[`excerpt_${language}`] || post.excerpt_es,
        content: post[`content_${language}`] || post.content_es,
        seo_title: post[`seo_title_${language}`] || post.seo_title_es,
        seo_description: post[`seo_description_${language}`] || post.seo_description_es,
        // Keep original slugs for URL normalization
        slug_es: post.slug_es,
        slug_ca: post.slug_ca,
        slug_en: post.slug_en,
      } as any;
    },
    enabled: !previewToken && !!slug,
  });

  // Increment view count
  const incrementViewMutation = useMutation({
    mutationFn: async (postId: string) => {
      await supabase.rpc("increment_blog_view_count", { post_id: postId });
    },
  });

  useEffect(() => {
    if (dbData?.id && !previewToken) {
      incrementViewMutation.mutate(dbData.id);
    }
  }, [dbData?.id, previewToken]);

  // Normalizar URL cuando se carga el post
  useEffect(() => {
    if (dbData) {
      const correctPath = getBlogPath(
        dbData.slug_es,
        dbData.slug_en
      );
      
      const currentPath = window.location.pathname;
      
      if (currentPath !== correctPath && !previewToken) {
        console.log(`🔄 Normalizing blog URL from ${currentPath} to ${correctPath}`);
        navigate(correctPath, { replace: true });
      }
    }
  }, [dbData, language, navigate, getBlogPath, previewToken]);

  // Reset queries when slug or language changes
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["blog-post", slug, language] });
    queryClient.invalidateQueries({ queryKey: ["blog-post-id", slug, language] });
  }, [slug, language, queryClient]);

  const isLoading = previewToken ? isIdLoading || isPreviewLoading : isDbLoading;
  const post = previewToken ? previewData?.data : dbData;
  const isPreviewMode = !!previewToken && !!previewData;
  
  // Breadcrumb items
  const breadcrumbItems = post 
    ? createDynamicBreadcrumb(mainBreadcrumbs.blog, post.title)
    : mainBreadcrumbs.blog;
  
  // Track page view when post is loaded
  useEffect(() => {
    if (post && !previewToken) {
      trackPageView("blog_detalle");
    }
  }, [post, slug, previewToken]);

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
          <h1 className="text-2xl font-bold mb-4">{t('blog.previewNotAvailable')}</h1>
          <p className="text-muted-foreground mb-8">
            {t('blog.previewExpired')}
          </p>
          <Button asChild>
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('blog.backToBlog')}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('blog.notFound')}</h1>
          <Button asChild>
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('blog.backToBlog')}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Sanitize HTML content for safe rendering
  const sanitizedContent = post.content
    ? DOMPurify.sanitize(post.content, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre', 'span', 'div'],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target', 'rel', 'style'],
      })
    : "";
  
  // Generate dynamic OG image URL
  const ogImageUrl = post 
    ? `https://zntotcpagkunvkwpubqu.supabase.co/functions/v1/generate-og-image?type=blog&title=${encodeURIComponent(post.title)}&description=${encodeURIComponent((post.excerpt || '').substring(0, 150))}`
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
        title={post.seo_title || post.title}
        description={post.seo_description || post.excerpt || ""}
        ogImage={ogImageUrl}
        canonicalUrl={`${window.location.origin}/blog/${post.slug}`}
        slugs={{
          es: post.slug_es,
          ca: post.slug_ca || post.slug_es,
          en: post.slug_en || post.slug_es,
        }}
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <ArticleSchema
        title={post.title}
        description={post.excerpt || post.seo_description || ""}
        author={{
          name: post.author_name || "Navarro Tax Legal",
          url: `${window.location.origin}/equipo`
        }}
        publishedDate={post.published_at || post.created_at}
        modifiedDate={post.updated_at}
        imageUrl={post.featured_image || ogImageUrl}
        articleUrl={`${window.location.origin}/blog/${post.slug}`}
        category={post.category}
        tags={post.tags}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-muted/30 border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">{t('breadcrumb.home')}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/blog">{t('nav.blog')}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{post?.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="min-h-screen">
        <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Button variant="ghost" asChild className="mb-8">
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('blog.backToBlog')}
            </Link>
          </Button>

          <div className="max-w-3xl mx-auto">
          <header className="mb-12 pb-12 border-b border-border">
              {post.category && <Overline className="mb-4">{post.category}</Overline>}
              <h1 className="text-3xl md:text-4xl font-normal leading-tight mb-6">{post.title}</h1>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <time dateTime={post.published_at}>
                  {new Date(post.published_at || post.created_at).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                {post.read_time && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.read_time} min
                    </span>
                  </>
                )}
              </div>
            </header>

            <div className="prose-article">
              {post.excerpt && (
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">{post.excerpt}</p>
              )}
              {sanitizedContent && (
                <div 
                  className="prose prose-lg max-w-none prose-headings:font-semibold prose-headings:text-foreground prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:mb-4 prose-p:leading-relaxed prose-p:text-foreground/90 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-strong:text-foreground prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                />
              )}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="text-sm font-semibold mb-4">{t('blog.tags')}</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-muted rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author Card */}
            <AuthorCard 
              authorName={post.author_name} 
              specialization={post.author_specialization} 
            />

            {/* Contact Form */}
            <BlogContactForm 
              articleTitle={post.title} 
              articleSlug={post.slug} 
            />
          </div>
        </article>

        {/* Artículos relacionados */}
        <RelatedBlogPosts
          currentPostId={post.id}
          category={post.category || ''}
          tags={post.tags || []}
          language={language}
        />

        {/* CTA de contacto */}
        <BlogCTASection />
      </div>
    </>
  );
};

export default BlogDetail;