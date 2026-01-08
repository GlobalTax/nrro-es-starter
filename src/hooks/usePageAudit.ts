import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface PageAudit {
  id: string;
  site_page_id: string | null;
  page_url: string;
  audit_date: string;
  seo_score: number | null;
  content_score: number | null;
  structure_score: number | null;
  overall_score: number | null;
  issues: AuditIssue[];
  recommendations: AuditRecommendation[];
  raw_data: Record<string, unknown>;
  created_at: string;
}

export interface AuditIssue {
  type: 'seo' | 'content' | 'structure';
  severity: 'error' | 'warning' | 'info';
  message: string;
  recommendation: string;
}

export interface AuditRecommendation {
  priority: 'high' | 'medium' | 'low';
  category: string;
  action: string;
}

export interface AuditResult {
  success: boolean;
  error?: string;
  audit?: PageAudit & {
    seo_score: number;
    content_score: number;
    structure_score: number;
    overall_score: number;
  };
}

// Hook to audit a page
export function useAuditPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ url, sitePageId }: { url: string; sitePageId?: string }): Promise<AuditResult> => {
      const { data, error } = await supabase.functions.invoke('audit-page', {
        body: { url, sitePageId }
      });

      if (error) {
        throw new Error(error.message);
      }

      return data as AuditResult;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Auditoría completada",
          description: `Puntuación global: ${data.audit?.overall_score}/100`,
        });
        queryClient.invalidateQueries({ queryKey: ['page-audits'] });
      } else {
        toast({
          title: "Error en auditoría",
          description: data.error || "No se pudo completar la auditoría",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}

// Hook to get all audits
export function usePageAudits(limit = 20) {
  return useQuery({
    queryKey: ['page-audits', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_audits')
        .select('*')
        .order('audit_date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      
      return (data || []).map(audit => ({
        ...audit,
        issues: (audit.issues as unknown as AuditIssue[]) || [],
        recommendations: (audit.recommendations as unknown as AuditRecommendation[]) || [],
        raw_data: (audit.raw_data as Record<string, unknown>) || {},
      })) as PageAudit[];
    }
  });
}

// Hook to get audits for a specific page
export function usePageAuditsByUrl(pageUrl: string) {
  return useQuery({
    queryKey: ['page-audits', 'url', pageUrl],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_audits')
        .select('*')
        .eq('page_url', pageUrl)
        .order('audit_date', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(audit => ({
        ...audit,
        issues: (audit.issues as unknown as AuditIssue[]) || [],
        recommendations: (audit.recommendations as unknown as AuditRecommendation[]) || [],
        raw_data: (audit.raw_data as Record<string, unknown>) || {},
      })) as PageAudit[];
    },
    enabled: !!pageUrl
  });
}

// Hook to get latest audit for a page
export function useLatestAudit(pageUrl: string) {
  return useQuery({
    queryKey: ['page-audits', 'latest', pageUrl],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_audits')
        .select('*')
        .eq('page_url', pageUrl)
        .order('audit_date', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (!data) return null;
      
      return {
        ...data,
        issues: (data.issues as unknown as AuditIssue[]) || [],
        recommendations: (data.recommendations as unknown as AuditRecommendation[]) || [],
        raw_data: (data.raw_data as Record<string, unknown>) || {},
      } as PageAudit;
    },
    enabled: !!pageUrl
  });
}

// Hook to get audit statistics
export function useAuditStats() {
  return useQuery({
    queryKey: ['page-audits', 'stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_audits')
        .select('overall_score, seo_score, content_score, structure_score, audit_date')
        .order('audit_date', { ascending: false })
        .limit(100);

      if (error) throw error;

      const audits = data || [];
      
      if (audits.length === 0) {
        return {
          totalAudits: 0,
          avgOverallScore: 0,
          avgSeoScore: 0,
          avgContentScore: 0,
          avgStructureScore: 0,
          recentTrend: 'stable' as const,
        };
      }

      const avgOverallScore = Math.round(
        audits.reduce((sum, a) => sum + (a.overall_score || 0), 0) / audits.length
      );
      const avgSeoScore = Math.round(
        audits.reduce((sum, a) => sum + (a.seo_score || 0), 0) / audits.length
      );
      const avgContentScore = Math.round(
        audits.reduce((sum, a) => sum + (a.content_score || 0), 0) / audits.length
      );
      const avgStructureScore = Math.round(
        audits.reduce((sum, a) => sum + (a.structure_score || 0), 0) / audits.length
      );

      // Calculate trend (compare last 10 vs previous 10)
      let recentTrend: 'up' | 'down' | 'stable' = 'stable';
      if (audits.length >= 10) {
        const recent = audits.slice(0, 5).reduce((sum, a) => sum + (a.overall_score || 0), 0) / 5;
        const previous = audits.slice(5, 10).reduce((sum, a) => sum + (a.overall_score || 0), 0) / 5;
        if (recent > previous + 5) recentTrend = 'up';
        else if (recent < previous - 5) recentTrend = 'down';
      }

      return {
        totalAudits: audits.length,
        avgOverallScore,
        avgSeoScore,
        avgContentScore,
        avgStructureScore,
        recentTrend,
      };
    }
  });
}

// Hook to delete an audit
export function useDeleteAudit() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('page_audits')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Auditoría eliminada",
      });
      queryClient.invalidateQueries({ queryKey: ['page-audits'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}
