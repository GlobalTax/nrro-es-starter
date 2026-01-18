import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Zap, Clock, Settings2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  useNewsAutomationSettings,
  useUpdateNewsAutomationSettings,
  useTriggerNewsGeneration,
} from "@/hooks/useNewsAutomation";

const AVAILABLE_SOURCES = [
  { value: "BOE", label: "BOE" },
  { value: "AEAT", label: "AEAT" },
  { value: "CGPJ", label: "CGPJ" },
  { value: "EUROPEAN", label: "UE" },
  { value: "MARKET", label: "Mercado" },
];

const AVAILABLE_CATEGORIES = [
  { value: "Fiscal", label: "Fiscal" },
  { value: "Mercantil", label: "Mercantil" },
  { value: "Laboral", label: "Laboral" },
  { value: "Internacional", label: "Internacional" },
  { value: "M&A", label: "M&A" },
];

export function NewsAutomationPanel() {
  const { data: settings, isLoading } = useNewsAutomationSettings();
  const updateSettings = useUpdateNewsAutomationSettings();
  const triggerGeneration = useTriggerNewsGeneration();
  const [localSettings, setLocalSettings] = useState<Record<string, unknown>>({});

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm bg-white">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </CardContent>
      </Card>
    );
  }

  if (!settings) return null;

  const currentSettings = { ...settings, ...localSettings };

  const toggleSource = (source: string) => {
    const current = currentSettings.default_sources || [];
    const updated = current.includes(source)
      ? current.filter((s: string) => s !== source)
      : [...current, source];
    setLocalSettings({ ...localSettings, default_sources: updated });
  };

  const toggleCategory = (category: string) => {
    const current = currentSettings.default_categories || [];
    const updated = current.includes(category)
      ? current.filter((c: string) => c !== category)
      : [...current, category];
    setLocalSettings({ ...localSettings, default_categories: updated });
  };

  const handleSave = () => {
    updateSettings.mutate(localSettings);
    setLocalSettings({});
  };

  const hasChanges = Object.keys(localSettings).length > 0;

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-100 rounded-md">
              <Settings2 className="h-4 w-4 text-slate-600" />
            </div>
            <CardTitle className="text-lg font-medium text-slate-900">
              Automatización de Noticias
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={currentSettings.is_enabled}
              onCheckedChange={(checked) => {
                updateSettings.mutate({ is_enabled: checked });
              }}
              className="data-[state=checked]:bg-emerald-500"
            />
            <Label className="text-sm text-slate-600">
              {currentSettings.is_enabled ? "Activo" : "Inactivo"}
            </Label>
          </div>
        </div>
        <CardDescription className="text-slate-500">
          Genera noticias legales automáticamente cada día para la sección de noticias de la home.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Status */}
        <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-500">Última ejecución:</span>
            <span className="text-sm font-medium text-slate-700">
              {settings.last_run_at
                ? format(new Date(settings.last_run_at), "dd MMM yyyy HH:mm", { locale: es })
                : "Nunca"}
            </span>
          </div>
          {settings.next_run_at && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Próxima:</span>
              <span className="text-sm font-medium text-slate-700">
                {format(new Date(settings.next_run_at), "dd MMM yyyy HH:mm", { locale: es })}
              </span>
            </div>
          )}
        </div>

        {/* Settings Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-sm text-slate-600">Noticias por ejecución</Label>
            <Input
              type="number"
              min={1}
              max={10}
              value={currentSettings.articles_per_run}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, articles_per_run: parseInt(e.target.value) })
              }
              className="border-slate-200 focus:border-slate-300 focus:ring-slate-200"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-slate-600">Hora de ejecución</Label>
            <Input
              type="time"
              value={currentSettings.run_time?.slice(0, 5) || "08:00"}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, run_time: e.target.value + ":00" })
              }
              className="border-slate-200 focus:border-slate-300 focus:ring-slate-200"
            />
          </div>
        </div>

        {/* Sources */}
        <div className="space-y-2">
          <Label className="text-sm text-slate-600">Fuentes de noticias</Label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_SOURCES.map((source) => (
              <Badge
                key={source.value}
                variant="outline"
                className={`cursor-pointer transition-colors font-normal ${
                  currentSettings.default_sources?.includes(source.value)
                    ? "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
                    : "bg-transparent text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
                onClick={() => toggleSource(source.value)}
              >
                {source.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <Label className="text-sm text-slate-600">Categorías</Label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_CATEGORIES.map((cat) => (
              <Badge
                key={cat.value}
                variant="outline"
                className={`cursor-pointer transition-colors font-normal ${
                  currentSettings.default_categories?.includes(cat.value)
                    ? "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
                    : "bg-transparent text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
                onClick={() => toggleCategory(cat.value)}
              >
                {cat.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <Switch
              checked={currentSettings.auto_publish}
              onCheckedChange={(checked) =>
                setLocalSettings({ ...localSettings, auto_publish: checked })
              }
              className="data-[state=checked]:bg-emerald-500"
            />
            <Label className="text-sm text-slate-600">Auto-publicar</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={currentSettings.notify_on_generation}
              onCheckedChange={(checked) =>
                setLocalSettings({ ...localSettings, notify_on_generation: checked })
              }
              className="data-[state=checked]:bg-emerald-500"
            />
            <Label className="text-sm text-slate-600">Notificar al generar</Label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-slate-100">
          {hasChanges && (
            <Button 
              onClick={handleSave} 
              disabled={updateSettings.isPending}
              className="bg-slate-900 hover:bg-slate-800 text-white"
            >
              {updateSettings.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar cambios
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => triggerGeneration.mutate()}
            disabled={triggerGeneration.isPending}
            className="border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            {triggerGeneration.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Zap className="mr-2 h-4 w-4" />
            )}
            Generar ahora
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
