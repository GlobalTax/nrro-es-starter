import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  Mail, 
  Phone, 
  Building2, 
  MapPin, 
  Briefcase, 
  Calendar,
  DollarSign,
  Eye,
  Copy,
  CheckCircle2
} from "lucide-react";
import type { LeyBeckhamLead } from "@/hooks/useLeyBeckhamLeads";
import { toast } from "sonner";

interface LeadCardProps {
  lead: LeyBeckhamLead;
  onViewDetails: (lead: LeyBeckhamLead) => void;
  onStatusChange: (id: string, status: string) => void;
}

const statusConfig = {
  nuevo: { label: "Nuevo", color: "bg-blue-500" },
  contactado: { label: "Contactado", color: "bg-purple-500" },
  documentacion: { label: "Documentación", color: "bg-yellow-500" },
  en_proceso: { label: "En proceso", color: "bg-orange-500" },
  completado: { label: "Completado", color: "bg-green-500" },
  descartado: { label: "Descartado", color: "bg-gray-500" },
};

const priorityConfig = {
  urgente: { label: "Urgente", emoji: "🔴", color: "destructive" },
  alta: { label: "Alta", emoji: "🟠", color: "default" },
  media: { label: "Media", emoji: "🟡", color: "secondary" },
  baja: { label: "Baja", emoji: "🟢", color: "outline" },
};

export const LeadCard = ({ lead, onViewDetails, onStatusChange }: LeadCardProps) => {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado al portapapeles`);
  };

  const copyAllInfo = () => {
    const info = `
Nombre: ${lead.name}
Email: ${lead.email}
${lead.phone ? `Teléfono: ${lead.phone}` : ''}
${lead.company ? `Empresa: ${lead.company}` : ''}
País: ${lead.country}
Situación Laboral: ${lead.job_situation}
${lead.estimated_move_date ? `Fecha Traslado: ${format(new Date(lead.estimated_move_date), "dd/MM/yyyy")}` : ''}
${lead.current_salary ? `Salario: ${lead.current_salary.toLocaleString('es-ES')} €` : ''}
${lead.message ? `Mensaje: ${lead.message}` : ''}
    `.trim();
    
    copyToClipboard(info, "Información del lead");
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-lg">{lead.name}</h3>
              {lead.eligibility_score && (
                <Badge variant="outline" className="ml-2">
                  Score: {lead.eligibility_score}/100
                </Badge>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge className={statusConfig[lead.status].color}>
                {statusConfig[lead.status].label}
              </Badge>
              <Badge variant={priorityConfig[lead.priority].color as any}>
                {priorityConfig[lead.priority].emoji} {priorityConfig[lead.priority].label}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyAllInfo}
            title="Copiar toda la información"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span className="flex-1">{lead.email}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => copyToClipboard(lead.email, "Email")}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
          
          {lead.phone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span className="flex-1">{lead.phone}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => copyToClipboard(lead.phone, "Teléfono")}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          {lead.company && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>{lead.company}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{lead.country}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Briefcase className="h-4 w-4" />
            <span className="text-xs">{lead.job_situation}</span>
          </div>
          
          {lead.estimated_move_date && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Traslado: {format(new Date(lead.estimated_move_date), "dd MMM yyyy", { locale: es })}
              </span>
            </div>
          )}
          
          {lead.current_salary && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>{lead.current_salary.toLocaleString('es-ES')} €</span>
            </div>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground pt-2 border-t">
          Recibido: {format(new Date(lead.created_at), "dd MMM yyyy HH:mm", { locale: es })}
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => onViewDetails(lead)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver detalles
          </Button>
          
          {lead.status === 'nuevo' && (
            <Button
              size="sm"
              variant="default"
              onClick={() => onStatusChange(lead.id, 'contactado')}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Marcar contactado
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
