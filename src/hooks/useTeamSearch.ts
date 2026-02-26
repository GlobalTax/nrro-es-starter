import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from './useTeamMembers';

interface TeamSearchParams {
  specialization?: string;
  position?: string;
}

export function useTeamSearch(params: TeamSearchParams = {}, language: string = 'es') {
  return useQuery({
    queryKey: ['team-members-search', params.specialization, params.position, language],
    queryFn: async () => {
      let query = supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('order_index') as any;

      if (params.specialization) {
        query = query.eq(`specialization_${language}`, params.specialization);
      }

      if (params.position) {
        query = query.eq(`position_${language}`, params.position);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Map to TeamMember with language-specific fields
      return (data || []).map((member: any) => ({
        id: member.id,
        name: member.name,
        position: member[`position_${language}`] || member.position_es,
        bio: member[`bio_${language}`] || member.bio_es,
        specialization: member[`specialization_${language}`] || member.specialization_es,
        linkedin: member.linkedin,
        email: member.email,
        avatar_url: member.avatar_url,
        order_index: member.order_index,
        is_active: member.is_active,
      })) as TeamMember[];
    },
  });
}

export function useTeamFilterOptions(language: string = 'es') {
  return useQuery({
    queryKey: ['team-specializations', language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select(`specialization_${language}`)
        .eq('is_active', true)
        .not(`specialization_${language}`, 'is', null) as any;

      if (error) throw error;

      // Get unique specializations
      const uniqueSpecializations = Array.from(
        new Set(data.map((item: any) => item[`specialization_${language}`]).filter(Boolean))
      ).sort();

      return uniqueSpecializations as string[];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

export function useTeamPositionOptions(language: string = 'es') {
  return useQuery({
    queryKey: ['team-positions', language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select(`position_${language}`)
        .eq('is_active', true)
        .not(`position_${language}`, 'is', null) as any;

      if (error) throw error;

      // Get unique positions and order them logically
      const uniquePositions = Array.from(
        new Set(data.map((item: any) => item[`position_${language}`]).filter(Boolean))
      );

      const orderMap: Record<string, number> = {
        'SOCIO': 1,
        'MANAGER': 2,
        'SENIOR': 3,
        'ASOCIADO': 4,
        'JUNIOR': 5,
        'MASTER SCHOLAR': 6
      };

      return uniquePositions.sort((a, b) => {
        const aVal = orderMap[a as string] || 999;
        const bVal = orderMap[b as string] || 999;
        return aVal - bVal;
      }) as string[];
    },
    staleTime: 5 * 60 * 1000,
  });
}
