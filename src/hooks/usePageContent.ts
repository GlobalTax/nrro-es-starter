import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PageContent, PageContentInsert, PageContentUpdate } from '@/types/pageContent';

export const usePageContent = (pageKey?: string, sectionKey?: string) => {
  return useQuery({
    queryKey: ['page-content', pageKey, sectionKey],
    queryFn: async () => {
      let query = supabase
        .from('page_content')
        .select('*')
        .eq('is_active', true);
      
      if (pageKey) {
        query = query.eq('page_key', pageKey);
      }
      
      if (sectionKey) {
        query = query.eq('section_key', sectionKey);
      }
      
      const { data, error } = await query.order('display_order');
      
      if (error) throw error;
      return data as PageContent[];
    },
    enabled: !!pageKey,
  });
};

export const useAllPageContent = () => {
  return useQuery({
    queryKey: ['page-content', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .order('page_key')
        .order('display_order');
      
      if (error) throw error;
      return data as PageContent[];
    },
  });
};

export const useCreatePageContent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (content: PageContentInsert) => {
      const { data, error } = await supabase
        .from('page_content')
        .insert(content)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-content'] });
    },
  });
};

export const useUpdatePageContent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, content }: { id: string; content: PageContentUpdate }) => {
      const { data, error } = await supabase
        .from('page_content')
        .update(content)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-content'] });
    },
  });
};

export const useDeletePageContent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('page_content')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-content'] });
    },
  });
};
