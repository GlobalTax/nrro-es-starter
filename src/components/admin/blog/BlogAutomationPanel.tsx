import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Bot, Calendar, Clock, Play, Plus, Settings, Sparkles, Trash2, Loader2 } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  useBlogAutomationSettings,
  useUpdateAutomationSettings,
  useBlogQueue,
  useAddToQueue,
  useDeleteFromQueue,
  useTriggerGeneration,
} from "@/hooks/useBlogAutomation";

const CATEGORIES = ["Fiscal", "Mercantil", "Laboral", "Corporativo"];
const TONES = [
  { value: "professional", label: "Profesional" },
  { value: "technical", label: "Técnico" },
  { value: "divulgative", label: "Divulgativo" },
];

export function BlogAutomationPanel() {
  const [newTopic, setNewTopic] = useState("");
  const [newCategory, setNewCategory] = useState("Fiscal");
  const [newTone, setNewTone] = useState("professional");

  const { data: settings, isLoading: settingsLoading } = useBlogAutomationSettings();
  const { data: queue, isLoading: queueLoading } = useBlogQueue();
  const updateSettings = useUpdateAutomationSettings();
  const addToQueue = useAddToQueue();
  const deleteFromQueue = useDeleteFromQueue();
  const triggerGeneration = useTriggerGeneration();

  const handleAddToQueue = () => {
    if (!newTopic.trim()) return;
    addToQueue.mutate({
      topic: newTopic,
      category: newCategory,
      tone: newTone,
    });
    setNewTopic("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pendiente</Badge>;
      case "generating":
        return <Badge className="bg-amber-500">Generando</Badge>;
      case "completed":
        return <Badge className="bg-emerald-500">Completado</Badge>;
      case "failed":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (settingsLoading) {
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
      {/* Settings Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <CardTitle>Configuración de Automatización</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="automation-enabled">Automatización activa</Label>
              <Switch
                id="automation-enabled"
                checked={settings?.is_enabled}
                onCheckedChange={(checked) =>
                  updateSettings.mutate({ is_enabled: checked })
                }
              />
            </div>
          </div>
          <CardDescription>
            Genera artículos automáticamente cada {settings?.run_interval_days || 2} días
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label>Artículos por ejecución</Label>
              <Select
                value={String(settings?.articles_per_run || 2)}
                onValueChange={(value) =>
                  updateSettings.mutate({ articles_per_run: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} artículo{n > 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Intervalo (días)</Label>
              <Select
                value={String(settings?.run_interval_days || 2)}
                onValueChange={(value) =>
                  updateSettings.mutate({ run_interval_days: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 5, 7].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      Cada {n} día{n > 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tono por defecto</Label>
              <Select
                value={settings?.default_tone || "professional"}
                onValueChange={(value) =>
                  updateSettings.mutate({ default_tone: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <div className="flex items-center gap-2">
                <Switch
                  id="auto-publish"
                  checked={settings?.auto_publish}
                  onCheckedChange={(checked) =>
                    updateSettings.mutate({ auto_publish: checked })
                  }
                />
                <Label htmlFor="auto-publish">Publicar automáticamente</Label>
              </div>
            </div>
          </div>

          {/* Status info */}
          <div className="flex gap-6 pt-4 text-sm text-muted-foreground border-t">
            {settings?.last_run_at && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  Última ejecución:{" "}
                  {formatDistanceToNow(new Date(settings.last_run_at), {
                    addSuffix: true,
                    locale: es,
                  })}
                </span>
              </div>
            )}
            {settings?.next_run_at && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  Próxima:{" "}
                  {format(new Date(settings.next_run_at), "dd/MM/yyyy HH:mm", {
                    locale: es,
                  })}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Manual Generation Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <CardTitle>Generación Manual</CardTitle>
          </div>
          <CardDescription>
            Genera artículos inmediatamente o añade temas a la cola
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Tema del artículo (ej: Novedades fiscales 2026)"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
              />
            </div>
            <Select value={newCategory} onValueChange={setNewCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={newTone} onValueChange={setNewTone}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TONES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddToQueue} disabled={!newTopic.trim()}>
              <Plus className="h-4 w-4 mr-1" />
              Añadir a cola
            </Button>
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => triggerGeneration.mutate({ count: 1 })}
              disabled={triggerGeneration.isPending}
            >
              {triggerGeneration.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Bot className="h-4 w-4 mr-2" />
              )}
              Generar 1 artículo (aleatorio)
            </Button>
            <Button
              onClick={() => triggerGeneration.mutate({ count: 2 })}
              disabled={triggerGeneration.isPending}
            >
              {triggerGeneration.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Ejecutar ahora (2 artículos)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Queue Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <CardTitle>Cola de Generación</CardTitle>
          </div>
          <CardDescription>
            Temas programados para generación automática
          </CardDescription>
        </CardHeader>
        <CardContent>
          {queueLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : queue && queue.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tema</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Tono</TableHead>
                  <TableHead>Programado</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queue.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium max-w-md truncate">
                      {item.topic}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {TONES.find((t) => t.value === item.tone)?.label || item.tone}
                    </TableCell>
                    <TableCell>
                      {format(new Date(item.scheduled_for), "dd/MM/yyyy HH:mm", {
                        locale: es,
                      })}
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      {item.status === "pending" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar tema?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Se eliminará "{item.topic}" de la cola de generación.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteFromQueue.mutate(item.id)}
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Bot className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No hay temas en la cola</p>
              <p className="text-sm">Los artículos se generarán automáticamente con temas aleatorios</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
