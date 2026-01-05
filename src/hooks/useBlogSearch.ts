import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface BlogSearchParams {
  searchQuery?: string;
  category?: string;
  tags?: string[];
  status?: string;
  limit?: number;
  offset?: number;
  sourceSite?: string; // 'es' | 'int' | 'global' | null (null = all sites)
}

export const useBlogSearch = (params: BlogSearchParams, language: string = 'es') => {
  return useQuery({
    queryKey: ["blog-search", params, language],
    queryFn: async () => {
      // Fetch paginated posts
      const { data: posts, error: postsError } = await supabase.rpc("search_blog_posts", {
        search_query: params.searchQuery || null,
        filter_category: params.category || null,
        filter_tags: params.tags || null,
        filter_status: params.status || 'published',
        limit_count: params.limit || 10,
        offset_count: params.offset || 0,
        lang: language,
        filter_site: params.sourceSite || null,
      });

      if (postsError) throw postsError;

      // Fetch total count
      const { data: totalCount, error: countError } = await supabase.rpc("count_blog_posts", {
        search_query: params.searchQuery || null,
        filter_category: params.category || null,
        filter_tags: params.tags || null,
        filter_status: params.status || 'published',
        lang: language,
        filter_site: params.sourceSite || null,
      });

      if (countError) throw countError;

      return {
        posts: posts || [],
        totalCount: Number(totalCount) || 0,
      };
    },
    enabled: true,
  });
};

export const useBlogFilterOptions = () => {
  return useQuery({
    queryKey: ["blog-filter-options"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_blog_filter_options");
      
      if (error) throw error;
      
      const result = data && data.length > 0 ? data[0] : { categories: [], all_tags: [] };
      return result as {
        categories: string[];
        all_tags: string[];
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useBlogStats = () => {
  return useQuery({
    queryKey: ["blog-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_blog_stats");
      
      if (error) throw error;
      
      const result = data && data.length > 0 ? data[0] : {
        total_published: 0,
        total_drafts: 0,
        total_scheduled: 0,
        total_views: 0,
      };
      return result as {
        total_published: number;
        total_drafts: number;
        total_scheduled: number;
        total_views: number;
      };
    },
  });
};
