import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Trash2, GripVertical } from 'lucide-react';
import { LandingPage, useCreateLandingPage, useUpdateLandingPage } from '@/hooks/useLandingPages';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LandingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  landing?: LandingPage | null;
}

export const LandingFormDialog = ({ open, onOpenChange, landing }: LandingFormDialogProps) => {
  const [formData, setFormData] = useState<Partial<LandingPage>>({
    title: '',
    slug: '',
    meta_title: '',
    meta_description: '',
    status: 'draft',
    is_active: true,
    use_navbar: true,
    use_footer: true,
    custom_navbar: 'default',
    layout_type: 'default',
    sections: [],
  });
  
  const createMutation = useCreateLandingPage();
  const updateMutation = useUpdateLandingPage();
  
  useEffect(() => {
    if (landing) {
      setFormData(landing);
    } else {
      setFormData({
        title: '',
        slug: '',
        meta_title: '',
        meta_description: '',
        status: 'draft',
        is_active: true,
        use_navbar: true,
        use_footer: true,
        custom_navbar: 'default',
        layout_type: 'default',
        sections: [],
      });
    }
  }, [landing, open]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (landing?.id) {
        await updateMutation.mutateAsync({
          id: landing.id,
          updates: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving landing page:', error);
    }
  };
  
  const handleChange = (field: keyof LandingPage, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };
  
  const handleTitleChange = (title: string) => {
    handleChange('title', title);
    if (!landing) {
      handleChange('slug', generateSlug(title));
    }
  };
  
  const addSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      type: 'text',
      props: {},
    };
    handleChange('sections', [...(formData.sections || []), newSection]);
  };
  
  const removeSection = (index: number) => {
    const newSections = [...(formData.sections || [])];
    newSections.splice(index, 1);
    handleChange('sections', newSections);
  };
  
  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {landing ? 'Editar Landing Page' : 'Nueva Landing Page'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="sections">Secciones</TabsTrigger>
              <TabsTrigger value="config">Configuración</TabsTrigger>
            </TabsList>
            
            {/* General Tab */}
            <TabsContent value="general" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título*</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Abogados de Herencias en Barcelona"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)*</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  placeholder="abogados-herencias-barcelona"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  La URL será: /{formData.slug}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Borrador</SelectItem>
                      <SelectItem value="published">Publicada</SelectItem>
                      <SelectItem value="archived">Archivada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="is_active" className="flex items-center gap-2">
                    Página Activa
                  </Label>
                  <div className="flex items-center gap-2 h-10">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => handleChange('is_active', checked)}
                    />
                    <span className="text-sm text-muted-foreground">
                      {formData.is_active ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="featured_image">Imagen Destacada (URL)</Label>
                <Input
                  id="featured_image"
                  value={formData.featured_image || ''}
                  onChange={(e) => handleChange('featured_image', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </TabsContent>
            
            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title || ''}
                  onChange={(e) => handleChange('meta_title', e.target.value)}
                  placeholder="Abogados de Herencias en Barcelona | Navarro Tax Legal"
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.meta_title?.length || 0}/60 caracteres
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description || ''}
                  onChange={(e) => handleChange('meta_description', e.target.value)}
                  placeholder="Abogados especializados en herencias en Barcelona..."
                  maxLength={160}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.meta_description?.length || 0}/160 caracteres
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Keywords (SEO)</Label>
                <Input
                  placeholder="abogados herencias barcelona, legítima catalana..."
                  value={(formData.keywords || []).join(', ')}
                  onChange={(e) => {
                    const keywords = e.target.value.split(',').map(k => k.trim()).filter(k => k);
                    handleChange('keywords', keywords);
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Separa las keywords con comas
                </p>
              </div>
            </TabsContent>
            
            {/* Sections Tab */}
            <TabsContent value="sections" className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Secciones: {formData.sections?.length || 0}
                </p>
                <Button type="button" onClick={addSection} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Añadir Sección
                </Button>
              </div>
              
              {formData.sections && formData.sections.length > 0 ? (
                <div className="space-y-3">
                  {formData.sections.map((section: any, index: number) => (
                    <Card key={section.id || index}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                            <Badge variant="outline">
                              Sección {index + 1}
                            </Badge>
                            <span className="text-sm font-normal">{section.type}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSection(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          Configuración de sección próximamente disponible
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      No hay secciones añadidas aún
                    </p>
                    <Button 
                      type="button" 
                      onClick={addSection} 
                      variant="outline" 
                      size="sm"
                      className="mt-4"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Añadir Primera Sección
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            {/* Config Tab */}
            <TabsContent value="config" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="layout_type">Tipo de Layout</Label>
                <Select 
                  value={formData.layout_type} 
                  onValueChange={(value) => handleChange('layout_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="full-width">Full Width</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="custom_navbar">Navbar</Label>
                <Select 
                  value={formData.custom_navbar} 
                  onValueChange={(value) => handleChange('custom_navbar', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="landing">Landing (sin menú)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="use_navbar">Mostrar Navbar</Label>
                <Switch
                  id="use_navbar"
                  checked={formData.use_navbar}
                  onCheckedChange={(checked) => handleChange('use_navbar', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="use_footer">Mostrar Footer</Label>
                <Switch
                  id="use_footer"
                  checked={formData.use_footer}
                  onCheckedChange={(checked) => handleChange('use_footer', checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="primary_cta_variant">CTA Variant</Label>
                <Input
                  id="primary_cta_variant"
                  value={formData.primary_cta_variant || ''}
                  onChange={(e) => handleChange('primary_cta_variant', e.target.value)}
                  placeholder="herencias-barcelona"
                />
                <p className="text-xs text-muted-foreground">
                  Variante para el formulario de leads
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                landing ? 'Actualizar' : 'Crear'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
