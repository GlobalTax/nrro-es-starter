import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Empleado {
  id: string;
  nombre: string;
  email: string | null;
  puesto: string | null;
  departamento: string | null;
  area: string | null;
  oficina: string | null;
  salario_base: number | null;
  variable: number | null;
  bonus: number | null;
  coste_seg_social: number | null;
  coste_total_mensual: number | null;
  coste_total_anual: number | null;
  tipo_contrato: string | null;
  fecha_alta: string | null;
  fecha_baja: string | null;
  activo: boolean | null;
  nif: string | null;
  avatar_url: string | null;
  rol: string | null;
  notas: string | null;
  contrato_url: string | null;
  firma_url: string | null;
  created_at: string | null;
}

interface EmpleadoFilters {
  search?: string;
  departamento?: string;
  area?: string;
  oficina?: string;
  rol?: string;
  activo?: boolean;
}

export type { EmpleadoFilters };

export function useEmpleados(filters?: EmpleadoFilters) {
  return useQuery({
    queryKey: ['empleados', filters],
    queryFn: async () => {
      let query = supabase.from('empleados').select('*').order('nombre');

      if (filters?.search) {
        query = query.or(
          `nombre.ilike.%${filters.search}%,email.ilike.%${filters.search}%,puesto.ilike.%${filters.search}%`
        );
      }

      if (filters?.departamento) {
        query = query.eq('departamento', filters.departamento);
      }

      if (filters?.area) {
        query = query.eq('area', filters.area);
      }

      if (filters?.oficina) {
        query = query.eq('oficina', filters.oficina);
      }

      if (filters?.rol) {
        query = query.eq('rol', filters.rol);
      }

      if (filters?.activo !== undefined) {
        query = query.eq('activo', filters.activo);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Empleado[];
    },
  });
}

export function useEmpleado(id: string | null) {
  return useQuery({
    queryKey: ['empleado', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('empleados')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Empleado;
    },
    enabled: !!id,
  });
}

export function useEmpleadoStats() {
  return useQuery({
    queryKey: ['empleados-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.from('empleados').select('*');
      if (error) throw error;

      const empleados = data || [];
      const activos = empleados.filter((e) => e.activo);
      const costeMensualTotal = activos.reduce(
        (acc, e) => acc + (e.coste_total_mensual || 0),
        0
      );

      // Group by departamento
      const porDepartamento = activos.reduce((acc, e) => {
        const dept = e.departamento || 'Sin asignar';
        acc[dept] = (acc[dept] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        total: empleados.length,
        activos: activos.length,
        inactivos: empleados.length - activos.length,
        costeMensualTotal,
        costeAnualTotal: costeMensualTotal * 12,
        porDepartamento,
      };
    },
  });
}

export function useCreateEmpleado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Empleado>) => {
      if (!data.nombre) throw new Error('Nombre es requerido');
      const { error, data: newEmpleado } = await supabase
        .from('empleados')
        .insert([{ ...data, nombre: data.nombre }])
        .select()
        .single();

      if (error) throw error;
      return newEmpleado;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empleados'] });
      queryClient.invalidateQueries({ queryKey: ['empleados-stats'] });
      toast.success('Empleado creado correctamente');
    },
    onError: (error: Error) => {
      toast.error('Error al crear empleado', { description: error.message });
    },
  });
}

export function useUpdateEmpleado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Empleado> }) => {
      const { error, data: updated } = await supabase
        .from('empleados')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empleados'] });
      queryClient.invalidateQueries({ queryKey: ['empleados-stats'] });
      toast.success('Empleado actualizado');
    },
    onError: (error: Error) => {
      toast.error('Error al actualizar', { description: error.message });
    },
  });
}

export function useDeleteEmpleado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('empleados').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empleados'] });
      queryClient.invalidateQueries({ queryKey: ['empleados-stats'] });
      toast.success('Empleado eliminado');
    },
    onError: (error: Error) => {
      toast.error('Error al eliminar', { description: error.message });
    },
  });
}

export function useEmpleadoDepartamentos() {
  return useQuery({
    queryKey: ['empleados-departamentos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('empleados')
        .select('departamento')
        .not('departamento', 'is', null);

      if (error) throw error;

      const departamentos = [
        ...new Set(data.map((e) => e.departamento).filter(Boolean)),
      ] as string[];
      return departamentos.sort();
    },
  });
}

export function useEmpleadoAreas() {
  return useQuery({
    queryKey: ['empleados-areas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('empleados')
        .select('area')
        .not('area', 'is', null);

      if (error) throw error;

      const areas = [
        ...new Set(data.map((e) => e.area).filter(Boolean)),
      ] as string[];
      return areas.sort();
    },
  });
}

export function useEmpleadoOficinas() {
  return useQuery({
    queryKey: ['empleados-oficinas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('empleados')
        .select('oficina')
        .not('oficina', 'is', null);

      if (error) throw error;

      const oficinas = [
        ...new Set(data.map((e) => e.oficina).filter(Boolean)),
      ] as string[];
      return oficinas.sort();
    },
  });
}

export function useEmpleadoRoles() {
  return useQuery({
    queryKey: ['empleados-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('empleados')
        .select('rol')
        .not('rol', 'is', null);

      if (error) throw error;

      const roles = [
        ...new Set(data.map((e) => e.rol).filter(Boolean)),
      ] as string[];
      return roles.sort();
    },
  });
}
