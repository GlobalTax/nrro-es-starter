import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Entrevista {
  id: string;
  candidato_id: string;
  entrevistador_id: string;
  fecha_hora: string;
  tipo: string | null;
  ronda: number | null;
  estado: string | null;
  duracion_minutos: number | null;
  ubicacion: string | null;
  meeting_url: string | null;
  fortalezas: string[] | null;
  debilidades: string[] | null;
  puntuacion: number | null;
  recomendacion: string | null;
  notas_evaluacion: string | null;
  created_at: string | null;
  updated_at: string | null;
  // Joined data
  candidato?: {
    id: string;
    nombre: string;
    email: string;
    puesto_solicitado: string;
  };
  entrevistador?: {
    id: string;
    email: string;
  };
}

interface EntrevistaFilters {
  estado?: string;
  tipo?: string;
  entrevistador_id?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
}

export function useEntrevistas(filters?: EntrevistaFilters) {
  return useQuery({
    queryKey: ['entrevistas', filters],
    queryFn: async () => {
      let query = supabase
        .from('entrevistas')
        .select(
          `
          *,
          candidato:candidatos(id, nombre, email, puesto_solicitado),
          entrevistador:profiles!entrevistas_entrevistador_id_fkey(id, email)
        `
        )
        .order('fecha_hora', { ascending: false });

      if (filters?.estado) {
        query = query.eq('estado', filters.estado);
      }

      if (filters?.tipo) {
        query = query.eq('tipo', filters.tipo);
      }

      if (filters?.entrevistador_id) {
        query = query.eq('entrevistador_id', filters.entrevistador_id);
      }

      if (filters?.fecha_desde) {
        query = query.gte('fecha_hora', filters.fecha_desde);
      }

      if (filters?.fecha_hasta) {
        query = query.lte('fecha_hora', filters.fecha_hasta);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Entrevista[];
    },
  });
}

export function useEntrevista(id: string | null) {
  return useQuery({
    queryKey: ['entrevista', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('entrevistas')
        .select(
          `
          *,
          candidato:candidatos(id, nombre, email, puesto_solicitado),
          entrevistador:profiles!entrevistas_entrevistador_id_fkey(id, email)
        `
        )
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Entrevista;
    },
    enabled: !!id,
  });
}

export function useEntrevistaStats() {
  return useQuery({
    queryKey: ['entrevistas-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.from('entrevistas').select('*');
      if (error) throw error;

      const entrevistas = data || [];
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      const pendientes = entrevistas.filter(
        (e) => e.estado === 'programada' && new Date(e.fecha_hora) >= hoy
      );
      const completadas = entrevistas.filter((e) => e.estado === 'completada');
      const estaSemana = entrevistas.filter((e) => {
        const fecha = new Date(e.fecha_hora);
        const inicioSemana = new Date(hoy);
        inicioSemana.setDate(hoy.getDate() - hoy.getDay());
        const finSemana = new Date(inicioSemana);
        finSemana.setDate(inicioSemana.getDate() + 7);
        return fecha >= inicioSemana && fecha < finSemana;
      });

      // Promedio de puntuación
      const conPuntuacion = completadas.filter((e) => e.puntuacion !== null);
      const promedioPuntuacion =
        conPuntuacion.length > 0
          ? conPuntuacion.reduce((acc, e) => acc + (e.puntuacion || 0), 0) /
            conPuntuacion.length
          : 0;

      return {
        total: entrevistas.length,
        pendientes: pendientes.length,
        completadas: completadas.length,
        estaSemana: estaSemana.length,
        promedioPuntuacion: Math.round(promedioPuntuacion * 10) / 10,
      };
    },
  });
}

export function useCreateEntrevista() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Entrevista>) => {
      if (!data.candidato_id || !data.entrevistador_id || !data.fecha_hora) {
        throw new Error('Campos requeridos: candidato_id, entrevistador_id, fecha_hora');
      }
      const { error, data: newEntrevista } = await supabase
        .from('entrevistas')
        .insert([{ ...data, candidato_id: data.candidato_id, entrevistador_id: data.entrevistador_id, fecha_hora: data.fecha_hora }])
        .select()
        .single();

      if (error) throw error;
      return newEntrevista;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entrevistas'] });
      queryClient.invalidateQueries({ queryKey: ['entrevistas-stats'] });
      toast.success('Entrevista programada correctamente');
    },
    onError: (error: Error) => {
      toast.error('Error al programar entrevista', { description: error.message });
    },
  });
}

export function useUpdateEntrevista() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Entrevista>;
    }) => {
      const { error, data: updated } = await supabase
        .from('entrevistas')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entrevistas'] });
      queryClient.invalidateQueries({ queryKey: ['entrevistas-stats'] });
      toast.success('Entrevista actualizada');
    },
    onError: (error: Error) => {
      toast.error('Error al actualizar', { description: error.message });
    },
  });
}

export function useDeleteEntrevista() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('entrevistas').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entrevistas'] });
      queryClient.invalidateQueries({ queryKey: ['entrevistas-stats'] });
      toast.success('Entrevista eliminada');
    },
    onError: (error: Error) => {
      toast.error('Error al eliminar', { description: error.message });
    },
  });
}
