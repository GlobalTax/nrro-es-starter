import { useState, useEffect } from "react";
import { ContactLead } from "@/hooks/useContactLeads";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Mail, 
  Phone, 
  Copy, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  Globe,
  Calendar,
  Monitor,
  MapPin
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ContactLeadDetailSheetProps {
  lead: ContactLead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (id: string, emailSent: boolean, responseNotes?: string) => void;
  onDelete: (id: string) => void;
}

const SOURCE_CONFIG: Record<string, { label: string; className: string }> = {
  es: { label: "España (ES)", className: "bg-red-50 text-red-600" },
  en: { label: "English (EN)", className: "bg-blue-50 text-blue-600" },
  ca: { label: "Català (CA)", className: "bg-amber-50 text-amber-600" },
};

const SERVICE_LABELS: Record<string, string> = {
  tax_advisory: "Asesoría Fiscal",
  legal_services: "Servicios Legales",
  accounting: "Contabilidad",
  payroll: "Nóminas",
  other: "Otro",
};

export const ContactLeadDetailSheet = ({
  lead,
  open,
  onOpenChange,
  onUpdateStatus,
  onDelete,
}: ContactLeadDetailSheetProps) => {
  const [responseNotes, setResponseNotes] = useState("");

  useEffect(() => {
    if (lead) {
      setResponseNotes(lead.response_notes || "");
    }
  }, [lead]);

  if (!lead) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado`);
  };

  const handleSaveResponse = () => {
    onUpdateStatus(lead.id, true, responseNotes);
    onOpenChange(false);
  };

  const handleMarkPending = () => {
    onUpdateStatus(lead.id, false);
  };

  const openMailto = () => {
    const emailTemplate = `Estimado/a ${lead.name},

Gracias por contactar con navarro.

Hemos recibido su consulta y nuestro equipo la está revisando. Nos pondremos en contacto con usted en las próximas 24-48 horas.

Si necesita asistencia urgente, no dude en llamarnos.

Saludos cordiales,
Equipo navarro`;

    const mailtoLink = `mailto:${lead.email}?subject=Re: ${lead.subject}&body=${encodeURIComponent(emailTemplate)}`;
    window.open(mailtoLink, '_blank');
  };

  const sourceConfig = SOURCE_CONFIG[lead.source_site as string];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[480px] sm:max-w-[480px] overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl">{lead.name}</SheetTitle>
            <Badge 
              variant={lead.email_sent ? "default" : "secondary"}
              className={cn(
                lead.email_sent 
                  ? "bg-emerald-50 text-emerald-700" 
                  : "bg-amber-50 text-amber-700"
              )}
            >
              {lead.email_sent ? "Respondido" : "Pendiente"}
            </Badge>
          </div>
          <SheetDescription>{lead.company || "Sin empresa"}</SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6 py-4">
          {/* Contact Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                <a 
                  href={`mailto:${lead.email}`} 
                  className="text-sm text-blue-600 hover:underline"
                >
                  {lead.email}
                </a>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => copyToClipboard(lead.email, "Email")}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
            {lead.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-700">{lead.phone}</span>
              </div>
            )}
          </div>
          
          <Separator />
          
          {/* Subject & Message */}
          <div className="space-y-2">
            <Label className="text-xs text-slate-500 uppercase tracking-wide">Asunto</Label>
            <p className="text-sm font-medium text-slate-900">{lead.subject}</p>
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs text-slate-500 uppercase tracking-wide">Mensaje</Label>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {lead.message}
              </p>
            </div>
          </div>
          
          <Separator />
          
          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-slate-500">Tipo de Servicio</Label>
              <p className="text-sm text-slate-700">
                {SERVICE_LABELS[lead.service_type as string] || "-"}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-500">Origen</Label>
              {sourceConfig ? (
                <Badge className={cn("text-xs", sourceConfig.className)}>
                  <Globe className="h-3 w-3 mr-1" />
                  {sourceConfig.label}
                </Badge>
              ) : (
                <span className="text-sm text-slate-500">-</span>
              )}
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-500">Fecha</Label>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-sm text-slate-700">
                  {format(new Date(lead.created_at), "dd/MM/yyyy HH:mm", { locale: es })}
                </span>
              </div>
            </div>
            {lead.ip_address && (
              <div className="space-y-1">
                <Label className="text-xs text-slate-500">IP</Label>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-sm text-slate-500 font-mono">{lead.ip_address}</span>
                </div>
              </div>
            )}
          </div>

          {lead.user_agent && (
            <div className="space-y-1">
              <Label className="text-xs text-slate-500">Navegador</Label>
              <div className="flex items-center gap-1.5">
                <Monitor className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-xs text-slate-500 truncate">{lead.user_agent}</span>
              </div>
            </div>
          )}
          
          {/* Response Status */}
          {lead.responded_at && (
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Respondido el {format(new Date(lead.responded_at), "dd/MM/yyyy 'a las' HH:mm", { locale: es })}
                </span>
              </div>
              {lead.response_notes && (
                <p className="text-sm text-emerald-600 mt-2 pl-6">{lead.response_notes}</p>
              )}
            </div>
          )}
          
          <Separator />
          
          {/* Response Notes */}
          <div className="space-y-2">
            <Label htmlFor="response-notes">Notas internas</Label>
            <Textarea
              id="response-notes"
              value={responseNotes}
              onChange={(e) => setResponseNotes(e.target.value)}
              placeholder="Añadir notas sobre el seguimiento..."
              rows={3}
              className="resize-none"
            />
          </div>
        </div>
        
        <SheetFooter className="flex flex-row justify-between gap-2 pt-4 border-t">
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => {
              if (confirm("¿Eliminar este lead de contacto?")) {
                onDelete(lead.id);
                onOpenChange(false);
              }
            }}
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            Eliminar
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={openMailto}>
              <Mail className="h-4 w-4 mr-1.5" />
              Responder
            </Button>
            {!lead.email_sent ? (
              <Button size="sm" onClick={handleSaveResponse}>
                <CheckCircle2 className="h-4 w-4 mr-1.5" />
                Marcar Respondido
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={handleMarkPending}>
                <XCircle className="h-4 w-4 mr-1.5" />
                Marcar Pendiente
              </Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};