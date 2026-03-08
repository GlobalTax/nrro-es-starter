import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface LeadRecent {
  id: string;
  name: string;
  email: string;
  subject: string;
  source_site: string | null;
  created_at: string;
  email_sent: boolean;
}

export interface DashboardStats {
  leadsTotal: number;
  leadsPendientes: number;
  
  postsPublicados: number;
  leadsRecientes: LeadRecent[];
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const [
        leadsCountResult,
        leadsPendientesResult,
        postsResult,
        leadsRecientesResult,
      ] = await Promise.all([
        supabase
          .from('contact_leads')
          .select('id', { count: 'exact', head: true }),
        supabase
          .from('contact_leads')
          .select('id', { count: 'exact', head: true })
          .eq('email_sent', false),
        supabase
          .from('blog_posts')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'published'),
        supabase
          .from('contact_leads')
          .select('id, name, email, subject, source_site, created_at, email_sent')
          .order('created_at', { ascending: false })
          .limit(10),
      ]);

      return {
        leadsTotal: leadsCountResult.count || 0,
        leadsPendientes: leadsPendientesResult.count || 0,
        postsPublicados: postsResult.count || 0,
        leadsRecientes: (leadsRecientesResult.data || []) as LeadRecent[],
      };
    },
    staleTime: 1000 * 60 * 5,
  });
};
