import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CompanySetupLead {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  phone?: string;
  company_name?: string;
  country_origin: string;
  industry?: string;
  estimated_revenue?: string;
  timeline?: string;
  company_stage?: string;
  landing_variant: 'calculator' | 'nie-hell' | 'tech-startup' | 'express';
  conversion_type?: string;
  status: string;
  priority: string;
  lead_score: number;
  calculator_data?: any;
  message?: string;
  notes?: string;
  utm_campaign?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_term?: string;
  utm_content?: string;
  landing_page_url?: string;
  referrer?: string;
  assigned_to?: string;
  contacted_at?: string;
  consultation_date?: string;
  ip_address?: string;
  user_agent?: string;
}

export interface LeadFilters {
  landing_variant?: string;
  status?: string;
  priority?: string;
  country?: string;
  timeline?: string;
  dateFrom?: string;
  dateTo?: string;
  minScore?: number;
  maxScore?: number;
  search?: string;
}

export const useCompanySetupLeads = (filters?: LeadFilters) => {
  return useQuery({
    queryKey: ['company-setup-leads', filters],
    queryFn: async () => {
      let query = supabase
        .from('company_setup_leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (filters?.landing_variant && filters.landing_variant !== 'all') {
        query = query.eq('landing_variant', filters.landing_variant);
      }
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters?.priority && filters.priority !== 'all') {
        query = query.eq('priority', filters.priority);
      }
      if (filters?.country && filters.country !== 'all') {
        query = query.eq('country_origin', filters.country);
      }
      if (filters?.timeline && filters.timeline !== 'all') {
        query = query.eq('timeline', filters.timeline);
      }
      if (filters?.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      if (filters?.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }
      if (filters?.minScore !== undefined) {
        query = query.gte('lead_score', filters.minScore);
      }
      if (filters?.maxScore !== undefined) {
        query = query.lte('lead_score', filters.maxScore);
      }
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company_name.ilike.%${filters.search}%`);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as CompanySetupLead[];
    },
  });
};

export const useUpdateCompanySetupLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CompanySetupLead> }) => {
      const { error } = await supabase
        .from('company_setup_leads')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-setup-leads'] });
      queryClient.invalidateQueries({ queryKey: ['company-setup-stats'] });
    },
  });
};

export const useDeleteCompanySetupLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('company_setup_leads')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-setup-leads'] });
      queryClient.invalidateQueries({ queryKey: ['company-setup-stats'] });
    },
  });
};

export const useCompanySetupStats = () => {
  return useQuery({
    queryKey: ['company-setup-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_setup_leads')
        .select('landing_variant, status, priority, lead_score, created_at');
      
      if (error) throw error;
      
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const thisMonthData = data.filter(l => new Date(l.created_at) >= thisMonth);
      
      const stats = {
        total: data.length,
        thisMonth: thisMonthData.length,
        byVariant: {
          calculator: data.filter(l => l.landing_variant === 'calculator').length,
          nieHell: data.filter(l => l.landing_variant === 'nie-hell').length,
          techStartup: data.filter(l => l.landing_variant === 'tech-startup').length,
          express: data.filter(l => l.landing_variant === 'express').length,
        },
        byStatus: {
          new: data.filter(l => l.status === 'new').length,
          contacted: data.filter(l => l.status === 'contacted').length,
          qualified: data.filter(l => l.status === 'qualified').length,
          won: data.filter(l => l.status === 'won').length,
          lost: data.filter(l => l.status === 'lost').length,
        },
        byPriority: {
          urgent: data.filter(l => l.priority === 'urgent').length,
          high: data.filter(l => l.priority === 'high').length,
          medium: data.filter(l => l.priority === 'medium').length,
          low: data.filter(l => l.priority === 'low').length,
        },
        avgScore: data.length > 0 
          ? Math.round(data.reduce((acc, l) => acc + l.lead_score, 0) / data.length)
          : 0,
      };
      
      return stats;
    },
  });
};
