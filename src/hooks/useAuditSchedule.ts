import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AuditScheduleEntry {
  id: string;
  url: string;
  label: string;
  frequency: string;
  is_active: boolean;
  last_audit_at: string | null;
  last_score: number | null;
  last_audit_id: string | null;
  created_at: string;
}

export const useAuditSchedule = () => {
  const [entries, setEntries] = useState<AuditScheduleEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEntries = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('audit_schedule' as any)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching audit schedule:', error);
    } else {
      setEntries((data as any) || []);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const addEntry = async (url: string, label: string, frequency: string) => {
    const { error } = await supabase
      .from('audit_schedule' as any)
      .insert({ url, label, frequency } as any);

    if (error) {
      toast.error('Error al añadir URL programada');
      console.error(error);
    } else {
      toast.success('URL añadida al schedule');
      fetchEntries();
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from('audit_schedule' as any)
      .update({ is_active: !isActive } as any)
      .eq('id', id);

    if (error) {
      toast.error('Error al actualizar');
    } else {
      fetchEntries();
    }
  };

  const deleteEntry = async (id: string) => {
    const { error } = await supabase
      .from('audit_schedule' as any)
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Error al eliminar');
    } else {
      toast.success('Entrada eliminada');
      fetchEntries();
    }
  };

  const runManualAudit = async (url: string) => {
    try {
      toast.info(`Auditando ${url}...`);
      const { data, error } = await supabase.functions.invoke('auto-marketing-audit', {
        body: { mode: 'single', url },
      });
      if (error) throw error;
      if (data?.success) {
        toast.success(`Auditoría completada: score ${data.data.global_score}`);
        fetchEntries();
      } else {
        toast.error(data?.error || 'Error en auditoría');
      }
    } catch (err) {
      toast.error('Error al ejecutar auditoría');
      console.error(err);
    }
  };

  return { entries, isLoading, addEntry, toggleActive, deleteEntry, runManualAudit, refresh: fetchEntries };
};
