import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AIUsageStats {
  articlesGenerated: number;
  articlesLast30Days: number;
  newsCreated: number;
  newsLast30Days: number;
  translationsCompleted: number;
  translationsLast30Days: number;
  auditsCompleted: number;
  auditsLast30Days: number;
  cacheEntries: number;
  cacheHitsTotal: number;
}

export const useAIUsageStats = () => {
  return useQuery({
    queryKey: ['ai-usage-stats'],
    queryFn: async (): Promise<AIUsageStats> => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyDaysAgoISO = thirtyDaysAgo.toISOString();

      const [
        articlesTotal,
        articlesRecent,
        newsTotal,
        newsRecent,
        translationsTotal,
        translationsRecent,
        auditsTotal,
        auditsRecent,
        cacheStats,
      ] = await Promise.all([
        supabase
          .from('blog_generation_queue')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'completed'),
        supabase
          .from('blog_generation_queue')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'completed')
          .gte('created_at', thirtyDaysAgoISO),
        supabase
          .from('news_automation_runs')
          .select('articles_generated')
          .eq('status', 'completed'),
        supabase
          .from('news_automation_runs')
          .select('articles_generated')
          .eq('status', 'completed')
          .gte('created_at', thirtyDaysAgoISO),
        supabase
          .from('blog_posts')
          .select('id', { count: 'exact', head: true })
          .not('content_en', 'is', null),
        supabase
          .from('blog_posts')
          .select('id', { count: 'exact', head: true })
          .not('content_en', 'is', null)
          .gte('created_at', thirtyDaysAgoISO),
        supabase
          .from('marketing_audits')
          .select('id', { count: 'exact', head: true }),
        supabase
          .from('marketing_audits')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', thirtyDaysAgoISO),
        supabase
          .from('translation_cache')
          .select('hit_count'),
      ]);

      const sumArticlesGenerated = (data: { articles_generated: number | null }[] | null) =>
        (data || []).reduce((sum, r) => sum + (r.articles_generated || 0), 0);

      const cacheData = (cacheStats.data as { hit_count: number }[] | null) || [];
      const cacheEntries = cacheData.length;
      const cacheHitsTotal = cacheData.reduce((sum, r) => sum + (r.hit_count || 0), 0);

      return {
        articlesGenerated: articlesTotal.count ?? 0,
        articlesLast30Days: articlesRecent.count ?? 0,
        newsCreated: sumArticlesGenerated(newsTotal.data),
        newsLast30Days: sumArticlesGenerated(newsRecent.data),
        translationsCompleted: translationsTotal.count ?? 0,
        translationsLast30Days: translationsRecent.count ?? 0,
        auditsCompleted: auditsTotal.count ?? 0,
        auditsLast30Days: auditsRecent.count ?? 0,
        cacheEntries,
        cacheHitsTotal,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};
