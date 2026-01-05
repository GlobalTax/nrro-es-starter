import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, BarChart3 } from "lucide-react";
import { LeadFilters } from "@/components/admin/ley-beckham/LeadFilters";
import { LeadCard } from "@/components/admin/ley-beckham/LeadCard";
import { LeadDetailModal } from "@/components/admin/ley-beckham/LeadDetailModal";
import { LeadStats } from "@/components/admin/ley-beckham/LeadStats";
import { 
  useLeyBeckhamLeads, 
  useUpdateLeadStatus,
  type LeyBeckhamLead 
} from "@/hooks/useLeyBeckhamLeads";
import { Skeleton } from "@/components/ui/skeleton";
import * as XLSX from 'xlsx';
import { toast } from "sonner";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function AdminLeyBeckhamLeads() {
  const { trackDownload } = useAnalytics();
  const [filters, setFilters] = useState<{
    status?: string;
    priority?: string;
    country?: string;
    job_situation?: string;
    search?: string;
  }>({});
  
  const [selectedLead, setSelectedLead] = useState<LeyBeckhamLead | null>(null);
  const [showStats, setShowStats] = useState(false);

  const { data: leads, isLoading } = useLeyBeckhamLeads(filters);
  const updateStatus = useUpdateLeadStatus();

  const handleStatusChange = (id: string, status: string) => {
    updateStatus.mutate({ id, status });
  };

  const exportToExcel = () => {
    if (!leads || leads.length === 0) {
      toast.error("No hay leads para exportar");
      return;
    }

    const exportData = leads.map(lead => ({
      Nombre: lead.name,
      Email: lead.email,
      Teléfono: lead.phone || '',
      Empresa: lead.company || '',
      País: lead.country,
      'Situación Laboral': lead.job_situation,
      'Fecha Traslado': lead.estimated_move_date || '',
      'Salario Actual': lead.current_salary || '',
      Estado: lead.status,
      Prioridad: lead.priority,
      'Score': lead.eligibility_score || '',
      'Fecha Creación': new Date(lead.created_at).toLocaleDateString('es-ES'),
      Mensaje: lead.message || ''
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leads Ley Beckham");
    
    // Auto-size columns
    const cols = Object.keys(exportData[0]).map(key => ({ wch: Math.max(key.length, 15) }));
    ws['!cols'] = cols;
    
    const fileName = `ley-beckham-leads-${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    trackDownload('excel', fileName, 'admin_ley_beckham_leads');
    toast.success("Leads exportados correctamente");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-normal">Gestión Ley Beckham</h1>
          <p className="text-muted-foreground mt-1">
            Administra las consultas sobre el Régimen Especial de Impatriados
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowStats(!showStats)}>
            <BarChart3 className="h-4 w-4 mr-2" />
            {showStats ? 'Ver Lista' : 'Ver Estadísticas'}
          </Button>
          <Button onClick={exportToExcel}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Excel
          </Button>
        </div>
      </div>

      {showStats && leads ? (
        <LeadStats leads={leads} />
      ) : (
        <>
          <LeadFilters filters={filters} onFilterChange={setFilters} />

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-80" />
              ))}
            </div>
          ) : leads && leads.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  Mostrando {leads.length} leads
                </p>
              </div>

              <Tabs defaultValue="all" className="w-full">
                <TabsList>
                  <TabsTrigger value="all">
                    Todos ({leads.length})
                  </TabsTrigger>
                  <TabsTrigger value="nuevo">
                    Nuevos ({leads.filter(l => l.status === 'nuevo').length})
                  </TabsTrigger>
                  <TabsTrigger value="urgente">
                    Urgentes ({leads.filter(l => l.priority === 'urgente').length})
                  </TabsTrigger>
                  <TabsTrigger value="en_proceso">
                    En Proceso ({leads.filter(l => l.status === 'en_proceso').length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {leads.map((lead) => (
                      <LeadCard
                        key={lead.id}
                        lead={lead}
                        onViewDetails={setSelectedLead}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="nuevo" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {leads.filter(l => l.status === 'nuevo').map((lead) => (
                      <LeadCard
                        key={lead.id}
                        lead={lead}
                        onViewDetails={setSelectedLead}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="urgente" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {leads.filter(l => l.priority === 'urgente').map((lead) => (
                      <LeadCard
                        key={lead.id}
                        lead={lead}
                        onViewDetails={setSelectedLead}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="en_proceso" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {leads.filter(l => l.status === 'en_proceso').map((lead) => (
                      <LeadCard
                        key={lead.id}
                        lead={lead}
                        onViewDetails={setSelectedLead}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">
                No hay leads que coincidan con los filtros seleccionados
              </p>
            </div>
          )}
        </>
      )}

      <LeadDetailModal
        lead={selectedLead}
        open={!!selectedLead}
        onClose={() => setSelectedLead(null)}
      />
    </div>
  );
}
