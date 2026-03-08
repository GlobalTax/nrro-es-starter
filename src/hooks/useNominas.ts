import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Nomina {
  id: string;
  empleado_id: string;
  mes: number;
  anio: number;
  bruto: number | null;
  neto: number | null;
  coste_empresa: number | null;
  salario_bruto?: number | null;
  salario_neto?: number | null;
  pdf_url: string | null;
  fecha_subida: string | null;
  created_at?: string | null;
}

export const useNominas = (filters?: { empleado_id?: string }) => {
  return useQuery({
    queryKey: ['nominas', filters],
    queryFn: async () => {
      let query = supabase.from('nominas').select('*');
      if (filters?.empleado_id) {
        query = query.eq('empleado_id', filters.empleado_id);
      }
      query = query.order('anio', { ascending: false }).order('mes', { ascending: false });
      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map((n: any) => ({
        ...n,
        salario_bruto: n.bruto,
        salario_neto: n.neto,
        created_at: n.fecha_subida,
      })) as Nomina[];
    },
    enabled: !!filters?.empleado_id,
  });
};
