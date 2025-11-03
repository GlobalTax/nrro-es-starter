import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { JobPosition } from "@/types/jobPosition";
import { toast } from "sonner";

export const useJobPositions = (filters?: {
  status?: 'draft' | 'published' | 'closed';
  department?: string;
}) => {
  return useQuery({
    queryKey: ["job-positions", filters],
    queryFn: async () => {
      let query = supabase
        .from("job_positions")
        .select("*")
        .order("is_featured", { ascending: false })
        .order("display_order", { ascending: true })
        .order("published_at", { ascending: false });

      if (filters?.status) {
        query = query.eq("status", filters.status);
      }

      if (filters?.department) {
        query = query.eq("department", filters.department);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as JobPosition[];
    },
  });
};

export const useJobPosition = (slug: string) => {
  return useQuery({
    queryKey: ["job-position", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_positions")
        .select("*")
        .eq('slug_es', slug);

      if (error) throw error;
      if (!data || data.length === 0) throw new Error("Job position not found");
      
      return data[0] as JobPosition;
    },
    enabled: !!slug,
  });
};

export const useCreateJobPosition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobPosition: any) => {
      const { data, error } = await supabase
        .from("job_positions")
        .insert([jobPosition])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-positions"] });
      toast.success("Vacante creada correctamente");
    },
    onError: (error: Error) => {
      toast.error("Error al crear la vacante: " + error.message);
    },
  });
};

export const useUpdateJobPosition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<JobPosition>;
    }) => {
      const { data, error } = await supabase
        .from("job_positions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-positions"] });
      toast.success("Vacante actualizada correctamente");
    },
    onError: (error: Error) => {
      toast.error("Error al actualizar la vacante: " + error.message);
    },
  });
};

export const useDeleteJobPosition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("job_positions")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-positions"] });
      toast.success("Vacante eliminada correctamente");
    },
    onError: (error: Error) => {
      toast.error("Error al eliminar la vacante: " + error.message);
    },
  });
};

export const useJobPositionStats = () => {
  return useQuery({
    queryKey: ["job-position-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_positions")
        .select("status");

      if (error) throw error;

      const stats = {
        published: data.filter((p) => p.status === "published").length,
        draft: data.filter((p) => p.status === "draft").length,
        closed: data.filter((p) => p.status === "closed").length,
        total: data.length,
      };

      return stats;
    },
  });
};
