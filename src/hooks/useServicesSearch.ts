import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ServicesSearchParams {
  searchQuery?: string;
  area?: string;
  limit?: number;
  offset?: number;
}

export const useServicesSearch = (params: ServicesSearchParams) => {
  return useQuery({
    queryKey: ["services-search", params],
    queryFn: async () => {
      // @ts-ignore - New tables not in types yet
      const supabaseAny = supabase as any;
      let query = supabaseAny
        .from('services')
        .select('*')
        .eq('is_active', true);

      // Apply search filter
      if (params.searchQuery) {
        query = query.or(`name.ilike.%${params.searchQuery}%,description.ilike.%${params.searchQuery}%`);
      }

      // Apply area filter
      if (params.area) {
        query = query.eq('area', params.area);
      }

      // Apply pagination
      if (params.limit) {
        query = query.limit(params.limit);
      }
      if (params.offset) {
        query = query.range(params.offset, params.offset + (params.limit || 20) - 1);
      }

      // Order by featured first, then display order
      query = query.order('is_featured', { ascending: false });
      query = query.order('display_order', { ascending: true });
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
    enabled: true,
  });
};

export const useServicesFilterOptions = () => {
  return useQuery({
    queryKey: ["services-filter-options"],
    queryFn: async () => {
      // @ts-ignore - New tables not in types yet
      const supabaseAny = supabase as any;
      const { data, error } = await supabaseAny
        .from('services')
        .select('area')
        .eq('is_active', true);
      
      if (error) throw error;
      
      const uniqueAreas = Array.from(new Set(data?.map((s: any) => s.area) || []));
      
      return {
        areas: uniqueAreas,
      };
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};
