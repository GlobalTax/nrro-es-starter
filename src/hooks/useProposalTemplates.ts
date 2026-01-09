import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ProposalTemplate {
  id: string;
  title: string;
  description: string | null;
  category: string;
  file_url: string;
  thumbnail_url: string | null;
  version: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProposalTemplateFormData {
  title: string;
  description?: string;
  category: string;
  file_url: string;
  thumbnail_url?: string;
  version?: number;
  is_active?: boolean;
}

export const useProposalTemplates = (category?: string) => {
  return useQuery({
    queryKey: ['proposal-templates', category],
    queryFn: async () => {
      let query = supabase
        .from('proposal_templates')
        .select('*')
        .eq('is_active', true)
        .order('category')
        .order('created_at', { ascending: false });
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as ProposalTemplate[];
    },
  });
};

export const useCreateProposalTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (template: ProposalTemplateFormData) => {
      const { data, error } = await supabase
        .from('proposal_templates')
        .insert(template)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposal-templates'] });
      toast.success('Plantilla creada correctamente');
    },
    onError: (error) => {
      console.error('Error creating template:', error);
      toast.error('Error al crear la plantilla');
    },
  });
};

export const useUpdateProposalTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProposalTemplate> & { id: string }) => {
      const { data, error } = await supabase
        .from('proposal_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposal-templates'] });
      toast.success('Plantilla actualizada');
    },
    onError: (error) => {
      console.error('Error updating template:', error);
      toast.error('Error al actualizar la plantilla');
    },
  });
};

export const useDeleteProposalTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('proposal_templates')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposal-templates'] });
      toast.success('Plantilla eliminada');
    },
    onError: (error) => {
      console.error('Error deleting template:', error);
      toast.error('Error al eliminar la plantilla');
    },
  });
};

export const uploadTemplateFile = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `templates/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('proposal-templates')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('proposal-templates')
    .getPublicUrl(filePath);

  return publicUrl;
};

export const TEMPLATE_CATEGORIES = [
  { value: 'fiscal', label: 'Fiscal' },
  { value: 'contabilidad', label: 'Contabilidad' },
  { value: 'laboral', label: 'Laboral' },
  { value: 'mercantil', label: 'Mercantil' },
  { value: 'ma', label: 'M&A' },
  { value: 'integral', label: 'Integral' },
];
