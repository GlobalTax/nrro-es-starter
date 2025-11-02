import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, ChevronUp, ChevronDown, Pencil, Trash2, Star } from 'lucide-react';
import { useTechnology, useUpdateTechnology, TechItem } from '@/hooks/useTechnology';
import { TechnologyFormDialog } from '@/components/admin/TechnologyFormDialog';
import { toast } from 'sonner';
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

export default function AdminTechnology() {
  const { data: technologies = [], isLoading } = useTechnology();
  const updateTechnology = useUpdateTechnology();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTech, setEditingTech] = useState<TechItem | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [techToDelete, setTechToDelete] = useState<number | null>(null);

  const handleAdd = () => {
    setEditingTech(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (tech: TechItem) => {
    setEditingTech(tech);
    setDialogOpen(true);
  };

  const handleSave = (newTech: TechItem) => {
    let updatedTechnologies: TechItem[];

    if (editingTech) {
      // Actualizar existente
      updatedTechnologies = technologies.map(t => 
        t.order === editingTech.order ? newTech : t
      );
    } else {
      // Añadir nueva
      const maxOrder = technologies.length > 0 
        ? Math.max(...technologies.map(t => t.order)) 
        : 0;
      updatedTechnologies = [...technologies, { ...newTech, order: maxOrder + 1 }];
    }

    // Validar máximo 2 destacadas
    const featuredCount = updatedTechnologies.filter(t => t.featured).length;
    if (featuredCount > 2) {
      toast.error('Solo puedes tener máximo 2 tecnologías destacadas');
      return;
    }

    updateTechnology.mutate(updatedTechnologies);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= technologies.length) return;

    const reordered = [...technologies];
    [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
    
    // Actualizar orden
    reordered.forEach((item, i) => item.order = i + 1);
    
    updateTechnology.mutate(reordered);
  };

  const handleToggleFeatured = (index: number) => {
    const updated = [...technologies];
    const currentFeaturedCount = updated.filter(t => t.featured).length;
    
    if (!updated[index].featured && currentFeaturedCount >= 2) {
      toast.error('Solo puedes tener 2 tecnologías destacadas');
      return;
    }
    
    updated[index].featured = !updated[index].featured;
    updateTechnology.mutate(updated);
  };

  const confirmDelete = (index: number) => {
    setTechToDelete(index);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (techToDelete === null) return;
    
    const updated = technologies.filter((_, i) => i !== techToDelete);
    // Reordenar
    updated.forEach((item, i) => item.order = i + 1);
    
    updateTechnology.mutate(updated);
    setDeleteDialogOpen(false);
    setTechToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Cargando tecnologías...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tecnología que usamos</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona las tecnologías mostradas en la página principal
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Añadir Tecnología
        </Button>
      </div>

      <div className="space-y-4">
        {technologies.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <p className="text-center text-muted-foreground">
                No hay tecnologías configuradas. Añade la primera tecnología.
              </p>
            </CardContent>
          </Card>
        ) : (
          technologies.map((tech, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  {/* Mockup Preview */}
                  <div className="w-32 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {tech.mockup_url ? (
                      <img 
                        src={tech.mockup_url} 
                        alt={tech.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                        Sin imagen
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{tech.name}</h3>
                          {tech.featured && (
                            <Badge variant="secondary" className="gap-1">
                              <Star className="h-3 w-3 fill-current" />
                              Destacado
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {tech.category}
                        </p>
                        <p className="text-sm text-foreground/80 line-clamp-2">
                          {tech.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Orden: {tech.order}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleFeatured(index)}
                          title={tech.featured ? 'Quitar destacado' : 'Marcar destacado'}
                        >
                          <Star className={`h-4 w-4 ${tech.featured ? 'fill-current' : ''}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMove(index, 'up')}
                          disabled={index === 0}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMove(index, 'down')}
                          disabled={index === technologies.length - 1}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(tech)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => confirmDelete(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <TechnologyFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        technology={editingTech}
        onSave={handleSave}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar tecnología?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La tecnología será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
