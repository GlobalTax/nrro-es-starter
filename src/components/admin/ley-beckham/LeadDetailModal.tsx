import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import { 
  Mail, 
  Phone, 
  Building2, 
  MapPin, 
  Briefcase, 
  Calendar,
  DollarSign,
  MessageSquare,
  FileText,
  History,
  Copy,
  Send
} from "lucide-react";
import type { LeyBeckhamLead } from "@/hooks/useLeyBeckhamLeads";
import { 
  useLeadNotes, 
  useLeadStatusHistory, 
  useLeadDocuments,
  useAddLeadNote,
  useUpdateLeadDocument,
  useUpdateLeadStatus
} from "@/hooks/useLeyBeckhamLeads";
import { toast } from "sonner";

interface LeadDetailModalProps {
  lead: LeyBeckhamLead | null;
  open: boolean;
  onClose: () => void;
}

export const LeadDetailModal = ({ lead, open, onClose }: LeadDetailModalProps) => {
  const [newNote, setNewNote] = useState("");
  const [newStatus, setNewStatus] = useState("");

  const { data: notes } = useLeadNotes(lead?.id || "");
  const { data: history } = useLeadStatusHistory(lead?.id || "");
  const { data: documents } = useLeadDocuments(lead?.id || "");
  const addNote = useAddLeadNote();
  const updateDocument = useUpdateLeadDocument();
  const updateStatus = useUpdateLeadStatus();

  if (!lead) return null;

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addNote.mutate({ lead_id: lead.id, note: newNote });
    setNewNote("");
  };

  const handleStatusChange = () => {
    if (!newStatus) return;
    updateStatus.mutate({ id: lead.id, status: newStatus });
    setNewStatus("");
  };

  const handleDocumentToggle = (docId: string, isReceived: boolean) => {
    updateDocument.mutate({ 
      id: docId, 
      is_received: !isReceived,
      received_at: !isReceived ? new Date().toISOString() : null
    });
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(lead.email);
    toast.success("Email copiado");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalles del Lead: {lead.name}</span>
            <Badge className="ml-2">
              Score: {lead.eligibility_score || 0}/100
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">Información</TabsTrigger>
            <TabsTrigger value="notes">Notas</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Datos del Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{lead.email}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyEmail}>
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                        <a href={`mailto:${lead.email}`}>
                          <Send className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </div>

                  {lead.phone && (
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Teléfono
                      </div>
                      <div>{lead.phone}</div>
                    </div>
                  )}

                  {lead.company && (
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Empresa
                      </div>
                      <div>{lead.company}</div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      País
                    </div>
                    <div>{lead.country}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Situación Laboral
                    </div>
                    <div className="text-sm">{lead.job_situation}</div>
                  </div>

                  {lead.estimated_move_date && (
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Fecha Traslado Estimada
                      </div>
                      <div>{format(new Date(lead.estimated_move_date), "dd MMMM yyyy", { locale: es })}</div>
                    </div>
                  )}

                  {lead.current_salary && (
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Salario Actual
                      </div>
                      <div>{lead.current_salary.toLocaleString('es-ES')} €</div>
                    </div>
                  )}
                </div>

                {lead.message && (
                  <div className="space-y-1 pt-4 border-t">
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Mensaje
                    </div>
                    <div className="text-sm bg-muted p-3 rounded-md">{lead.message}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Gestión del Lead</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Cambiar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nuevo">Nuevo</SelectItem>
                      <SelectItem value="contactado">Contactado</SelectItem>
                      <SelectItem value="documentacion">Documentación</SelectItem>
                      <SelectItem value="en_proceso">En proceso</SelectItem>
                      <SelectItem value="completado">Completado</SelectItem>
                      <SelectItem value="descartado">Descartado</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleStatusChange} disabled={!newStatus}>
                    Actualizar
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Estado actual: <Badge>{lead.status}</Badge></div>
                  <div>Prioridad: <Badge>{lead.priority}</Badge></div>
                  <div>Recibido: {format(new Date(lead.created_at), "dd MMM yyyy HH:mm", { locale: es })}</div>
                  {lead.contacted_at && (
                    <div>Contactado: {format(new Date(lead.contacted_at), "dd MMM yyyy HH:mm", { locale: es })}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Añadir Nota</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Textarea
                  placeholder="Escribe una nota sobre este lead..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={4}
                />
                <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Añadir Nota
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {notes?.map((note) => (
                <Card key={note.id}>
                  <CardContent className="pt-4">
                    <div className="text-sm">{note.note}</div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {format(new Date(note.created_at), "dd MMM yyyy HH:mm", { locale: es })}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {(!notes || notes.length === 0) && (
                <div className="text-center text-muted-foreground py-8">
                  No hay notas todavía
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-3">
            {documents?.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={doc.is_received}
                        onCheckedChange={() => handleDocumentToggle(doc.id, doc.is_received)}
                      />
                      <div>
                        <div className="font-medium">{doc.document_name}</div>
                        <div className="text-xs text-muted-foreground">{doc.document_type}</div>
                      </div>
                    </div>
                    {doc.is_received && doc.received_at && (
                      <Badge variant="outline" className="text-green-600">
                        Recibido {format(new Date(doc.received_at), "dd/MM/yy")}
                      </Badge>
                    )}
                  </div>
                  {doc.notes && (
                    <div className="text-sm text-muted-foreground mt-2 pl-7">
                      {doc.notes}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="history" className="space-y-3">
            {history?.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <History className="h-4 w-4 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <div className="text-sm">
                        <Badge variant="outline" className="mr-2">{item.from_status || 'N/A'}</Badge>
                        →
                        <Badge className="ml-2">{item.to_status}</Badge>
                      </div>
                      {item.notes && (
                        <div className="text-sm text-muted-foreground mt-1">{item.notes}</div>
                      )}
                      <div className="text-xs text-muted-foreground mt-2">
                        {format(new Date(item.changed_at), "dd MMM yyyy HH:mm", { locale: es })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {(!history || history.length === 0) && (
              <div className="text-center text-muted-foreground py-8">
                No hay historial todavía
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
