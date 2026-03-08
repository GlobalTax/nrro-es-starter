import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface StatusCheckResult {
  id: string;
  status: string;
  response: string | null;
  created_at: string;
  updated_at: string;
}

export const useSubmitWhistleblowerReport = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('whistleblower_reports')
        .insert(data);
      if (error) throw error;
    },
  });
};

export const useCheckWhistleblowerStatus = () => {
  return useMutation({
    mutationFn: async (trackingCode: string): Promise<StatusCheckResult | null> => {
      const { data, error } = await supabase
        .from('whistleblower_reports')
        .select('id, status, response, created_at, updated_at')
        .eq('tracking_code', trackingCode)
        .maybeSingle();
      if (error) throw error;
      return data as StatusCheckResult | null;
    },
  });
};
