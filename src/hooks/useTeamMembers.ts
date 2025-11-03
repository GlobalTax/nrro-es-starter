import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from './useLanguage';
import { getLocalizedField } from '@/i18n/utils';

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio?: string;
  specialization?: string;
  linkedin?: string;
  email?: string;
  avatar_url?: string;
  order_index: number;
  is_active: boolean;
}

export function useTeamMembers() {
  const { language } = useLanguage();
  
  return useQuery({
    queryKey: ['team-members', language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (error) throw error;
      
      // Map localized fields
      return data?.map((member: any) => ({
        ...member,
        position: getLocalizedField(member, 'position', language) || member.position,
        bio: getLocalizedField(member, 'bio', language) || member.bio,
        specialization: getLocalizedField(member, 'specialization', language) || member.specialization,
      })) as TeamMember[];
    },
  });
}
