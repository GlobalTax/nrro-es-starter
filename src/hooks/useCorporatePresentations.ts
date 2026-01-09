import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CorporatePresentation {
  id: string;
  title: string;
  description: string | null;
  category: 'general' | 'fiscal' | 'legal' | 'ma' | 'laboral' | 'sector';
  format: 'horizontal' | 'vertical';
  file_url: string;
  thumbnail_url: string | null;
  version: number;
  language: 'es' | 'en' | 'ca';
  is_active: boolean;
  target_audience: string | null;
  page_count: number | null;
  tags: string[] | null;
  download_count: number;
  created_at: string;
  updated_at: string;
}

export interface CorporatePresentationFormData {
  title: string;
  description?: string;
  category: CorporatePresentation['category'];
  format: CorporatePresentation['format'];
  file_url: string;
  thumbnail_url?: string;
  language: CorporatePresentation['language'];
  target_audience?: string;
  page_count?: number;
  tags?: string[];
  is_active?: boolean;
}

export const PRESENTATION_CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'fiscal', label: 'Fiscal' },
  { value: 'legal', label: 'Legal / Mercantil' },
  { value: 'ma', label: 'M&A' },
  { value: 'laboral', label: 'Laboral' },
  { value: 'sector', label: 'Sector específico' },
] as const;

export const PRESENTATION_LANGUAGES = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'ca', label: 'Català' },
] as const;

export const PRESENTATION_FORMATS = [
  { value: 'horizontal', label: 'Horizontal (16:9)' },
  { value: 'vertical', label: 'Vertical (A4)' },
] as const;

// Fetch all presentations
export function useCorporatePresentations(category?: string) {
  return useQuery({
    queryKey: ['corporate-presentations', category],
    queryFn: async () => {
      let query = supabase
        .from('corporate_presentations')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as CorporatePresentation[];
    },
  });
}

// Fetch single presentation
export function useCorporatePresentation(id: string) {
  return useQuery({
    queryKey: ['corporate-presentation', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('corporate_presentations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as CorporatePresentation;
    },
    enabled: !!id,
  });
}

// Create presentation
export function useCreateCorporatePresentation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CorporatePresentationFormData) => {
      const { data: result, error } = await supabase
        .from('corporate_presentations')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['corporate-presentations'] });
      toast.success('Presentación creada correctamente');
    },
    onError: (error) => {
      toast.error(`Error al crear presentación: ${error.message}`);
    },
  });
}

// Update presentation
export function useUpdateCorporatePresentation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CorporatePresentationFormData> }) => {
      const { data: result, error } = await supabase
        .from('corporate_presentations')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['corporate-presentations'] });
      toast.success('Presentación actualizada correctamente');
    },
    onError: (error) => {
      toast.error(`Error al actualizar: ${error.message}`);
    },
  });
}

// Delete presentation
export function useDeleteCorporatePresentation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('corporate_presentations')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['corporate-presentations'] });
      toast.success('Presentación eliminada');
    },
    onError: (error) => {
      toast.error(`Error al eliminar: ${error.message}`);
    },
  });
}

// Increment download count
export function useIncrementDownloadCount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Manually increment download count
      const { data: current } = await supabase
        .from('corporate_presentations')
        .select('download_count')
        .eq('id', id)
        .single();
      
      const { error } = await supabase
        .from('corporate_presentations')
        .update({ download_count: (current?.download_count || 0) + 1 })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['corporate-presentations'] });
    },
  });
}

// Upload presentation file
export async function uploadPresentationFile(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `presentations/${fileName}`;

  const { error } = await supabase.storage
    .from('corporate-presentations')
    .upload(filePath, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from('corporate-presentations')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

// Upload thumbnail
export async function uploadPresentationThumbnail(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `thumbnails/${fileName}`;

  const { error } = await supabase.storage
    .from('corporate-presentations')
    .upload(filePath, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from('corporate-presentations')
    .getPublicUrl(filePath);

  return data.publicUrl;
}
