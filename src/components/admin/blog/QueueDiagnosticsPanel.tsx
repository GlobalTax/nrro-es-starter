import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Loader2, 
  RefreshCw, 
  Trash2, 
  XCircle,
  Activity,
  Zap
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  useBlogQueue,
  useQueueDiagnostics,
  useRetryQueueItem,
  useRetryAllFailed,
  useCleanupStuckItems,
  type BlogQueueItem,
} from "@/hooks/useBlogAutomation";

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  variant = "default" 
}: { 
  title: string; 
  value: number; 
  icon: React.ElementType;
  variant?: "default" | "success" | "warning" | "error";
}) {
  const variants = {
    default: "text-muted-foreground",
    success: "text-emerald-600",
    warning: "text-amber-600",
    error: "text-destructive",
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={`text-2xl font-bold ${variants[variant]}`}>{value}</p>
          </div>
          <Icon className={`h-8 w-8 ${variants[variant]} opacity-80`} />
        </div>
      </CardContent>
    </Card>
  );
}

function ErrorTooltip({ message }: { message: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help text-muted-foreground max-w-[200px] truncate block">
            {message.length > 40 ? `${message.slice(0, 40)}...` : message}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm">
          <p className="text-sm whitespace-pre-wrap">{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function QueueDiagnosticsPanel() {
  const { data: diagnostics, isLoading: diagnosticsLoading } = useQueueDiagnostics();
  const { data: queue, isLoading: queueLoading } = useBlogQueue();
  const retryItem = useRetryQueueItem();
  const retryAllFailed = useRetryAllFailed();
  const cleanupStuck = useCleanupStuckItems();

  // Filter items with problems (failed or has error message)
  const problemItems = queue?.filter(
    (i) => i.status === "failed" || i.error_message
  ) || [];

  const isLoading = diagnosticsLoading || queueLoading;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <StatCard
          title="Pendientes"
          value={diagnostics?.pending || 0}
          icon={Clock}
          variant="default"
        />
        <StatCard
          title="Generando"
          value={diagnostics?.generating || 0}
          icon={Zap}
          variant="warning"
        />
        <StatCard
          title="Completados"
          value={diagnostics?.completed || 0}
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          title="Fallidos"
          value={diagnostics?.failed || 0}
          icon={XCircle}
          variant="error"
        />
        <StatCard
          title="Atascados (>30min)"
          value={diagnostics?.stuck || 0}
          icon={AlertTriangle}
          variant={diagnostics?.stuck ? "error" : "default"}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            <CardTitle>Acciones Rápidas</CardTitle>
          </div>
          <CardDescription>
            Herramientas para gestionar la cola de generación
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => retryAllFailed.mutate()}
            disabled={retryAllFailed.isPending || !diagnostics?.failed}
          >
            {retryAllFailed.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Reintentar todos los fallidos
            {diagnostics?.failed ? (
              <Badge variant="secondary" className="ml-2">
                {diagnostics.failed}
              </Badge>
            ) : null}
          </Button>
          <Button
            variant="outline"
            onClick={() => cleanupStuck.mutate()}
            disabled={cleanupStuck.isPending || !diagnostics?.stuck}
          >
            {cleanupStuck.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Limpiar atascados
            {diagnostics?.stuck ? (
              <Badge variant="destructive" className="ml-2">
                {diagnostics.stuck}
              </Badge>
            ) : null}
          </Button>
        </CardContent>
      </Card>

      {/* Problem Items Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <CardTitle>Elementos con Problemas</CardTitle>
          </div>
          <CardDescription>
            Items que han fallado o tienen mensajes de error
          </CardDescription>
        </CardHeader>
        <CardContent>
          {problemItems.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tema</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Error</TableHead>
                  <TableHead>Última actualización</TableHead>
                  <TableHead className="w-24">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {problemItems.map((item: BlogQueueItem) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {item.topic}
                    </TableCell>
                    <TableCell>
                      {item.status === "failed" ? (
                        <Badge variant="destructive">Error</Badge>
                      ) : item.status === "pending" ? (
                        <Badge variant="secondary">Pendiente</Badge>
                      ) : (
                        <Badge>{item.status}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.error_message ? (
                        <ErrorTooltip message={item.error_message} />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDistanceToNow(new Date(item.updated_at), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => retryItem.mutate(item.id)}
                        disabled={retryItem.isPending}
                      >
                        {retryItem.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                        <span className="ml-1">Reintentar</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50 text-emerald-600" />
              <p className="font-medium">Sin problemas detectados</p>
              <p className="text-sm">Todos los elementos de la cola están funcionando correctamente</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
