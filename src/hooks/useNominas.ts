import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Nomina {
  id: string;
  empleado_id: string;
  mes: number;
  anio: number;
  salario_bruto: number | null;
  salario_neto: number | null;
  irpf: number | null;
  seg_social_trabajador: number | null;
  seg_social_empresa: number | null;
  coste_empresa: number | null;
  horas_extra: number | null;
  importe_extra: number | null;
  incidencias: string | null;
  estado: string | null;
  fecha_pago: string | null;
  created_at: string | null;
  empleado?: {
    id: string;
    nombre: string;
    departamento: string | null;
  };
}

export interface CierreNomina {
  id: string;
  mes: number;
  anio: number;
  estado: string;
  fecha_inicio: string | null;
  fecha_cierre: string | null;
  fecha_comparacion: string | null;
  total_previsto: number | null;
  total_real: number | null;
  desviacion: number | null;
  observaciones: string | null;
  responsable: string | null;
  created_at: string | null;
}

interface NominaFilters {
  mes?: number;
  anio?: number;
  empleado_id?: string;
}

export function useNominas(filters?: NominaFilters) {
  return useQuery({
    queryKey: ['nominas', filters],
    queryFn: async () => {
      let query = supabase
        .from('nominas')
        .select(
          `
          *,
          empleado:empleados(id, nombre, departamento)
        `
        )
        .order('anio', { ascending: false })
        .order('mes', { ascending: false });

      if (filters?.mes) {
        query = query.eq('mes', filters.mes);
      }

      if (filters?.anio) {
        query = query.eq('anio', filters.anio);
      }

      if (filters?.empleado_id) {
        query = query.eq('empleado_id', filters.empleado_id);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as any[];
    },
  });
}

export function useCierresNomina(anio?: number) {
  return useQuery({
    queryKey: ['cierres-nomina', anio],
    queryFn: async () => {
      let query = supabase
        .from('cierres_nomina')
        .select('*')
        .order('anio', { ascending: false })
        .order('mes', { ascending: false });

      if (anio) {
        query = query.eq('anio', anio);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as CierreNomina[];
    },
  });
}

export function useCierreNomina(id: string | null) {
  return useQuery({
    queryKey: ['cierre-nomina', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('cierres_nomina')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as CierreNomina;
    },
    enabled: !!id,
  });
}

export function useNominaStats(anio?: number) {
  const currentYear = anio || new Date().getFullYear();

  return useQuery({
    queryKey: ['nominas-stats', currentYear],
    queryFn: async () => {
      // Get all nominas for the year
      const { data: nominas, error: nominasError } = await supabase
        .from('nominas')
        .select('*')
        .eq('anio', currentYear);

      if (nominasError) throw nominasError;

      // Get cierres for the year
      const { data: cierres, error: cierresError } = await supabase
        .from('cierres_nomina')
        .select('*')
        .eq('anio', currentYear);

      if (cierresError) throw cierresError;

      const totalCosteEmpresa = (nominas || []).reduce(
        (acc: number, n: any) => acc + (n.coste_empresa || 0),
        0
      );
      const totalBruto = (nominas || []).reduce(
        (acc: number, n: any) => acc + (n.bruto || 0),
        0
      );

      const mesesCerrados = (cierres || []).filter(
        (c) => c.estado === 'cerrado'
      ).length;
      const mesesPendientes = 12 - mesesCerrados;

      const desviacionTotal = (cierres || []).reduce(
        (acc, c) => acc + Math.abs(c.desviacion || 0),
        0
      );

      return {
        totalCosteEmpresa,
        totalBruto,
        mesesCerrados,
        mesesPendientes,
        desviacionTotal,
        nominasProcesadas: (nominas || []).length,
      };
    },
  });
}

export function useCreateCierreNomina() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<CierreNomina>) => {
      if (!data.mes || !data.anio) throw new Error('Mes y año son requeridos');
      const { error, data: newCierre } = await supabase
        .from('cierres_nomina')
        .insert([{ ...data, mes: data.mes, anio: data.anio }])
        .select()
        .single();

      if (error) throw error;
      return newCierre;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cierres-nomina'] });
      queryClient.invalidateQueries({ queryKey: ['nominas-stats'] });
      toast.success('Cierre creado correctamente');
    },
    onError: (error: Error) => {
      toast.error('Error al crear cierre', { description: error.message });
    },
  });
}

export function useUpdateCierreNomina() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CierreNomina>;
    }) => {
      const { error, data: updated } = await supabase
        .from('cierres_nomina')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cierres-nomina'] });
      queryClient.invalidateQueries({ queryKey: ['nominas-stats'] });
      toast.success('Cierre actualizado');
    },
    onError: (error: Error) => {
      toast.error('Error al actualizar', { description: error.message });
    },
  });
}

export function useNominaAnios() {
  return useQuery({
    queryKey: ['nominas-anios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nominas')
        .select('anio')
        .order('anio', { ascending: false });

      if (error) throw error;

      const anios = [...new Set(data.map((n) => n.anio))];
      return anios;
    },
  });
}

export function useComparativasNomina(cierreId: string | null) {
  return useQuery({
    queryKey: ['comparativas-nomina', cierreId],
    queryFn: async () => {
      if (!cierreId) return [];
      const { data, error } = await supabase
        .from('comparativas_nomina')
        .select(
          `
          *,
          empleado:empleados(id, nombre, departamento)
        `
        )
        .eq('cierre_id', cierreId);

      if (error) throw error;
      return data;
    },
    enabled: !!cierreId,
  });
}
