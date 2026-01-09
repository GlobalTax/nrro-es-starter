import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ProposalService {
  id: string;
  name: string;
  description: string | null;
  category: string;
  default_price: number | null;
  price_type: 'fixed' | 'monthly' | 'annual';
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface ProposalServiceFormData {
  name: string;
  description?: string;
  category: string;
  default_price?: number;
  price_type?: 'fixed' | 'monthly' | 'annual';
  display_order?: number;
  is_active?: boolean;
}

export const useProposalServices = (activeOnly = true) => {
  return useQuery({
    queryKey: ['proposal-services', activeOnly],
    queryFn: async () => {
      let query = supabase
        .from('proposal_services')
        .select('*')
        .order('category')
        .order('display_order');
      
      if (activeOnly) {
        query = query.eq('is_active', true);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as ProposalService[];
    },
  });
};

export const useCreateProposalService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (service: ProposalServiceFormData) => {
      const { data, error } = await supabase
        .from('proposal_services')
        .insert(service)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposal-services'] });
      toast.success('Servicio creado correctamente');
    },
    onError: (error) => {
      console.error('Error creating service:', error);
      toast.error('Error al crear el servicio');
    },
  });
};

export const useUpdateProposalService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProposalService> & { id: string }) => {
      const { data, error } = await supabase
        .from('proposal_services')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposal-services'] });
      toast.success('Servicio actualizado');
    },
    onError: (error) => {
      console.error('Error updating service:', error);
      toast.error('Error al actualizar el servicio');
    },
  });
};

export const useDeleteProposalService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('proposal_services')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposal-services'] });
      toast.success('Servicio eliminado');
    },
    onError: (error) => {
      console.error('Error deleting service:', error);
      toast.error('Error al eliminar el servicio');
    },
  });
};

// Agrupar servicios por categoría
export const groupServicesByCategory = (services: ProposalService[]) => {
  return services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, ProposalService[]>);
};

export const CATEGORY_LABELS: Record<string, string> = {
  fiscal: 'Fiscal',
  contabilidad: 'Contabilidad',
  laboral: 'Laboral',
  mercantil: 'Mercantil',
  ma: 'M&A',
};

export const PRICE_TYPE_LABELS: Record<string, string> = {
  fixed: 'Único',
  monthly: 'Mensual',
  annual: 'Anual',
};
