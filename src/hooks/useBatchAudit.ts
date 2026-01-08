import { useState, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { BatchAuditResult } from "@/components/admin/sitemap/BatchAuditModal";

interface SitePage {
  id: string;
  url: string;
  title: string | null;
}

interface UseBatchAuditOptions {
  baseUrl?: string;
  onProgress?: (current: number, total: number) => void;
  onComplete?: (results: BatchAuditResult[]) => void;
}

export function useBatchAudit(options: UseBatchAuditOptions = {}) {
  const { baseUrl = 'https://nrro.es', onProgress, onComplete } = options;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [results, setResults] = useState<BatchAuditResult[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cancelledRef = useRef(false);

  const auditPages = useCallback(async (pages: SitePage[]) => {
    if (pages.length === 0) {
      toast({
        title: "Sin páginas",
        description: "No hay páginas para auditar",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(true);
    setProgress(0);
    setTotal(pages.length);
    setResults([]);
    cancelledRef.current = false;
    abortControllerRef.current = new AbortController();

    const auditResults: BatchAuditResult[] = [];

    for (let i = 0; i < pages.length; i++) {
      if (cancelledRef.current) {
        console.log('Batch audit cancelled');
        break;
      }

      const page = pages[i];
      let fullUrl = page.url;
      if (!fullUrl.startsWith('http')) {
        fullUrl = `${baseUrl}${page.url.startsWith('/') ? '' : '/'}${page.url}`;
      }

      try {
        const { data, error } = await supabase.functions.invoke('audit-page', {
          body: { url: fullUrl, sitePageId: page.id },
        });

        if (error) throw error;

        const result: BatchAuditResult = {
          sitePageId: page.id,
          url: fullUrl,
          success: data.success,
          overallScore: data.audit?.overall_score,
          error: data.error,
        };

        auditResults.push(result);
        setResults([...auditResults]);
        setProgress(i + 1);
        onProgress?.(i + 1, pages.length);

      } catch (error) {
        console.error(`Error auditing ${fullUrl}:`, error);
        const result: BatchAuditResult = {
          sitePageId: page.id,
          url: fullUrl,
          success: false,
          error: error instanceof Error ? error.message : 'Error desconocido',
        };
        auditResults.push(result);
        setResults([...auditResults]);
        setProgress(i + 1);
        onProgress?.(i + 1, pages.length);
      }

      // Small delay between audits to avoid overwhelming the API
      if (i < pages.length - 1 && !cancelledRef.current) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    setIsRunning(false);
    queryClient.invalidateQueries({ queryKey: ['page-audits'] });
    
    const successCount = auditResults.filter(r => r.success).length;
    const failCount = auditResults.filter(r => !r.success).length;
    
    if (!cancelledRef.current) {
      toast({
        title: "Auditoría masiva completada",
        description: `${successCount} exitosas, ${failCount} errores`,
      });
      onComplete?.(auditResults);
    }

    return auditResults;
  }, [baseUrl, toast, queryClient, onProgress, onComplete]);

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    abortControllerRef.current?.abort();
    setIsRunning(false);
    toast({
      title: "Auditoría cancelada",
      description: `Se completaron ${progress} de ${total} auditorías`,
    });
  }, [progress, total, toast]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setProgress(0);
    setTotal(0);
    setResults([]);
  }, []);

  return {
    isRunning,
    progress,
    total,
    results,
    auditPages,
    cancel,
    reset,
  };
}
