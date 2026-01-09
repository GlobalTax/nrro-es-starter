import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Proposal {
  id: string;
  proposal_number: string;
  client_name: string;
  client_company: string | null;
  client_email: string | null;
  contact_lead_id: string | null;
  services: any[];
  fees: Record<string, any>;
  total_amount: number | null;
  valid_until: string | null;
  notes: string | null;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  pdf_url: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProposalFormData {
  client_name: string;
  client_company?: string;
  client_email?: string;
  contact_lead_id?: string;
  services: any[];
  fees: Record<string, any>;
  total_amount?: number;
  valid_until?: string;
  notes?: string;
  status?: string;
}

const generateProposalNumber = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const { count } = await supabase
    .from('proposals')
    .select('*', { count: 'exact', head: true })
    .like('proposal_number', `PROP-${year}-%`);
  
  const nextNumber = (count || 0) + 1;
  return `PROP-${year}-${String(nextNumber).padStart(3, '0')}`;
};

export const useProposals = (status?: string) => {
  return useQuery({
    queryKey: ['proposals', status],
    queryFn: async () => {
      let query = supabase
        .from('proposals')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Proposal[];
    },
  });
};

export const useProposal = (id: string | undefined) => {
  return useQuery({
    queryKey: ['proposal', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Proposal;
    },
    enabled: !!id,
  });
};

export const useCreateProposal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (proposal: ProposalFormData) => {
      const proposalNumber = await generateProposalNumber();
      
      const { data, error } = await supabase
        .from('proposals')
        .insert({
          ...proposal,
          proposal_number: proposalNumber,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast.success('Propuesta creada correctamente');
    },
    onError: (error) => {
      console.error('Error creating proposal:', error);
      toast.error('Error al crear la propuesta');
    },
  });
};

export const useUpdateProposal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Proposal> & { id: string }) => {
      const { data, error } = await supabase
        .from('proposals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast.success('Propuesta actualizada');
    },
    onError: (error) => {
      console.error('Error updating proposal:', error);
      toast.error('Error al actualizar la propuesta');
    },
  });
};

export const useDeleteProposal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('proposals')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast.success('Propuesta eliminada');
    },
    onError: (error) => {
      console.error('Error deleting proposal:', error);
      toast.error('Error al eliminar la propuesta');
    },
  });
};

export const useProposalStats = () => {
  return useQuery({
    queryKey: ['proposal-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('proposals')
        .select('status, total_amount');
      
      if (error) throw error;
      
      const stats = {
        total: data.length,
        draft: data.filter(p => p.status === 'draft').length,
        sent: data.filter(p => p.status === 'sent').length,
        accepted: data.filter(p => p.status === 'accepted').length,
        rejected: data.filter(p => p.status === 'rejected').length,
        totalValue: data
          .filter(p => p.status === 'accepted')
          .reduce((sum, p) => sum + (p.total_amount || 0), 0),
        conversionRate: data.length > 0
          ? (data.filter(p => p.status === 'accepted').length / data.filter(p => p.status !== 'draft').length) * 100
          : 0,
      };
      
      return stats;
    },
  });
};
