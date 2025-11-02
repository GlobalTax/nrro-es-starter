import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { TechItem } from '@/hooks/useTechnology';
import { ImageUpload } from './ImageUpload';

interface TechnologyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  technology?: TechItem;
  onSave: (technology: TechItem) => void;
}

export const TechnologyFormDialog = ({
  open,
  onOpenChange,
  technology,
  onSave
}: TechnologyFormDialogProps) => {
  const [formData, setFormData] = useState<TechItem>({
    name: '',
    category: '',
    description: '',
    mockup_url: '',
    featured: false,
    order: 0
  });

  useEffect(() => {
    if (technology) {
      setFormData(technology);
    } else {
      setFormData({
        name: '',
        category: '',
        description: '',
        mockup_url: '',
        featured: false,
        order: 0
      });
    }
  }, [technology, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {technology ? 'Editar Tecnología' : 'Añadir Tecnología'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Sage"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoría *</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Ej: ERP Contable"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción breve de la tecnología..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Mockup de interfaz *</Label>
            <ImageUpload
              value={formData.mockup_url}
              onChange={(url) => setFormData({ ...formData, mockup_url: url })}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="featured">Marcar como destacado</Label>
              <p className="text-sm text-muted-foreground">
                Las tecnologías destacadas aparecen más grandes (máximo 2)
              </p>
            </div>
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {technology ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
