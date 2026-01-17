import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface NewsAutomationSettings {
  id: string;
  is_enabled: boolean;
  run_time: string;
  articles_per_run: number;
  auto_publish: boolean;
  default_sources: string[];
  default_categories: string[];
  last_run_at: string | null;
  next_run_at: string | null;
  notify_on_generation: boolean;
  created_at: string;
  updated_at: string;
}

export function useNewsAutomationSettings() {
  return useQuery({
    queryKey: ["news-automation-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news_automation_settings")
        .select("*")
        .single();

      if (error) throw error;
      return data as NewsAutomationSettings;
    },
  });
}

export function useUpdateNewsAutomationSettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (updates: Partial<NewsAutomationSettings>) => {
      const { data: current } = await supabase
        .from("news_automation_settings")
        .select("id")
        .single();

      if (!current) throw new Error("No settings found");

      const { data, error } = await supabase
        .from("news_automation_settings")
        .update(updates)
        .eq("id", current.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news-automation-settings"] });
      toast({
        title: "Configuración actualizada",
        description: "Los ajustes de automatización de noticias se han guardado.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al guardar configuración",
        variant: "destructive",
      });
    },
  });
}

export function useTriggerNewsGeneration() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("auto-generate-news");
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["news-articles"] });
      queryClient.invalidateQueries({ queryKey: ["news-automation-settings"] });
      toast({
        title: "Noticias generadas",
        description: `Se han generado ${data?.generated || 0} noticias correctamente.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error al generar noticias",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
    },
  });
}

export function useNewsArticles() {
  return useQuery({
    queryKey: ["news-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news_articles")
        .select("*")
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useDeleteNewsArticle() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("news_articles")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news-articles"] });
      toast({
        title: "Noticia eliminada",
        description: "La noticia se ha eliminado correctamente.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al eliminar",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateNewsArticle() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, unknown> }) => {
      const { data, error } = await supabase
        .from("news_articles")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news-articles"] });
      toast({
        title: "Noticia actualizada",
        description: "Los cambios se han guardado correctamente.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al actualizar",
        variant: "destructive",
      });
    },
  });
}
