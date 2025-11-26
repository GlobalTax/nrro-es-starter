import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface LandingVersion {
  id: string;
  landing_id: string;
  version_number: number;
  snapshot_json: any;
  change_summary: string | null;
  created_at: string;
  created_by: string | null;
}

export const useLandingVersions = (landingId: string | undefined) => {
  return useQuery({
    queryKey: ['landing-versions', landingId],
    queryFn: async () => {
      if (!landingId) return [];
      
      const { data, error } = await supabase
        .from('landing_versions')
        .select('*')
        .eq('landing_id', landingId)
        .order('version_number', { ascending: false });

      if (error) throw error;
      return data as LandingVersion[];
    },
    enabled: !!landingId,
  });
};

export const useCreateVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      landingId,
      versionNumber,
      snapshot,
      changeSummary,
    }: {
      landingId: string;
      versionNumber: number;
      snapshot: any;
      changeSummary: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('landing_versions')
        .insert({
          landing_id: landingId,
          version_number: versionNumber,
          snapshot_json: snapshot,
          change_summary: changeSummary,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['landing-versions', variables.landingId] });
      toast.success('Versión guardada correctamente');
    },
    onError: (error) => {
      console.error('Error creating version:', error);
      toast.error('Error al guardar versión');
    },
  });
};

export const generateChangeSummary = (before: any, after: any): string => {
  const changes: string[] = [];

  if (before.title !== after.title) changes.push('título');
  if (before.slug !== after.slug) changes.push('slug');
  if (before.url !== after.url) changes.push('URL');
  if (before.category !== after.category) changes.push('categoría');
  if (before.status !== after.status) changes.push(`estado a "${after.status}"`);
  if (before.meta_title !== after.meta_title) changes.push('meta título');
  if (before.meta_description !== after.meta_description) changes.push('meta descripción');
  if (JSON.stringify(before.sections) !== JSON.stringify(after.sections)) changes.push('secciones');
  if (before.notes !== after.notes) changes.push('notas');

  if (changes.length === 0) return 'Sin cambios significativos';
  if (changes.length === 1) return `Actualizado ${changes[0]}`;
  if (changes.length === 2) return `Actualizado ${changes[0]} y ${changes[1]}`;
  
  return `Actualizado ${changes.slice(0, -1).join(', ')} y ${changes.slice(-1)}`;
};

export const shouldCreateVersion = (current: any, updates: any): boolean => {
  const trackableFields = ['title', 'slug', 'url', 'category', 'status', 'meta_title', 'meta_description', 'sections', 'notes'];
  
  return trackableFields.some(field => {
    if (!(field in updates)) return false;
    const currentValue = current[field];
    const newValue = updates[field];
    
    if (typeof currentValue === 'object' && typeof newValue === 'object') {
      return JSON.stringify(currentValue) !== JSON.stringify(newValue);
    }
    
    return currentValue !== newValue;
  });
};
