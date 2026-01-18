import { useState, useMemo } from 'react';
import { Plus, Settings, Search, Grid3X3, LayoutList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToolCard } from '@/components/admin/hub/ToolCard';
import { ToolFormDialog } from '@/components/admin/hub/ToolFormDialog';
import { ToolCategoryFilter } from '@/components/admin/hub/ToolCategoryFilter';
import { useInternalTools, useInternalToolMutations, InternalTool, InternalToolInsert } from '@/hooks/useInternalTools';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, ExternalLink } from 'lucide-react';

export default function AdminToolsHub() {
  const { canManageUsers } = useAdminAuth();
  const isAdmin = canManageUsers();

  const [isManageMode, setIsManageMode] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<InternalTool | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toolToDelete, setToolToDelete] = useState<InternalTool | null>(null);

  const { data: tools, isLoading } = useInternalTools(isManageMode);
  const { createTool, updateTool, deleteTool, toggleActive } = useInternalToolMutations();

  // Stats
  const stats = useMemo(() => {
    if (!tools) return { total: 0, active: 0, inactive: 0, categories: {} as Record<string, number> };
    const categories: Record<string, number> = {};
    tools.forEach(t => {
      if (t.category) {
        categories[t.category] = (categories[t.category] || 0) + 1;
      }
    });
    return {
      total: tools.length,
      active: tools.filter(t => t.is_active).length,
      inactive: tools.filter(t => !t.is_active).length,
      categories,
    };
  }, [tools]);

  const filteredTools = useMemo(() => {
    if (!tools) return [];
    return tools.filter((tool) => {
      const matchesSearch =
        !searchQuery ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [tools, searchQuery, selectedCategory]);

  const handleEdit = (tool: InternalTool) => {
    setEditingTool(tool);
    setFormOpen(true);
  };

  const handleDelete = (tool: InternalTool) => {
    setToolToDelete(tool);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (toolToDelete) {
      deleteTool.mutate(toolToDelete.id);
      setDeleteDialogOpen(false);
      setToolToDelete(null);
    }
  };

  const handleToggleActive = (tool: InternalTool) => {
    toggleActive.mutate({ id: tool.id, is_active: !tool.is_active });
  };

  const handleFormSubmit = (data: InternalToolInsert) => {
    if (editingTool) {
      updateTool.mutate({ id: editingTool.id, updates: data });
    } else {
      createTool.mutate(data);
    }
    setFormOpen(false);
    setEditingTool(null);
  };

  const handleFormClose = (open: boolean) => {
    setFormOpen(open);
    if (!open) {
      setEditingTool(null);
    }
  };

  const categoryLabels: Record<string, string> = {
    admin: 'Administración',
    comercial: 'Comercial',
    rrhh: 'Recursos Humanos',
    marketing: 'Marketing',
    finanzas: 'Finanzas',
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-medium text-slate-900">Hub de Herramientas</h1>
            <p className="text-slate-500 text-sm">
              Accede rápidamente a todas las aplicaciones internas
            </p>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <Button
                variant={isManageMode ? 'default' : 'outline'}
                onClick={() => setIsManageMode(!isManageMode)}
                className={isManageMode 
                  ? 'bg-slate-900 hover:bg-slate-800' 
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }
              >
                <Settings className="h-4 w-4 mr-2" />
                {isManageMode ? 'Vista normal' : 'Gestionar'}
              </Button>
              {isManageMode && (
                <Button onClick={() => setFormOpen(true)} className="bg-slate-900 hover:bg-slate-800">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva herramienta
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium text-slate-900">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Activas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-medium text-emerald-600">{stats.active}</div>
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Inactivas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-medium text-red-600">{stats.inactive}</div>
                {stats.inactive > 0 && <div className="h-2.5 w-2.5 rounded-full bg-red-500" />}
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Por Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-slate-600">
                {Object.entries(stats.categories).map(([cat, count], idx) => (
                  <span key={cat}>
                    {categoryLabels[cat] || cat}: {count}
                    {idx < Object.keys(stats.categories).length - 1 ? ' | ' : ''}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Buscar herramientas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-slate-200 focus:border-slate-300 focus:ring-slate-200"
            />
          </div>
          <ToolCategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          <div className="flex gap-1 border border-slate-200 rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-slate-900 hover:bg-slate-800' : 'text-slate-600'}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className={viewMode === 'table' ? 'bg-slate-900 hover:bg-slate-800' : 'text-slate-600'}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-[200px] rounded-lg bg-slate-100" />
            ))}
          </div>
        ) : filteredTools.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 bg-slate-100 rounded-full mb-4">
              <Grid3X3 className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No se encontraron herramientas</h3>
            <p className="text-slate-500 text-sm mt-1">
              {searchQuery || selectedCategory
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Añade tu primera herramienta al hub'}
            </p>
            {isAdmin && !searchQuery && !selectedCategory && (
              <Button className="mt-4 bg-slate-900 hover:bg-slate-800" onClick={() => setFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Añadir herramienta
              </Button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isManageMode={isManageMode}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
              />
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 border-b border-slate-100">
                    <TableHead>Herramienta</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>URL</TableHead>
                    {isManageMode && <TableHead>Estado</TableHead>}
                    <TableHead className="w-20">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTools.map((tool) => (
                    <TableRow key={tool.id} className="border-b border-slate-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div 
                            className="h-9 w-9 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                            style={{ backgroundColor: tool.color || '#6366f1' }}
                          >
                            {tool.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{tool.name}</p>
                            <p className="text-xs text-slate-500 line-clamp-1">{tool.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {tool.category && (
                          <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                            {categoryLabels[tool.category] || tool.category}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm max-w-[200px] truncate">
                        {tool.login_url}
                      </TableCell>
                      {isManageMode && (
                        <TableCell>
                          <Switch
                            checked={tool.is_active}
                            onCheckedChange={() => handleToggleActive(tool)}
                          />
                        </TableCell>
                      )}
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => window.open(tool.login_url, '_blank')}>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Abrir
                            </DropdownMenuItem>
                            {isManageMode && (
                              <>
                                <DropdownMenuItem onClick={() => handleEdit(tool)}>
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(tool)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Eliminar
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Form Dialog */}
      <ToolFormDialog
        open={formOpen}
        onOpenChange={handleFormClose}
        tool={editingTool}
        onSubmit={handleFormSubmit}
        isLoading={createTool.isPending || updateTool.isPending}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar herramienta?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de eliminar "{toolToDelete?.name}". Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
