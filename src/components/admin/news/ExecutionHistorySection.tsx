import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  History, 
  Loader2, 
  Percent, 
  Timer,
  TrendingUp,
  XCircle
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  useNewsAutomationHistory, 
  useNewsAutomationStats,
  NewsAutomationRun 
} from "@/hooks/useNewsAutomation";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  variant?: "default" | "success" | "warning" | "error";
}

function StatCard({ title, value, icon: Icon, variant = "default" }: StatCardProps) {
  const variants = {
    default: "bg-slate-100 text-slate-600",
    success: "bg-emerald-100 text-emerald-600",
    warning: "bg-amber-100 text-amber-600",
    error: "bg-red-100 text-red-600",
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-100">
      <div className={`p-2 rounded-lg ${variants[variant]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-lg font-semibold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">{title}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: NewsAutomationRun['status'] }) {
  const config = {
    running: { 
      icon: Loader2, 
      label: "Ejecutando", 
      className: "bg-blue-100 text-blue-700 hover:bg-blue-100" 
    },
    success: { 
      icon: CheckCircle2, 
      label: "Éxito", 
      className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" 
    },
    error: { 
      icon: XCircle, 
      label: "Error", 
      className: "bg-red-100 text-red-700 hover:bg-red-100" 
    },
    skipped: { 
      icon: AlertCircle, 
      label: "Omitido", 
      className: "bg-slate-100 text-slate-600 hover:bg-slate-100" 
    },
  };

  const { icon: Icon, label, className } = config[status];

  return (
    <Badge className={`gap-1 ${className}`}>
      <Icon className={`h-3 w-3 ${status === 'running' ? 'animate-spin' : ''}`} />
      {label}
    </Badge>
  );
}

function TriggerBadge({ trigger }: { trigger: NewsAutomationRun['trigger_type'] }) {
  const config = {
    cron: { label: "Auto", className: "border-slate-200 text-slate-600" },
    manual: { label: "Manual", className: "border-blue-200 text-blue-600" },
    api: { label: "API", className: "border-purple-200 text-purple-600" },
  };

  const { label, className } = config[trigger];

  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
}

export function ExecutionHistorySection() {
  const { data: history, isLoading: historyLoading } = useNewsAutomationHistory(20);
  const { data: stats, isLoading: statsLoading } = useNewsAutomationStats();

  const isLoading = historyLoading || statsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary (últimos 30 días) */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-slate-500" />
            Estadísticas (últimos 30 días)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title="Tasa de éxito"
              value={`${stats?.successRate.toFixed(0) || 0}%`}
              icon={Percent}
              variant={stats && stats.successRate >= 90 ? "success" : stats && stats.successRate >= 70 ? "warning" : "error"}
            />
            <StatCard
              title="Ejecuciones"
              value={stats?.totalRuns || 0}
              icon={History}
            />
            <StatCard
              title="Tiempo promedio"
              value={stats?.averageExecutionTime ? `${(stats.averageExecutionTime / 1000).toFixed(1)}s` : "—"}
              icon={Timer}
            />
            <StatCard
              title="Noticias/ejecución"
              value={stats?.averageArticlesPerRun.toFixed(1) || 0}
              icon={TrendingUp}
              variant="success"
            />
          </div>
        </CardContent>
      </Card>

      {/* Execution History Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <History className="h-4 w-4 text-slate-500" />
            Historial de Ejecuciones
          </CardTitle>
          <CardDescription>
            Últimas 20 ejecuciones de la automatización
          </CardDescription>
        </CardHeader>
        <CardContent>
          {history && history.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                  <TableHead className="text-slate-600 font-medium">Fecha/Hora</TableHead>
                  <TableHead className="text-slate-600 font-medium">Estado</TableHead>
                  <TableHead className="text-slate-600 font-medium">Generadas</TableHead>
                  <TableHead className="text-slate-600 font-medium">Duración</TableHead>
                  <TableHead className="text-slate-600 font-medium">Tipo</TableHead>
                  <TableHead className="text-slate-600 font-medium">Error</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((run) => (
                  <TableRow key={run.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {format(new Date(run.started_at), "dd MMM HH:mm", { locale: es })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={run.status} />
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-slate-900">
                        {run.articles_generated}
                      </span>
                      <span className="text-slate-400">/{run.articles_requested}</span>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {run.execution_time_ms 
                        ? `${(run.execution_time_ms / 1000).toFixed(1)}s` 
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <TriggerBadge trigger={run.trigger_type} />
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      {run.error_message ? (
                        <span className="text-sm text-red-600 truncate block" title={run.error_message}>
                          {run.error_message}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <History className="h-8 w-8 mx-auto mb-2 text-slate-300" />
              <p>No hay historial de ejecuciones</p>
              <p className="text-sm text-slate-400">
                El historial aparecerá cuando se ejecute la automatización
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
