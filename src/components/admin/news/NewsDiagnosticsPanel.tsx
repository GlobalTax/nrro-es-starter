import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Activity, 
  AlertTriangle, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Loader2, 
  Newspaper, 
  Play, 
  RefreshCw,
  Settings,
  Zap
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { 
  useNewsAutomationSettings, 
  useNewsDiagnostics, 
  useTriggerNewsGeneration 
} from "@/hooks/useNewsAutomation";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  variant?: "default" | "success" | "warning" | "error";
  subtitle?: string;
}

function StatCard({ title, value, icon: Icon, variant = "default", subtitle }: StatCardProps) {
  const variants = {
    default: "bg-slate-100 text-slate-600",
    success: "bg-emerald-100 text-emerald-600",
    warning: "bg-amber-100 text-amber-600",
    error: "bg-red-100 text-red-600",
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${variants[variant]}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-slate-900">{value}</p>
            <p className="text-xs text-slate-500">{title}</p>
            {subtitle && <p className="text-[10px] text-slate-400">{subtitle}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function NewsDiagnosticsPanel() {
  const { data: settings, isLoading: settingsLoading } = useNewsAutomationSettings();
  const { data: diagnostics, isLoading: diagnosticsLoading, refetch } = useNewsDiagnostics();
  const triggerGeneration = useTriggerNewsGeneration();

  const isLoading = settingsLoading || diagnosticsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const lastRunAt = settings?.last_run_at ? new Date(settings.last_run_at) : null;
  const nextRunAt = settings?.next_run_at ? new Date(settings.next_run_at) : null;
  const isStale = lastRunAt && (Date.now() - lastRunAt.getTime()) > 48 * 60 * 60 * 1000;

  return (
    <div className="space-y-6">
      {/* Cron Status Card */}
      <Card className={`border-0 shadow-sm ${isStale ? "bg-amber-50 border-amber-200" : "bg-white"}`}>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isStale ? (
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              )}
              <div>
                <p className={`font-medium ${isStale ? "text-amber-900" : "text-slate-900"}`}>
                  {isStale ? "Última ejecución hace más de 48h" : "Automatización configurada"}
                </p>
                <p className={`text-sm ${isStale ? "text-amber-700" : "text-slate-500"}`}>
                  {isStale 
                    ? "Verifica que el cron job esté activo en Supabase Dashboard" 
                    : `Programado: ${settings?.run_time || "08:00"} UTC diariamente`}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="gap-2"
            >
              <a 
                href="https://supabase.com/dashboard/project/_/database/cron-jobs" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Settings className="h-4 w-4" />
                Ver Cron Jobs
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          title="Última ejecución"
          value={lastRunAt ? formatDistanceToNow(lastRunAt, { locale: es, addSuffix: true }) : "Nunca"}
          icon={Clock}
          variant={isStale ? "warning" : "default"}
          subtitle={lastRunAt ? format(lastRunAt, "dd MMM HH:mm", { locale: es }) : undefined}
        />
        <StatCard
          title="Próxima ejecución"
          value={nextRunAt ? format(nextRunAt, "dd MMM", { locale: es }) : "—"}
          icon={Calendar}
          subtitle={nextRunAt ? format(nextRunAt, "HH:mm", { locale: es }) : undefined}
        />
        <StatCard
          title="Estado"
          value={settings?.is_enabled ? "Activo" : "Inactivo"}
          icon={Activity}
          variant={settings?.is_enabled ? "success" : "error"}
        />
        <StatCard
          title="Auto-publicar"
          value={settings?.auto_publish ? "Sí" : "No"}
          icon={Zap}
          variant={settings?.auto_publish ? "success" : "default"}
        />
        <StatCard
          title="Hoy"
          value={diagnostics?.todayCount || 0}
          icon={Newspaper}
          variant={diagnostics?.todayCount ? "success" : "default"}
          subtitle={`${diagnostics?.aiGeneratedToday || 0} por IA`}
        />
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Acciones Rápidas</CardTitle>
          <CardDescription>Ejecutar manualmente o refrescar diagnósticos</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button
            onClick={() => triggerGeneration.mutate()}
            disabled={triggerGeneration.isPending}
            className="bg-slate-900 hover:bg-slate-800"
          >
            {triggerGeneration.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Generar noticias ahora
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refrescar
          </Button>
        </CardContent>
      </Card>

      {/* Today's Articles Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Noticias generadas hoy</CardTitle>
          <CardDescription>
            {diagnostics?.todayCount || 0} noticias creadas hoy, {diagnostics?.publishedToday || 0} publicadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {diagnostics?.todayArticles && diagnostics.todayArticles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                  <TableHead className="text-slate-600 font-medium">Título</TableHead>
                  <TableHead className="text-slate-600 font-medium">Fuente</TableHead>
                  <TableHead className="text-slate-600 font-medium">Categoría</TableHead>
                  <TableHead className="text-slate-600 font-medium">Hora</TableHead>
                  <TableHead className="text-slate-600 font-medium">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {diagnostics.todayArticles.map((article) => (
                  <TableRow key={article.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-medium text-slate-900 max-w-[300px] truncate">
                      {article.title_es || "Sin título"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-slate-200 text-slate-600 font-normal">
                        {article.source_name || "—"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-slate-200 text-slate-600 font-normal">
                        {article.category || "—"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {article.created_at 
                        ? format(new Date(article.created_at), "HH:mm", { locale: es })
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={article.is_published 
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" 
                          : "bg-slate-100 text-slate-500 hover:bg-slate-100"
                        }
                      >
                        {article.is_published ? "Publicado" : "Borrador"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <Newspaper className="h-8 w-8 mx-auto mb-2 text-slate-300" />
              <p>No hay noticias generadas hoy</p>
              <p className="text-sm text-slate-400">Ejecuta la generación manualmente o espera al próximo ciclo automático</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}