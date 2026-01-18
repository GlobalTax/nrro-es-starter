import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ContactLead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string;
  message: string;
  service_type: string | null;
  source_site: string | null;
  ip_address: string | null;
  user_agent: string | null;
  email_sent: boolean;
  created_at: string;
  updated_at: string;
  response_notes: string | null;
  responded_by: string | null;
  responded_at: string | null;
}

export interface ContactLeadFilters {
  search?: string;
  status?: string;
  serviceType?: string;
  sourceSite?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const useContactLeads = (filters?: ContactLeadFilters) => {
  return useQuery({
    queryKey: ["contact-leads", filters],
    queryFn: async () => {
      let query = supabase
        .from("contact_leads")
        .select("*");

      // Apply filters
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
      }

      if (filters?.status === "pending") {
        query = query.eq("email_sent", false);
      } else if (filters?.status === "responded") {
        query = query.eq("email_sent", true);
      }

      if (filters?.serviceType && filters.serviceType !== "all") {
        query = query.eq("service_type", filters.serviceType as any);
      }

      if (filters?.sourceSite && filters.sourceSite !== "all") {
        query = query.eq("source_site", filters.sourceSite as any);
      }

      if (filters?.dateFrom) {
        query = query.gte("created_at", filters.dateFrom);
      }

      if (filters?.dateTo) {
        query = query.lte("created_at", filters.dateTo);
      }

      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return data as ContactLead[];
    },
  });
};

export const useUpdateContactLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      email_sent, 
      response_notes 
    }: { 
      id: string; 
      email_sent: boolean; 
      response_notes?: string;
    }) => {
      const updateData: any = { 
        email_sent, 
        updated_at: new Date().toISOString() 
      };

      if (email_sent) {
        updateData.responded_at = new Date().toISOString();
        if (response_notes !== undefined) {
          updateData.response_notes = response_notes;
        }
      } else {
        // Clear response data when marking as pending
        updateData.responded_at = null;
        updateData.response_notes = null;
      }

      const { error } = await supabase
        .from("contact_leads")
        .update(updateData)
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
