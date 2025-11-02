import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TechItem {
  name: string;
  category: string;
  description: string;
  mockup_url: string;
  featured?: boolean;
  order: number;
}

interface TechnologyContent {
  overline?: string;
  title?: string;
  technologies: TechItem[];
}

export const useTechnology = () => {
  return useQuery({
    queryKey: ['technology-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_key', 'home')
        .eq('section_key', 'tecnologia')
        .single();

      if (error) throw error;
      
      const content = data?.content as unknown as TechnologyContent;
      return content?.technologies || [];
    }
  });
};

export const useUpdateTechnology = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (technologies: TechItem[]) => {
      const { data: existing, error: fetchError } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_key', 'home')
        .eq('section_key', 'tecnologia')
        .single();

      if (fetchError) throw fetchError;

      const currentContent = existing.content as unknown as TechnologyContent;
      const updatedContent = {
        ...currentContent,
        technologies
      };

      const { error: updateError } = await supabase
        .from('page_content')
        .update({ content: updatedContent as any, updated_at: new Date().toISOString() })
        .eq('id', existing.id);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technology-content'] });
      toast.success('Tecnologías actualizadas correctamente');
    },
    onError: (error) => {
      console.error('Error updating technologies:', error);
      toast.error('Error al actualizar las tecnologías');
    }
  });
};
