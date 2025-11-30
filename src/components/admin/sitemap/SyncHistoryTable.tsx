import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { History, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useSyncHistory, SyncHistoryLog } from "@/hooks/useSyncHistory";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusConfig = {
  running: {
    icon: Loader2,
    label: 'En proceso',
    color: 'text-blue-600',
    variant: 'default' as const,
  },
  completed: {
    icon: CheckCircle2,
    label: 'Completado',
    color: 'text-green-600',
    variant: 'default' as const,
  },
  failed: {
    icon: XCircle,
    label: 'Fallido',
    color: 'text-red-600',
    variant: 'destructive' as const,
  },
};

export const SyncHistoryTable = () => {
  const { data: history, isLoading } = useSyncHistory(10);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historial de Sincronizaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!history || history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historial de Sincronizaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">No hay sincronizaciones previas</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Historial de Sincronizaciones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Nuevas</TableHead>
              <TableHead className="text-right">Actualizadas</TableHead>
              <TableHead className="text-right">Archivadas</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((log: SyncHistoryLog) => {
              const config = statusConfig[log.status as keyof typeof statusConfig];
              const Icon = config.icon;

              return (
                <TableRow key={log.id}>
                  <TableCell>
                    <Badge variant={config.variant} className="gap-1">
                      <Icon className={`h-3 w-3 ${config.color} ${log.status === 'running' ? 'animate-spin' : ''}`} />
                      {config.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDistanceToNow(new Date(log.started_at), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(log.started_at).toLocaleString('es-ES')}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-medium text-green-600">
                      +{log.pages_added}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-medium text-blue-600">
                      {log.pages_updated}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-medium text-orange-600">
                      {log.pages_archived}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold">{log.pages_total}</span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};