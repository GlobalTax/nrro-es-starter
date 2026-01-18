import { useState } from "react";
import { Plus, Search, Pencil, Trash2, Star, Check, X, MoreHorizontal, Copy, Download, FileText, TrendingUp, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { ResourceFormDialog } from "@/components/admin/resources/ResourceFormDialog";
import { ContentTypeBadge, ContentCategoryBadge } from "@/components/admin/content/ContentStatusBadge";
import { useDuplicateResource } from "@/hooks/useDuplicateContent";
import {
  useAdminResources,
  useDeleteResource,
  useResourceStats,
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

  const { data: stats } = useResourceStats();
  const deleteMutation = useDeleteResource();
  const duplicateMutation = useDuplicateResource();

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

  const handleDuplicate = (resource: AdminResource) => {
    duplicateMutation.mutate(resource.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg">
            <Download className="h-5 w-5 text-slate-600" />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-slate-900">Centro de Recursos</h1>
            <p className="text-sm text-slate-500">Gestiona los lead magnets y recursos descargables</p>
          </div>
        </div>
        <Button onClick={handleNewResource} className="bg-slate-900 hover:bg-slate-800">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Recurso
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <FileText className="h-4 w-4 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{stats?.total || 0}</p>
              <p className="text-xs text-slate-500">Total recursos</p>
            </div>
          </div>
        </Card>
        <Card className="border-0 shadow-sm bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{stats?.active || 0}</p>
              <p className="text-xs text-slate-500">Activos</p>
            </div>
          </div>
        </Card>
        <Card className="border-0 shadow-sm bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Star className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{stats?.featured || 0}</p>
              <p className="text-xs text-slate-500">Destacados</p>
            </div>
          </div>
        </Card>
        <Card className="border-0 shadow-sm bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Download className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{stats?.downloads?.toLocaleString() || 0}</p>
              <p className="text-xs text-slate-500">Descargas totales</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm bg-white p-4">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Buscar por título..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 border-slate-200 focus:border-slate-300 focus:ring-slate-200"
            />
          </div>

          <Select
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[150px] border-slate-200">
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
            <SelectTrigger className="w-[170px] border-slate-200">
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
            <SelectTrigger className="w-[130px] border-slate-200">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-sm bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="text-slate-600 font-medium">Título</TableHead>
              <TableHead className="text-slate-600 font-medium">Tipo</TableHead>
              <TableHead className="text-slate-600 font-medium">Categoría</TableHead>
              <TableHead className="text-slate-600 font-medium text-center">Destacado</TableHead>
              <TableHead className="text-slate-600 font-medium text-center">Activo</TableHead>
              <TableHead className="text-slate-600 font-medium text-center">Descargas</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-slate-600"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : resources.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3 bg-slate-100 rounded-full">
                      <Download className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="text-slate-500">No se encontraron recursos</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              resources.map((resource) => (
                <TableRow key={resource.id} className="hover:bg-slate-50/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {resource.thumbnail_url && (
                        <img
                          src={resource.thumbnail_url}
                          alt={resource.title}
                          className="h-10 w-10 object-cover rounded"
                        />
                      )}
                      <span className="font-medium text-slate-900 line-clamp-2">{resource.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <ContentTypeBadge type={resource.type} />
                  </TableCell>
                  <TableCell>
                    <ContentCategoryBadge category={resource.category} />
                  </TableCell>
                  <TableCell className="text-center">
                    {resource.is_featured ? (
                      <Star className="h-4 w-4 text-amber-500 mx-auto fill-amber-500" />
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {resource.is_active ? (
                      <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-red-500 mx-auto" />
                    )}
                  </TableCell>
                  <TableCell className="text-center text-slate-600">
                    {resource.download_count || 0}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(resource)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(resource)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleteResourceId(resource.id)}
                          className="text-red-600 focus:text-red-700 focus:bg-red-50"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

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
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900">¿Eliminar recurso?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              Esta acción no se puede deshacer. El recurso será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-200">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
