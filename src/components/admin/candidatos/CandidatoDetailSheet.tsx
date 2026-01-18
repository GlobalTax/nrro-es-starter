import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Briefcase,
  Calendar,
  Mail,
  Phone,
  Linkedin,
  FileText,
  ExternalLink,
  Plus,
  Star,
  Clock,
  MapPin,
  GraduationCap,
  Languages,
  X,
} from "lucide-react";
import {
  Candidato,
  useUpdateCandidato,
  useCandidatoEntrevistas,
} from "@/hooks/useCandidatos";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface CandidatoDetailSheetProps {
  candidato: Candidato | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScheduleInterview: (candidato: Candidato) => void;
}

const ESTADOS = [
  { value: "nuevo", label: "Nuevo" },
  { value: "en_revision", label: "En revisión" },
  { value: "entrevista", label: "Entrevista" },
  { value: "evaluacion", label: "Evaluación" },
  { value: "oferta", label: "Oferta" },
  { value: "contratado", label: "Contratado" },
  { value: "descartado", label: "Descartado" },
];

const NIVELES_ESTUDIOS = [
  "Bachillerato",
  "FP Medio",
  "FP Superior",
  "Grado",
  "Licenciatura",
  "Máster",
  "Doctorado",
];

const PREFERENCIAS_TRABAJO = [
  "Presencial",
  "Híbrido",
  "Remoto",
];

const ESTADO_ENTREVISTA: Record<string, { label: string; className: string }> = {
  programada: { label: "Programada", className: "bg-blue-50 text-blue-700" },
  completada: { label: "Completada", className: "bg-green-50 text-green-700" },
  cancelada: { label: "Cancelada", className: "bg-red-50 text-red-700" },
  no_show: { label: "No presentado", className: "bg-amber-50 text-amber-700" },
};

