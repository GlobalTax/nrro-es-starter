import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  Eye,
  Pencil,
  MoreHorizontal,
  UserPlus,
  ArrowRightCircle,
  Flag,
  MessageSquare,
  Upload,
  Trash2,
  Mail,
  Phone,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import type { CompanySetupLead } from '@/hooks/useCompanySetupLeads';

interface LeadsTableProps {
  leads: CompanySetupLead[] | undefined;
  isLoading: boolean;
  onRowClick: (lead: CompanySetupLead) => void;
  onEdit: (lead: CompanySetupLead) => void;
  onAssign: (lead: CompanySetupLead) => void;
  onChangeStatus: (lead: CompanySetupLead) => void;
  onChangePriority: (lead: CompanySetupLead) => void;
  onAddNote: (lead: CompanySetupLead) => void;
  onUploadDocument: (lead: CompanySetupLead) => void;
  onDelete: (lead: CompanySetupLead) => void;
}

// Score badge colors based on ranges
const getScoreBadgeClasses = (score: number) => {
  if (score >= 81) return 'bg-red-100 text-red-700 border-red-200';
  if (score >= 61) return 'bg-amber-100 text-amber-700 border-amber-200';
  if (score >= 31) return 'bg-blue-100 text-blue-700 border-blue-200';
  return 'bg-slate-100 text-slate-600 border-slate-200';
};

const getScoreLabel = (score: number) => {
  if (score >= 81) return 'Urgente';
  if (score >= 61) return 'Alta';
  if (score >= 31) return 'Media';
  return 'Baja';
};

// Status config
const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  new: { label: 'Nuevo', className: 'bg-blue-50 text-blue-600 border-blue-100' },
  contacted: { label: 'Contactado', className: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  qualified: { label: 'Cualificado', className: 'bg-purple-50 text-purple-600 border-purple-100' },
  proposal: { label: 'Propuesta', className: 'bg-violet-50 text-violet-600 border-violet-100' },
  won: { label: 'Ganado', className: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  lost: { label: 'Perdido', className: 'bg-slate-100 text-slate-500 border-slate-200' },
};

// Priority config
const PRIORITY_CONFIG: Record<string, { label: string; className: string }> = {
  urgent: { label: 'Urgente', className: 'bg-red-50 text-red-600 border-red-100' },
  high: { label: 'Alta', className: 'bg-amber-50 text-amber-600 border-amber-100' },
  medium: { label: 'Media', className: 'bg-slate-100 text-slate-600 border-slate-200' },
  low: { label: 'Baja', className: 'bg-slate-50 text-slate-400 border-slate-100' },
};

// Country flag emojis
const getCountryFlag = (country: string): string => {
  const flags: Record<string, string> = {
    'United Kingdom': '🇬🇧',
    UK: '🇬🇧',
    'United States': '🇺🇸',
    USA: '🇺🇸',
    Spain: '🇪🇸',
    ES: '🇪🇸',
    Germany: '🇩🇪',
    DE: '🇩🇪',
    France: '🇫🇷',
    FR: '🇫🇷',
    Italy: '🇮🇹',
    IT: '🇮🇹',
    Netherlands: '🇳🇱',
    NL: '🇳🇱',
    Portugal: '🇵🇹',
    PT: '🇵🇹',
    China: '🇨🇳',
    CN: '🇨🇳',
    Japan: '🇯🇵',
    JP: '🇯🇵',
    Australia: '🇦🇺',
    AU: '🇦🇺',
    Canada: '🇨🇦',
    CA: '🇨🇦',
    Brazil: '🇧🇷',
    BR: '🇧🇷',
    Mexico: '🇲🇽',
    MX: '🇲🇽',
    Argentina: '🇦🇷',
    AR: '🇦🇷',
  };
  return flags[country] || '🌍';
};

export const LeadsTable = ({
  leads,
  isLoading,
  onRowClick,
  onEdit,
  onAssign,
  onChangeStatus,
  onChangePriority,
  onAddNote,
  onUploadDocument,
  onDelete,
}: LeadsTableProps) => {
  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!leads || leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <UserPlus className="h-12 w-12 mb-3 opacity-30" />
        <p className="text-sm font-medium">No hay leads</p>
        <p className="text-xs mt-1">Los leads aparecerán aquí cuando lleguen</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent border-slate-100">
          <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Nombre / Empresa
          </TableHead>
          <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Contacto
          </TableHead>
          <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            País
          </TableHead>
          <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Score
          </TableHead>
          <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Estado
          </TableHead>
          <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Prioridad
          </TableHead>
          <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Fecha
          </TableHead>
          <TableHead className="w-[100px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead, index) => {
          const statusConfig = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;
          const priorityConfig = PRIORITY_CONFIG[lead.priority] || PRIORITY_CONFIG.medium;

          return (
            <TableRow
              key={lead.id}
              className={cn(
                'group cursor-pointer transition-colors border-slate-100',
                index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50',
                'hover:bg-indigo-50/50'
              )}
              onClick={() => onRowClick(lead)}
            >
              {/* Name / Company */}
              <TableCell className="py-4">
                <div className="space-y-0.5">
                  <p className="font-semibold text-slate-900">{lead.name}</p>
                  {lead.company_name && (
                    <p className="text-sm text-slate-600">
                      {lead.company_name}
                      {lead.industry && (
                        <span className="text-slate-400"> • {lead.industry}</span>
                      )}
                    </p>
                  )}
                </div>
              </TableCell>

              {/* Contact */}
              <TableCell className="py-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span className="truncate max-w-[180px]">{lead.email}</span>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <span>{lead.phone}</span>
                    </div>
                  )}
                </div>
              </TableCell>

              {/* Country */}
              <TableCell className="py-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{getCountryFlag(lead.country_origin)}</span>
                  <span className="text-sm text-slate-600">{lead.country_origin}</span>
                </div>
              </TableCell>

              {/* Score */}
              <TableCell className="py-4">
                <Badge
                  variant="outline"
                  className={cn('font-semibold text-xs', getScoreBadgeClasses(lead.lead_score))}
                  title={getScoreLabel(lead.lead_score)}
                >
                  {lead.lead_score}
                </Badge>
              </TableCell>

              {/* Status */}
              <TableCell className="py-4">
                <Badge variant="outline" className={cn('text-xs', statusConfig.className)}>
                  {statusConfig.label}
                </Badge>
              </TableCell>

              {/* Priority */}
              <TableCell className="py-4">
                <Badge variant="outline" className={cn('text-xs', priorityConfig.className)}>
                  {priorityConfig.label}
                </Badge>
              </TableCell>

              {/* Date */}
              <TableCell className="py-4">
                <span className="text-sm text-slate-500">
                  {formatDistanceToNow(new Date(lead.created_at), {
                    addSuffix: true,
                    locale: es,
                  })}
                </span>
              </TableCell>

              {/* Actions */}
              <TableCell className="py-4 text-right">
                <div
                  className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-500 hover:text-slate-700"
                    onClick={() => onRowClick(lead)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-500 hover:text-slate-700"
                    onClick={() => onEdit(lead)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:text-slate-700"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => onAssign(lead)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Asignar a...
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onChangeStatus(lead)}>
                        <ArrowRightCircle className="h-4 w-4 mr-2" />
                        Cambiar estado
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onChangePriority(lead)}>
                        <Flag className="h-4 w-4 mr-2" />
                        Cambiar prioridad
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onAddNote(lead)}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Añadir nota
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUploadDocument(lead)}>
                        <Upload className="h-4 w-4 mr-2" />
                        Subir documento
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(lead)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
