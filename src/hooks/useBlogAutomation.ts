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

export interface QueueDiagnostics {
  pending: number;
  generating: number;
  completed: number;
  failed: number;
  stuck: number;
  withErrors: number;
}

export const useQueueDiagnostics = () => {
  return useQuery({
    queryKey: ["blog-queue-diagnostics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_generation_queue")
        .select("id, status, error_message, updated_at");

      if (error) throw error;

      const now = new Date();
      const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

      const diagnostics: QueueDiagnostics = {
        pending: data.filter((i) => i.status === "pending").length,
        generating: data.filter((i) => i.status === "generating").length,
        completed: data.filter((i) => i.status === "completed").length,
        failed: data.filter((i) => i.status === "failed").length,
        stuck: data.filter(
          (i) =>
            i.status === "generating" &&
            new Date(i.updated_at) < thirtyMinutesAgo
        ).length,
        withErrors: data.filter((i) => i.error_message).length,
      };

      return diagnostics;
    },
    refetchInterval: 30000,
  });
};

export const useRetryQueueItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("blog_generation_queue")
        .update({
          status: "pending",
          error_message: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-generation-queue"] });
      queryClient.invalidateQueries({ queryKey: ["blog-queue-diagnostics"] });
      toast.success("Elemento marcado para reintento");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });
};

export const useRetryAllFailed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("blog_generation_queue")
        .update({
          status: "pending",
          error_message: null,
          updated_at: new Date().toISOString(),
        })
        .eq("status", "failed")
        .select();

      if (error) throw error;
      return data?.length || 0;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ["blog-generation-queue"] });
      queryClient.invalidateQueries({ queryKey: ["blog-queue-diagnostics"] });
      toast.success(`${count} elemento(s) marcados para reintento`);
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });
};

export const useCleanupStuckItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const thirtyMinutesAgo = new Date(
        Date.now() - 30 * 60 * 1000
      ).toISOString();

      const { data, error } = await supabase
        .from("blog_generation_queue")
        .update({
          status: "pending",
          error_message: "Limpiado manualmente desde diagnóstico",
          updated_at: new Date().toISOString(),
        })
        .eq("status", "generating")
        .lt("updated_at", thirtyMinutesAgo)
        .select();

      if (error) throw error;
      return data?.length || 0;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ["blog-generation-queue"] });
      queryClient.invalidateQueries({ queryKey: ["blog-queue-diagnostics"] });
      if (count > 0) {
        toast.success(`${count} elemento(s) atascados limpiados`);
      } else {
        toast.info("No hay elementos atascados");
      }
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });
};
