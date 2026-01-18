import { useState, useMemo } from "react";
import { useContactLeads, useUpdateContactLead, useDeleteContactLead, ContactLead } from "@/hooks/useContactLeads";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Mail, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import { ContactLeadDetailSheet } from "@/components/admin/contact-leads/ContactLeadDetailSheet";
import { ContactLeadFilters, ContactLeadFiltersState } from "@/components/admin/contact-leads/ContactLeadFilters";
import { ContactLeadsTable } from "@/components/admin/contact-leads/ContactLeadsTable";
import { exportContactLeadsToCSV, exportContactLeadsToExcel } from "@/lib/exportContactLeads";
import { useAnalytics } from "@/hooks/useAnalytics";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { isThisWeek } from "date-fns";

export default function AdminContactLeads() {
  const { trackDownload } = useAnalytics();
  const [filters, setFilters] = useState<ContactLeadFiltersState>({
    search: "",
    status: "all",
    serviceType: "all",
    sourceSite: "all",
    dateFrom: "",
    dateTo: "",
  });
  
  const { data: leads, isLoading } = useContactLeads(filters);
  const updateLead = useUpdateContactLead();
  const deleteLead = useDeleteContactLead();
  
  const [selectedLead, setSelectedLead] = useState<ContactLead | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const handleClearFilters = () => {
    setFilters({
      search: "",
      status: "all",
      serviceType: "all",
      sourceSite: "all",
      dateFrom: "",
      dateTo: "",
    });
  };

  const handleExportCSV = () => {
    if (leads) {
      exportContactLeadsToCSV(leads);
      trackDownload('csv', 'contact-leads.csv', 'admin_contact_leads');
    }
  };

  const handleExportExcel = () => {
    if (leads) {
      exportContactLeadsToExcel(leads);
      trackDownload('excel', 'contact-leads.xlsx', 'admin_contact_leads');
    }
  };

  const handleUpdateStatus = (id: string, emailSent: boolean, responseNotes?: string) => {
    updateLead.mutate({ id, email_sent: emailSent, response_notes: responseNotes });
  };

  const handleViewDetail = (lead: ContactLead) => {
    setSelectedLead(lead);
  };

  const handleMarkResponded = (lead: ContactLead) => {
    updateLead.mutate({ id: lead.id, email_sent: true });
  };

  const handleOpenMailto = (lead: ContactLead) => {
    const emailTemplate = `Estimado/a ${lead.name},

Gracias por contactar con navarro.

Hemos recibido su consulta y nuestro equipo la está revisando. Nos pondremos en contacto con usted en las próximas 24-48 horas.

Si necesita asistencia urgente, no dude en llamarnos.

Saludos cordiales,
Equipo navarro`;

    const mailtoLink = `mailto:${lead.email}?subject=Re: ${lead.subject}&body=${encodeURIComponent(emailTemplate)}`;
    window.open(mailtoLink, '_blank');
  };

  const handleDelete = (id: string) => {
    deleteLead.mutate(id);
  };

  const toggleExpand = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const stats = useMemo(() => {
    if (!leads) return { total: 0, pending: 0, responded: 0, thisWeek: 0 };
    return {
      total: leads.length,
      pending: leads.filter(l => !l.email_sent).length,
      responded: leads.filter(l => l.email_sent).length,
      thisWeek: leads.filter(l => isThisWeek(new Date(l.created_at))).length,
    };
  }, [leads]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Leads de Contacto</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Gestiona los mensajes de contacto recibidos
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExportCSV}>
              Exportar a CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportExcel}>
              Exportar a Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total</p>
                <p className="text-2xl font-semibold text-slate-900">{stats.total}</p>
              </div>
              <div className="p-2.5 bg-slate-100 rounded-lg">
                <Mail className="h-5 w-5 text-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pendientes</p>
                <p className="text-2xl font-semibold text-amber-600">{stats.pending}</p>
              </div>
              <div className="p-2.5 bg-amber-100 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Respondidos</p>
                <p className="text-2xl font-semibold text-emerald-600">{stats.responded}</p>
              </div>
              <div className="p-2.5 bg-emerald-100 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Esta semana</p>
                <p className="text-2xl font-semibold text-indigo-600">{stats.thisWeek}</p>
              </div>
              <div className="p-2.5 bg-indigo-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-5 pb-4">
          <ContactLeadFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={handleClearFilters}
          />
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <ContactLeadsTable 
          leads={leads}
          isLoading={isLoading}
          expandedRows={expandedRows}
          onToggleExpand={toggleExpand}
          onViewDetail={handleViewDetail}
          onMarkResponded={handleMarkResponded}
          onOpenMailto={handleOpenMailto}
        />
      </Card>

      {/* Detail Sheet */}
      <ContactLeadDetailSheet
        lead={selectedLead}
        open={!!selectedLead}
        onOpenChange={(open) => !open && setSelectedLead(null)}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDelete}
      />
    </div>
  );
}