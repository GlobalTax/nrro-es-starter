import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CaseStudy } from "@/types/caseStudy";

interface CaseStudiesParams {
  searchQuery?: string;
  industry?: string;
  service?: string;
  tags?: string[];
  status?: 'draft' | 'review' | 'published' | 'archived';
  limit?: number;
  offset?: number;
  language?: string;
}

export const useCaseStudies = (params: CaseStudiesParams) => {
  const language = params.language || 'es';

  return useQuery({
    queryKey: ["case-studies", params, language],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("search_case_studies", {
        search_query: params.searchQuery || null,
        filter_industry: params.industry || null,
        filter_service: params.service || null,
        filter_tags: params.tags || null,
        filter_status: params.status || 'published',
        limit_count: params.limit || 12,
        offset_count: params.offset || 0,
      });

      if (error) throw error;
      return (data || []).map((item: any) => ({
        ...item,
        title: item[`title_${language}`] || item.title_es,
        slug: item[`slug_${language}`] || item.slug_es,
        hero_title: item[`hero_title_${language}`] || item.hero_title_es,
        hero_subtitle: item[`hero_subtitle_${language}`] || item.hero_subtitle_es,
        challenge: item[`challenge_${language}`] || item.challenge_es,
        solution: item[`solution_${language}`] || item.solution_es,
        results_summary: item[`results_summary_${language}`] || item.results_summary_es,
        metrics: Array.isArray(item.metrics) ? item.metrics : [],
        tags: Array.isArray(item.tags) ? item.tags : [],
        slug_es: item.slug_es,
        slug_ca: item.slug_ca,
        slug_en: item.slug_en,
      })) as unknown as CaseStudy[];
    },
    enabled: true,
  });
};

export const useCaseStudyFilterOptions = () => {
  return useQuery({
    queryKey: ["case-studies-filter-options"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_case_studies_filter_options");
      
      if (error) throw error;
      
      const result = data && data.length > 0 ? data[0] : { 
        industries: [], 
        services: [], 
        all_tags: [] 
      };
      
      return result as {
        industries: string[];
        services: string[];
        all_tags: string[];
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};
