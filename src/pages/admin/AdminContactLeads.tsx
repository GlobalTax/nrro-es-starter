import { useState } from "react";
import { useContactLeads, useUpdateContactLead, useDeleteContactLead, ContactLead } from "@/hooks/useContactLeads";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Mail, ExternalLink, Eye, Download } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ContactLeadDetailModal } from "@/components/admin/contact-leads/ContactLeadDetailModal";
import { ContactLeadFilters, ContactLeadFiltersState } from "@/components/admin/contact-leads/ContactLeadFilters";
import { exportContactLeadsToCSV, exportContactLeadsToExcel } from "@/lib/exportContactLeads";
import { useAnalytics } from "@/hooks/useAnalytics";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminContactLeads() {
  const { trackDownload } = useAnalytics();
  const [filters, setFilters] = useState<ContactLeadFiltersState>({
    search: "",
    status: "all",
    serviceType: "all",
    dateFrom: "",
    dateTo: "",
  });
  
  const { data: leads, isLoading } = useContactLeads(filters);
  const updateLead = useUpdateContactLead();
  const deleteLead = useDeleteContactLead();
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<ContactLead | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleClearFilters = () => {
    setFilters({
      search: "",
      status: "all",
      serviceType: "all",
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
    setIsDetailModalOpen(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteLead.mutate(deleteId);
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = {
    total: leads?.length || 0,
    responded: leads?.filter((l) => l.email_sent).length || 0,
    pending: leads?.filter((l) => !l.email_sent).length || 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Leads de Contacto</h1>
          <p className="text-muted-foreground mt-1">
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

      <ContactLeadFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Respondidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.responded}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Mensajes Recibidos</CardTitle>
        </CardHeader>
        <CardContent>
          {!leads || leads.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No hay leads aún</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Los mensajes de contacto aparecerán aquí
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Asunto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow 
                      key={lead.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleViewDetail(lead)}
                    >
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(lead.created_at), "dd MMM yyyy HH:mm", {
                          locale: es,
                        })}
                      </TableCell>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>
                        <a
                          href={`mailto:${lead.email}`}
                          className="text-blue-600 hover:underline flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {lead.email}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {lead.company || "-"}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{lead.subject}</TableCell>
                      <TableCell>
                        <Badge variant={lead.email_sent ? "default" : "secondary"}>
                          {lead.email_sent ? "Respondido" : "Pendiente"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetail(lead);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteId(lead.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ContactLeadDetailModal
        lead={selectedLead}
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        onUpdateStatus={handleUpdateStatus}
        onDelete={(id) => {
          deleteLead.mutate(id);
          setIsDetailModalOpen(false);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El lead será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
