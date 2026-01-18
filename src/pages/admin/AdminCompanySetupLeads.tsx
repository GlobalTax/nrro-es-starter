import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useCompanySetupLeads,
  useCompanySetupStats,
  useUpdateCompanySetupLead,
  useDeleteCompanySetupLead,
  useLeadUTMValues,
  useLeadCountries,
  type LeadFilters,
  type CompanySetupLead,
} from '@/hooks/useCompanySetupLeads';
import { LeadsTable } from '@/components/admin/company-leads/LeadsTable';
import { LeadDetailSheet } from '@/components/admin/company-leads/LeadDetailSheet';
import { LeadUTMFilters } from '@/components/admin/company-leads/LeadUTMFilters';
import {
  ChangeStatusDialog,
  ChangePriorityDialog,
  AssignLeadDialog,
  AddNoteDialog,
  DeleteLeadDialog,
} from '@/components/admin/company-leads/QuickActionDialogs';
import {
  Download,
  Search,
  Users,
  TrendingUp,
  Target,
  Clock,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AdminCompanySetupLeads = () => {
  const [filters, setFilters] = useState<LeadFilters>({});
  const [selectedLead, setSelectedLead] = useState<CompanySetupLead | null>(null);
  const [editLead, setEditLead] = useState<CompanySetupLead | null>(null);

  // Quick action dialogs state
  const [statusDialogLead, setStatusDialogLead] = useState<CompanySetupLead | null>(null);
  const [priorityDialogLead, setPriorityDialogLead] = useState<CompanySetupLead | null>(null);
  const [assignDialogLead, setAssignDialogLead] = useState<CompanySetupLead | null>(null);
  const [noteDialogLead, setNoteDialogLead] = useState<CompanySetupLead | null>(null);
  const [deleteDialogLead, setDeleteDialogLead] = useState<CompanySetupLead | null>(null);

  // Data hooks
  const { data: leads, isLoading } = useCompanySetupLeads(filters);
  const { data: stats } = useCompanySetupStats();
  const { data: utmValues } = useLeadUTMValues();
  const { data: countries } = useLeadCountries();
  const updateLead = useUpdateCompanySetupLead();
  const deleteLead = useDeleteCompanySetupLead();
  const { toast } = useToast();

  // Calculate pending leads (new or contacted but not qualified/won/lost)
  const pendingLeads = leads?.filter((l) =>
    ['new', 'contacted'].includes(l.status)
  ).length || 0;

  // Export to CSV
  const handleExport = () => {
    if (!leads || leads.length === 0) {
      toast({ title: 'No hay datos para exportar', variant: 'destructive' });
      return;
    }

    const headers = [
      'Nombre',
      'Email',
      'Teléfono',
      'Empresa',
      'Industria',
      'País',
      'Score',
      'Estado',
      'Prioridad',
      'Fecha',
    ];
    const rows = leads.map((l) => [
      l.name,
      l.email,
      l.phone || '',
      l.company_name || '',
      l.industry || '',
      l.country_origin,
      l.lead_score,
      l.status,
      l.priority,
      new Date(l.created_at).toLocaleDateString('es-ES'),
    ]);

    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads-empresas-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({ title: 'Exportación completada' });
  };

  // Handle save from detail sheet
  const handleSaveDetail = (updates: Partial<CompanySetupLead>) => {
    if (!selectedLead) return;

    updateLead.mutate(
      { id: selectedLead.id, updates },
      {
        onSuccess: () => {
          toast({ title: 'Lead actualizado' });
          setSelectedLead(null);
        },
        onError: () => {
          toast({ title: 'Error al actualizar', variant: 'destructive' });
        },
      }
    );
  };

  // Handle delete from detail sheet
  const handleDeleteDetail = () => {
    if (!selectedLead) return;

    deleteLead.mutate(selectedLead.id, {
      onSuccess: () => {
        toast({ title: 'Lead eliminado' });
        setSelectedLead(null);
      },
      onError: () => {
        toast({ title: 'Error al eliminar', variant: 'destructive' });
      },
    });
  };

  // Quick action handlers
  const handleChangeStatus = (newStatus: string) => {
    if (!statusDialogLead) return;

    updateLead.mutate(
      { id: statusDialogLead.id, updates: { status: newStatus } },
      {
        onSuccess: () => {
          toast({ title: 'Estado actualizado' });
          setStatusDialogLead(null);
        },
      }
    );
  };

  const handleChangePriority = (newPriority: string) => {
    if (!priorityDialogLead) return;

    updateLead.mutate(
      { id: priorityDialogLead.id, updates: { priority: newPriority } },
      {
        onSuccess: () => {
          toast({ title: 'Prioridad actualizada' });
          setPriorityDialogLead(null);
        },
      }
    );
  };

  const handleAssign = (assignedTo: string) => {
    if (!assignDialogLead) return;

    updateLead.mutate(
      { id: assignDialogLead.id, updates: { assigned_to: assignedTo } },
      {
        onSuccess: () => {
          toast({ title: 'Lead asignado' });
          setAssignDialogLead(null);
        },
      }
    );
  };

  const handleAddNote = (note: string) => {
    if (!noteDialogLead) return;

    const currentNotes = noteDialogLead.notes || '';
    const timestamp = new Date().toLocaleString('es-ES');
    const newNotes = currentNotes
      ? `${currentNotes}\n\n[${timestamp}]\n${note}`
      : `[${timestamp}]\n${note}`;

    updateLead.mutate(
      { id: noteDialogLead.id, updates: { notes: newNotes } },
      {
        onSuccess: () => {
          toast({ title: 'Nota añadida' });
          setNoteDialogLead(null);
        },
      }
    );
  };

  const handleDeleteConfirm = () => {
    if (!deleteDialogLead) return;

    deleteLead.mutate(deleteDialogLead.id, {
      onSuccess: () => {
        toast({ title: 'Lead eliminado' });
        setDeleteDialogLead(null);
      },
      onError: () => {
        toast({ title: 'Error al eliminar', variant: 'destructive' });
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Leads de Empresas
          </h1>
          <p className="text-sm text-slate-500">
            Gestiona los leads de constitución de empresas
          </p>
        </div>
        <Button variant="outline" onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Exportar
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Leads</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {stats.total}
                  </p>
                </div>
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Users className="h-5 w-5 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Este mes</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {stats.thisMonth}
                  </p>
                </div>
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Score promedio</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {stats.avgScore}
                  </p>
                </div>
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Target className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Pendientes</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {pendingLeads}
                  </p>
                </div>
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Clock className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-4">
          <div className="grid grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por nombre, empresa, email o teléfono..."
                value={filters.search || ''}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="pl-9"
              />
            </div>

            {/* Status */}
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) =>
                setFilters({ ...filters, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="new">Nuevo</SelectItem>
                <SelectItem value="contacted">Contactado</SelectItem>
                <SelectItem value="qualified">Cualificado</SelectItem>
                <SelectItem value="proposal">Propuesta</SelectItem>
                <SelectItem value="won">Ganado</SelectItem>
                <SelectItem value="lost">Perdido</SelectItem>
              </SelectContent>
            </Select>

            {/* Priority */}
            <Select
              value={filters.priority || 'all'}
              onValueChange={(value) =>
                setFilters({ ...filters, priority: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las prioridades</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
              </SelectContent>
            </Select>

            {/* Country */}
            <Select
              value={filters.country || 'all'}
              onValueChange={(value) =>
                setFilters({ ...filters, country: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="País" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los países</SelectItem>
                {countries?.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* UTM Pills */}
          {utmValues && (
            <LeadUTMFilters
              filters={filters}
              onFilterChange={setFilters}
              availableValues={{
                campaigns: utmValues.campaigns,
                sources: utmValues.sources,
                mediums: utmValues.mediums,
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <LeadsTable
          leads={leads}
          isLoading={isLoading}
          onRowClick={setSelectedLead}
          onEdit={setSelectedLead}
          onAssign={setAssignDialogLead}
          onChangeStatus={setStatusDialogLead}
          onChangePriority={setPriorityDialogLead}
          onAddNote={setNoteDialogLead}
          onUploadDocument={() =>
            toast({ title: 'Funcionalidad en desarrollo' })
          }
          onDelete={setDeleteDialogLead}
        />
      </Card>

      {/* Detail Sheet */}
      <LeadDetailSheet
        lead={selectedLead}
        open={!!selectedLead}
        onOpenChange={(open) => !open && setSelectedLead(null)}
        onSave={handleSaveDetail}
        onDelete={handleDeleteDetail}
        isSaving={updateLead.isPending}
        isDeleting={deleteLead.isPending}
      />

      {/* Quick Action Dialogs */}
      <ChangeStatusDialog
        lead={statusDialogLead}
        open={!!statusDialogLead}
        onOpenChange={(open) => !open && setStatusDialogLead(null)}
        onConfirm={handleChangeStatus}
        isLoading={updateLead.isPending}
      />

      <ChangePriorityDialog
        lead={priorityDialogLead}
        open={!!priorityDialogLead}
        onOpenChange={(open) => !open && setPriorityDialogLead(null)}
        onConfirm={handleChangePriority}
        isLoading={updateLead.isPending}
      />

      <AssignLeadDialog
        lead={assignDialogLead}
        open={!!assignDialogLead}
        onOpenChange={(open) => !open && setAssignDialogLead(null)}
        onConfirm={handleAssign}
        isLoading={updateLead.isPending}
      />

      <AddNoteDialog
        lead={noteDialogLead}
        open={!!noteDialogLead}
        onOpenChange={(open) => !open && setNoteDialogLead(null)}
        onConfirm={handleAddNote}
        isLoading={updateLead.isPending}
      />

      <DeleteLeadDialog
        lead={deleteDialogLead}
        open={!!deleteDialogLead}
        onOpenChange={(open) => !open && setDeleteDialogLead(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteLead.isPending}
      />
    </div>
  );
};
