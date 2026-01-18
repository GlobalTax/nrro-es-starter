import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Candidato {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  linkedin_url: string | null;
  puesto_solicitado: string;
  puesto_actual: string | null;
  empresa_actual: string | null;
  departamento: string | null;
  notas: string | null;
  cv_url: string | null;
  estado: string;
  fuente: string;
  anos_experiencia: number | null;
  salario_esperado: number | null;
  fecha_disponibilidad: string | null;
  preferencia_trabajo: string | null;
  skills: string[] | null;
  idiomas: string[] | null;
  nivel_estudios: string | null;
  job_position_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CandidatoFilters {
  estado?: string;
  departamento?: string;
  search?: string;
  nivel_estudios?: string;
  fuente?: string;
}

export const useCandidatos = (filters?: CandidatoFilters) => {
  return useQuery({
    queryKey: ["candidatos", filters],
    queryFn: async () => {
      let query = supabase
        .from("candidatos")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters?.estado) {
        query = query.eq("estado", filters.estado);
      }

      if (filters?.departamento) {
        query = query.eq("departamento", filters.departamento);
      }

      if (filters?.nivel_estudios) {
        query = query.eq("nivel_estudios", filters.nivel_estudios);
      }

      if (filters?.fuente) {
        query = query.eq("fuente", filters.fuente);
      }

      if (filters?.search) {
        query = query.or(
          `nombre.ilike.%${filters.search}%,email.ilike.%${filters.search}%,puesto_solicitado.ilike.%${filters.search}%`
        );
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Candidato[];
    },
  });
};

export const useCandidato = (id: string | null) => {
  return useQuery({
    queryKey: ["candidato", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("candidatos")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as Candidato | null;
    },
    enabled: !!id,
  });
};

export const useUpdateCandidato = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Candidato>;
    }) => {
      const { data, error } = await supabase
        .from("candidatos")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidatos"] });
      queryClient.invalidateQueries({ queryKey: ["candidato"] });
      toast.success("Candidato actualizado correctamente");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al actualizar el candidato");
    },
  });
};

export const useCreateCandidato = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (candidato: Omit<Candidato, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from("candidatos")
        .insert([candidato])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidatos"] });
      toast.success("Candidato creado correctamente");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al crear el candidato");
    },
  });
};

export const useDeleteCandidato = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("candidatos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidatos"] });
      toast.success("Candidato eliminado correctamente");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al eliminar el candidato");
    },
  });
};

export const useCandidatoStats = () => {
  return useQuery({
    queryKey: ["candidatos-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.from("candidatos").select("estado");

      if (error) throw error;

      const stats = {
        total: data.length,
        nuevo: data.filter((c) => c.estado === "nuevo").length,
        en_revision: data.filter((c) => c.estado === "en_revision").length,
        entrevista: data.filter((c) => c.estado === "entrevista").length,
        evaluacion: data.filter((c) => c.estado === "evaluacion").length,
        oferta: data.filter((c) => c.estado === "oferta").length,
        contratado: data.filter((c) => c.estado === "contratado").length,
        descartado: data.filter((c) => c.estado === "descartado").length,
      };

      return stats;
    },
  });
};

export const useCandidatoDepartamentos = () => {
  return useQuery({
    queryKey: ["candidatos-departamentos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("candidatos")
        .select("departamento")
        .not("departamento", "is", null);

      if (error) throw error;
      return [...new Set(data?.map((c) => c.departamento))].filter(Boolean).sort() as string[];
    },
  });
};

export const useCandidatoNivelEstudios = () => {
  return useQuery({
    queryKey: ["candidatos-nivel-estudios"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("candidatos")
        .select("nivel_estudios")
        .not("nivel_estudios", "is", null);

      if (error) throw error;
      return [...new Set(data?.map((c) => c.nivel_estudios))].filter(Boolean).sort() as string[];
    },
  });
};

export const useCandidatoFuentes = () => {
  return useQuery({
    queryKey: ["candidatos-fuentes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("candidatos")
        .select("fuente")
        .not("fuente", "is", null);

      if (error) throw error;
      return [...new Set(data?.map((c) => c.fuente))].filter(Boolean).sort() as string[];
    },
  });
};

export const useCandidatoEntrevistas = (candidatoId: string | null) => {
  return useQuery({
    queryKey: ["candidato-entrevistas", candidatoId],
    queryFn: async () => {
      if (!candidatoId) return [];
      const { data, error } = await supabase
        .from("entrevistas")
        .select("*")
        .eq("candidato_id", candidatoId)
        .order("fecha_hora", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!candidatoId,
  });
};
