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
        .select('*', { count: 'exact' })
        .eq('is_active', true);

      // Apply search filter
      if (params.searchQuery) {
        query = query.or(
          `name_es.ilike.%${params.searchQuery}%,description_es.ilike.%${params.searchQuery}%`
        );
      }

      // Apply area filter
      if (params.area) {
        query = query.eq('area', params.area);
      }

      // Order by display order, then creation date
      query = query.order('display_order', { ascending: true });
      query = query.order('created_at', { ascending: false });

      // Apply pagination
      if (params.limit) {
        query = query.limit(params.limit);
      }
      if (params.offset) {
        query = query.range(params.offset, params.offset + (params.limit || 20) - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;
      
      return {
        services: data || [],
        totalCount: count || 0
      };
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
