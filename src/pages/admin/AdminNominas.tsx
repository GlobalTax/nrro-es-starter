import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  useCierresNomina,
  useNominaStats,
  useNominaAnios,
  useUpdateCierreNomina,
  useComparativasNomina,
  CierreNomina,
} from '@/hooks/useNominas';
import {
  Receipt,
  Calendar,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  AlertTriangle,
  DollarSign,
  Download,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const MESES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const ESTADOS_CIERRE = [
  { value: 'pendiente', label: 'Pendiente', color: 'bg-amber-50 text-amber-700' },
  { value: 'en_proceso', label: 'En proceso', color: 'bg-blue-50 text-blue-700' },
  { value: 'cerrado', label: 'Cerrado', color: 'bg-emerald-50 text-emerald-700' },
];

export default function AdminNominas() {
  const currentYear = new Date().getFullYear();
  const [selectedAnio, setSelectedAnio] = useState<number>(currentYear);
  const [selectedCierre, setSelectedCierre] = useState<CierreNomina | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<CierreNomina>>({});

  const { data: cierres, isLoading } = useCierresNomina(selectedAnio);
  const { data: stats } = useNominaStats(selectedAnio);
  const { data: aniosDisponibles } = useNominaAnios();
  const { data: comparativas } = useComparativasNomina(selectedCierre?.id || null);

  const updateCierre = useUpdateCierreNomina();

  const handleRowClick = (cierre: CierreNomina) => {
    setSelectedCierre(cierre);
    setFormData(cierre);
    setIsSheetOpen(true);
  };

  const handleSave = () => {
    if (selectedCierre) {
      updateCierre.mutate(
        { id: selectedCierre.id, data: formData },
        { onSuccess: () => setIsSheetOpen(false) }
      );
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

  const getEstadoBadge = (estado: string | null) => {
    const estadoConfig = ESTADOS_CIERRE.find((e) => e.value === estado);
    return (
      <Badge className={`${estadoConfig?.color || 'bg-slate-100 text-slate-600'} border-0`}>
        {estadoConfig?.label || estado || 'Sin estado'}
      </Badge>
    );
  };

  const getDesviacionIcon = (desviacion: number | null) => {
    if (!desviacion) return null;
    if (desviacion > 0) {
      return <TrendingUp className="h-4 w-4 text-red-500" />;
    } else if (desviacion < 0) {
      return <TrendingDown className="h-4 w-4 text-emerald-500" />;
    }
    return null;
  };

  const statCards = [
    {
      title: 'Coste Total Año',
      value: formatCurrency(stats?.totalCosteEmpresa || 0),
      icon: DollarSign,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Meses Cerrados',
      value: `${stats?.mesesCerrados || 0}/12`,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Meses Pendientes',
      value: stats?.mesesPendientes || 0,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Desviación Total',
      value: formatCurrency(stats?.desviacionTotal || 0),
      icon: AlertTriangle,
      color: 'text-slate-600',
      bgColor: 'bg-slate-100',
    },
  ];

  // Generate all 12 months if cierres don't exist
  const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);
  const cierresPorMes = allMonths.map((mes) => {
    const cierre = cierres?.find((c) => c.mes === mes);
    return (
      cierre || {
        id: `pending-${mes}`,
        mes,
        anio: selectedAnio,
        estado: 'pendiente',
        total_previsto: null,
        total_real: null,
        desviacion: null,
        observaciones: null,
      }
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-slate-900">Nóminas</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Control de cierres mensuales y comparativas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={selectedAnio.toString()}
            onValueChange={(v) => setSelectedAnio(Number(v))}
          >
            <SelectTrigger className="w-[120px] border-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(aniosDisponibles || [currentYear, currentYear - 1]).map((anio) => (
                <SelectItem key={anio} value={anio.toString()}>
                  {anio}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-slate-200">
            <Download className="h-4 w-4 mr-2" />
            Exportar
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

      {/* Monthly Table */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-base font-medium text-slate-900">
            Cierres Mensuales {selectedAnio}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="text-slate-500 font-medium">Mes</TableHead>
                <TableHead className="text-slate-500 font-medium">Estado</TableHead>
                <TableHead className="text-slate-500 font-medium text-right">
                  Previsto
                </TableHead>
                <TableHead className="text-slate-500 font-medium text-right">
                  Real
                </TableHead>
                <TableHead className="text-slate-500 font-medium text-right">
                  Desviación
                </TableHead>
                <TableHead className="text-slate-500 font-medium">
                  Fecha Cierre
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-slate-300 border-t-slate-600 mx-auto" />
                  </TableCell>
                </TableRow>
              ) : (
                cierresPorMes.map((cierre) => (
                  <TableRow
                    key={cierre.id}
                    onClick={() =>
                      !cierre.id.startsWith('pending') && handleRowClick(cierre as CierreNomina)
                    }
                    className={`border-slate-100 ${
                      cierre.id.startsWith('pending')
                        ? 'opacity-60'
                        : 'cursor-pointer hover:bg-slate-50'
                    }`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-slate-900">
                          {MESES[cierre.mes - 1]}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getEstadoBadge(cierre.estado)}</TableCell>
                    <TableCell className="text-right text-slate-600">
                      {formatCurrency(cierre.total_previsto)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-slate-900">
                      {formatCurrency(cierre.total_real)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {getDesviacionIcon(cierre.desviacion)}
                        <span
                          className={
                            cierre.desviacion && cierre.desviacion > 0
                              ? 'text-red-600 font-medium'
                              : cierre.desviacion && cierre.desviacion < 0
                              ? 'text-emerald-600 font-medium'
                              : 'text-slate-600'
                          }
                        >
                          {cierre.desviacion
                            ? `${cierre.desviacion > 0 ? '+' : ''}${formatCurrency(
                                cierre.desviacion
                              )}`
                            : '-'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {(cierre as CierreNomina).fecha_cierre
                        ? format(
                            new Date((cierre as CierreNomina).fecha_cierre!),
                            'dd/MM/yyyy'
                          )
                        : '-'}
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
        title={`Cierre ${MESES[(selectedCierre?.mes || 1) - 1]} ${selectedCierre?.anio}`}
        onSave={handleSave}
        isSaving={updateCierre.isPending}
        size="xl"
      >
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg text-center">
              <p className="text-sm text-slate-500">Previsto</p>
              <p className="text-xl font-semibold text-slate-900 mt-1">
                {formatCurrency(selectedCierre?.total_previsto)}
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg text-center">
              <p className="text-sm text-slate-500">Real</p>
              <p className="text-xl font-semibold text-slate-900 mt-1">
                {formatCurrency(selectedCierre?.total_real)}
              </p>
            </div>
            <div
              className={`p-4 rounded-lg text-center ${
                selectedCierre?.desviacion && selectedCierre.desviacion > 0
                  ? 'bg-red-50'
                  : selectedCierre?.desviacion && selectedCierre.desviacion < 0
                  ? 'bg-emerald-50'
                  : 'bg-slate-50'
              }`}
            >
              <p className="text-sm text-slate-500">Desviación</p>
              <p
                className={`text-xl font-semibold mt-1 ${
                  selectedCierre?.desviacion && selectedCierre.desviacion > 0
                    ? 'text-red-700'
                    : selectedCierre?.desviacion && selectedCierre.desviacion < 0
                    ? 'text-emerald-700'
                    : 'text-slate-900'
                }`}
              >
                {selectedCierre?.desviacion
                  ? `${selectedCierre.desviacion > 0 ? '+' : ''}${formatCurrency(
                      selectedCierre.desviacion
                    )}`
                  : '-'}
              </p>
            </div>
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <Label>Estado del cierre</Label>
            <Select
              value={formData.estado || ''}
              onValueChange={(v) => setFormData({ ...formData, estado: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                {ESTADOS_CIERRE.map((e) => (
                  <SelectItem key={e.value} value={e.value}>
                    {e.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Observaciones */}
          <div className="space-y-2">
            <Label>Observaciones</Label>
            <Textarea
              value={formData.observaciones || ''}
              onChange={(e) =>
                setFormData({ ...formData, observaciones: e.target.value })
              }
              rows={4}
              placeholder="Notas sobre el cierre, incidencias..."
            />
          </div>

          {/* Comparativas por empleado */}
          {comparativas && comparativas.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-900">
                Comparativas por empleado
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableHead className="text-xs">Empleado</TableHead>
                      <TableHead className="text-xs text-right">Previsto</TableHead>
                      <TableHead className="text-xs text-right">Real</TableHead>
                      <TableHead className="text-xs text-right">Diferencia</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comparativas.map((comp: any) => (
                      <TableRow key={comp.id} className="border-slate-100">
                        <TableCell className="text-sm">
                          {comp.empleado?.nombre || 'N/A'}
                        </TableCell>
                        <TableCell className="text-sm text-right text-slate-600">
                          {formatCurrency(comp.coste_previsto)}
                        </TableCell>
                        <TableCell className="text-sm text-right font-medium">
                          {formatCurrency(comp.coste_real)}
                        </TableCell>
                        <TableCell
                          className={`text-sm text-right font-medium ${
                            comp.diferencia_coste > 0
                              ? 'text-red-600'
                              : comp.diferencia_coste < 0
                              ? 'text-emerald-600'
                              : ''
                          }`}
                        >
                          {comp.diferencia_coste
                            ? `${comp.diferencia_coste > 0 ? '+' : ''}${formatCurrency(
                                comp.diferencia_coste
                              )}`
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </DetailSheet>
    </div>
  );
}
