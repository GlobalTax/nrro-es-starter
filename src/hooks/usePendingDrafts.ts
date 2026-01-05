import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PendingDraft {
  id: string;
  title_es: string;
  created_at: string;
  category: string | null;
}

export function usePendingDrafts() {
  return useQuery({
    queryKey: ['pending-drafts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title_es, created_at, category')
        .eq('status', 'draft')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as PendingDraft[];
    },
    refetchInterval: 60000, // Refresh every minute
  });
}

export function usePendingDraftsCount() {
  return useQuery({
    queryKey: ['pending-drafts-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('blog_posts')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'draft');
      
      if (error) throw error;
      return count || 0;
    },
    refetchInterval: 60000,
  });
}
