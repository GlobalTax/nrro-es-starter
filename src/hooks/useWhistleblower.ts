import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface StatusCheckResult {
  id: string;
  status: string;
  statusLabel: string;
  response: string | null;
  created_at: string;
  createdAt: string;
  updated_at: string;
  updatedAt: string;
  resolvedAt: string | null;
  messages: any[];
}

export const useSubmitWhistleblowerReport = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const trackingCode = `WB-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const { error } = await supabase
        .from('whistleblower_reports')
        .insert({ ...data, tracking_code: trackingCode });
      if (error) throw error;
      return { success: true, trackingCode };
    },
  });
};

export const useCheckWhistleblowerStatus = () => {
  return useMutation({
    mutationFn: async (trackingCode: string): Promise<StatusCheckResult | null> => {
      const { data, error } = await supabase
        .from('whistleblower_reports')
        .select('id, status, admin_response, created_at, updated_at, resolved_at')
        .eq('tracking_code', trackingCode)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;

      const statusMap: Record<string, string> = {
        pending: 'Pendiente',
        in_review: 'En revisión',
        resolved: 'Resuelto',
        dismissed: 'Desestimado',
      };

      return {
        id: data.id,
        status: data.status,
        statusLabel: statusMap[data.status] || data.status,
        response: data.admin_response,
        created_at: data.created_at,
        createdAt: data.created_at,
        updated_at: data.updated_at,
        updatedAt: data.updated_at,
        resolvedAt: data.resolved_at,
        messages: [],
      } as StatusCheckResult;
    },
  });
};
