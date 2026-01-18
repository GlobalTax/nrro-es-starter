import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { EmpleadosTable } from '@/components/admin/empleados/EmpleadosTable';
import { EmpleadoDetailSheet } from '@/components/admin/empleados/EmpleadoDetailSheet';
import {
  useEmpleados,
  useEmpleadoStats,
  useEmpleadoDepartamentos,
  useEmpleadoAreas,
  useEmpleadoOficinas,
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
  Download,
} from 'lucide-react';
import Papa from 'papaparse';
import { toast } from 'sonner';

export default function AdminEmpleados() {
  const [search, setSearch] = useState('');
  const [departamentoFilter, setDepartamentoFilter] = useState<string>('');
  const [areaFilter, setAreaFilter] = useState<string>('');
  const [oficinaFilter, setOficinaFilter] = useState<string>('');
  const [activoFilter, setActivoFilter] = useState<string>('');

  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [empleadoToDelete, setEmpleadoToDelete] = useState<Empleado | null>(null);
  const [empleadoToToggle, setEmpleadoToToggle] = useState<Empleado | null>(null);

  const filters = {
    search: search || undefined,
    departamento: departamentoFilter || undefined,
    area: areaFilter || undefined,
    oficina: oficinaFilter || undefined,
    activo: activoFilter === '' ? undefined : activoFilter === 'true',
  };

  const { data: empleados, isLoading } = useEmpleados(filters);
  const { data: stats } = useEmpleadoStats();
  const { data: departamentos } = useEmpleadoDepartamentos();
  const { data: areas } = useEmpleadoAreas();
  const { data: oficinas } = useEmpleadoOficinas();

  const updateEmpleado = useUpdateEmpleado();
  const createEmpleado = useCreateEmpleado();
  const deleteEmpleado = useDeleteEmpleado();

  const handleView = (empleado: Empleado) => {
    setSelectedEmpleado(empleado);
    setIsCreating(false);
    setIsSheetOpen(true);
  };

  const handleEdit = (empleado: Empleado) => {
    setSelectedEmpleado(empleado);
    setIsCreating(false);
    setIsSheetOpen(true);
  };

  const handleCreate = () => {
    setSelectedEmpleado(null);
    setIsCreating(true);
    setIsSheetOpen(true);
  };

  const handleSave = (data: Partial<Empleado>) => {
    if (isCreating) {
      createEmpleado.mutate(data, {
        onSuccess: () => setIsSheetOpen(false),
      });
    } else if (selectedEmpleado) {
      updateEmpleado.mutate(
        { id: selectedEmpleado.id, data },
        { onSuccess: () => setIsSheetOpen(false) }
      );
    }
  };

  const handleDelete = () => {
    if (empleadoToDelete) {
      deleteEmpleado.mutate(empleadoToDelete.id, {
        onSuccess: () => {
          setEmpleadoToDelete(null);
          setIsSheetOpen(false);
        },
      });
    }
  };

  const handleToggleActive = () => {
    if (empleadoToToggle) {
      updateEmpleado.mutate(
        {
          id: empleadoToToggle.id,
          data: { activo: !empleadoToToggle.activo },
        },
        {
          onSuccess: () => {
            setEmpleadoToToggle(null);
            toast.success(
              empleadoToToggle.activo ? 'Empleado dado de baja' : 'Empleado reactivado'
            );
          },
        }
      );
    }
  };

  const handleUploadContrato = (empleado: Empleado) => {
    // Open sheet in contract tab
    setSelectedEmpleado(empleado);
    setIsCreating(false);
    setIsSheetOpen(true);
  };

  const handleViewNominas = (empleado: Empleado) => {
    // Open sheet in nominas tab
    setSelectedEmpleado(empleado);
    setIsCreating(false);
    setIsSheetOpen(true);
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return '-';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const exportToCSV = () => {
    if (!empleados || empleados.length === 0) {
      toast.error('No hay empleados para exportar');
      return;
    }

    const csvData = empleados.map((e) => ({
      Nombre: e.nombre,
      Email: e.email || '',
      Puesto: e.puesto || '',
      Departamento: e.departamento || '',
      Area: e.area || '',
      Oficina: e.oficina || '',
      Estado: e.activo ? 'Activo' : 'Inactivo',
      'Tipo Contrato': e.tipo_contrato || '',
      'Fecha Alta': e.fecha_alta || '',
      'Fecha Baja': e.fecha_baja || '',
      'Salario Base': e.salario_base || 0,
      Variable: e.variable || 0,
      Bonus: e.bonus || 0,
      'Coste Seg. Social': e.coste_seg_social || 0,
      'Coste Mensual': e.coste_total_mensual || 0,
      'Coste Anual': e.coste_total_anual || 0,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `empleados_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('Exportación completada');
  };

  const statCards = [
    {
      title: 'Total',
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
          <h1 className="text-2xl font-semibold text-slate-900">Empleados</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Gestión del equipo y costes de personal
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportToCSV}>CSV</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleCreate} className="bg-slate-900 hover:bg-slate-800 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo empleado
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card
            key={stat.title}
            className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow"
          >
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.title}</p>
                  <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm bg-white">
        <CardContent className="pt-4">
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por nombre, email o puesto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 border-slate-200"
              />
            </div>
            <Select value={departamentoFilter} onValueChange={setDepartamentoFilter}>
              <SelectTrigger className="border-slate-200">
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
              <SelectTrigger className="border-slate-200">
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
            <Select value={oficinaFilter} onValueChange={setOficinaFilter}>
              <SelectTrigger className="border-slate-200">
                <SelectValue placeholder="Oficina" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {oficinas?.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={activoFilter} onValueChange={setActivoFilter}>
              <SelectTrigger className="border-slate-200">
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
      <Card className="border-0 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0">
          <EmpleadosTable
            empleados={empleados}
            isLoading={isLoading}
            onView={handleView}
            onEdit={handleEdit}
            onUploadContrato={handleUploadContrato}
            onViewNominas={handleViewNominas}
            onToggleActive={(e) => setEmpleadoToToggle(e)}
            onDelete={(e) => setEmpleadoToDelete(e)}
          />
        </CardContent>
      </Card>

      {/* Detail Sheet */}
      <EmpleadoDetailSheet
        empleado={selectedEmpleado}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onSave={handleSave}
        onDelete={() => {
          if (selectedEmpleado) {
            setEmpleadoToDelete(selectedEmpleado);
          }
        }}
        isCreating={isCreating}
        isSaving={createEmpleado.isPending || updateEmpleado.isPending}
        isDeleting={deleteEmpleado.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!empleadoToDelete} onOpenChange={() => setEmpleadoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar empleado?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el registro de{' '}
              <strong>{empleadoToDelete?.nombre}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Toggle Active Confirmation Dialog */}
      <AlertDialog open={!!empleadoToToggle} onOpenChange={() => setEmpleadoToToggle(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {empleadoToToggle?.activo ? '¿Dar de baja?' : '¿Reactivar empleado?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {empleadoToToggle?.activo
                ? `Se marcará a ${empleadoToToggle?.nombre} como inactivo. Podrás reactivarlo en cualquier momento.`
                : `Se reactivará a ${empleadoToToggle?.nombre} como empleado activo.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleActive}>
              {empleadoToToggle?.activo ? 'Dar de baja' : 'Reactivar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
