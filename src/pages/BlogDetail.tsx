import { useParams, Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Clock, Loader2 } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Button } from "@/components/ui/button";
import { Overline } from "@/components/ui/typography";
import { Meta } from "@/components/seo/Meta";
import { PreviewBanner } from "@/components/ui/preview-banner";
import { usePreviewContent } from "@/hooks/usePreviewContent";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DOMPurify from "dompurify";
import { RelatedBlogPosts } from "@/components/blog/RelatedBlogPosts";
import { BlogCTASection } from "@/components/blog/BlogCTASection";

const BlogDetail = () => {
  const { slug } = useParams();
  const { trackPageView } = useAnalytics();
  const [searchParams] = useSearchParams();
  const previewToken = searchParams.get("preview");
  const queryClient = useQueryClient();

  // Get article ID from slug for preview mode
  const { data: articleId, isLoading: isIdLoading } = useQuery({
    queryKey: ["blog-post-id", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id")
        .eq("slug_es", slug)
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
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      if (!slug) return null;
      const response = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug_es", slug)
        .eq("status", "published")
        .single();

      if (response.error) throw response.error;
      return response.data;
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

  // Reset queries when slug changes
  useEffect(() => {
    // Invalidate all blog post queries to force refetch
    queryClient.invalidateQueries({ queryKey: ["blog-post", slug] });
    queryClient.invalidateQueries({ queryKey: ["blog-post-id", slug] });
  }, [slug, queryClient]);

  const isLoading = previewToken ? isIdLoading || isPreviewLoading : isDbLoading;
  const post = previewToken ? previewData?.data : dbData;
  const isPreviewMode = !!previewToken && !!previewData;
  
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
          <h1 className="text-2xl font-bold mb-4">Vista Previa No Disponible</h1>
          <p className="text-muted-foreground mb-8">
            El token de vista previa es inválido o ha expirado.
          </p>
          <Button asChild>
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Blog
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
          <h1 className="text-2xl font-bold mb-4">Artículo no encontrado</h1>
          <Button asChild>
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Blog
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {isPreviewMode && previewData?.preview_info && (
        <PreviewBanner
          expiresAt={previewData.preview_info.expires_at}
          accessedCount={previewData.preview_info.accessed_count}
        />
      )}
      <Meta
        title={post.seo_title_es || post.title_es}
        description={post.seo_description_es || post.excerpt_es || ""}
        canonicalUrl={`${window.location.origin}/blog/${post.slug_es}`}
      />

      <div className="min-h-screen">
        <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Button variant="ghost" asChild className="mb-8">
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Blog
            </Link>
          </Button>

          <div className="max-w-3xl mx-auto">
          <header className="mb-12 pb-12 border-b border-border">
              {post.category && <Overline className="mb-4">{post.category}</Overline>}
              <h1 className="text-3xl md:text-4xl font-normal leading-tight mb-6">{post.title_es}</h1>

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
              {post.excerpt_es && (
                <p className="text-lead mb-8">{post.excerpt_es}</p>
              )}
              {post.content_es && (
                <div
                  className="text-body space-y-6"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(post.content_es, {
                      ALLOWED_TAGS: [
                        "p",
                        "br",
                        "strong",
                        "em",
                        "u",
                        "h1",
                        "h2",
                        "h3",
                        "h4",
                        "h5",
                        "h6",
                        "ul",
                        "ol",
                        "li",
                        "a",
                        "img",
                        "blockquote",
                        "code",
                        "pre",
                      ],
                      ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "target", "rel"],
                      ALLOW_DATA_ATTR: false,
                    }),
                  }}
                />
              )}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <h3 className="text-sm font-semibold mb-4">Tags</h3>
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
          </div>
        </article>

        {/* Artículos relacionados */}
        <RelatedBlogPosts
          currentPostId={post.id}
          category={post.category || ''}
          tags={post.tags || []}
        />

        {/* CTA de contacto */}
        <BlogCTASection />
      </div>
    </>
  );
};

export default BlogDetail;
