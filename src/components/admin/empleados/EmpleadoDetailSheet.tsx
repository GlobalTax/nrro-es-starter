import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Empleado } from '@/hooks/useEmpleados';
import { useNominas, Nomina } from '@/hooks/useNominas';
import {
  User,
  FileText,
  Receipt,
  DollarSign,
  Briefcase,
  Camera,
  Copy,
  ExternalLink,
  Download,
  Trash2,
  Upload,
  Plus,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

interface EmpleadoDetailSheetProps {
  empleado: Empleado | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Partial<Empleado>) => void;
  onDelete: () => void;
  isCreating: boolean;
  isSaving?: boolean;
  isDeleting?: boolean;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

const formatCurrency = (value: number | null) => {
  if (!value) return '€0';
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(value);
};

const getMonthName = (month: number) => {
  const date = new Date(2024, month - 1, 1);
  return format(date, 'MMMM', { locale: es });
};

export function EmpleadoDetailSheet({
  empleado,
  open,
  onOpenChange,
  onSave,
  onDelete,
  isCreating,
  isSaving,
  isDeleting,
}: EmpleadoDetailSheetProps) {
  const [formData, setFormData] = useState<Partial<Empleado>>({});
  const [activeTab, setActiveTab] = useState('info');

  // Fetch nóminas for this employee
  const { data: nominas } = useNominas({
    empleado_id: empleado?.id,
  });

  useEffect(() => {
    if (empleado) {
      setFormData(empleado);
    } else {
      setFormData({ activo: true });
    }
    setActiveTab('info');
  }, [empleado, open]);

  const handleSave = () => {
    onSave(formData);
  };

  const copyEmail = () => {
    if (formData.email) {
      navigator.clipboard.writeText(formData.email);
      toast.success('Email copiado');
    }
  };

  const costeTotal = (formData.salario_base || 0) + (formData.variable || 0) + (formData.bonus || 0) + (formData.coste_seg_social || 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[560px] sm:max-w-[560px] overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              {formData.avatar_url ? (
                <img
                  src={formData.avatar_url}
                  alt={formData.nombre || ''}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                  <span className="text-xl font-semibold text-indigo-600">
                    {formData.nombre ? getInitials(formData.nombre) : '?'}
                  </span>
                </div>
              )}
              <Button
                variant="outline"
                size="icon"
                className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full"
              >
                <Camera className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex-1">
              <SheetTitle className="text-left">
                {isCreating ? 'Nuevo empleado' : formData.nombre || ''}
              </SheetTitle>
              <SheetDescription className="text-left">
                {formData.puesto || 'Sin puesto asignado'}
              </SheetDescription>
              {!isCreating && (
                <Badge
                  className={
                    formData.activo
                      ? 'bg-emerald-50 text-emerald-700 border-0 mt-1'
                      : 'bg-red-50 text-red-700 border-0 mt-1'
                  }
                >
                  {formData.activo ? 'Activo' : 'Inactivo'}
                </Badge>
              )}
            </div>
          </div>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-4 mb-6">
            <TabsTrigger value="info" className="text-xs">
              <User className="h-3.5 w-3.5 mr-1" />
              Info
            </TabsTrigger>
            <TabsTrigger value="contrato" className="text-xs">
              <FileText className="h-3.5 w-3.5 mr-1" />
              Contrato
            </TabsTrigger>
            <TabsTrigger value="nominas" className="text-xs">
              <Receipt className="h-3.5 w-3.5 mr-1" />
              Nóminas
              {nominas && nominas.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-4 text-[10px] px-1">
                  {nominas.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="costes" className="text-xs">
              <DollarSign className="h-3.5 w-3.5 mr-1" />
              Costes
            </TabsTrigger>
          </TabsList>

          {/* Tab: Información Personal */}
          <TabsContent value="info" className="space-y-6 mt-0">
            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2 text-slate-900">
                <User className="h-4 w-4" />
                Datos personales
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label className="text-xs text-slate-500">Nombre completo</Label>
                  <Input
                    value={formData.nombre || ''}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500">NIF</Label>
                  <Input
                    value={formData.nif || ''}
                    onChange={(e) => setFormData({ ...formData, nif: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500">Email</Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="flex-1"
                    />
                    <Button variant="ghost" size="icon" className="h-9 w-9" onClick={copyEmail}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2 text-slate-900">
                <Briefcase className="h-4 w-4" />
                Posición
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500">Puesto</Label>
                  <Input
                    value={formData.puesto || ''}
                    onChange={(e) => setFormData({ ...formData, puesto: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500">Departamento</Label>
                  <Input
                    value={formData.departamento || ''}
                    onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500">Área</Label>
                  <Input
                    value={formData.area || ''}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500">Oficina</Label>
                  <Input
                    value={formData.oficina || ''}
                    onChange={(e) => setFormData({ ...formData, oficina: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500">Rol</Label>
                  <Input
                    value={formData.rol || ''}
                    onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-xs text-slate-500">Notas internas</Label>
              <Textarea
                value={formData.notas || ''}
                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                rows={3}
                placeholder="Añadir notas sobre el empleado..."
              />
            </div>
          </TabsContent>

          {/* Tab: Contrato y Documentos */}
          <TabsContent value="contrato" className="space-y-6 mt-0">
            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2 text-slate-900">
                <FileText className="h-4 w-4" />
                Tipo de contrato
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500">Tipo</Label>
                  <Select
                    value={formData.tipo_contrato || ''}
                    onValueChange={(v) => setFormData({ ...formData, tipo_contrato: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Indefinido">Indefinido</SelectItem>
                      <SelectItem value="Temporal">Temporal</SelectItem>
                      <SelectItem value="Prácticas">Prácticas</SelectItem>
                      <SelectItem value="Formación">Formación</SelectItem>
                      <SelectItem value="Convenio">Convenio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500">Estado</Label>
                  <Select
                    value={formData.activo ? 'activo' : 'inactivo'}
                    onValueChange={(v) => setFormData({ ...formData, activo: v === 'activo' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500">Fecha de alta</Label>
                  <Input
                    type="date"
                    value={formData.fecha_alta || ''}
                    onChange={(e) => setFormData({ ...formData, fecha_alta: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500">Fecha de baja</Label>
                  <Input
                    type="date"
                    value={formData.fecha_baja || ''}
                    onChange={(e) => setFormData({ ...formData, fecha_baja: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-900">Documento de contrato</h3>

              {formData.contrato_url ? (
                <div className="p-4 border border-slate-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <FileText className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Contrato.pdf</p>
                      <p className="text-xs text-slate-500">Documento adjunto</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.open(formData.contrato_url!, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => setFormData({ ...formData, contrato_url: null })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 mx-auto text-slate-400 mb-3" />
                  <p className="text-sm text-slate-600 mb-2">Arrastra el contrato aquí o</p>
                  <Button variant="outline" size="sm">
                    Seleccionar archivo
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-900">Firma digital</h3>
              {formData.firma_url ? (
                <img src={formData.firma_url} className="h-16 border rounded" alt="Firma" />
              ) : (
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Subir firma
                </Button>
              )}
            </div>
          </TabsContent>

          {/* Tab: Historial de Nóminas */}
          <TabsContent value="nominas" className="space-y-4 mt-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-900">Historial de nóminas</h3>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Subir nómina
              </Button>
            </div>

            {nominas && nominas.length > 0 ? (
              <div className="space-y-2">
                {nominas.map((nomina: any) => (
                  <div
                    key={nomina.id}
                    className="p-3 border border-slate-100 rounded-lg flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <Receipt className="h-4 w-4 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium capitalize">
                          {getMonthName(nomina.mes)} {nomina.anio}
                        </p>
                        <div className="flex gap-4 text-xs text-slate-500">
                          <span>Bruto: {formatCurrency(nomina.salario_bruto)}</span>
                          <span>Neto: {formatCurrency(nomina.salario_neto)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Coste: {formatCurrency(nomina.coste_empresa)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Receipt className="h-10 w-10 mb-3 opacity-30" />
                <p className="text-sm font-medium">Sin nóminas registradas</p>
                <p className="text-xs mt-1">Las nóminas del empleado aparecerán aquí</p>
              </div>
            )}
          </TabsContent>

          {/* Tab: Costes y Retribución */}
          <TabsContent value="costes" className="space-y-6 mt-0">
            {/* Resumen visual */}
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-slate-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Coste mensual total</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {formatCurrency(formData.coste_total_mensual)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Coste anual total</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {formatCurrency(formData.coste_total_anual)}
                  </p>
                </div>
              </div>
            </div>

            {/* Desglose */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-900">Desglose salarial</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500">Salario base (anual)</Label>
                  <Input
                    type="number"
                    value={formData.salario_base || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, salario_base: Number(e.target.value) || null })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500">Variable</Label>
                  <Input
                    type="number"
                    value={formData.variable || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, variable: Number(e.target.value) || null })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500">Bonus</Label>
                  <Input
                    type="number"
                    value={formData.bonus || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, bonus: Number(e.target.value) || null })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500">Coste Seg. Social</Label>
                  <Input
                    type="number"
                    value={formData.coste_seg_social || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, coste_seg_social: Number(e.target.value) || null })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Barra visual de distribución */}
            {costeTotal > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-900">Distribución del coste</h3>
                <div className="h-4 rounded-full overflow-hidden flex bg-slate-200">
                  {formData.salario_base && formData.salario_base > 0 && (
                    <div
                      className="bg-indigo-500"
                      style={{ width: `${(formData.salario_base / costeTotal) * 100}%` }}
                    />
                  )}
                  {formData.variable && formData.variable > 0 && (
                    <div
                      className="bg-emerald-500"
                      style={{ width: `${(formData.variable / costeTotal) * 100}%` }}
                    />
                  )}
                  {formData.bonus && formData.bonus > 0 && (
                    <div
                      className="bg-amber-500"
                      style={{ width: `${(formData.bonus / costeTotal) * 100}%` }}
                    />
                  )}
                  {formData.coste_seg_social && formData.coste_seg_social > 0 && (
                    <div
                      className="bg-slate-400"
                      style={{ width: `${(formData.coste_seg_social / costeTotal) * 100}%` }}
                    />
                  )}
                </div>
                <div className="flex gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-indigo-500" />
                    Base
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    Variable
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                    Bonus
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-slate-400" />
                    Seg. Social
                  </span>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <SheetFooter className="flex justify-between mt-6 pt-4 border-t">
          {!isCreating && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Guardando...' : isCreating ? 'Crear' : 'Guardar'}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
