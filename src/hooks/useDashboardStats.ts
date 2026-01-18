import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface LeadsByStatus {
  status: string;
  count: number;
}

interface CandidatosByDepartamento {
  departamento: string;
  count: number;
}

interface PrevisionVsReal {
  mes: string;
  previsto: number;
  real: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

export interface DashboardStats {
  // KPIs
  leadsActivos: number;
  candidatosEnProceso: number;
  empleadosActivos: number;
  nominasPendientes: number;
  
  // Chart data
  leadsPorEstado: LeadsByStatus[];
  candidatosPorDepartamento: CandidatosByDepartamento[];
  previsionesVsReal: PrevisionVsReal[];
  
  // Notifications
  notificaciones: Notification[];
  notificacionesNoLeidas: number;
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      // Fetch all data in parallel
      const [
        leadsResult,
        candidatosResult,
        empleadosResult,
        nominasPendientesResult,
        leadsPorEstadoResult,
        candidatosPorDeptoResult,
        cierresResult,
      ] = await Promise.all([
        // KPI: Leads activos (not converted or lost)
        supabase
          .from('company_setup_leads')
          .select('id', { count: 'exact', head: true })
          .not('status', 'in', '(converted,lost,closed)'),
        
        // KPI: Candidatos en proceso
        supabase
          .from('candidatos')
          .select('id', { count: 'exact', head: true })
          .not('estado', 'in', '(contratado,descartado,rechazado)'),
        
        // KPI: Empleados activos
        supabase
          .from('empleados')
          .select('id', { count: 'exact', head: true })
          .eq('activo', true),
        
        // KPI: Nóminas pendientes (cierres con estado pendiente)
        supabase
          .from('cierres_nomina')
          .select('id', { count: 'exact', head: true })
          .eq('estado', 'pendiente'),
        
        // Chart: Leads por estado
        supabase
          .from('company_setup_leads')
          .select('status'),
        
        // Chart: Candidatos por departamento
        supabase
          .from('candidatos')
          .select('departamento'),
        
        // Chart: Cierres de nómina con previsiones (últimos 6 meses)
        supabase
          .from('cierres_nomina')
          .select('mes, anio, total_real, total_previsto')
          .order('anio', { ascending: false })
          .order('mes', { ascending: false })
          .limit(6),
      ]);

      // Process leads por estado
      const leadsByStatusMap = new Map<string, number>();
      (leadsPorEstadoResult.data || []).forEach((lead) => {
        const status = lead.status || 'sin_estado';
        leadsByStatusMap.set(status, (leadsByStatusMap.get(status) || 0) + 1);
      });
      const leadsPorEstado: LeadsByStatus[] = Array.from(leadsByStatusMap.entries())
        .map(([status, count]) => ({
          status: formatStatus(status),
          count,
        }))
        .sort((a, b) => b.count - a.count);

      // Process candidatos por departamento
      const candidatosByDeptoMap = new Map<string, number>();
      (candidatosPorDeptoResult.data || []).forEach((candidato) => {
        const depto = candidato.departamento || 'Sin asignar';
        candidatosByDeptoMap.set(depto, (candidatosByDeptoMap.get(depto) || 0) + 1);
      });
      const candidatosPorDepartamento: CandidatosByDepartamento[] = Array.from(candidatosByDeptoMap.entries())
        .map(([departamento, count]) => ({ departamento, count }))
        .sort((a, b) => b.count - a.count);

      // Process previsiones vs real from cierres_nomina
      const mesesNombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      
      const previsionesVsReal: PrevisionVsReal[] = (cierresResult.data || [])
        .map((cierre) => ({
          mes: `${mesesNombres[cierre.mes - 1]} ${cierre.anio}`,
          previsto: cierre.total_previsto || 0,
          real: cierre.total_real || 0,
          sortValue: cierre.anio * 100 + cierre.mes,
        }))
        .sort((a, b) => a.sortValue - b.sortValue)
        .map(({ mes, previsto, real }) => ({ mes, previsto, real }));

      // Mock notifications (since the table might not exist or be empty)
      const notificaciones: Notification[] = [];
      const notificacionesNoLeidas = 0;

      return {
        leadsActivos: leadsResult.count || 0,
        candidatosEnProceso: candidatosResult.count || 0,
        empleadosActivos: empleadosResult.count || 0,
        nominasPendientes: nominasPendientesResult.count || 0,
        leadsPorEstado,
        candidatosPorDepartamento,
        previsionesVsReal,
        notificaciones,
        notificacionesNoLeidas,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Helper to format status labels
function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    new: 'Nuevo',
    contacted: 'Contactado',
    qualified: 'Cualificado',
    proposal: 'Propuesta',
    negotiation: 'Negociación',
    converted: 'Convertido',
    lost: 'Perdido',
    closed: 'Cerrado',
    pending: 'Pendiente',
    sin_estado: 'Sin estado',
  };
  return statusMap[status] || status;
}
