import React, { useState } from 'react';
import { Shield, Search, Filter, AlertTriangle, Clock, CheckCircle, Archive, Eye, MessageSquare, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { 
  useWhistleblowerReports, 
  useWhistleblowerReport, 
  useWhistleblowerStats,
  useUpdateWhistleblowerReport,
  useAddWhistleblowerMessage,
  WhistleblowerReport 
} from '@/hooks/useWhistleblower';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { AdminPageHeader } from '@/components/admin/ui/AdminComponents';

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  nuevo: { label: 'Nuevo', color: 'bg-blue-100 text-blue-800', icon: AlertTriangle },
  en_revision: { label: 'En Revisión', color: 'bg-yellow-100 text-yellow-800', icon: Eye },
  investigando: { label: 'Investigando', color: 'bg-purple-100 text-purple-800', icon: Search },
  resuelto: { label: 'Resuelto', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  archivado: { label: 'Archivado', color: 'bg-gray-100 text-gray-800', icon: Archive },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  baja: { label: 'Baja', color: 'bg-gray-100 text-gray-700' },
  media: { label: 'Media', color: 'bg-blue-100 text-blue-700' },
  alta: { label: 'Alta', color: 'bg-orange-100 text-orange-700' },
  critica: { label: 'Crítica', color: 'bg-red-100 text-red-700' },
};

const categoryLabels: Record<string, string> = {
  fraude: 'Fraude',
  acoso: 'Acoso',
  corrupcion: 'Corrupción',
  conflicto_intereses: 'Conflicto de intereses',
  proteccion_datos: 'Protección de datos',
  medioambiente: 'Medioambiente',
  seguridad_laboral: 'Seguridad laboral',
  otro: 'Otro',
};

export default function AdminWhistleblower() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    priority: 'all',
    search: '',
  });
  const [newMessage, setNewMessage] = useState('');
  const [messageVisibleToReporter, setMessageVisibleToReporter] = useState(true);

  const { data: reports, isLoading } = useWhistleblowerReports(filters);
  const { data: reportData } = useWhistleblowerReport(selectedId);
  const { data: stats } = useWhistleblowerStats();
  const updateMutation = useUpdateWhistleblowerReport();
  const addMessageMutation = useAddWhistleblowerMessage();

  const handleUpdateReport = (updates: Partial<WhistleblowerReport>) => {
    if (!selectedId) return;
    updateMutation.mutate({ id: selectedId, updates });
  };

  const handleAddMessage = () => {
    if (!selectedId || !newMessage.trim()) {
      toast.error('Escriba un mensaje');
      return;
    }

    addMessageMutation.mutate({
      report_id: selectedId,
      message: newMessage.trim(),
      is_visible_to_reporter: messageVisibleToReporter,
    }, {
      onSuccess: () => {
        setNewMessage('');
      },
    });
  };

  const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: number; icon: React.ElementType; color: string }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Canal de Denuncias"
        description="Gestión de denuncias internas - Ley 2/2023"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard title="Total" value={stats?.total ?? 0} icon={Shield} color="bg-primary/10 text-primary" />
        <StatCard title="Nuevos" value={stats?.nuevo ?? 0} icon={AlertTriangle} color="bg-blue-100 text-blue-600" />
        <StatCard title="En Revisión" value={stats?.en_revision ?? 0} icon={Eye} color="bg-yellow-100 text-yellow-600" />
        <StatCard title="Investigando" value={stats?.investigando ?? 0} icon={Search} color="bg-purple-100 text-purple-600" />
        <StatCard title="Resueltos" value={stats?.resuelto ?? 0} icon={CheckCircle} color="bg-green-100 text-green-600" />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por código o descripción..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full"
              />
            </div>
            <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {Object.entries(statusConfig).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.category} onValueChange={(v) => setFilters({ ...filters, category: v })}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.priority} onValueChange={(v) => setFilters({ ...filters, priority: v })}>
              <SelectTrigger className="w-full md:w-[140px]">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {Object.entries(priorityConfig).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">Código</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Anónimo</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Cargando...
                  </TableCell>
                </TableRow>
              ) : reports?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No se encontraron denuncias
                  </TableCell>
                </TableRow>
              ) : (
                reports?.map((report) => (
                  <TableRow key={report.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedId(report.id)}>
                    <TableCell className="font-mono font-medium">{report.tracking_code}</TableCell>
                    <TableCell>{categoryLabels[report.category] || report.category}</TableCell>
                    <TableCell>
                      <Badge className={statusConfig[report.status]?.color || 'bg-gray-100'}>
                        {statusConfig[report.status]?.label || report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={priorityConfig[report.priority]?.color || ''}>
                        {priorityConfig[report.priority]?.label || report.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{report.is_anonymous ? 'Sí' : 'No'}</TableCell>
                    <TableCell>{format(new Date(report.created_at), 'dd/MM/yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedId(report.id); }}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Sheet */}
      <Sheet open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {reportData && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {reportData.report.tracking_code}
                </SheetTitle>
                <SheetDescription>
                  {categoryLabels[reportData.report.category] || reportData.report.category} • 
                  {format(new Date(reportData.report.created_at), " d 'de' MMMM 'de' yyyy", { locale: es })}
                </SheetDescription>
              </SheetHeader>

              <Tabs defaultValue="details" className="mt-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Detalles</TabsTrigger>
                  <TabsTrigger value="messages">Mensajes</TabsTrigger>
                  <TabsTrigger value="resolution">Resolución</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Estado</label>
                      <Select
                        value={reportData.report.status}
                        onValueChange={(v) => handleUpdateReport({ status: v as any })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(statusConfig).map(([key, { label }]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Prioridad</label>
                      <Select
                        value={reportData.report.priority}
                        onValueChange={(v) => handleUpdateReport({ priority: v as any })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(priorityConfig).map(([key, { label }]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <label className="text-sm font-medium">Descripción de los hechos</label>
                    <div className="mt-2 p-4 bg-muted rounded-lg text-sm whitespace-pre-wrap">
                      {reportData.report.description}
                    </div>
                  </div>

                  {reportData.report.date_of_incident && (
                    <div>
                      <label className="text-sm font-medium">Fecha del incidente</label>
                      <p className="text-sm mt-1">{format(new Date(reportData.report.date_of_incident), 'd MMMM yyyy', { locale: es })}</p>
                    </div>
                  )}

                  {reportData.report.location && (
                    <div>
                      <label className="text-sm font-medium">Lugar</label>
                      <p className="text-sm mt-1">{reportData.report.location}</p>
                    </div>
                  )}

                  {reportData.report.persons_involved && (
                    <div>
                      <label className="text-sm font-medium">Personas implicadas</label>
                      <p className="text-sm mt-1">{reportData.report.persons_involved}</p>
                    </div>
                  )}

                  <Separator />

                  <div>
                    <label className="text-sm font-medium">Notas internas</label>
                    <Textarea
                      className="mt-2"
                      placeholder="Añadir notas internas (solo visibles para administradores)..."
                      value={reportData.report.internal_notes || ''}
                      onChange={(e) => handleUpdateReport({ internal_notes: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Anónimo:</span>
                    <Badge variant="outline">{reportData.report.is_anonymous ? 'Sí' : 'No'}</Badge>
                    {!reportData.report.is_anonymous && reportData.report.contact_email && (
                      <>
                        <span className="mx-2">•</span>
                        <span>Email: {reportData.report.contact_email}</span>
                      </>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="messages" className="space-y-4 mt-4">
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {reportData.messages.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No hay mensajes</p>
                    ) : (
                      reportData.messages.map((msg) => (
                        <div key={msg.id} className={`p-3 rounded-lg ${msg.sender_type === 'admin' ? 'bg-primary/10 ml-4' : 'bg-muted mr-4'}`}>
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>{msg.sender_type === 'admin' ? 'Admin' : 'Denunciante'}</span>
                            <span>{format(new Date(msg.created_at), 'dd/MM/yyyy HH:mm')}</span>
                          </div>
                          <p className="text-sm">{msg.message}</p>
                          {msg.sender_type === 'admin' && (
                            <Badge variant="outline" className="mt-2 text-xs">
                              {msg.is_visible_to_reporter ? 'Visible para denunciante' : 'Solo interno'}
                            </Badge>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Textarea
                      placeholder="Escribir mensaje..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={messageVisibleToReporter}
                          onCheckedChange={(c) => setMessageVisibleToReporter(!!c)}
                        />
                        Visible para el denunciante
                      </label>
                      <Button onClick={handleAddMessage} disabled={addMessageMutation.isPending}>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Enviar
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="resolution" className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium">Resolución del caso</label>
                    <Textarea
                      className="mt-2 min-h-[150px]"
                      placeholder="Describa la resolución del caso..."
                      value={reportData.report.resolution || ''}
                      onChange={(e) => handleUpdateReport({ resolution: e.target.value })}
                    />
                  </div>

                  {reportData.report.resolved_at && (
                    <p className="text-sm text-muted-foreground">
                      Resuelto el {format(new Date(reportData.report.resolved_at), "d 'de' MMMM 'de' yyyy", { locale: es })}
                    </p>
                  )}

                  <Button
                    onClick={() => handleUpdateReport({ status: 'resuelto' })}
                    disabled={reportData.report.status === 'resuelto'}
                    className="w-full"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Marcar como Resuelto
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleUpdateReport({ status: 'archivado' })}
                    disabled={reportData.report.status === 'archivado'}
                    className="w-full"
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    Archivar Caso
                  </Button>
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
