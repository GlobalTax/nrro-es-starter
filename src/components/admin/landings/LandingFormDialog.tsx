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
import { Loader2, Plus, Trash2, GripVertical, Link, QrCode, RefreshCw } from 'lucide-react';
import { LandingPage, useCreateLandingPage, useUpdateLandingPage } from '@/hooks/useLandingPages';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateUTM, generateQRCode, incrementVersion, generateSlug } from '@/lib/landingUtils';
import { toast } from 'sonner';

const CATEGORIES = [
  'Tax',
  'Legal',
  'Payroll',
  'Corporate',
  'M&A',
  'International',
  'Family Business',
  'Contact',
  'Other',
];

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
    category: 'Other',
    url: '',
    notes: '',
    version: 1,
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
        category: 'Other',
        url: '',
        notes: '',
        version: 1,
      });
    }
  }, [landing, open]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Increment version if updating
      const dataToSave = landing?.id 
        ? { ...formData, version: incrementVersion(formData.version || 1) }
        : formData;
        
      if (landing?.id) {
        await updateMutation.mutateAsync({
          id: landing.id,
          updates: dataToSave,
        });
      } else {
        await createMutation.mutateAsync(dataToSave);
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
  
  const handleGenerateUTM = () => {
    if (!formData.url) {
      toast.error('Por favor, introduce primero una URL');
      return;
    }
    const campaign = formData.slug || 'landing';
    const utmUrl = generateUTM(formData.url, campaign);
    handleChange('utm_url', utmUrl);
    toast.success('URL con UTM generada');
  };
  
  const handleGenerateQR = async () => {
    const urlToUse = formData.utm_url || formData.url;
    if (!urlToUse) {
      toast.error('Por favor, introduce primero una URL');
      return;
    }
    
    toast.info('Generando código QR...');
    const qrCode = await generateQRCode(urlToUse);
    if (qrCode) {
      handleChange('qr_code', qrCode);
      toast.success('Código QR generado');
    } else {
      toast.error('Error al generar el código QR');
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
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
              <TabsTrigger value="sections">Secciones</TabsTrigger>
              <TabsTrigger value="config">Config</TabsTrigger>
            </TabsList>
            
            {/* General Tab */}
            <TabsContent value="general" className="space-y-4">
              {/* Indicador de idioma */}
              {formData.title_es && !formData.title_en && !formData.title_ca && (
                <div className="bg-muted/50 border border-border rounded-lg p-3 mb-4">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Idioma:</span> Esta landing está configurada solo en <span className="font-medium text-foreground">Español</span>. 
                    Los campos base se usan como fallback.
                  </p>
                </div>
              )}
              
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
              
              <div className="space-y-2">
                <Label htmlFor="url">URL Completa</Label>
                <Input
                  id="url"
                  value={formData.url || ''}
                  onChange={(e) => handleChange('url', e.target.value)}
                  placeholder="https://navarro.es/abogados-herencias-barcelona"
                  type="url"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Select 
                    value={formData.category || 'Other'} 
                    onValueChange={(value) => handleChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
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
                      <SelectItem value="needs_review">Needs Review</SelectItem>
                      <SelectItem value="archived">Archivada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="featured_image">Imagen Destacada (URL)</Label>
                  <Input
                    id="featured_image"
                    value={formData.featured_image || ''}
                    onChange={(e) => handleChange('featured_image', e.target.value)}
                    placeholder="https://..."
                  />
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
                <Label htmlFor="notes">Notas Internas</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Notas internas sobre esta landing..."
                  rows={3}
                />
              </div>
            </TabsContent>
            
            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-4">
              {/* Indicador de idioma */}
              {formData.meta_title_es && !formData.meta_title_en && !formData.meta_title_ca && (
                <div className="bg-muted/50 border border-border rounded-lg p-3 mb-4">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">SEO en Español:</span> Esta landing solo tiene meta tags en español. 
                    Los campos base se usan para motores de búsqueda.
                  </p>
                </div>
              )}
              
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
            
            {/* Marketing Tab */}
            <TabsContent value="marketing" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="utm_url">URL con UTM</Label>
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="outline"
                    onClick={handleGenerateUTM}
                  >
                    <Link className="h-4 w-4 mr-1" />
                    Generar UTM
                  </Button>
                </div>
                <Input
                  id="utm_url"
                  value={formData.utm_url || ''}
                  onChange={(e) => handleChange('utm_url', e.target.value)}
                  placeholder="https://navarro.es/landing?utm_source=navarro&utm_medium=landing&utm_campaign=..."
                />
                <p className="text-xs text-muted-foreground">
                  URL con parámetros UTM para tracking de campañas
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Código QR</Label>
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="outline"
                    onClick={handleGenerateQR}
                  >
                    <QrCode className="h-4 w-4 mr-1" />
                    Generar QR
                  </Button>
                </div>
                {formData.qr_code ? (
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <img 
                      src={formData.qr_code} 
                      alt="QR Code" 
                      className="w-48 h-48 mx-auto"
                    />
                    <p className="text-xs text-center text-muted-foreground mt-2">
                      QR generado para: {formData.utm_url || formData.url}
                    </p>
                  </div>
                ) : (
                  <div className="border border-dashed rounded-lg p-8 text-center">
                    <QrCode className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No hay código QR generado aún
                    </p>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ads_campaigns">Campañas de Ads</Label>
                <Textarea
                  id="ads_campaigns"
                  value={formData.ads_campaigns || ''}
                  onChange={(e) => handleChange('ads_campaigns', e.target.value)}
                  placeholder="Google Ads Q1 2025&#10;Meta Ads - Herencias BCN&#10;LinkedIn Campaign"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Lista de campañas publicitarias asociadas a esta landing
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
