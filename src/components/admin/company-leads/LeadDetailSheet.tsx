import { useState, useEffect } from 'react';
import { DetailSheet } from '@/components/admin/DetailSheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Copy, Check, ExternalLink, Globe, FileText, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { CompanySetupLead } from '@/hooks/useCompanySetupLeads';

interface LeadDetailSheetProps {
  lead: CompanySetupLead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updates: Partial<CompanySetupLead>) => void;
  onDelete: () => void;
  isSaving?: boolean;
  isDeleting?: boolean;
}

const STATUS_OPTIONS = [
  { value: 'new', label: 'Nuevo' },
  { value: 'contacted', label: 'Contactado' },
  { value: 'qualified', label: 'Cualificado' },
  { value: 'proposal', label: 'Propuesta' },
  { value: 'won', label: 'Ganado' },
  { value: 'lost', label: 'Perdido' },
];

const PRIORITY_OPTIONS = [
  { value: 'urgent', label: 'Urgente' },
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Media' },
  { value: 'low', label: 'Baja' },
];

const getScoreBadgeClasses = (score: number) => {
  if (score >= 81) return 'bg-red-100 text-red-700';
  if (score >= 61) return 'bg-amber-100 text-amber-700';
  if (score >= 31) return 'bg-blue-100 text-blue-700';
  return 'bg-slate-100 text-slate-600';
};

export const LeadDetailSheet = ({
  lead,
  open,
  onOpenChange,
  onSave,
  onDelete,
  isSaving,
  isDeleting,
}: LeadDetailSheetProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<CompanySetupLead>>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (lead) {
      setFormData({ ...lead });
    }
  }, [lead]);

  const handleCopy = async (value: string, field: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    toast({ title: 'Copiado al portapapeles' });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSave = () => {
    onSave(formData);
  };

  if (!lead) return null;

  return (
    <DetailSheet
      open={open}
      onOpenChange={onOpenChange}
      title={formData.name || ''}
      description={formData.company_name || 'Lead de empresa'}
      size="xl"
      onSave={handleSave}
      onDelete={onDelete}
      isSaving={isSaving}
      isDeleting={isDeleting}
    >
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="w-full grid grid-cols-4 mb-6">
          <TabsTrigger value="info" className="text-xs">
            Info
          </TabsTrigger>
          <TabsTrigger value="notes" className="text-xs">
            <MessageSquare className="h-3 w-3 mr-1" />
            Notas
          </TabsTrigger>
          <TabsTrigger value="documents" className="text-xs">
            <FileText className="h-3 w-3 mr-1" />
            Docs
          </TabsTrigger>
          <TabsTrigger value="tracking" className="text-xs">
            <Globe className="h-3 w-3 mr-1" />
            UTM
          </TabsTrigger>
        </TabsList>

        {/* Info Tab */}
        <TabsContent value="info" className="space-y-6 mt-0">
          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-900">Información de contacto</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-slate-500">Nombre</Label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-slate-500">Email</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-9"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0"
                    onClick={() => handleCopy(formData.email || '', 'email')}
                  >
                    {copiedField === 'email' ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-slate-500">Teléfono</Label>
                <Input
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-slate-500">País de origen</Label>
                <Input
                  value={formData.country_origin || ''}
                  onChange={(e) => setFormData({ ...formData, country_origin: e.target.value })}
                  className="h-9"
                />
              </div>
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-900">Información de empresa</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-slate-500">Empresa</Label>
                <Input
                  value={formData.company_name || ''}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-slate-500">Industria</Label>
                <Input
                  value={formData.industry || ''}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="h-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-slate-500">Ingresos estimados</Label>
                <Input
                  value={formData.estimated_revenue || ''}
                  onChange={(e) => setFormData({ ...formData, estimated_revenue: e.target.value })}
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-slate-500">Timeline</Label>
                <Input
                  value={formData.timeline || ''}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  className="h-9"
                />
              </div>
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Lead Management */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-900">Gestión del lead</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-slate-500">Estado</Label>
                <Select
                  value={formData.status || 'new'}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-slate-500">Prioridad</Label>
                <Select
                  value={formData.priority || 'medium'}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-slate-500">Lead Score</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.lead_score || 0}
                    onChange={(e) =>
                      setFormData({ ...formData, lead_score: parseInt(e.target.value) || 0 })
                    }
                    className="h-9"
                  />
                  <Badge className={cn('shrink-0', getScoreBadgeClasses(formData.lead_score || 0))}>
                    {formData.lead_score || 0}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-slate-500">Asignado a</Label>
                <Input
                  value={formData.assigned_to || ''}
                  onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                  placeholder="ID del usuario"
                  className="h-9"
                />
              </div>
            </div>
          </div>

          {/* Message */}
          {formData.message && (
            <>
              <Separator className="bg-slate-100" />
              <div className="space-y-2">
                <Label className="text-xs text-slate-500">Mensaje del lead</Label>
                <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-700 whitespace-pre-wrap">
                  {formData.message}
                </div>
              </div>
            </>
          )}

          {/* Internal Notes */}
          <Separator className="bg-slate-100" />
          <div className="space-y-2">
            <Label className="text-xs text-slate-500">Notas internas</Label>
            <Textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Añadir notas sobre este lead..."
              rows={3}
              className="resize-none"
            />
          </div>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="mt-0">
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <MessageSquare className="h-10 w-10 mb-3 opacity-30" />
            <p className="text-sm font-medium">Sin notas adicionales</p>
            <p className="text-xs mt-1">Las notas del lead aparecerán aquí</p>
            <Button variant="outline" size="sm" className="mt-4">
              Añadir nota
            </Button>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="mt-0">
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <FileText className="h-10 w-10 mb-3 opacity-30" />
            <p className="text-sm font-medium">Sin documentos</p>
            <p className="text-xs mt-1">Sube documentos relacionados con este lead</p>
            <Button variant="outline" size="sm" className="mt-4">
              Subir documento
            </Button>
          </div>
        </TabsContent>

        {/* UTM Tracking Tab */}
        <TabsContent value="tracking" className="mt-0 space-y-4">
          <h3 className="text-sm font-medium text-slate-900">Parámetros UTM</h3>

          <div className="space-y-3">
            {[
              { label: 'Campaña', value: formData.utm_campaign },
              { label: 'Fuente', value: formData.utm_source },
              { label: 'Medio', value: formData.utm_medium },
              { label: 'Término', value: formData.utm_term },
              { label: 'Contenido', value: formData.utm_content },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <span className="text-sm text-slate-500">{item.label}</span>
                <span className="text-sm font-medium text-slate-900">
                  {item.value || <span className="text-slate-300">—</span>}
                </span>
              </div>
            ))}
          </div>

          <Separator className="bg-slate-100" />

          <h3 className="text-sm font-medium text-slate-900 pt-2">Información de origen</h3>

          <div className="space-y-3">
            <div className="flex items-start justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-500">Landing page</span>
              <span className="text-sm font-medium text-slate-900 text-right max-w-[60%] break-all">
                {formData.landing_page_url ? (
                  <a
                    href={formData.landing_page_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    Ver página
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-slate-300">—</span>
                )}
              </span>
            </div>
            <div className="flex items-start justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-500">Referrer</span>
              <span className="text-sm font-medium text-slate-900 text-right max-w-[60%] truncate">
                {formData.referrer || <span className="text-slate-300">—</span>}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-500">Variante landing</span>
              <Badge variant="outline" className="text-xs">
                {formData.landing_variant}
              </Badge>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DetailSheet>
  );
};
