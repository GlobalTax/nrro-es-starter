import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export interface SyncHistoryLog {
  id: string;
  started_at: string;
  completed_at: string | null;
  status: string;
  pages_added: number;
  pages_updated: number;
  pages_archived: number;
  pages_total: number;
  errors: Json;
  triggered_by: string;
  created_at: string;
}

async function fetchSyncHistory(limit: number = 10): Promise<SyncHistoryLog[]> {
  const { data, error } = await supabase
    .from('sitemap_sync_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return data || [];
}

export function useSyncHistory(limit: number = 10) {
  return useQuery({
    queryKey: ['sync-history', limit],
    queryFn: () => fetchSyncHistory(limit),
    staleTime: 1000 * 60, // 1 minuto
  });
}