import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface RelatedPostsParams {
  currentPostId: string;
  category: string;
  tags: string[];
  language?: string;
}

export function useRelatedBlogPosts({ currentPostId, category, tags, language = 'es' }: RelatedPostsParams) {
  return useQuery({
    queryKey: ['related-blog-posts', currentPostId, category, tags, language],
    queryFn: async () => {
      // Para catalán, usar inglés como fallback
      const dbLang = language === 'ca' ? 'en' : language;
      
      // Get posts from same category (excluding current)
      const { data: categoryPosts, error: categoryError } = await supabase
        .from('blog_posts')
        .select('id, title_es, title_en, slug_es, slug_en, excerpt_es, excerpt_en, featured_image, category, published_at, read_time, author_name, author_specialization')
        .eq('status', 'published')
        .eq('category', category)
        .neq('id', currentPostId)
        .order('published_at', { ascending: false })
        .limit(5);

      if (categoryError) throw categoryError;

      // Get posts with overlapping tags
      const { data: tagPosts, error: tagError } = await supabase
        .from('blog_posts')
        .select('id, title_es, title_en, slug_es, slug_en, excerpt_es, excerpt_en, featured_image, category, tags, published_at, read_time, author_name, author_specialization')
        .eq('status', 'published')
        .neq('id', currentPostId)
        .order('published_at', { ascending: false })
        .limit(10);

      if (tagError) throw tagError;

      // Calculate relevance score
      const scoredPosts = new Map<string, any>();

      categoryPosts?.forEach(post => {
        scoredPosts.set(post.id, { ...post, score: 3 });
      });

      tagPosts?.forEach(post => {
        const postTags = post.tags || [];
        const commonTags = postTags.filter((tag: string) => tags.includes(tag));
        
        if (commonTags.length > 0) {
          const existing = scoredPosts.get(post.id);
          if (existing) {
            existing.score += commonTags.length * 2;
          } else {
            scoredPosts.set(post.id, { ...post, score: commonTags.length * 2 });
          }
        }
      });

      // Sort by score and get top 3
      const relatedPosts = Array.from(scoredPosts.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      // If we don't have enough related posts, fill with recent posts
      if (relatedPosts.length < 3) {
        const { data: recentPosts, error: recentError } = await supabase
          .from('blog_posts')
          .select('id, title_es, title_en, slug_es, slug_en, excerpt_es, excerpt_en, featured_image, category, published_at, read_time, author_name, author_specialization')
          .eq('status', 'published')
          .neq('id', currentPostId)
          .order('published_at', { ascending: false })
          .limit(3);

        if (recentError) throw recentError;

        // Add recent posts that aren't already in relatedPosts
        const existingIds = new Set(relatedPosts.map(p => p.id));
        recentPosts?.forEach(post => {
          if (!existingIds.has(post.id) && relatedPosts.length < 3) {
            relatedPosts.push(post);
          }
        });
      }

      // Aplicar fallback según idioma
      return relatedPosts.map((post: any) => ({
        ...post,
        title_es: post.title_es,
        title_en: post.title_en,
        slug_es: post.slug_es,
        slug_en: post.slug_en,
        excerpt_es: post.excerpt_es,
        excerpt_en: post.excerpt_en,
      }));
    },
    enabled: !!currentPostId,
  });
}
