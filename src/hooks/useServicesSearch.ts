import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ServicesSearchParams {
  searchQuery?: string;
  area?: string;
  limit?: number;
  offset?: number;
}

export const useServicesSearch = (params: ServicesSearchParams, language: string = 'es') => {
  return useQuery({
    queryKey: ["services-search", params, language],
    retry: 1,
    queryFn: async () => {
      let query = supabase
        .from('services')
        .select('*', { count: 'exact' })
        .eq('is_active', true) as any;

      // Apply search filter with language-specific columns and fallback
      if (params.searchQuery) {
        const q = params.searchQuery;
        query = query.or(
          `name_${language}.ilike.%${q}%,description_${language}.ilike.%${q}%,name_es.ilike.%${q}%,description_es.ilike.%${q}%`
        );
      }

      // Apply area filter with language-specific column and fallback
      if (params.area) {
        const areaCol = `area_${language}`;
        if (language === 'es') {
          query = query.eq('area_es', params.area);
        } else {
          query = query.or(`${areaCol}.eq.${params.area},area_es.eq.${params.area}`);
        }
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

      if (error) {
        console.error('Error fetching services:', error);
        throw error;
      }
      
      // Map data to include language-specific fields AND all slug variants
      const services = (data || []).map((service: any) => ({
        ...service,
        name: service[`name_${language}`] || service.name_es,
        description: service[`description_${language}`] || service.description_es,
        slug: service[`slug_${language}`] || service.slug_es,
        area: service[`area_${language}`] || service.area_es,
        slug_es: service.slug_es,
        slug_ca: service.slug_ca,
        slug_en: service.slug_en,
      }));
      
      return {
        services,
        totalCount: count || 0
      };
    },
    enabled: true,
  });
};

export const useServicesFilterOptions = (language: string = 'es') => {
  return useQuery({
    queryKey: ["services-filter-options", language],
    queryFn: async () => {
      const areaCol = `area_${language}`;
      const { data, error } = await supabase
        .from('services')
        .select(`${areaCol}, area_es`)
        .eq('is_active', true);
      
      if (error) {
        console.error('Error fetching service filter options:', error);
        throw error;
      }
      
      const areas = Array.from(
        new Set(
          (data || [])
            .map((r: any) => r[areaCol] || r.area_es)
            .filter(Boolean)
        )
      );
      
      return { areas };
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
