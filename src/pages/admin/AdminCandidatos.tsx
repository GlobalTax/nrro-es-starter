import { useState } from "react";
import { useCandidatos, useUpdateCandidato, useDeleteCandidato, useCandidatoStats } from "@/hooks/useCandidatos";
import { useJobPositions } from "@/hooks/useJobPositions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAnalytics } from "@/hooks/useAnalytics";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Download,
  Eye,
  Trash2,
  Users,
  UserPlus,
  UserCheck,
  UserX,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Candidato } from "@/hooks/useCandidatos";

const ESTADOS = [
  { value: "nuevo", label: "Nuevo", variant: "default" as const },
  { value: "en_revision", label: "En revisión", variant: "secondary" as const },
  { value: "entrevista", label: "Entrevista", variant: "default" as const },
  { value: "evaluacion", label: "Evaluación", variant: "secondary" as const },
  { value: "oferta", label: "Oferta enviada", variant: "default" as const },
  { value: "contratado", label: "Contratado", variant: "default" as const },
  { value: "descartado", label: "Descartado", variant: "destructive" as const },
];

const DEPARTAMENTOS = [
  "Fiscal",
  "Laboral",
  "Contable",
  "Legal",
  "Administración",
  "Tecnología",
  "Otro",
];

export default function AdminCandidatos() {
  const { trackDownload } = useAnalytics();
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState<string>("");
  const [departamentoFilter, setDepartamentoFilter] = useState<string>("");
  const [selectedCandidato, setSelectedCandidato] = useState<Candidato | null>(null);
  const [candidatoToDelete, setCandidatoToDelete] = useState<Candidato | null>(null);

  const { data: candidatos = [], isLoading } = useCandidatos({
    estado: estadoFilter || undefined,
    departamento: departamentoFilter || undefined,
    search: search || undefined,
  });

  const { data: stats } = useCandidatoStats();
  const updateCandidato = useUpdateCandidato();
  const deleteCandidato = useDeleteCandidato();

  const handleEstadoChange = async (candidatoId: string, nuevoEstado: string) => {
    await updateCandidato.mutateAsync({
      id: candidatoId,
      updates: { estado: nuevoEstado },
    });
  };

  const handleDeleteConfirm = async () => {
    if (candidatoToDelete) {
      await deleteCandidato.mutateAsync(candidatoToDelete.id);
      if (selectedCandidato?.id === candidatoToDelete.id) {
        setSelectedCandidato(null);
      }
      setCandidatoToDelete(null);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const estadoConfig = ESTADOS.find((e) => e.value === estado);
    return (
      <Badge variant={estadoConfig?.variant || "default"}>
        {estadoConfig?.label || estado}
      </Badge>
    );
  };

  const statCards = [
    {
      title: "Total",
      value: stats?.total || 0,
      icon: Users,
      color: "text-slate-600",
      bgColor: "bg-slate-100",
    },
    {
      title: "Nuevos",
      value: stats?.nuevo || 0,
      icon: UserPlus,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Contratados",
      value: stats?.contratado || 0,
      icon: UserCheck,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Descartados",
      value: stats?.descartado || 0,
      icon: UserX,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Candidatos</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Gestiona las candidaturas recibidas a través del portal de talento.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card
            key={stat.title}
            className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow"
          >
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.title}</p>
                  <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm bg-white">
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por nombre, email, puesto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 border-slate-200"
              />
            </div>

            <Select
              value={estadoFilter || "all"}
              onValueChange={(val) => setEstadoFilter(val === "all" ? "" : val)}
            >
              <SelectTrigger className="border-slate-200">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {ESTADOS.map((estado) => (
                  <SelectItem key={estado.value} value={estado.value}>
                    {estado.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={departamentoFilter || "all"}
              onValueChange={(val) => setDepartamentoFilter(val === "all" ? "" : val)}
            >
              <SelectTrigger className="border-slate-200">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los departamentos</SelectItem>
                {DEPARTAMENTOS.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidato</TableHead>
                  <TableHead>Puesto</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Cargando candidatos...
                    </TableCell>
                  </TableRow>
                ) : candidatos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No se encontraron candidatos
                    </TableCell>
                  </TableRow>
                ) : (
                  candidatos.map((candidato) => (
                    <TableRow key={candidato.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{candidato.nombre}</div>
                          <div className="text-sm text-muted-foreground">
                            {candidato.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{candidato.puesto_solicitado}</TableCell>
                      <TableCell>
                        {candidato.departamento ? (
                          <Badge variant="outline">{candidato.departamento}</Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={candidato.estado}
                          onValueChange={(value) =>
                            handleEstadoChange(candidato.id, value)
                          }
                        >
                          <SelectTrigger className="w-[140px]">
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
                      </TableCell>
                      <TableCell>
                        {format(new Date(candidato.created_at), "dd MMM yyyy", {
                          locale: es,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedCandidato(candidato)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {candidato.cv_url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                            >
                              <a
                                href={candidato.cv_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackDownload('cv', `cv-${candidato.nombre}`, 'admin_candidatos_table')}
                              >
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCandidatoToDelete(candidato)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={!!selectedCandidato} onOpenChange={() => setSelectedCandidato(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles del Candidato</DialogTitle>
            <DialogDescription>
              Información completa de la candidatura
            </DialogDescription>
          </DialogHeader>

          {selectedCandidato && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">Nombre</h4>
                  <p>{selectedCandidato.nombre}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">Email</h4>
                  <p>{selectedCandidato.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">Teléfono</h4>
                  <p>{selectedCandidato.telefono || "-"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">LinkedIn</h4>
                  {selectedCandidato.linkedin_url ? (
                    <a
                      href={selectedCandidato.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      Ver perfil
                    </a>
                  ) : (
                    <p>-</p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">Puesto solicitado</h4>
                  <p>{selectedCandidato.puesto_solicitado}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">Departamento</h4>
                  <p>{selectedCandidato.departamento || "-"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">Estado</h4>
                  {getEstadoBadge(selectedCandidato.estado)}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">Fuente</h4>
                  <Badge variant="outline">{selectedCandidato.fuente}</Badge>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Mensaje motivacional</h4>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedCandidato.notas || "Sin mensaje"}
                </p>
              </div>

              {selectedCandidato.cv_url && (
                <>
                  <Separator />
                  <div>
                    <Button asChild className="w-full">
                      <a
                        href={selectedCandidato.cv_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackDownload('cv', `cv-${selectedCandidato.nombre}`, 'admin_candidatos_modal')}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Descargar CV
                      </a>
                    </Button>
                  </div>
                </>
              )}

              <Separator />

              <div className="text-xs text-muted-foreground">
                <p>
                  Recibido:{" "}
                  {format(
                    new Date(selectedCandidato.created_at),
                    "dd/MM/yyyy 'a las' HH:mm",
                    { locale: es }
                  )}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!candidatoToDelete} onOpenChange={() => setCandidatoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar candidato?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el registro de{" "}
              <strong>{candidatoToDelete?.nombre}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
