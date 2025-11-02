import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface DemoRequest {
  id: string;
  name: string;
  email: string;
  restaurant_name: string | null;
  message: string | null;
  status: string;
  source: string | null;
  created_at: string;
}

export const useDemoRequests = () => {
  return useQuery({
    queryKey: ["demo-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("demo_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as DemoRequest[];
    },
  });
};

export const useUpdateDemoRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("demo_requests")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["demo-requests"] });
      toast.success("Demo request actualizada");
    },
    onError: (error) => {
      console.error("Error updating demo request:", error);
      toast.error("Error al actualizar demo request");
    },
  });
};

export const useDeleteDemoRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("demo_requests")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["demo-requests"] });
      toast.success("Demo request eliminada");
    },
    onError: (error) => {
      console.error("Error deleting demo request:", error);
      toast.error("Error al eliminar demo request");
    },
  });
};
