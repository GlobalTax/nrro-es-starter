import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface LeyBeckhamLead {
  id: string;
  contact_lead_id: string | null;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  country: string;
  job_situation: string;
  estimated_move_date: string | null;
  current_salary: number | null;
  message: string | null;
  status: 'nuevo' | 'contactado' | 'documentacion' | 'en_proceso' | 'completado' | 'descartado';
  priority: 'baja' | 'media' | 'alta' | 'urgente';
  eligibility_score: number | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
  contacted_at: string | null;
  completed_at: string | null;
  assigned_to: string | null;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  note: string;
  created_by: string | null;
  created_at: string;
  is_internal: boolean;
}

export interface LeadStatusHistory {
  id: string;
  lead_id: string;
  from_status: string | null;
  to_status: string;
  changed_by: string | null;
  changed_at: string;
  notes: string | null;
}

export interface LeadDocument {
  id: string;
  lead_id: string;
  document_type: string;
  document_name: string;
  is_received: boolean;
  file_url: string | null;
  received_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const useLeyBeckhamLeads = (filters?: {
  status?: string;
  priority?: string;
  country?: string;
  job_situation?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["ley-beckham-leads", filters],
    queryFn: async () => {
      let query = supabase
        .from("ley_beckham_leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters?.status && filters.status !== 'all') {
        query = query.eq("status", filters.status as any);
      }
      if (filters?.priority && filters.priority !== 'all') {
        query = query.eq("priority", filters.priority as any);
      }
      if (filters?.country) {
        query = query.eq("country", filters.country);
      }
      if (filters?.job_situation) {
        query = query.eq("job_situation", filters.job_situation);
      }
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as LeyBeckhamLead[];
    },
  });
};

export const useLeyBeckhamLead = (leadId: string) => {
  return useQuery({
    queryKey: ["ley-beckham-lead", leadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ley_beckham_leads")
        .select("*")
        .eq("id", leadId)
        .single();

      if (error) throw error;
      return data as LeyBeckhamLead;
    },
    enabled: !!leadId,
  });
};

export const useLeadNotes = (leadId: string) => {
  return useQuery({
    queryKey: ["lead-notes", leadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lead_notes")
        .select("*")
        .eq("lead_id", leadId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as LeadNote[];
    },
    enabled: !!leadId,
  });
};

export const useLeadStatusHistory = (leadId: string) => {
  return useQuery({
    queryKey: ["lead-status-history", leadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lead_status_history")
        .select("*")
        .eq("lead_id", leadId)
        .order("changed_at", { ascending: false });

      if (error) throw error;
      return data as LeadStatusHistory[];
    },
    enabled: !!leadId,
  });
};

export const useLeadDocuments = (leadId: string) => {
  return useQuery({
    queryKey: ["lead-documents", leadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lead_documents")
        .select("*")
        .eq("lead_id", leadId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as LeadDocument[];
    },
    enabled: !!leadId,
  });
};

export const useUpdateLeadStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const updates: any = { status, updated_at: new Date().toISOString() };
      
      if (status === 'contactado' && !updates.contacted_at) {
        updates.contacted_at = new Date().toISOString();
      }
      if (status === 'completado' && !updates.completed_at) {
        updates.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("ley_beckham_leads")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ley-beckham-leads"] });
      queryClient.invalidateQueries({ queryKey: ["ley-beckham-lead"] });
      toast.success("Estado actualizado correctamente");
    },
    onError: (error) => {
      console.error("Error updating lead status:", error);
      toast.error("Error al actualizar el estado");
    },
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<LeyBeckhamLead> & { id: string }) => {
      const { error } = await supabase
        .from("ley_beckham_leads")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ley-beckham-leads"] });
      queryClient.invalidateQueries({ queryKey: ["ley-beckham-lead"] });
      toast.success("Lead actualizado correctamente");
    },
    onError: (error) => {
      console.error("Error updating lead:", error);
      toast.error("Error al actualizar el lead");
    },
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("ley_beckham_leads")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ley-beckham-leads"] });
      toast.success("Lead eliminado correctamente");
    },
    onError: (error) => {
      console.error("Error deleting lead:", error);
      toast.error("Error al eliminar el lead");
    },
  });
};

export const useAddLeadNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ lead_id, note, is_internal = true }: { lead_id: string; note: string; is_internal?: boolean }) => {
      const { error } = await supabase
        .from("lead_notes")
        .insert({ lead_id, note, is_internal });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead-notes"] });
      toast.success("Nota añadida correctamente");
    },
    onError: (error) => {
      console.error("Error adding note:", error);
      toast.error("Error al añadir la nota");
    },
  });
};

export const useUpdateLeadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<LeadDocument> & { id: string }) => {
      const { error } = await supabase
        .from("lead_documents")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead-documents"] });
      toast.success("Documento actualizado correctamente");
    },
    onError: (error) => {
      console.error("Error updating document:", error);
      toast.error("Error al actualizar el documento");
    },
  });
};

export const useLeyBeckhamStats = () => {
  return useQuery({
    queryKey: ["ley-beckham-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_ley_beckham_stats");

      if (error) throw error;
      return data;
    },
  });
};
