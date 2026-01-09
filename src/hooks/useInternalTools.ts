import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface InternalTool {
  id: string;
  name: string;
  description: string | null;
  login_url: string;
  icon: string;
  category: string;
  color: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type InternalToolInsert = Omit<InternalTool, 'id' | 'created_at' | 'updated_at'>;
export type InternalToolUpdate = Partial<InternalToolInsert>;

export const useInternalTools = (includeInactive = false) => {
  return useQuery({
    queryKey: ['internal-tools', includeInactive],
    queryFn: async () => {
      let query = supabase
        .from('internal_tools')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!includeInactive) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as InternalTool[];
    },
  });
};

export const useInternalToolMutations = () => {
  const queryClient = useQueryClient();

  const createTool = useMutation({
    mutationFn: async (tool: InternalToolInsert) => {
      const { data, error } = await supabase
        .from('internal_tools')
        .insert(tool)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internal-tools'] });
      toast.success('Herramienta creada correctamente');
    },
    onError: (error) => {
      toast.error(`Error al crear herramienta: ${error.message}`);
    },
  });

  const updateTool = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: InternalToolUpdate }) => {
      const { data, error } = await supabase
        .from('internal_tools')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internal-tools'] });
      toast.success('Herramienta actualizada correctamente');
    },
    onError: (error) => {
      toast.error(`Error al actualizar herramienta: ${error.message}`);
    },
  });

  const deleteTool = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('internal_tools')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internal-tools'] });
      toast.success('Herramienta eliminada correctamente');
    },
    onError: (error) => {
      toast.error(`Error al eliminar herramienta: ${error.message}`);
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { data, error } = await supabase
        .from('internal_tools')
        .update({ is_active })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['internal-tools'] });
      toast.success(variables.is_active ? 'Herramienta activada' : 'Herramienta desactivada');
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  return {
    createTool,
    updateTool,
    deleteTool,
    toggleActive,
  };
};
