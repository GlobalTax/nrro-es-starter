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
  html_content: string | null;
  status: string;
  generated_by: string | null;
  created_at: string;
  updated_at: string;
  // Nuevos campos de módulos narrativos
  presentation_type: string;
  audience_type: string;
  presentation_objective: string;
  quality_mode: string;
  narrative_score: number;
  validation_passed: boolean;
  cover_tagline: string | null;
  cta_type: string;
  differentiators: Differentiator[];
}

export interface ServiceSummary {
  id: string;
  name: string;
  area: string;
  description: string;
  features?: string[];
  benefits?: string[];
}

export interface TeamMemberSummary {
  id: string;
  name: string;
  position: string;
  avatar_url?: string;
  specialization?: string;
  bio?: string;
}

export interface CaseStudySummary {
  id: string;
  title: string;
  client_name: string;
  client_industry: string;
  results_summary: string;
  challenge?: string;
  solution?: string;
  metrics?: { label: string; value: string }[];
  testimonial_text?: string;
  testimonial_author?: string;
}

export interface Differentiator {
  title: string;
  description: string;
  proof: string;
  impact: string;
}

export interface GeneratedPresentationInsert {
  client_name: string;
  client_company?: string;
  client_logo_url?: string;
  sector?: string;
  language: string;
  format: string;
  services_included: ServiceSummary[];
  team_members_included: TeamMemberSummary[];
  case_studies_included: CaseStudySummary[];
  include_stats?: boolean;
  custom_intro?: string;
  generated_by?: string;
  // Nuevos campos de módulos narrativos
  presentation_type?: string;
  audience_type?: string;
  presentation_objective?: string;
  quality_mode?: string;
  cover_tagline?: string;
  cta_type?: string;
  differentiators?: Differentiator[];
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

export const PRESENTATION_TYPES = [
  { value: 'corporate', label: 'Corporativa general' },
  { value: 'ma', label: 'Para operación de M&A' },
  { value: 'inbound', label: 'Para captar cliente inbound' },
  { value: 'pe', label: 'Para inversor / Private Equity' },
  { value: 'fiscal', label: 'Solo fiscal' },
];

export const AUDIENCE_TYPES = [
  { value: 'family_business', label: 'Empresa familiar' },
  { value: 'investor', label: 'Inversor / fondo' },
  { value: 'foreigner', label: 'Empresa extranjera' },
  { value: 'startup', label: 'Startup / scale-up' },
];

export const PRESENTATION_OBJECTIVES = [
  { value: 'meet', label: 'Que nos conozcan' },
  { value: 'decide', label: 'Que tomen una decisión' },
  { value: 'contact', label: 'Que contacten' },
];

export const QUALITY_MODES = [
  { value: 'basic', label: 'Básico', description: '6-8 páginas, esencial' },
  { value: 'professional', label: 'Profesional', description: '10-12 páginas, completo' },
  { value: 'premium', label: 'Premium', description: '15+ páginas, detallado' },
];

export const CTA_TYPES = [
  { value: 'strategic_conversation', label: 'Primera conversación estratégica' },
  { value: 'initial_diagnosis', label: 'Diagnóstico inicial' },
  { value: 'preliminary_valuation', label: 'Valoración preliminar' },
  { value: 'structure_review', label: 'Revisión de estructura' },
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
        differentiators: Array.isArray(item.differentiators) ? item.differentiators : [],
        narrative_score: item.narrative_score || 0,
        validation_passed: item.validation_passed || false,
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
          client_logo_url: data.client_logo_url,
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
          // Nuevos campos narrativos
          presentation_type: data.presentation_type || 'corporate',
          audience_type: data.audience_type || 'family_business',
          presentation_objective: data.presentation_objective || 'meet',
          quality_mode: data.quality_mode || 'professional',
          cover_tagline: data.cover_tagline,
          cta_type: data.cta_type || 'strategic_conversation',
          differentiators: data.differentiators as any || [],
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
      if (data.differentiators) {
        updateData.differentiators = data.differentiators;
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
      toast.success('Presentación generada correctamente');
    },
    onError: (error) => {
      console.error('Error generating PDF:', error);
      toast.error('Error al generar la presentación');
    },
  });
};

// Función para calcular score de calidad en frontend (preview)
export function calculateNarrativeScore(data: Partial<GeneratedPresentationInsert>): { score: number; issues: string[] } {
  let score = 100;
  const issues: string[] = [];

  // Cliente
  if (!data.client_name?.trim()) {
    score -= 20;
    issues.push('Falta nombre del cliente');
  }

  // Servicios
  const servicesCount = data.services_included?.length || 0;
  if (servicesCount === 0) {
    score -= 30;
    issues.push('Sin servicios seleccionados');
  } else if (servicesCount < 3) {
    score -= 10;
    issues.push('Pocos servicios (menos de 3)');
  }

  // Equipo
  const teamCount = data.team_members_included?.length || 0;
  const casesCount = data.case_studies_included?.length || 0;
  if (casesCount > 0 && teamCount < 2) {
    score -= 15;
    issues.push('Añade más equipo si incluyes casos');
  }

  // Intro personalizada (bonus)
  if (data.custom_intro && data.custom_intro.length >= 50) {
    score += 5;
  }

  // Cover tagline (bonus)
  if (data.cover_tagline && data.cover_tagline.length >= 20) {
    score += 5;
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    issues,
  };
}
