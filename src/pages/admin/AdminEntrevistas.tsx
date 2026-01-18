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
  useEntrevistas,
  useEntrevistaStats,
  useUpdateEntrevista,
  useDeleteEntrevista,
  Entrevista,
} from '@/hooks/useEntrevistas';
import {
  Calendar,
  Clock,
  Users,
  Star,
  Video,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ESTADOS = [
  { value: 'programada', label: 'Programada', color: 'bg-blue-50 text-blue-700' },
  { value: 'completada', label: 'Completada', color: 'bg-emerald-50 text-emerald-700' },
  { value: 'cancelada', label: 'Cancelada', color: 'bg-red-50 text-red-700' },
  { value: 'no_show', label: 'No Show', color: 'bg-amber-50 text-amber-700' },
];

const TIPOS = [
  { value: 'telefonica', label: 'Telefónica' },
  { value: 'videollamada', label: 'Videollamada' },
  { value: 'presencial', label: 'Presencial' },
  { value: 'tecnica', label: 'Técnica' },
  { value: 'final', label: 'Final' },
];

export default function AdminEntrevistas() {
  const [estadoFilter, setEstadoFilter] = useState<string>('');
  const [tipoFilter, setTipoFilter] = useState<string>('');

  const [selectedEntrevista, setSelectedEntrevista] = useState<Entrevista | null>(
    null
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Entrevista>>({});

  const filters = {
    estado: estadoFilter || undefined,
    tipo: tipoFilter || undefined,
  };

  const { data: entrevistas, isLoading } = useEntrevistas(filters);
  const { data: stats } = useEntrevistaStats();

  const updateEntrevista = useUpdateEntrevista();
  const deleteEntrevista = useDeleteEntrevista();

  const handleRowClick = (entrevista: Entrevista) => {
    setSelectedEntrevista(entrevista);
    setFormData(entrevista);
    setIsSheetOpen(true);
  };

  const handleSave = () => {
    if (selectedEntrevista) {
      updateEntrevista.mutate(
        { id: selectedEntrevista.id, data: formData },
        { onSuccess: () => setIsSheetOpen(false) }
      );
    }
  };

  const handleDelete = () => {
    if (selectedEntrevista) {
      deleteEntrevista.mutate(selectedEntrevista.id, {
        onSuccess: () => setIsSheetOpen(false),
      });
    }
  };

  const getEstadoBadge = (estado: string | null) => {
    const estadoConfig = ESTADOS.find((e) => e.value === estado);
    return (
      <Badge className={`${estadoConfig?.color || 'bg-slate-100 text-slate-600'} border-0`}>
        {estadoConfig?.label || estado || 'Sin estado'}
      </Badge>
    );
  };

  const statCards = [
    {
      title: 'Esta Semana',
      value: stats?.estaSemana || 0,
      icon: Calendar,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Pendientes',
      value: stats?.pendientes || 0,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Completadas',
      value: stats?.completadas || 0,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Puntuación Media',
      value: stats?.promedioPuntuacion || '-',
      icon: Star,
      color: 'text-slate-600',
      bgColor: 'bg-slate-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium text-slate-900">Entrevistas</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Seguimiento de procesos de selección
        </p>
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
            <Select value={estadoFilter} onValueChange={setEstadoFilter}>
              <SelectTrigger className="w-[180px] border-slate-200">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los estados</SelectItem>
                {ESTADOS.map((e) => (
                  <SelectItem key={e.value} value={e.value}>
                    {e.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-[180px] border-slate-200">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los tipos</SelectItem>
                {TIPOS.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
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
                <TableHead className="text-slate-500 font-medium">
                  Fecha y Hora
                </TableHead>
                <TableHead className="text-slate-500 font-medium">Candidato</TableHead>
                <TableHead className="text-slate-500 font-medium">Puesto</TableHead>
                <TableHead className="text-slate-500 font-medium">Tipo</TableHead>
                <TableHead className="text-slate-500 font-medium">Ronda</TableHead>
                <TableHead className="text-slate-500 font-medium">Puntuación</TableHead>
                <TableHead className="text-slate-500 font-medium">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-slate-300 border-t-slate-600 mx-auto" />
                  </TableCell>
                </TableRow>
              ) : entrevistas?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                    No hay entrevistas programadas
                  </TableCell>
                </TableRow>
              ) : (
                entrevistas?.map((entrevista) => (
                  <TableRow
                    key={entrevista.id}
                    onClick={() => handleRowClick(entrevista)}
                    className="cursor-pointer hover:bg-slate-50 border-slate-100"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-900">
                            {format(new Date(entrevista.fecha_hora), 'dd MMM yyyy', {
                              locale: es,
                            })}
                          </p>
                          <p className="text-sm text-slate-500">
                            {format(new Date(entrevista.fecha_hora), 'HH:mm')}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-slate-900">
                        {entrevista.candidato?.nombre || 'Sin asignar'}
                      </p>
                      <p className="text-sm text-slate-500">
                        {entrevista.candidato?.email}
                      </p>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {entrevista.candidato?.puesto_solicitado || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        {entrevista.tipo === 'videollamada' ? (
                          <Video className="h-3.5 w-3.5" />
                        ) : entrevista.tipo === 'presencial' ? (
                          <MapPin className="h-3.5 w-3.5" />
                        ) : null}
                        <span className="capitalize">{entrevista.tipo || '-'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-slate-200">
                        Ronda {entrevista.ronda || 1}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {entrevista.puntuacion ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span className="font-medium text-slate-900">
                            {entrevista.puntuacion}
                          </span>
                          <span className="text-slate-400">/10</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>{getEstadoBadge(entrevista.estado)}</TableCell>
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
        title="Detalles de entrevista"
        description={selectedEntrevista?.candidato?.nombre}
        onSave={handleSave}
        onDelete={handleDelete}
        isSaving={updateEntrevista.isPending}
        isDeleting={deleteEntrevista.isPending}
        size="lg"
      >
        <div className="space-y-6">
          {/* Candidate Info */}
          {selectedEntrevista?.candidato && (
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
                  {selectedEntrevista.candidato.nombre.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-slate-900">
                    {selectedEntrevista.candidato.nombre}
                  </p>
                  <p className="text-sm text-slate-500">
                    {selectedEntrevista.candidato.puesto_solicitado}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Schedule Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-900 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Programación
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fecha y hora</Label>
                <Input
                  type="datetime-local"
                  value={formData.fecha_hora?.slice(0, 16) || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha_hora: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Duración (min)</Label>
                <Input
                  type="number"
                  value={formData.duracion_minutos || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duracion_minutos: Number(e.target.value),
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Tipo</Label>
                <Select
                  value={formData.tipo || ''}
                  onValueChange={(v) => setFormData({ ...formData, tipo: v })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Ronda</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.ronda || 1}
                  onChange={(e) =>
                    setFormData({ ...formData, ronda: Number(e.target.value) })
                  }
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Ubicación</Label>
              <Input
                value={formData.ubicacion || ''}
                onChange={(e) =>
                  setFormData({ ...formData, ubicacion: e.target.value })
                }
                className="mt-1"
                placeholder="Sala, dirección..."
              />
            </div>
            <div>
              <Label>URL de reunión</Label>
              <Input
                value={formData.meeting_url || ''}
                onChange={(e) =>
                  setFormData({ ...formData, meeting_url: e.target.value })
                }
                className="mt-1"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Estado */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-900">Estado</h3>
            <Select
              value={formData.estado || ''}
              onValueChange={(v) => setFormData({ ...formData, estado: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                {ESTADOS.map((e) => (
                  <SelectItem key={e.value} value={e.value}>
                    {e.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Evaluation */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-900 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Evaluación
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Puntuación (1-10)</Label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={formData.puntuacion || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, puntuacion: Number(e.target.value) })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Recomendación</Label>
                <Select
                  value={formData.recomendacion || ''}
                  onValueChange={(v) => setFormData({ ...formData, recomendacion: v })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contratar">
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="h-4 w-4 text-emerald-600" />
                        Contratar
                      </div>
                    </SelectItem>
                    <SelectItem value="siguiente_ronda">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        Siguiente ronda
                      </div>
                    </SelectItem>
                    <SelectItem value="reserva">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        Reserva
                      </div>
                    </SelectItem>
                    <SelectItem value="descartar">
                      <div className="flex items-center gap-2">
                        <ThumbsDown className="h-4 w-4 text-red-600" />
                        Descartar
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Notas de evaluación</Label>
              <Textarea
                value={formData.notas_evaluacion || ''}
                onChange={(e) =>
                  setFormData({ ...formData, notas_evaluacion: e.target.value })
                }
                rows={4}
                className="mt-1"
                placeholder="Observaciones, puntos fuertes, áreas de mejora..."
              />
            </div>
          </div>
        </div>
      </DetailSheet>
    </div>
  );
}