const formatCurrency = (value: number | null) => {
  if (value === null || value === undefined) return "";
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function CandidatoDetailSheet({
  candidato,
  open,
  onOpenChange,
  onScheduleInterview,
}: CandidatoDetailSheetProps) {
  const [formData, setFormData] = useState<Partial<Candidato>>({});
  const [newSkill, setNewSkill] = useState("");
  const [newIdioma, setNewIdioma] = useState("");
  const updateCandidato = useUpdateCandidato();
  const { data: entrevistas, isLoading: loadingEntrevistas } = useCandidatoEntrevistas(
    candidato?.id || null
  );

  useEffect(() => {
    if (candidato) {
      setFormData(candidato);
    }
  }, [candidato]);

  const handleSave = () => {
    if (!candidato?.id) return;
    updateCandidato.mutate(
      { id: candidato.id, updates: formData },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    const skills = [...(formData.skills || []), newSkill.trim()];
    setFormData({ ...formData, skills });
    setNewSkill("");
  };

  const handleRemoveSkill = (skill: string) => {
    const skills = (formData.skills || []).filter((s) => s !== skill);
    setFormData({ ...formData, skills });
  };

  const handleAddIdioma = () => {
    if (!newIdioma.trim()) return;
    const idiomas = [...(formData.idiomas || []), newIdioma.trim()];
    setFormData({ ...formData, idiomas });
    setNewIdioma("");
  };

  const handleRemoveIdioma = (idioma: string) => {
    const idiomas = (formData.idiomas || []).filter((i) => i !== idioma);
    setFormData({ ...formData, idiomas });
  };

  if (!candidato) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-semibold text-indigo-600">
                {getInitials(candidato.nombre)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-xl truncate">{candidato.nombre}</SheetTitle>
              <SheetDescription className="truncate">
                {candidato.puesto_solicitado}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="info" className="w-full mt-4">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="info" className="text-xs">
              <User className="h-3.5 w-3.5 mr-1" />
              Info
            </TabsTrigger>
            <TabsTrigger value="perfil" className="text-xs">
              <Briefcase className="h-3.5 w-3.5 mr-1" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="entrevistas" className="text-xs">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              Entrevistas
              {entrevistas && entrevistas.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {entrevistas.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Tab: Info */}
          <TabsContent value="info" className="space-y-6 mt-0">
            {/* Quick Actions */}
            <div className="flex gap-2">
              {candidato.cv_url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(candidato.cv_url!, "_blank")}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Ver CV
                </Button>
              )}
              {candidato.linkedin_url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(candidato.linkedin_url!, "_blank")}
                >
                  <Linkedin className="h-4 w-4 mr-1" />
                  LinkedIn
                </Button>
              )}
            </div>

            <Separator />

            {/* Contacto */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                Datos de contacto
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">Email</Label>
                  <p className="text-sm">{candidato.email}</p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">Teléfono</Label>
                  <p className="text-sm">{candidato.telefono || "-"}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Posición */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-slate-400" />
                Posición
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">Puesto solicitado</Label>
                  <p className="text-sm font-medium">{candidato.puesto_solicitado}</p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">Departamento</Label>
                  <Select
                    value={formData.departamento || ""}
                    onValueChange={(v) => setFormData({ ...formData, departamento: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fiscal">Fiscal</SelectItem>
                      <SelectItem value="Contabilidad">Contabilidad</SelectItem>
                      <SelectItem value="Laboral">Laboral</SelectItem>
                      <SelectItem value="Legal">Legal</SelectItem>
                      <SelectItem value="Administración">Administración</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Tecnología">Tecnología</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">Puesto actual</Label>
                  <p className="text-sm">{candidato.puesto_actual || "-"}</p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">Empresa actual</Label>
                  <p className="text-sm">{candidato.empresa_actual || "-"}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Estado y Fuente */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Estado del proceso</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">Estado</Label>
                  <Select
                    value={formData.estado || "nuevo"}
                    onValueChange={(v) => setFormData({ ...formData, estado: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ESTADOS.map((estado) => (
                        <SelectItem key={estado.value} value={estado.value}>
                          {estado.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">Fuente</Label>
                  <p className="text-sm">{candidato.fuente}</p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">Fecha de registro</Label>
                  <p className="text-sm">
                    {format(new Date(candidato.created_at), "dd MMM yyyy", { locale: es })}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={updateCandidato.isPending}>
                {updateCandidato.isPending ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </TabsContent>

          {/* Tab: Perfil */}
          <TabsContent value="perfil" className="space-y-6 mt-0">
            {/* Experiencia y Salario */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Star className="h-4 w-4 text-slate-400" />
                Experiencia y expectativas
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">Años de experiencia</Label>
                  <Input
                    type="number"
                    value={formData.anos_experiencia || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        anos_experiencia: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">Salario esperado (€/año)</Label>
                  <Input
                    type="number"
                    value={formData.salario_esperado || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        salario_esperado: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Formación */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-slate-400" />
                Formación y disponibilidad
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">Nivel de estudios</Label>
                  <Select
                    value={formData.nivel_estudios || ""}
                    onValueChange={(v) => setFormData({ ...formData, nivel_estudios: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {NIVELES_ESTUDIOS.map((nivel) => (
                        <SelectItem key={nivel} value={nivel}>
                          {nivel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">Disponibilidad</Label>
                  <Input
                    type="date"
                    value={formData.fecha_disponibilidad || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, fecha_disponibilidad: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <Label className="text-xs text-slate-500">Preferencia de trabajo</Label>
                  <Select
                    value={formData.preferencia_trabajo || ""}
                    onValueChange={(v) => setFormData({ ...formData, preferencia_trabajo: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {PREFERENCIAS_TRABAJO.map((pref) => (
                        <SelectItem key={pref} value={pref}>
                          {pref}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Skills */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {(formData.skills || []).map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="px-2 py-1 cursor-pointer hover:bg-red-100"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    {skill}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Nueva skill..."
                  onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                  className="flex-1"
                />
                <Button variant="outline" size="sm" onClick={handleAddSkill}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Idiomas */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Languages className="h-4 w-4 text-slate-400" />
                Idiomas
              </h3>
              <div className="flex flex-wrap gap-2">
                {(formData.idiomas || []).map((idioma) => (
                  <Badge
                    key={idioma}
                    variant="outline"
                    className="px-2 py-1 cursor-pointer hover:bg-red-100"
                    onClick={() => handleRemoveIdioma(idioma)}
                  >
                    {idioma}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newIdioma}
                  onChange={(e) => setNewIdioma(e.target.value)}
                  placeholder="Nuevo idioma..."
                  onKeyDown={(e) => e.key === "Enter" && handleAddIdioma()}
                  className="flex-1"
                />
                <Button variant="outline" size="sm" onClick={handleAddIdioma}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Notas */}
            <div className="space-y-2">
              <Label className="text-xs text-slate-500">Notas internas</Label>
              <Textarea
                value={formData.notas || ""}
                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                rows={4}
                placeholder="Añade notas sobre el candidato..."
              />
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={updateCandidato.isPending}>
                {updateCandidato.isPending ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </TabsContent>

          {/* Tab: Entrevistas */}
          <TabsContent value="entrevistas" className="space-y-4 mt-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Historial de entrevistas</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onScheduleInterview(candidato)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Programar
              </Button>
            </div>

            {loadingEntrevistas ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-20 bg-slate-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : entrevistas && entrevistas.length > 0 ? (
              <div className="space-y-3">
                {entrevistas.map((entrevista) => {
                  const estadoConfig =
                    ESTADO_ENTREVISTA[entrevista.estado || "programada"] ||
                    ESTADO_ENTREVISTA.programada;
                  return (
                    <div
                      key={entrevista.id}
                      className="p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span className="text-sm font-medium">
                              {format(new Date(entrevista.fecha_hora), "dd MMM yyyy, HH:mm", {
                                locale: es,
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="capitalize">{entrevista.tipo || "General"}</span>
                            <span>·</span>
                            <span>Ronda {entrevista.ronda || 1}</span>
                            {entrevista.duracion_minutos && (
                              <>
                                <span>·</span>
                                <Clock className="h-3 w-3" />
                                <span>{entrevista.duracion_minutos} min</span>
                              </>
                            )}
                          </div>
                          {entrevista.ubicacion && (
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <MapPin className="h-3 w-3" />
                              {entrevista.ubicacion}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={cn("text-xs", estadoConfig.className)}>
                            {estadoConfig.label}
                          </Badge>
                          {entrevista.puntuacion !== null && (
                            <div className="flex items-center gap-1 text-amber-500">
                              <Star className="h-3.5 w-3.5 fill-current" />
                              <span className="text-sm font-medium">
                                {entrevista.puntuacion}/10
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      {entrevista.notas_evaluacion && (
                        <p className="text-xs text-slate-500 mt-3 line-clamp-2">
                          {entrevista.notas_evaluacion}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Calendar className="h-10 w-10 mb-3 opacity-30" />
                <p className="text-sm font-medium">Sin entrevistas</p>
                <p className="text-xs mt-1">Programa la primera entrevista</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
