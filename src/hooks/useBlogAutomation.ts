import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface BlogQueueItem {
  id: string;
  topic: string;
  category: string;
  tone: string;
  language: string;
  scheduled_for: string;
  status: string;
  generated_post_id: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogAutomationSettings {
  id: string;
  is_enabled: boolean;
  articles_per_run: number;
  run_interval_days: number;
  default_tone: string;
  default_language: string;
  auto_publish: boolean;
  notify_on_generation: boolean;
  last_run_at: string | null;
  next_run_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useBlogAutomationSettings = () => {
  return useQuery({
    queryKey: ["blog-automation-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_automation_settings")
        .select("*")
        .single();

      if (error) throw error;
      return data as BlogAutomationSettings;
    },
  });
};

export const useUpdateAutomationSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<BlogAutomationSettings>) => {
      const { data, error } = await supabase
        .from("blog_automation_settings")
        .update(updates)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-automation-settings"] });
      toast.success("Configuración actualizada");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });
};

export const useBlogQueue = () => {
  return useQuery({
    queryKey: ["blog-generation-queue"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_generation_queue")
        .select("*")
        .order("scheduled_for", { ascending: true });

      if (error) throw error;
      return data as BlogQueueItem[];
    },
  });
};

export const useAddToQueue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: {
      topic: string;
      category: string;
      tone?: string;
      language?: string;
      scheduled_for?: string;
    }) => {
      const { data, error } = await supabase
        .from("blog_generation_queue")
        .insert({
          topic: item.topic,
          category: item.category,
          tone: item.tone || "professional",
          language: item.language || "both",
          scheduled_for: item.scheduled_for || new Date().toISOString(),
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-generation-queue"] });
      toast.success("Tema añadido a la cola");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });
};

export const useDeleteFromQueue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("blog_generation_queue")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-generation-queue"] });
      toast.success("Tema eliminado de la cola");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });
};

export const useTriggerGeneration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params?: { count?: number; topic?: string; category?: string }) => {
      const { data, error } = await supabase.functions.invoke("auto-generate-blog", {
        body: params || { count: 2 },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["blog-generation-queue"] });
      queryClient.invalidateQueries({ queryKey: ["blog-search"] });
      queryClient.invalidateQueries({ queryKey: ["blog-automation-settings"] });
      toast.success(`${data.generated} artículo(s) generado(s)`);
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });
};
