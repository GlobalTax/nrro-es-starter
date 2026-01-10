import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface GeneratedPresentation {
  id: string;
  client_name: string;
  client_company: string | null;
  sector: string | null;
  language: string;
  format: string;
  services_included: ServiceSummary[];
  team_members_included: TeamMemberSummary[];
  case_studies_included: CaseStudySummary[];
  include_stats: boolean;
  custom_intro: string | null;
  pdf_url: string | null;
  status: string;
  generated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceSummary {
  id: string;
  name: string;
  area: string;
  description: string;
}

export interface TeamMemberSummary {
  id: string;
  name: string;
  position: string;
  avatar_url?: string;
}

export interface CaseStudySummary {
  id: string;
  title: string;
  client_name: string;
  client_industry: string;
  results_summary: string;
}

export interface GeneratedPresentationInsert {
  client_name: string;
  client_company?: string;
  sector?: string;
  language: string;
  format: string;
  services_included: ServiceSummary[];
  team_members_included: TeamMemberSummary[];
  case_studies_included: CaseStudySummary[];
  include_stats?: boolean;
  custom_intro?: string;
  generated_by?: string;
}

export const PRESENTATION_SECTORS = [
  { value: 'tecnologia', label: 'Tecnología' },
  { value: 'retail', label: 'Retail / Comercio' },
  { value: 'industria', label: 'Industria' },
  { value: 'servicios', label: 'Servicios Profesionales' },
  { value: 'salud', label: 'Salud / Farmacia' },
  { value: 'inmobiliario', label: 'Inmobiliario' },
  { value: 'hosteleria', label: 'Hostelería / Turismo' },
  { value: 'construccion', label: 'Construcción' },
  { value: 'educacion', label: 'Educación' },
  { value: 'otro', label: 'Otro' },
];

export const useGeneratedPresentations = () => {
  return useQuery({
    queryKey: ['generated-presentations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('generated_presentations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map((item: any) => ({
        ...item,
        services_included: Array.isArray(item.services_included) ? item.services_included : [],
        team_members_included: Array.isArray(item.team_members_included) ? item.team_members_included : [],
        case_studies_included: Array.isArray(item.case_studies_included) ? item.case_studies_included : [],
      })) as GeneratedPresentation[];
    },
  });
};

export const useCreateGeneratedPresentation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: GeneratedPresentationInsert) => {
      const { data: result, error } = await supabase
        .from('generated_presentations')
        .insert({
          client_name: data.client_name,
          client_company: data.client_company,
          sector: data.sector,
          language: data.language,
          format: data.format,
          services_included: data.services_included as any,
          team_members_included: data.team_members_included as any,
          case_studies_included: data.case_studies_included as any,
          include_stats: data.include_stats ?? true,
          custom_intro: data.custom_intro,
          generated_by: data.generated_by,
          status: 'draft',
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generated-presentations'] });
    },
    onError: (error) => {
      console.error('Error creating presentation:', error);
      toast.error('Error al crear la presentación');
    },
  });
};

export const useUpdateGeneratedPresentation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<GeneratedPresentation> & { id: string }) => {
      const updateData: any = { ...data };
      if (data.services_included) {
        updateData.services_included = data.services_included;
      }
      if (data.team_members_included) {
        updateData.team_members_included = data.team_members_included;
      }
      if (data.case_studies_included) {
        updateData.case_studies_included = data.case_studies_included;
      }

      const { data: result, error } = await supabase
        .from('generated_presentations')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generated-presentations'] });
    },
    onError: (error) => {
      console.error('Error updating presentation:', error);
      toast.error('Error al actualizar la presentación');
    },
  });
};

export const useDeleteGeneratedPresentation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('generated_presentations')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generated-presentations'] });
      toast.success('Presentación eliminada');
    },
    onError: (error) => {
      console.error('Error deleting presentation:', error);
      toast.error('Error al eliminar la presentación');
    },
  });
};

export const useGeneratePresentationPdf = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (presentationId: string) => {
      const { data, error } = await supabase.functions.invoke('generate-presentation-pdf', {
        body: { presentation_id: presentationId },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generated-presentations'] });
      toast.success('PDF generado correctamente');
    },
    onError: (error) => {
      console.error('Error generating PDF:', error);
      toast.error('Error al generar el PDF');
    },
  });
};
