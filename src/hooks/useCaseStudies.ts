import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CaseStudy } from "@/types/caseStudy";
import { useLanguage } from "./useLanguage";
import { getLocalizedField } from "@/i18n/utils";

interface CaseStudiesParams {
  searchQuery?: string;
  industry?: string;
  service?: string;
  tags?: string[];
  status?: 'draft' | 'review' | 'published' | 'archived';
  limit?: number;
  offset?: number;
}

export const useCaseStudies = (params: CaseStudiesParams) => {
  const { language } = useLanguage();
  
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
        title: getLocalizedField(item, 'title', language) || item.title,
        slug: getLocalizedField(item, 'slug', language) || item.slug,
        hero_title: getLocalizedField(item, 'hero_title', language) || item.hero_title,
        hero_subtitle: getLocalizedField(item, 'hero_subtitle', language) || item.hero_subtitle,
        challenge: getLocalizedField(item, 'challenge', language) || item.challenge,
        solution: getLocalizedField(item, 'solution', language) || item.solution,
        results_summary: getLocalizedField(item, 'results_summary', language) || item.results_summary,
        detailed_content: getLocalizedField(item, 'detailed_content', language) || item.detailed_content,
        testimonial_text: getLocalizedField(item, 'testimonial_text', language) || item.testimonial_text,
        meta_title: getLocalizedField(item, 'meta_title', language) || item.meta_title,
        meta_description: getLocalizedField(item, 'meta_description', language) || item.meta_description,
        metrics: Array.isArray(item.metrics) ? item.metrics : [],
        tags: Array.isArray(item.tags) ? item.tags : [],
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
