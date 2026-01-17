import { useState, useMemo } from 'react';
import { Plus, Settings, Search, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToolCard } from '@/components/admin/hub/ToolCard';
import { ToolFormDialog } from '@/components/admin/hub/ToolFormDialog';
import { ToolCategoryFilter } from '@/components/admin/hub/ToolCategoryFilter';
import { useInternalTools, useInternalToolMutations, InternalTool, InternalToolInsert } from '@/hooks/useInternalTools';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Skeleton } from '@/components/ui/skeleton';
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

export default function AdminToolsHub() {
  const { canManageUsers } = useAdminAuth();
  const isAdmin = canManageUsers();

  const [isManageMode, setIsManageMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<InternalTool | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toolToDelete, setToolToDelete] = useState<InternalTool | null>(null);

  const { data: tools, isLoading } = useInternalTools(isManageMode);
  const { createTool, updateTool, deleteTool, toggleActive } = useInternalToolMutations();

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
        </div>

        {/* Tools Grid */}
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
        ) : (
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