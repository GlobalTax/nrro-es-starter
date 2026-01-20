import { ContactLead } from "@/hooks/useContactLeads";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  ChevronRight, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Eye,
  Globe
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ContactLeadsTableProps {
  leads: ContactLead[] | undefined;
  isLoading: boolean;
  expandedRows: Set<string>;
  onToggleExpand: (id: string) => void;
  onViewDetail: (lead: ContactLead) => void;
  onMarkResponded: (lead: ContactLead) => void;
  onOpenMailto: (lead: ContactLead) => void;
}

const SOURCE_CONFIG: Record<string, { label: string; className: string }> = {
  es: { label: "ES", className: "bg-red-50 text-red-600 border-red-200" },
  en: { label: "EN", className: "bg-blue-50 text-blue-600 border-blue-200" },
  ca: { label: "CA", className: "bg-amber-50 text-amber-600 border-amber-200" },
};

const SERVICE_CONFIG: Record<string, { label: string; className: string }> = {
  tax_advisory: { label: "Fiscal", className: "bg-indigo-50 text-indigo-600" },
  legal_services: { label: "Legal", className: "bg-purple-50 text-purple-600" },
  accounting: { label: "Contabilidad", className: "bg-emerald-50 text-emerald-600" },
  payroll: { label: "Nóminas", className: "bg-cyan-50 text-cyan-600" },
  other: { label: "Otro", className: "bg-slate-50 text-slate-600" },
};

export const ContactLeadsTable = ({
  leads,
  isLoading,
  expandedRows,
  onToggleExpand,
  onViewDetail,
  onMarkResponded,
  onOpenMailto,
}: ContactLeadsTableProps) => {
  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (!leads || leads.length === 0) {
    return (
      <div className="text-center py-16">
        <Mail className="mx-auto h-12 w-12 text-slate-300" />
        <h3 className="mt-4 text-lg font-medium text-slate-900">No hay leads aún</h3>
        <p className="text-sm text-slate-500 mt-1">
          Los mensajes de contacto aparecerán aquí
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-[900px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-8"></TableHead>
            <TableHead className="min-w-[120px]">Nombre</TableHead>
            <TableHead className="w-[100px]">Empresa</TableHead>
            <TableHead className="min-w-[180px]">Contacto</TableHead>
            <TableHead className="min-w-[160px] max-w-[200px]">Asunto</TableHead>
            <TableHead className="w-14">Origen</TableHead>
            <TableHead className="w-24">Servicio</TableHead>
            <TableHead className="w-24">Estado</TableHead>
            <TableHead className="min-w-[90px]">Fecha</TableHead>
          </TableRow>
        </TableHeader>
      <TableBody>
        {leads.map((lead, index) => {
          const isExpanded = expandedRows.has(lead.id);
          const sourceConfig = SOURCE_CONFIG[lead.source_site as string] || { label: "-", className: "bg-slate-50 text-slate-500" };
          const serviceConfig = SERVICE_CONFIG[lead.service_type as string];

          return (
            <Collapsible key={lead.id} open={isExpanded} onOpenChange={() => onToggleExpand(lead.id)}>
              <CollapsibleTrigger asChild>
                <TableRow 
                  className={cn(
                    "cursor-pointer transition-colors group",
                    index % 2 === 0 ? "bg-white" : "bg-slate-50/50",
                    isExpanded ? "bg-indigo-50/50" : "hover:bg-slate-100/50"
                  )}
                >
                  <TableCell className="w-8">
                    <ChevronRight 
                      className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform",
                        isExpanded && "rotate-90"
                      )} 
                    />
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {lead.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <span className="truncate block max-w-[100px]" title={lead.company || undefined}>
                      {lead.company || "-"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                        <span className="text-foreground truncate max-w-[150px]" title={lead.email}>
                          {lead.email}
                        </span>
                      </div>
                      {lead.phone && (
                        <div className="flex items-center gap-1.5 text-sm">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                          <span className="text-muted-foreground">{lead.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <span className="truncate block text-foreground" title={lead.subject}>
                      {lead.subject}
                    </span>
                  </TableCell>
                  <TableCell>
                    {lead.source_site && (
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs font-medium", sourceConfig.className)}
                      >
                        <Globe className="h-3 w-3 mr-1" />
                        {sourceConfig.label}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {serviceConfig ? (
                      <Badge 
                        variant="secondary" 
                        className={cn("text-xs", serviceConfig.className)}
                      >
                        {serviceConfig.label}
                      </Badge>
                    ) : (
                      <span className="text-slate-400 text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={lead.email_sent ? "default" : "secondary"}
                      className={cn(
                        "text-xs",
                        lead.email_sent 
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" 
                          : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                      )}
                    >
                      {lead.email_sent ? "Respondido" : "Pendiente"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm whitespace-nowrap">
                    {formatDistanceToNow(new Date(lead.created_at), { 
                      addSuffix: true, 
                      locale: es 
                    })}
                  </TableCell>
                </TableRow>
              </CollapsibleTrigger>
              
              <CollapsibleContent asChild>
                <tr>
                  <td colSpan={9} className="p-0">
                    <div className="px-6 py-4 bg-slate-50 border-y border-slate-100">
                      <div className="space-y-4">
                        <div>
                          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            Mensaje
                          </span>
                          <div className="mt-2 p-4 bg-white rounded-lg border border-slate-200">
                            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                              {lead.message}
                            </p>
                          </div>
                        </div>
                        
                        {lead.responded_at && (
                          <div className="flex items-center gap-2 text-sm text-emerald-600">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>
                              Respondido el {format(new Date(lead.responded_at), "dd/MM/yyyy 'a las' HH:mm", { locale: es })}
                            </span>
                            {lead.response_notes && (
                              <span className="text-slate-500">— {lead.response_notes}</span>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 pt-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenMailto(lead);
                            }}
                            className="h-8"
                          >
                            <Mail className="h-3.5 w-3.5 mr-1.5" />
                            Responder
                          </Button>
                          {!lead.email_sent && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                onMarkResponded(lead);
                              }}
                              className="h-8"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                              Marcar Respondido
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewDetail(lead);
                            }}
                            className="h-8"
                          >
                            <Eye className="h-3.5 w-3.5 mr-1.5" />
                            Ver Detalle
                          </Button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </TableBody>
    </Table>
    </div>
  );
};