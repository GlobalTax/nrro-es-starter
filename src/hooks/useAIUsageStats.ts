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
      ] = await Promise.all([
        // Articles generated (total)
        supabase
          .from('blog_generation_queue')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'completed'),
        // Articles generated (last 30 days)
        supabase
          .from('blog_generation_queue')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'completed')
          .gte('created_at', thirtyDaysAgoISO),
        // News created (total articles_generated sum)
        supabase
          .from('news_automation_runs')
          .select('articles_generated')
          .eq('status', 'completed'),
        // News created (last 30 days)
        supabase
          .from('news_automation_runs')
          .select('articles_generated')
          .eq('status', 'completed')
          .gte('created_at', thirtyDaysAgoISO),
        // Translations (total - posts with content_en)
        supabase
          .from('blog_posts')
          .select('id', { count: 'exact', head: true })
          .not('content_en', 'is', null),
        // Translations (last 30 days)
        supabase
          .from('blog_posts')
          .select('id', { count: 'exact', head: true })
          .not('content_en', 'is', null)
          .gte('created_at', thirtyDaysAgoISO),
        // Audits (total)
        supabase
          .from('marketing_audits')
          .select('id', { count: 'exact', head: true }),
        // Audits (last 30 days)
        supabase
          .from('marketing_audits')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', thirtyDaysAgoISO),
      ]);

      const sumArticlesGenerated = (data: { articles_generated: number | null }[] | null) =>
        (data || []).reduce((sum, r) => sum + (r.articles_generated || 0), 0);

      return {
        articlesGenerated: articlesTotal.count ?? 0,
        articlesLast30Days: articlesRecent.count ?? 0,
        newsCreated: sumArticlesGenerated(newsTotal.data),
        newsLast30Days: sumArticlesGenerated(newsRecent.data),
        translationsCompleted: translationsTotal.count ?? 0,
        translationsLast30Days: translationsRecent.count ?? 0,
        auditsCompleted: auditsTotal.count ?? 0,
        auditsLast30Days: auditsRecent.count ?? 0,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};
