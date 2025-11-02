import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ContactLead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  subject: string;
  message: string;
  service_type: string | null;
  ip_address: string | null;
  user_agent: string | null;
  email_sent: boolean;
  created_at: string;
  updated_at: string;
}

export const useContactLeads = () => {
  return useQuery({
    queryKey: ["contact-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ContactLead[];
    },
  });
};

export const useUpdateContactLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, email_sent }: { id: string; email_sent: boolean }) => {
      const { error } = await supabase
        .from("contact_leads")
        .update({ email_sent, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-leads"] });
      toast.success("Lead actualizado correctamente");
    },
    onError: (error) => {
      console.error("Error updating lead:", error);
      toast.error("Error al actualizar el lead");
    },
  });
};

export const useDeleteContactLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("contact_leads")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-leads"] });
      toast.success("Lead eliminado correctamente");
    },
    onError: (error) => {
      console.error("Error deleting lead:", error);
      toast.error("Error al eliminar el lead");
    },
  });
};
