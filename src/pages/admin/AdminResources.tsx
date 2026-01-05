import { useState } from "react";
import { Plus, Search, Pencil, Trash2, Star, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { CustomPagination } from "@/components/ui/custom-pagination";
import { ResourceStatsCard } from "@/components/admin/resources/ResourceStatsCard";
import { ResourceFormDialog } from "@/components/admin/resources/ResourceFormDialog";
import {
  useAdminResources,
  useDeleteResource,
  AdminResource,
} from "@/hooks/useAdminResources";
import { resourceTypes, resourceCategories } from "@/hooks/useResources";

const typeLabels: Record<string, string> = {
  country_guide: "Guía",
  template: "Plantilla",
  webinar: "Webinar",
  white_paper: "White Paper",
};

const categoryLabels: Record<string, string> = {
  accounting: "Contabilidad",
  corporate_legal: "Mercantil",
  governance: "Gobierno",
  payroll: "Nóminas",
  tax: "Fiscal",
  transfer_pricing: "Transfer Pricing",
  treasury: "Tesorería",
};

const PAGE_SIZE = 10;

export default function AdminResources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<AdminResource | null>(null);
  const [deleteResourceId, setDeleteResourceId] = useState<string | null>(null);

  const { data, isLoading } = useAdminResources({
    searchQuery,
    typeFilter,
    categoryFilter,
    statusFilter,
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  const deleteMutation = useDeleteResource();

  const resources = data?.resources || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const handleEdit = (resource: AdminResource) => {
    setSelectedResource(resource);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (deleteResourceId) {
      await deleteMutation.mutateAsync(deleteResourceId);
      setDeleteResourceId(null);
    }
  };

  const handleNewResource = () => {
    setSelectedResource(null);
    setIsFormOpen(true);
  };

  const getTypeBadge = (type: string) => (
    <Badge variant="outline" className="font-normal">
      {typeLabels[type] || type}
    </Badge>
  );

  const getCategoryBadge = (category: string) => (
    <Badge variant="secondary" className="font-normal">
      {categoryLabels[category] || category}
    </Badge>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Centro de Recursos</h1>
          <p className="text-muted-foreground">
            Gestiona los lead magnets y recursos descargables
          </p>
        </div>
        <Button onClick={handleNewResource}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Recurso
        </Button>
      </div>

      {/* Stats */}
      <ResourceStatsCard />

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por título..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>

        <Select
          value={typeFilter}
          onValueChange={(value) => {
            setTypeFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            {resourceTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {typeLabels[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={categoryFilter}
          onValueChange={(value) => {
            setCategoryFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {resourceCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {categoryLabels[category]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Activos</SelectItem>
            <SelectItem value="inactive">Inactivos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Título</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="text-center">Destacado</TableHead>
              <TableHead className="text-center">Activo</TableHead>
              <TableHead className="text-center">Descargas</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Cargando recursos...
                </TableCell>
              </TableRow>
            ) : resources.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No se encontraron recursos
                </TableCell>
              </TableRow>
            ) : (
              resources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="font-medium">
                    <div className="line-clamp-2">{resource.title}</div>
                  </TableCell>
                  <TableCell>{getTypeBadge(resource.type)}</TableCell>
                  <TableCell>{getCategoryBadge(resource.category)}</TableCell>
                  <TableCell className="text-center">
                    {resource.is_featured ? (
                      <Star className="h-4 w-4 text-amber-500 mx-auto fill-amber-500" />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {resource.is_active ? (
                      <Check className="h-4 w-4 text-green-500 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-red-500 mx-auto" />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {resource.download_count || 0}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(resource)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteResourceId(resource.id)}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Form Dialog */}
      <ResourceFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        resource={selectedResource}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteResourceId}
        onOpenChange={() => setDeleteResourceId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar recurso?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El recurso será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
