import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SitePage {
  id: string;
  url: string;
  title: string;
  page_type: 'home' | 'service' | 'landing' | 'blog' | 'case_study' | 'legal' | 'contact' | 'about' | 'careers' | 'job_position' | 'other';
  source_table: string | null;
  source_id: string | null;
  language: 'es' | 'ca' | 'en';
  business_area: string | null;
  owner: string | null;
  status: 'published' | 'draft' | 'archived' | 'redirect';
  meta_title: string | null;
  meta_description: string | null;
  is_noindex: boolean;
  is_landing: boolean;
  campaign_name: string | null;
  traffic_source: 'seo' | 'sem' | 'social' | 'email' | 'referral' | 'direct' | 'other' | null;
  conversion_goal: string | null;
  last_updated: string;
  notes: string | null;
  redirect_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SitePageFilters {
  search?: string;
  page_type?: string;
  language?: string;
  business_area?: string;
  status?: string;
  is_landing?: boolean;
  sort_by?: 'title' | 'last_updated' | 'page_type' | 'status' | 'language';
  sort_order?: 'asc' | 'desc';
}

export const useSitePages = (filters?: SitePageFilters) => {
  return useQuery({
    queryKey: ["site-pages", filters],
    queryFn: async () => {
      let query = supabase
        .from("site_pages")
        .select("*");

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,url.ilike.%${filters.search}%`);
      }

      if (filters?.page_type) {
        query = query.eq("page_type", filters.page_type as any);
      }

      if (filters?.language) {
        query = query.eq("language", filters.language);
      }

      if (filters?.business_area) {
        query = query.eq("business_area", filters.business_area);
      }

      if (filters?.status) {
        query = query.eq("status", filters.status as any);
      }

      if (filters?.is_landing !== undefined) {
        query = query.eq("is_landing", filters.is_landing);
      }

      // Ordenación
      const sortBy = filters?.sort_by || 'last_updated';
      const sortOrder = filters?.sort_order || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching site pages:", error);
        throw error;
      }

      return data as SitePage[];
    },
  });
};

export const useSitePage = (id: string) => {
  return useQuery({
    queryKey: ["site-page", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_pages")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching site page:", error);
        throw error;
      }

      return data as SitePage;
    },
    enabled: !!id,
  });
};

export const useUpdateSitePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SitePage> }) => {
      const { error } = await supabase
        .from("site_pages")
        .update(data)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-pages"] });
      queryClient.invalidateQueries({ queryKey: ["site-page"] });
      toast.success("Página actualizada correctamente");
    },
    onError: (error) => {
      console.error("Error updating site page:", error);
      toast.error("Error al actualizar la página");
    },
  });
};

export const useDeleteSitePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("site_pages")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-pages"] });
      toast.success("Página eliminada correctamente");
    },
    onError: (error) => {
      console.error("Error deleting site page:", error);
      toast.error("Error al eliminar la página");
    },
  });
};

export const useCreateSitePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<SitePage, "id" | "created_at" | "updated_at">) => {
      const { error } = await supabase
        .from("site_pages")
        .insert(data);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-pages"] });
      toast.success("Página creada correctamente");
    },
    onError: (error) => {
      console.error("Error creating site page:", error);
      toast.error("Error al crear la página");
    },
  });
};

export const useSitePageStats = () => {
  return useQuery({
    queryKey: ["site-pages-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_pages")
        .select("page_type, status, language, is_landing");

      if (error) {
        console.error("Error fetching stats:", error);
        throw error;
      }

      const stats = {
        total: data.length,
        by_type: {} as Record<string, number>,
        by_status: {} as Record<string, number>,
        by_language: {} as Record<string, number>,
        landings: data.filter(p => p.is_landing).length,
      };

      data.forEach(page => {
        stats.by_type[page.page_type] = (stats.by_type[page.page_type] || 0) + 1;
        stats.by_status[page.status] = (stats.by_status[page.status] || 0) + 1;
        stats.by_language[page.language] = (stats.by_language[page.language] || 0) + 1;
      });

      return stats;
    },
  });
};