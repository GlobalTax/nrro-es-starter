import { useState, useMemo } from 'react';
import { 
  Bell, 
  Search, 
  CheckCheck, 
  Trash2, 
  ExternalLink,
  Info,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Clock,
  Filter
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import {
  useNotifications,
  useNotificationStats,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
  useBulkDeleteNotifications,
  useDeleteExpiredNotifications,
} from '@/hooks/useNotifications';

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  info: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50' },
  success: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  warning: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
  error: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
};

export default function AdminNotifications() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [readFilter, setReadFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: notifications, isLoading } = useNotifications({
    type: typeFilter !== 'all' ? typeFilter : undefined,
    read: readFilter === 'all' ? null : readFilter === 'read',
    search: searchQuery || undefined,
  });

  const { data: stats } = useNotificationStats();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const deleteNotification = useDeleteNotification();
  const bulkDelete = useBulkDeleteNotifications();
  const deleteExpired = useDeleteExpiredNotifications();

  const filteredNotifications = useMemo(() => {
    if (!notifications) return [];
    return notifications;
  }, [notifications]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredNotifications.map(n => n.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(i => i !== id));
    }
  };

  const handleBulkDelete = () => {
    bulkDelete.mutate(selectedIds);
    setSelectedIds([]);
    setDeleteDialogOpen(false);
  };

  const getTypeConfig = (type: string) => {
    return typeConfig[type] || typeConfig.info;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium text-slate-900">Notificaciones</h1>
          <p className="text-slate-500 text-sm mt-1">
            Gestiona las alertas y notificaciones del sistema
          </p>
        </div>
        <div className="flex gap-2">
          {(stats?.expired || 0) > 0 && (
            <Button
              variant="outline"
              onClick={() => deleteExpired.mutate()}
              disabled={deleteExpired.isPending}
              className="border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <Clock className="h-4 w-4 mr-2" />
              Limpiar expiradas ({stats?.expired})
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => markAllAsRead.mutate()}
            disabled={markAllAsRead.isPending || (stats?.unread || 0) === 0}
            className="border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Marcar todas leídas
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium text-slate-900">{stats?.total || 0}</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Sin leer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-medium text-blue-600">{stats?.unread || 0}</div>
              {(stats?.unread || 0) > 0 && (
                <div className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Esta semana</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium text-slate-900">{stats?.thisWeek || 0}</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Expiradas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium text-amber-600">{stats?.expired || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <span className="text-sm font-medium text-indigo-900">
            {selectedIds.length} seleccionadas
          </span>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
            className="bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar seleccionadas
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSelectedIds([])}
            className="text-slate-600"
          >
            Cancelar
          </Button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Buscar notificaciones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 border-slate-200 focus:border-slate-300 focus:ring-slate-200"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px] border-slate-200">
            <Filter className="h-4 w-4 mr-2 text-slate-400" />
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="success">Éxito</SelectItem>
            <SelectItem value="warning">Aviso</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
        <Select value={readFilter} onValueChange={setReadFilter}>
          <SelectTrigger className="w-[150px] border-slate-200">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="unread">Sin leer</SelectItem>
            <SelectItem value="read">Leídos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="border-0 shadow-sm bg-white">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full bg-slate-100" />
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="p-4 bg-slate-100 rounded-full mb-4">
                <Bell className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">No hay notificaciones</h3>
              <p className="text-slate-500 text-sm mt-1">
                Las alertas del sistema aparecerán aquí
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 border-b border-slate-100">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedIds.length === filteredNotifications.length && filteredNotifications.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-12">Estado</TableHead>
                  <TableHead className="w-24">Tipo</TableHead>
                  <TableHead>Contenido</TableHead>
                  <TableHead className="w-32">Categoría</TableHead>
                  <TableHead className="w-32">Fecha</TableHead>
                  <TableHead className="w-24">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.map((notification) => {
                  const config = getTypeConfig(notification.type);
                  const TypeIcon = config.icon;
                  return (
                    <TableRow
                      key={notification.id}
                      className={`border-b border-slate-50 ${!notification.read ? 'bg-blue-50/30' : ''}`}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(notification.id)}
                          onCheckedChange={(checked) => handleSelectOne(notification.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div
                          className={`h-2.5 w-2.5 rounded-full ${
                            notification.read ? 'bg-slate-300' : 'bg-blue-500'
                          }`}
                        />
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${config.bg} ${config.color} border-0 gap-1`}
                        >
                          <TypeIcon className="h-3 w-3" />
                          {notification.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium text-slate-900 text-sm">
                            {notification.title}
                          </p>
                          <p className="text-slate-500 text-xs line-clamp-1">
                            {notification.message}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {notification.category && (
                          <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                            {notification.category}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-slate-500" title={format(new Date(notification.created_at), 'dd/MM/yyyy HH:mm')}>
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: es })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-400 hover:text-emerald-600"
                              onClick={() => markAsRead.mutate(notification.id)}
                              title="Marcar como leída"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          {notification.action_url && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-400 hover:text-indigo-600"
                              onClick={() => window.open(notification.action_url!, '_blank')}
                              title="Abrir enlace"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-red-600"
                            onClick={() => deleteNotification.mutate(notification.id)}
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar notificaciones?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de eliminar {selectedIds.length} notificaciones. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
