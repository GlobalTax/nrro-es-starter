import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface BlogResearchSource {
  id: string;
  category: string;
  site_url: string;
  site_name: string;
  is_enabled: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

const QUERY_KEY = ["blog-research-sources"];

export function useBlogResearchSources() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_research_sources" as any)
        .select("*")
        .order("priority", { ascending: false })
        .order("site_name", { ascending: true });

      if (error) throw error;
      return data as unknown as BlogResearchSource[];
    },
  });
}

export function useAddResearchSource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (source: { category: string; site_url: string; site_name: string }) => {
      const { error } = await supabase
        .from("blog_research_sources" as any)
        .insert(source as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("Fuente añadida");
    },
    onError: (e: Error) => toast.error(`Error: ${e.message}`),
  });
}

export function useToggleResearchSource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, is_enabled }: { id: string; is_enabled: boolean }) => {
      const { error } = await supabase
        .from("blog_research_sources" as any)
        .update({ is_enabled } as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteResearchSource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("blog_research_sources" as any)
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("Fuente eliminada");
    },
    onError: (e: Error) => toast.error(`Error: ${e.message}`),
  });
}
