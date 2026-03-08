import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Search, Briefcase, FileText, CheckCircle, XCircle } from "lucide-react";
import {
  useJobPositions,
  useDeleteJobPosition,
  useJobPositionStats,
  useJobPositionCandidateCounts,
} from "@/hooks/useJobPositions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import { JobPositionFormDialog } from "@/components/admin/jobs/JobPositionFormDialog";
import { JobPosition } from "@/types/jobPosition";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function AdminJobPositions() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const { data: positions, isLoading } = useJobPositions(
    statusFilter ? { status: statusFilter as 'draft' | 'published' | 'closed' } : undefined
  );
  const { data: stats } = useJobPositionStats();
  const deletePosition = useDeleteJobPosition();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<JobPosition | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [positionToDelete, setPositionToDelete] = useState<JobPosition | null>(null);

  const filteredPositions = positions?.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.department.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q)
    );
  });

  const handleCreate = () => {
    setEditingPosition(null);
    setIsFormOpen(true);
  };

  const handleEdit = (position: JobPosition) => {
    setEditingPosition(position);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (position: JobPosition) => {
    setPositionToDelete(position);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (positionToDelete) {
      deletePosition.mutate(positionToDelete.id);
      setDeleteDialogOpen(false);
      setPositionToDelete(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "outline"; label: string }> = {
      published: { variant: "default", label: "Publicada" },
      draft: { variant: "secondary", label: "Borrador" },
      closed: { variant: "outline", label: "Cerrada" },
    };
    const c = config[status] || { variant: "outline", label: status };
    return <Badge variant={c.variant}>{c.label}</Badge>;
  };

  const statCards = [
    {
      title: "Total",
      value: stats?.total || 0,
      icon: Briefcase,
      color: "text-slate-600",
      bgColor: "bg-slate-100",
    },
    {
      title: "Publicadas",
      value: stats?.published || 0,
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Borradores",
      value: stats?.draft || 0,
      icon: FileText,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Cerradas",
      value: stats?.closed || 0,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Vacantes Laborales</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Gestiona las posiciones abiertas en tu empresa
            </p>
          </div>
          <Button onClick={handleCreate} className="bg-slate-900 hover:bg-slate-800 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Vacante
          </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar por título, departamento, ubicación..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 border-slate-200"
                />
              </div>
              <Select
                value={statusFilter || "all"}
                onValueChange={(val) => setStatusFilter(val === "all" ? "" : val)}
              >
                <SelectTrigger className="border-slate-200">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="published">Publicadas</SelectItem>
                  <SelectItem value="draft">Borradores</SelectItem>
                  <SelectItem value="closed">Cerradas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Cargando vacantes...</p>
          </div>
        ) : !filteredPositions || filteredPositions.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">
              No hay vacantes que coincidan con los filtros
            </p>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Crear primera vacante
            </Button>
          </div>
        ) : (
          <Card className="border-0 shadow-sm bg-white overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Publicado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPositions.map((position) => (
                    <TableRow key={position.id}>
                      <TableCell className="font-medium">
                        {position.title}
                        {position.is_featured && (
                          <Badge variant="outline" className="ml-2">
                            Destacado
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{position.department}</TableCell>
                      <TableCell>{position.location}</TableCell>
                      <TableCell>{getStatusBadge(position.status)}</TableCell>
                      <TableCell>
                        {position.published_at
                          ? format(new Date(position.published_at), "d MMM yyyy", {
                              locale: es,
                            })
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(position)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(position)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      <JobPositionFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        position={editingPosition}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar vacante?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la vacante{" "}
              <strong>{positionToDelete?.title}</strong>.
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
    </>
  );
}
