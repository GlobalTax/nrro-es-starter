import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FetchMetaResult {
  success: boolean;
  processed: number;
  successCount: number;
  errorCount: number;
  results?: any[];
  error?: string;
}

async function fetchPageMeta(): Promise<FetchMetaResult> {
  const { data, error } = await supabase.functions.invoke('fetch-page-meta');
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data as FetchMetaResult;
}

export function useFetchPageMeta() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: fetchPageMeta,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(
          `Meta tags detectados: ${data.successCount} páginas actualizadas`
        );
        
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['site-pages'] });
        queryClient.invalidateQueries({ queryKey: ['seo-alerts'] });
      } else if (data.error) {
        toast.error(`Error: ${data.error}`);
      }
    },
    onError: (error: Error) => {
      toast.error(`Error al detectar meta tags: ${error.message}`);
    },
  });
}
