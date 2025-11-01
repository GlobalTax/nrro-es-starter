import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { PageContent } from '@/types/pageContent';
import { useCreatePageContent, useUpdatePageContent } from '@/hooks/usePageContent';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ContentEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: PageContent | null;
  onSave: () => void;
}

const sectionTypes = [
  { value: 'hero', label: 'Hero Section' },
  { value: 'stats', label: 'Statistics/KPIs' },
  { value: 'about', label: 'About Section' },
  { value: 'logos', label: 'Logos Grid' },
  { value: 'values', label: 'Values/Benefits' },
  { value: 'process', label: 'Process Steps' },
  { value: 'featured_services', label: 'Featured Services' },
  { value: 'custom', label: 'Custom Section' },
];

export function ContentEditorDialog({ open, onOpenChange, content, onSave }: ContentEditorDialogProps) {
  const [sectionKey, setSectionKey] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [jsonContent, setJsonContent] = useState('{}');
  const [jsonError, setJsonError] = useState('');
  const [kpiStats, setKpiStats] = useState<Array<{ label: string; value: string }>>([
    { label: '', value: '' },
    { label: '', value: '' },
    { label: '', value: '' },
    { label: '', value: '' },
  ]);

  const createMutation = useCreatePageContent();
  const updateMutation = useUpdatePageContent();

  const isKpisSection = sectionKey === 'kpis';

  useEffect(() => {
    if (content) {
      setSectionKey(content.section_key);
      setDisplayOrder(content.display_order);
      setIsActive(content.is_active);
      setJsonContent(JSON.stringify(content.content, null, 2));
      
      if (content.section_key === 'kpis' && content.content.stats) {
        const stats = content.content.stats as Array<{ label: string; value: string }>;
        setKpiStats([
          stats[0] || { label: '', value: '' },
          stats[1] || { label: '', value: '' },
          stats[2] || { label: '', value: '' },
          stats[3] || { label: '', value: '' },
        ]);
      }
    } else {
      setSectionKey('');
      setDisplayOrder(0);
      setIsActive(true);
      setJsonContent('{}');
      setKpiStats([
        { label: '', value: '' },
        { label: '', value: '' },
        { label: '', value: '' },
        { label: '', value: '' },
      ]);
    }
    setJsonError('');
  }, [content]);

  const validateJson = (text: string) => {
    try {
      JSON.parse(text);
      setJsonError('');
      return true;
    } catch (e) {
      setJsonError('JSON inválido: ' + (e as Error).message);
      return false;
    }
  };

  const handleSave = async () => {
    if (!content) return;
    
    let parsedContent;
    
    if (isKpisSection) {
      parsedContent = { stats: kpiStats.filter(s => s.label && s.value) };
    } else {
      if (!validateJson(jsonContent)) return;
      parsedContent = JSON.parse(jsonContent);
    }

    try {
      if (content.id) {
        await updateMutation.mutateAsync({
          id: content.id,
          content: {
            section_key: sectionKey,
            content: parsedContent,
            is_active: isActive,
            display_order: displayOrder,
          },
        });
        toast.success('Contenido actualizado correctamente');
      } else {
        await createMutation.mutateAsync({
          page_key: content.page_key,
          section_key: sectionKey,
          content: parsedContent,
          is_active: isActive,
          display_order: displayOrder,
        });
        toast.success('Contenido creado correctamente');
      }
      onSave();
    } catch (error) {
      toast.error('Error al guardar: ' + (error as Error).message);
    }
  };

  const updateKpiStat = (index: number, field: 'label' | 'value', value: string) => {
    const newStats = [...kpiStats];
    newStats[index] = { ...newStats[index], [field]: value };
    setKpiStats(newStats);
  };

  const getTemplateForSection = (type: string) => {
    const templates: Record<string, any> = {
      hero: {
        overline: 'Overline text',
        title: 'Main Title',
        subtitle: 'Subtitle text',
        cta_primary: { text: 'Primary Button', link: '/link' },
        cta_secondary: { text: 'Secondary Button', link: '/link' },
      },
      kpis: {
        stats: [
          { label: 'Abogados y profesionales', value: '+70' },
          { label: 'Clientes Recurrentes', value: '87%' },
          { label: 'Áreas de Práctica', value: '10' },
          { label: 'Cliente Internacional', value: '40%' },
        ],
      },
      about: {
        overline: 'About',
        title: 'Title',
        paragraphs: ['Paragraph 1', 'Paragraph 2'],
        cta: { text: 'Learn More', link: '/link' },
      },
      logos: {
        overline: 'Partners',
        title: 'Our Partners',
        logos: [
          { name: 'Company 1', logo_url: 'https://...', website_url: 'https://...' },
        ],
      },
      values: {
        overline: 'Values',
        title: 'Our Values',
        values: [
          { icon: 'Users', title: 'Value 1', description: 'Description' },
        ],
      },
      process: {
        overline: 'Process',
        title: 'How We Work',
        steps: [
          { icon: 'Target', title: 'Step 1', description: 'Description' },
        ],
      },
    };
    return templates[type] || {};
  };

  const handleTemplateLoad = (type: string) => {
    const template = getTemplateForSection(type);
    setJsonContent(JSON.stringify(template, null, 2));
    setSectionKey(type);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {content?.id ? 'Editar Sección' : 'Nueva Sección'}
          </DialogTitle>
          <DialogDescription>
            {content?.page_key && `Página: ${content.page_key}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="section-type">Tipo de Sección</Label>
              <Select onValueChange={handleTemplateLoad} value={sectionKey}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {sectionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="section-key">Clave de Sección</Label>
              <Input
                id="section-key"
                value={sectionKey}
                onChange={(e) => setSectionKey(e.target.value)}
                placeholder="ej: hero, about, stats"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="display-order">Orden de Visualización</Label>
              <Input
                id="display-order"
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
              />
            </div>

            <div className="flex items-center space-x-2 pt-8">
              <Switch
                id="is-active"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="is-active">Sección Activa</Label>
            </div>
          </div>

          {isKpisSection ? (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                Edita los 4 KPIs que aparecen en la página principal. 
                Usa "+" al inicio o "%" al final en el valor si es necesario (ej: "+70", "87%")
              </div>
              
              {[0, 1, 2, 3].map(index => (
                <div key={index} className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-card">
                  <div>
                    <Label>Etiqueta {index + 1}</Label>
                    <Input 
                      value={kpiStats[index]?.label || ''} 
                      onChange={(e) => updateKpiStat(index, 'label', e.target.value)}
                      placeholder="Ej: Abogados y profesionales"
                    />
                  </div>
                  <div>
                    <Label>Valor {index + 1}</Label>
                    <Input 
                      value={kpiStats[index]?.value || ''} 
                      onChange={(e) => updateKpiStat(index, 'value', e.target.value)}
                      placeholder="Ej: +70, 87%, 10"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <Label htmlFor="content-json">Contenido (JSON)</Label>
              <Textarea
                id="content-json"
                value={jsonContent}
                onChange={(e) => {
                  setJsonContent(e.target.value);
                  validateJson(e.target.value);
                }}
                rows={20}
                className="font-mono text-sm"
                placeholder='{"title": "Example", "description": "..."}'
              />
              {jsonError && (
                <p className="text-sm text-destructive mt-2">{jsonError}</p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!isKpisSection && !!jsonError}>
              Guardar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
