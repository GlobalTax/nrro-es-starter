import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SyncResult {
  success: boolean;
  summary?: {
    pagesAdded: number;
    pagesUpdated: number;
    pagesArchived: number;
    pagesTotal: number;
    errors: any[];
  };
  error?: string;
}

async function syncSitePages(): Promise<SyncResult> {
  const { data, error } = await supabase.functions.invoke('sync-site-pages');
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data as SyncResult;
}

export function useSyncSitePages() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: syncSitePages,
    onSuccess: (data) => {
      if (data.success && data.summary) {
        const { pagesAdded, pagesUpdated, pagesArchived } = data.summary;
        
        toast.success(
          `Sincronización completada: ${pagesAdded} nuevas, ${pagesUpdated} actualizadas, ${pagesArchived} archivadas`
        );
        
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['site-pages'] });
        queryClient.invalidateQueries({ queryKey: ['site-page-stats'] });
        queryClient.invalidateQueries({ queryKey: ['sync-history'] });
      } else if (data.error) {
        toast.error(`Error en sincronización: ${data.error}`);
      }
    },
    onError: (error: Error) => {
      toast.error(`Error llamando a la función: ${error.message}`);
    },
  });
}