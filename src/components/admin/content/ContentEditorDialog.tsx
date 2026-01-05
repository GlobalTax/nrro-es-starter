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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Copy, CheckCircle2, AlertCircle, Languages } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ContentEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: PageContent | null;
  onSave: () => void;
}

const sectionTypes = [
  { value: 'hero', label: 'Hero Section' },
  { value: 'stats', label: 'Statistics/KPIs' },
  { value: 'kpis', label: 'KPIs (4 items)' },
  { value: 'datos', label: 'Datos/Estadísticas (6 items)' },
  { value: 'about', label: 'About Section' },
  { value: 'story', label: 'Story (About Page)' },
  { value: 'timeline', label: 'Timeline (About Page)' },
  { value: 'values', label: 'Values (About Page)' },
  { value: 'diferenciacion', label: 'Diferenciación (About Page)' },
  { value: 'founder', label: 'Founder (About Page)' },
  { value: 'servicios_destacados', label: 'Servicios Destacados (4 cards)' },
  { value: 'introduccion', label: 'Introducción Servicios' },
  { value: 'areas_destacadas', label: 'Áreas Destacadas' },
  { value: 'metodologia', label: 'Metodología' },
  { value: 'cta_consulta', label: 'CTA Consulta' },
  { value: 'faqs', label: 'FAQs' },
  { value: 'cta_final', label: 'CTA Final' },
  { value: 'tecnologia', label: 'Tecnología/Logos' },
  { value: 'clientes', label: 'Clientes/Logos Carrusel' },
  { value: 'logos', label: 'Logos Grid' },
  { value: 'process', label: 'Process Steps' },
  { value: 'featured_services', label: 'Featured Services' },
  { value: 'custom', label: 'Custom Section' },
];

type Language = 'es' | 'ca' | 'en';

interface ContentByLanguage {
  es: { json: string; kpis: Array<{ label: string; value: string }>; datos: Array<{ categoria: string; valor: string; descripcion: string }>; id?: string };
  ca: { json: string; kpis: Array<{ label: string; value: string }>; datos: Array<{ categoria: string; valor: string; descripcion: string }>; id?: string };
  en: { json: string; kpis: Array<{ label: string; value: string }>; datos: Array<{ categoria: string; valor: string; descripcion: string }>; id?: string };
}

