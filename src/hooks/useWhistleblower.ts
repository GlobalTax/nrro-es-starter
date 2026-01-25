import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types
export interface WhistleblowerReport {
  id: string;
  tracking_code: string;
  category: string;
  description: string;
  date_of_incident: string | null;
  location: string | null;
  persons_involved: string | null;
  evidence_urls: string[];
  contact_email: string | null;
  is_anonymous: boolean;
  status: 'nuevo' | 'en_revision' | 'investigando' | 'resuelto' | 'archivado';
  priority: 'baja' | 'media' | 'alta' | 'critica';
  assigned_to: string | null;
  internal_notes: string | null;
  resolution: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface WhistleblowerMessage {
  id: string;
  report_id: string;
  sender_type: 'denunciante' | 'admin';
  message: string;
  attachment_urls: string[];
  is_visible_to_reporter: boolean;
  created_at: string;
}

export interface WhistleblowerStats {
  total: number;
  nuevo: number;
  en_revision: number;
  investigando: number;
  resuelto: number;
  archivado: number;
  by_category: Record<string, number>;
  by_priority: Record<string, number>;
}

export interface SubmitReportData {
  category: string;
  description: string;
  dateOfIncident?: string;
  location?: string;
  personsInvolved?: string;
  contactEmail?: string;
  isAnonymous: boolean;
  acceptedPolicy: boolean;
}

export interface StatusCheckResult {
  success: boolean;
  status: string;
  statusLabel: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  messages: Array<{
    message: string;
    date: string;
    from: string;
  }>;
}

// Fetch all reports (admin)
export const useWhistleblowerReports = (filters?: {
  status?: string;
  category?: string;
  priority?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['whistleblower-reports', filters],
    queryFn: async () => {
      let query = supabase
        .from('whistleblower_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status as any);
      }
      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category as any);
      }
      if (filters?.priority && filters.priority !== 'all') {
        query = query.eq('priority', filters.priority as any);
      }
      if (filters?.search) {
        query = query.or(`tracking_code.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as WhistleblowerReport[];
    },
  });
};

// Fetch single report with messages
export const useWhistleblowerReport = (id: string | null) => {
  return useQuery({
    queryKey: ['whistleblower-report', id],
    queryFn: async () => {
      if (!id) return null;

      const { data: report, error } = await supabase
        .from('whistleblower_reports')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      const { data: messages } = await supabase
        .from('whistleblower_messages')
        .select('*')
        .eq('report_id', id)
        .order('created_at', { ascending: true });

      return {
        report: report as WhistleblowerReport,
        messages: (messages || []) as WhistleblowerMessage[],
      };
    },
    enabled: !!id,
  });
};

// Fetch stats
export const useWhistleblowerStats = () => {
  return useQuery({
    queryKey: ['whistleblower-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('whistleblower_reports')
        .select('status, category, priority');

      if (error) throw error;

      const stats: WhistleblowerStats = {
        total: data.length,
        nuevo: 0,
        en_revision: 0,
        investigando: 0,
        resuelto: 0,
        archivado: 0,
        by_category: {},
        by_priority: {},
      };

      const statusKeys: (keyof WhistleblowerStats)[] = ['nuevo', 'en_revision', 'investigando', 'resuelto', 'archivado'];

      data.forEach((report) => {
        // Count by status
        const status = report.status as string;
        if (statusKeys.includes(status as keyof WhistleblowerStats)) {
          (stats as any)[status]++;
        }

        // Count by category
        const category = report.category as string;
        if (category) {
          stats.by_category[category] = (stats.by_category[category] || 0) + 1;
        }

        // Count by priority
        const priority = report.priority as string;
        if (priority) {
          stats.by_priority[priority] = (stats.by_priority[priority] || 0) + 1;
        }
      });

      return stats;
    },
  });
};

// Update report
export const useUpdateWhistleblowerReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<WhistleblowerReport> }) => {
      const updateData: any = { ...updates };
      
      // Set resolved_at when status changes to resuelto
      if (updates.status === 'resuelto' && !updates.resolved_at) {
        updateData.resolved_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('whistleblower_reports')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whistleblower-reports'] });
      queryClient.invalidateQueries({ queryKey: ['whistleblower-report'] });
      queryClient.invalidateQueries({ queryKey: ['whistleblower-stats'] });
      toast.success('Denuncia actualizada');
    },
    onError: (error) => {
      console.error('Error updating report:', error);
      toast.error('Error al actualizar la denuncia');
    },
  });
};

// Add message
export const useAddWhistleblowerMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      report_id: string;
      message: string;
      is_visible_to_reporter: boolean;
    }) => {
      const { data: result, error } = await supabase
        .from('whistleblower_messages')
        .insert({
          report_id: data.report_id,
          sender_type: 'admin',
          message: data.message,
          is_visible_to_reporter: data.is_visible_to_reporter,
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['whistleblower-report', variables.report_id] });
      toast.success('Mensaje añadido');
    },
    onError: (error) => {
      console.error('Error adding message:', error);
      toast.error('Error al añadir el mensaje');
    },
  });
};

// Submit new report (public)
export const useSubmitWhistleblowerReport = () => {
  return useMutation({
    mutationFn: async (data: SubmitReportData) => {
      const response = await supabase.functions.invoke('submit-whistleblower-report', {
        body: data,
      });

      if (response.error) {
        throw new Error(response.error.message || 'Error al enviar la denuncia');
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      return response.data as { success: boolean; trackingCode: string; message: string };
    },
  });
};

// Check status (public)
export const useCheckWhistleblowerStatus = () => {
  return useMutation({
    mutationFn: async (trackingCode: string) => {
      const response = await supabase.functions.invoke('check-whistleblower-status', {
        body: { trackingCode },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Error al consultar el estado');
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      return response.data as StatusCheckResult;
    },
  });
};
