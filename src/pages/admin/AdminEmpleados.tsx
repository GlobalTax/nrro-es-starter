import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DetailSheet } from '@/components/admin/DetailSheet';
import {
  useEmpleados,
  useEmpleadoStats,
  useEmpleadoDepartamentos,
  useEmpleadoAreas,
  useUpdateEmpleado,
  useCreateEmpleado,
  useDeleteEmpleado,
  Empleado,
} from '@/hooks/useEmpleados';
import {
  Users,
  UserCheck,
  UserX,
  DollarSign,
  Search,
  Plus,
  Building,
  Mail,
  Phone,
  Calendar,
  Briefcase,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AdminEmpleados() {
  const [search, setSearch] = useState('');
  const [departamentoFilter, setDepartamentoFilter] = useState<string>('');
  const [areaFilter, setAreaFilter] = useState<string>('');
  const [activoFilter, setActivoFilter] = useState<string>('');

  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Form state for editing/creating
  const [formData, setFormData] = useState<Partial<Empleado>>({});

  const filters = {
    search: search || undefined,
    departamento: departamentoFilter || undefined,
    area: areaFilter || undefined,
    activo: activoFilter === '' ? undefined : activoFilter === 'true',
  };

  const { data: empleados, isLoading } = useEmpleados(filters);
  const { data: stats } = useEmpleadoStats();
  const { data: departamentos } = useEmpleadoDepartamentos();
  const { data: areas } = useEmpleadoAreas();

  const updateEmpleado = useUpdateEmpleado();
  const createEmpleado = useCreateEmpleado();
  const deleteEmpleado = useDeleteEmpleado();

  const handleRowClick = (empleado: Empleado) => {
    setSelectedEmpleado(empleado);
    setFormData(empleado);
    setIsCreating(false);
    setIsSheetOpen(true);
  };

  const handleCreate = () => {
    setSelectedEmpleado(null);
    setFormData({ activo: true });
    setIsCreating(true);
    setIsSheetOpen(true);
  };

  const handleSave = () => {
    if (isCreating) {
      createEmpleado.mutate(formData, {
        onSuccess: () => setIsSheetOpen(false),
      });
    } else if (selectedEmpleado) {
      updateEmpleado.mutate(
        { id: selectedEmpleado.id, data: formData },
        { onSuccess: () => setIsSheetOpen(false) }
      );
    }
  };

  const handleDelete = () => {
    if (selectedEmpleado) {
      deleteEmpleado.mutate(selectedEmpleado.id, {
        onSuccess: () => setIsSheetOpen(false),
      });
    }
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return '-';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const statCards = [
    {
      title: 'Total Empleados',
      value: stats?.total || 0,
      icon: Users,
      color: 'text-slate-600',
      bgColor: 'bg-slate-100',
    },
    {
      title: 'Activos',
      value: stats?.activos || 0,
      icon: UserCheck,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Inactivos',
      value: stats?.inactivos || 0,
      icon: UserX,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Coste Mensual',
      value: formatCurrency(stats?.costeMensualTotal || 0),
      icon: DollarSign,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-slate-900">Empleados</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Gestión del equipo y costes de personal
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-slate-900 hover:bg-slate-800 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo empleado
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card
            key={stat.title}
            className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm bg-white">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar por nombre, email o puesto..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 border-slate-200"
                />
              </div>
            </div>
            <Select value={departamentoFilter} onValueChange={setDepartamentoFilter}>
              <SelectTrigger className="w-[180px] border-slate-200">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {departamentos?.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={areaFilter} onValueChange={setAreaFilter}>
              <SelectTrigger className="w-[180px] border-slate-200">
                <SelectValue placeholder="Área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {areas?.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={activoFilter} onValueChange={setActivoFilter}>
              <SelectTrigger className="w-[140px] border-slate-200">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="true">Activos</SelectItem>
                <SelectItem value="false">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-sm bg-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="text-slate-500 font-medium">Nombre</TableHead>
                <TableHead className="text-slate-500 font-medium">Puesto</TableHead>
                <TableHead className="text-slate-500 font-medium">Departamento</TableHead>
                <TableHead className="text-slate-500 font-medium">Contrato</TableHead>
                <TableHead className="text-slate-500 font-medium text-right">
                  Coste/Mes
                </TableHead>
                <TableHead className="text-slate-500 font-medium">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-slate-300 border-t-slate-600 mx-auto" />
                  </TableCell>
                </TableRow>
              ) : empleados?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    No se encontraron empleados
                  </TableCell>
                </TableRow>
              ) : (
                empleados?.map((empleado) => (
                  <TableRow
                    key={empleado.id}
                    onClick={() => handleRowClick(empleado)}
                    className="cursor-pointer hover:bg-slate-50 border-slate-100"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-sm font-medium">
                          {empleado.nombre.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{empleado.nombre}</p>
                          <p className="text-sm text-slate-500">{empleado.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">{empleado.puesto || '-'}</TableCell>
                    <TableCell className="text-slate-600">
                      {empleado.departamento || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-slate-50 text-slate-600 border-slate-200"
                      >
                        {empleado.tipo_contrato || 'Sin definir'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium text-slate-900">
                      {formatCurrency(empleado.coste_total_mensual)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          empleado.activo
                            ? 'bg-emerald-50 text-emerald-700 border-0'
                            : 'bg-red-50 text-red-700 border-0'
                        }
                      >
                        {empleado.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Sheet */}
      <DetailSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        title={isCreating ? 'Nuevo empleado' : 'Editar empleado'}
        description={isCreating ? 'Añade un nuevo miembro al equipo' : undefined}
        onSave={handleSave}
        onDelete={!isCreating ? handleDelete : undefined}
        isSaving={createEmpleado.isPending || updateEmpleado.isPending}
        isDeleting={deleteEmpleado.isPending}
        size="lg"
      >
        <div className="space-y-6">
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-900 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Información personal
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Nombre completo</Label>
                <Input
                  value={formData.nombre || ''}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>NIF</Label>
                <Input
                  value={formData.nif || ''}
                  onChange={(e) => setFormData({ ...formData, nif: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Position */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-900 flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Puesto
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Puesto</Label>
                <Input
                  value={formData.puesto || ''}
                  onChange={(e) => setFormData({ ...formData, puesto: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Departamento</Label>
                <Input
                  value={formData.departamento || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, departamento: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Área</Label>
                <Input
                  value={formData.area || ''}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Oficina</Label>
                <Input
                  value={formData.oficina || ''}
                  onChange={(e) => setFormData({ ...formData, oficina: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Contract */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-900 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Contrato
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo de contrato</Label>
                <Select
                  value={formData.tipo_contrato || ''}
                  onValueChange={(v) => setFormData({ ...formData, tipo_contrato: v })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Indefinido">Indefinido</SelectItem>
                    <SelectItem value="Temporal">Temporal</SelectItem>
                    <SelectItem value="Prácticas">Prácticas</SelectItem>
                    <SelectItem value="Formación">Formación</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Estado</Label>
                <Select
                  value={formData.activo ? 'true' : 'false'}
                  onValueChange={(v) => setFormData({ ...formData, activo: v === 'true' })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Activo</SelectItem>
                    <SelectItem value="false">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Fecha de alta</Label>
                <Input
                  type="date"
                  value={formData.fecha_alta || ''}
                  onChange={(e) => setFormData({ ...formData, fecha_alta: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Fecha de baja</Label>
                <Input
                  type="date"
                  value={formData.fecha_baja || ''}
                  onChange={(e) => setFormData({ ...formData, fecha_baja: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Salary */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-900 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Retribución
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Salario base (anual)</Label>
                <Input
                  type="number"
                  value={formData.salario_base || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, salario_base: Number(e.target.value) })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Variable</Label>
                <Input
                  type="number"
                  value={formData.variable || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, variable: Number(e.target.value) })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Bonus</Label>
                <Input
                  type="number"
                  value={formData.bonus || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, bonus: Number(e.target.value) })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Coste Seg. Social</Label>
                <Input
                  type="number"
                  value={formData.coste_seg_social || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, coste_seg_social: Number(e.target.value) })
                  }
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notas</Label>
            <Textarea
              value={formData.notas || ''}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              rows={3}
            />
          </div>
        </div>
      </DetailSheet>
    </div>
  );
}