export function ContentEditorDialog({ open, onOpenChange, content, onSave }: ContentEditorDialogProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('es');
  const [sectionKey, setSectionKey] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [jsonError, setJsonError] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  
  const [contentByLanguage, setContentByLanguage] = useState<ContentByLanguage>({
    es: { json: '{}', kpis: Array(4).fill(null).map(() => ({ label: '', value: '' })), datos: Array(6).fill(null).map(() => ({ categoria: '', valor: '', descripcion: '' })) },
    ca: { json: '{}', kpis: Array(4).fill(null).map(() => ({ label: '', value: '' })), datos: Array(6).fill(null).map(() => ({ categoria: '', valor: '', descripcion: '' })) },
    en: { json: '{}', kpis: Array(4).fill(null).map(() => ({ label: '', value: '' })), datos: Array(6).fill(null).map(() => ({ categoria: '', valor: '', descripcion: '' })) },
  });

  const createMutation = useCreatePageContent();
  const updateMutation = useUpdatePageContent();

  const isKpisSection = sectionKey === 'kpis';
  const isDatosSection = sectionKey === 'datos';

  const currentContent = contentByLanguage[selectedLanguage];
  const hasSpanishContent = contentByLanguage.es.json !== '{}' || contentByLanguage.es.kpis.some(k => k.label || k.value);
  
  const getLanguageStatus = (lang: Language) => {
    const content = contentByLanguage[lang];
    if (isKpisSection) return content.kpis.some(k => k.label || k.value);
    if (isDatosSection) return content.datos.some(d => d.categoria || d.valor);
    return content.json !== '{}';
  };

  useEffect(() => {
    const loadContent = async () => {
      if (content && open) {
        setSectionKey(content.section_key);
        setDisplayOrder(content.display_order);
        setIsActive(content.is_active);

        const { data: allVersions } = await supabase
          .from('page_content')
          .select('*')
          .eq('page_key', content.page_key)
          .eq('section_key', content.section_key);

        const newContentByLanguage: ContentByLanguage = {
          es: { json: '{}', kpis: Array(4).fill(null).map(() => ({ label: '', value: '' })), datos: Array(6).fill(null).map(() => ({ categoria: '', valor: '', descripcion: '' })) },
          ca: { json: '{}', kpis: Array(4).fill(null).map(() => ({ label: '', value: '' })), datos: Array(6).fill(null).map(() => ({ categoria: '', valor: '', descripcion: '' })) },
          en: { json: '{}', kpis: Array(4).fill(null).map(() => ({ label: '', value: '' })), datos: Array(6).fill(null).map(() => ({ categoria: '', valor: '', descripcion: '' })) },
        };

        allVersions?.forEach((version) => {
          const lang = version.language as Language;
          const versionContent = version.content as any;
          newContentByLanguage[lang].id = version.id;

          if (content.section_key === 'kpis' && versionContent?.stats) {
            newContentByLanguage[lang].kpis = Array(4).fill(null).map((_, i) => versionContent.stats[i] || { label: '', value: '' });
          } else if (content.section_key === 'datos' && versionContent?.items) {
            newContentByLanguage[lang].datos = Array(6).fill(null).map((_, i) => versionContent.items[i] || { categoria: '', valor: '', descripcion: '' });
          } else {
            newContentByLanguage[lang].json = JSON.stringify(version.content, null, 2);
          }
        });

        setContentByLanguage(newContentByLanguage);
      } else {
        setSectionKey('');
        setDisplayOrder(0);
        setIsActive(true);
        setContentByLanguage({
          es: { json: '{}', kpis: Array(4).fill(null).map(() => ({ label: '', value: '' })), datos: Array(6).fill(null).map(() => ({ categoria: '', valor: '', descripcion: '' })) },
          ca: { json: '{}', kpis: Array(4).fill(null).map(() => ({ label: '', value: '' })), datos: Array(6).fill(null).map(() => ({ categoria: '', valor: '', descripcion: '' })) },
          en: { json: '{}', kpis: Array(4).fill(null).map(() => ({ label: '', value: '' })), datos: Array(6).fill(null).map(() => ({ categoria: '', valor: '', descripcion: '' })) },
        });
      }
      setJsonError('');
    };

    loadContent();
  }, [content, open]);

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

    if (!getLanguageStatus('es')) {
      toast.error('El contenido en español es obligatorio');
      return;
    }

    try {
      for (const lang of ['es', 'ca', 'en'] as Language[]) {
        const langContent = contentByLanguage[lang];
        let parsedContent;

        if (isDatosSection) {
          parsedContent = {
            titulo: "Datos",
            grid: { cols_desktop: 3, cols_tablet: 2, cols_mobile: 1, gap_desktop: 40, gap_tablet: 28, gap_mobile: 20, max_width: 1200 },
            items: langContent.datos.filter(d => d.categoria && d.valor)
          };
        } else if (isKpisSection) {
          parsedContent = { stats: langContent.kpis.filter(s => s.label && s.value) };
        } else {
          if (!validateJson(langContent.json)) {
            if (lang === 'es') return;
            continue;
          }
          parsedContent = JSON.parse(langContent.json);
        }

        if (langContent.id) {
          await updateMutation.mutateAsync({
            id: langContent.id,
            content: { section_key: sectionKey, content: parsedContent, is_active: isActive, display_order: displayOrder },
          });
        } else {
          await supabase.from('page_content').insert({
            page_key: content.page_key,
            section_key: sectionKey,
            content: parsedContent,
            is_active: isActive,
            display_order: displayOrder,
            language: lang,
          });
        }
      }

      toast.success('Contenido guardado en todos los idiomas');
      onSave();
    } catch (error) {
      toast.error('Error al guardar: ' + (error as Error).message);
    }
  };

  const copyFromSpanish = () => {
    if (!hasSpanishContent) {
      toast.error('No hay contenido en español para copiar');
      return;
    }

    if (currentContent.json !== '{}' && selectedLanguage !== 'es') {
      if (!confirm(`¿Sobrescribir el contenido existente en ${selectedLanguage.toUpperCase()}?`)) return;
    }

    setContentByLanguage(prev => ({
      ...prev,
      [selectedLanguage]: { ...prev.es, id: prev[selectedLanguage].id }
    }));

    toast.success(`Contenido copiado desde español. Recuerda traducirlo antes de guardar.`);
  };

  const translateFromSpanish = async () => {
    if (!hasSpanishContent) {
      toast.error('No hay contenido en español para traducir');
      return;
    }

    if (selectedLanguage === 'es') {
      toast.error('Ya estás en la versión española');
      return;
    }

    if (currentContent.json !== '{}' && !confirm(`¿Sobrescribir el contenido existente en ${selectedLanguage.toUpperCase()}?`)) {
      return;
    }

    setIsTranslating(true);
    try {
      let textToTranslate: any;

      if (isKpisSection) {
        textToTranslate = contentByLanguage.es.kpis.map(k => ({ label: k.label, value: k.value }));
      } else if (isDatosSection) {
        textToTranslate = contentByLanguage.es.datos.map(d => ({ 
          categoria: d.categoria, 
          valor: d.valor, 
          descripcion: d.descripcion 
        }));
      } else {
        textToTranslate = JSON.parse(contentByLanguage.es.json);
      }

      const { data, error } = await supabase.functions.invoke('translate-content', {
        body: { 
          text: textToTranslate,
          targetLang: selectedLanguage,
          sourceLang: 'es'
        }
      });

      if (error) throw error;

      const translated = data.translatedText;

      if (isKpisSection) {
        setContentByLanguage(prev => ({
          ...prev,
          [selectedLanguage]: { 
            ...prev[selectedLanguage], 
            kpis: Array.isArray(translated) ? translated : prev[selectedLanguage].kpis 
          }
        }));
      } else if (isDatosSection) {
        setContentByLanguage(prev => ({
          ...prev,
          [selectedLanguage]: { 
            ...prev[selectedLanguage], 
            datos: Array.isArray(translated) ? translated : prev[selectedLanguage].datos 
          }
        }));
      } else {
        setContentByLanguage(prev => ({
          ...prev,
          [selectedLanguage]: { 
            ...prev[selectedLanguage], 
            json: JSON.stringify(translated, null, 2) 
          }
        }));
      }

      toast.success(`Traducción a ${selectedLanguage === 'ca' ? 'catalán' : 'inglés'} completada`);
    } catch (error) {
      console.error('Translation error:', error);
      toast.error(`Error al traducir: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsTranslating(false);
    }
  };

  const updateCurrentLanguageContent = (field: 'json' | 'kpis' | 'datos', value: any) => {
    setContentByLanguage(prev => ({
      ...prev,
      [selectedLanguage]: { ...prev[selectedLanguage], [field]: value }
    }));
  };

  const updateKpiStat = (index: number, field: 'label' | 'value', value: string) => {
    const newStats = [...currentContent.kpis];
    newStats[index] = { ...newStats[index], [field]: value };
    updateCurrentLanguageContent('kpis', newStats);
  };

  const updateDatosItem = (index: number, field: 'categoria' | 'valor' | 'descripcion', value: string) => {
    const newItems = [...currentContent.datos];
    newItems[index] = { ...newItems[index], [field]: value };
    updateCurrentLanguageContent('datos', newItems);
  };

  const handleTemplateLoad = (type: string) => {
    setSectionKey(type);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{content?.id ? 'Editar Sección Multiidioma' : 'Nueva Sección Multiidioma'}</span>
            <div className="flex gap-2">
              {(['es', 'ca', 'en'] as Language[]).map(lang => (
                <Badge key={lang} variant={getLanguageStatus(lang) ? 'default' : 'secondary'}>
                  {lang.toUpperCase()} {getLanguageStatus(lang) ? <CheckCircle2 className="w-3 h-3 ml-1" /> : <AlertCircle className="w-3 h-3 ml-1" />}
                </Badge>
              ))}
            </div>
          </DialogTitle>
          <DialogDescription>
            {content?.page_key && `Página: ${content.page_key} | ES obligatorio, CA/EN opcionales`}
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

          <Tabs value={selectedLanguage} onValueChange={(v) => setSelectedLanguage(v as Language)} className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="es">🇪🇸 Español {!getLanguageStatus('es') && <span className="ml-1 text-destructive">*</span>}</TabsTrigger>
                <TabsTrigger value="ca">🇪🇸 Català</TabsTrigger>
                <TabsTrigger value="en">🇬🇧 English</TabsTrigger>
              </TabsList>
              {selectedLanguage !== 'es' && hasSpanishContent && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyFromSpanish}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar desde Español
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={translateFromSpanish}
                    disabled={isTranslating}
                  >
                    <Languages className="w-4 h-4 mr-2" />
                    {isTranslating ? 'Traduciendo...' : 'Traducir desde Español'}
                  </Button>
                </div>
              )}
            </div>

            {(['es', 'ca', 'en'] as Language[]).map(lang => (
              <TabsContent key={lang} value={lang} className="space-y-4">
                {isDatosSection ? (
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                      Edita las 6 tarjetas de datos en {lang.toUpperCase()}
                    </div>
                    
                    {[0, 1, 2, 3, 4, 5].map(index => (
                      <div key={index} className="space-y-3 p-4 border rounded-lg bg-card">
                        <div className="font-medium text-sm">Tarjeta {index + 1}</div>
                        
                        <div>
                          <Label>Categoría</Label>
                          <Input 
                            value={contentByLanguage[lang].datos[index]?.categoria || ''} 
                            onChange={(e) => {
                              setSelectedLanguage(lang);
                              updateDatosItem(index, 'categoria', e.target.value);
                            }}
                            placeholder="Ej: Clientes, Proyectos, Equipo"
                          />
                        </div>
                        
                        <div>
                          <Label>Valor</Label>
                          <Input 
                            value={contentByLanguage[lang].datos[index]?.valor || ''}
                            onChange={(e) => {
                              setSelectedLanguage(lang);
                              updateDatosItem(index, 'valor', e.target.value);
                            }}
                            placeholder="Ej: 300+, 70+, 100%"
                          />
                        </div>
                        
                        <div>
                          <Label>Descripción</Label>
                          <Textarea 
                            value={contentByLanguage[lang].datos[index]?.descripcion || ''}
                            onChange={(e) => {
                              setSelectedLanguage(lang);
                              updateDatosItem(index, 'descripcion', e.target.value);
                            }}
                            placeholder="Descripción de la métrica"
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : isKpisSection ? (
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                      Edita los 4 KPIs que aparecen en la página en {lang.toUpperCase()}
                    </div>
                    
                    {[0, 1, 2, 3].map(index => (
                      <div key={index} className="space-y-2 p-4 border rounded-lg bg-card">
                        <div className="font-medium text-sm">KPI {index + 1}</div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Valor</Label>
                            <Input
                              value={contentByLanguage[lang].kpis[index]?.value || ''}
                              onChange={(e) => {
                                setSelectedLanguage(lang);
                                updateKpiStat(index, 'value', e.target.value);
                              }}
                              placeholder="Ej: +70, 87%, 10"
                            />
                          </div>
                          <div>
                            <Label>Etiqueta</Label>
                            <Input
                              value={contentByLanguage[lang].kpis[index]?.label || ''}
                              onChange={(e) => {
                                setSelectedLanguage(lang);
                                updateKpiStat(index, 'label', e.target.value);
                              }}
                              placeholder="Ej: Abogados, Clientes"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Contenido JSON ({lang.toUpperCase()})</Label>
                    <Textarea
                      value={contentByLanguage[lang].json}
                      onChange={(e) => {
                        setSelectedLanguage(lang);
                        updateCurrentLanguageContent('json', e.target.value);
                        validateJson(e.target.value);
                      }}
                      placeholder="{ ... }"
                      className="font-mono text-sm"
                      rows={20}
                    />
                    {jsonError && selectedLanguage === lang && (
                      <p className="text-sm text-destructive">{jsonError}</p>
                    )}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!isKpisSection && !isDatosSection && !!jsonError}>
              Guardar en todos los idiomas
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}