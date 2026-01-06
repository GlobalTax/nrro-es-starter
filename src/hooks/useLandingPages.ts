import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { shouldCreateVersion, generateChangeSummary } from './useLandingVersions';

export interface LandingPage {
  id: string;
  slug: string;
  slug_es?: string | null;
  slug_ca?: string | null;
  slug_en?: string | null;
  title: string;
  title_es?: string | null;
  title_ca?: string | null;
  title_en?: string | null;
  meta_title?: string | null;
  meta_title_es?: string | null;
  meta_title_ca?: string | null;
  meta_title_en?: string | null;
  meta_description?: string | null;
  meta_description_es?: string | null;
  meta_description_ca?: string | null;
  meta_description_en?: string | null;
  keywords?: string[] | null;
  sections: any[];
  layout_type?: string | null;
  use_navbar?: boolean | null;
  use_footer?: boolean | null;
  custom_navbar?: string | null;
  primary_cta_text?: string | null;
  primary_cta_text_es?: string | null;
  primary_cta_text_ca?: string | null;
  primary_cta_text_en?: string | null;
  primary_cta_url?: string | null;
  primary_cta_variant?: string | null;
  secondary_cta_text?: string | null;
  secondary_cta_url?: string | null;
  status?: string | null;
  is_active?: boolean | null;
  featured_image?: string | null;
  view_count?: number | null;
  conversion_count?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
  // New LMS fields
  category?: string | null;
  url?: string | null;
  utm_url?: string | null;
  qr_code?: string | null;
  ads_campaigns?: string | null;
  notes?: string | null;
  version?: number | null;
  health_score?: number | null;
  source_site?: 'es' | 'int' | null;
}

interface LandingFilters {
  status?: string;
  search?: string;
  category?: string;
}

export const useLandingPages = (filters: LandingFilters = {}) => {
  return useQuery({
    queryKey: ['landing-pages', filters],
    queryFn: async () => {
      let query = supabase
        .from('landing_pages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,slug.ilike.%${filters.search}%`);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as LandingPage[];
    },
  });
};

export const useLandingPageBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['landing-page', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data as LandingPage;
    },
    enabled: !!slug,
  });
};

export const useCreateLandingPage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (landing: Partial<LandingPage>) => {
      const { data, error } = await supabase
        .from('landing_pages')
        .insert([landing as any])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing-pages'] });
      toast.success('Landing page creada correctamente');
    },
    onError: (error) => {
      console.error('Error creating landing page:', error);
      toast.error('Error al crear la landing page');
    },
  });
};

export const useUpdateLandingPage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates, skipVersion = false }: { id: string; updates: Partial<LandingPage>; skipVersion?: boolean }) => {
      // 1. Obtener estado actual
      const { data: current, error: fetchError } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // 2. Crear snapshot si hay cambios significativos
      if (!skipVersion && shouldCreateVersion(current, updates)) {
        const { data: { user } } = await supabase.auth.getUser();
        
        await supabase.from('landing_versions').insert({
          landing_id: id,
          version_number: current.version || 1,
          snapshot_json: current,
          change_summary: generateChangeSummary(current, updates),
          created_by: user?.id,
        });
      }
      
      // 3. Aplicar updates con versión incrementada
      const finalUpdates = skipVersion 
        ? updates 
        : { ...updates, version: (current.version || 1) + 1 };
      
      const { data, error } = await supabase
        .from('landing_pages')
        .update(finalUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['landing-pages'] });
      queryClient.invalidateQueries({ queryKey: ['landing-page', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['landing-versions', variables.id] });
      toast.success('Landing page actualizada correctamente');
    },
    onError: (error) => {
      console.error('Error updating landing page:', error);
      toast.error('Error al actualizar la landing page');
    },
  });
};

export const useDeleteLandingPage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('landing_pages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing-pages'] });
      toast.success('Landing page eliminada correctamente');
    },
    onError: (error) => {
      console.error('Error deleting landing page:', error);
      toast.error('Error al eliminar la landing page');
    },
  });
};

export const useLandingPageById = (id: string) => {
  return useQuery({
    queryKey: ['landing-page', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as LandingPage;
    },
    enabled: !!id,
  });
};

export const useDuplicateLanding = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (landing: LandingPage) => {
      const { id, created_at, updated_at, ...landingData } = landing;
      const duplicate = {
        ...landingData,
        title: `${landing.title} (Copia)`,
        slug: `${landing.slug}-copia`,
        status: 'draft',
        version: 1,
      };
      
      const { data, error } = await supabase
        .from('landing_pages')
        .insert([duplicate as any])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing-pages'] });
      toast.success('Landing page duplicada correctamente');
    },
    onError: (error) => {
      console.error('Error duplicating landing page:', error);
      toast.error('Error al duplicar la landing page');
    },
  });
};

