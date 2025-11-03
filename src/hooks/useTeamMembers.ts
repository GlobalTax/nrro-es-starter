import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
  return useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (error) throw error;
      return data as TeamMember[];
    },
  });
}
