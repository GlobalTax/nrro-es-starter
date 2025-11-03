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
  const [datosItems, setDatosItems] = useState<Array<{
    categoria: string;
    valor: string;
    descripcion: string;
  }>>([
    { categoria: '', valor: '', descripcion: '' },
    { categoria: '', valor: '', descripcion: '' },
    { categoria: '', valor: '', descripcion: '' },
    { categoria: '', valor: '', descripcion: '' },
    { categoria: '', valor: '', descripcion: '' },
    { categoria: '', valor: '', descripcion: '' },
  ]);

  const createMutation = useCreatePageContent();
  const updateMutation = useUpdatePageContent();

  const isKpisSection = sectionKey === 'kpis';
  const isDatosSection = sectionKey === 'datos';

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
      
      if (content.section_key === 'datos' && content.content.items) {
        const items = content.content.items as Array<{
          categoria: string;
          valor: string;
          descripcion: string;
        }>;
        setDatosItems([
          items[0] || { categoria: '', valor: '', descripcion: '' },
          items[1] || { categoria: '', valor: '', descripcion: '' },
          items[2] || { categoria: '', valor: '', descripcion: '' },
          items[3] || { categoria: '', valor: '', descripcion: '' },
          items[4] || { categoria: '', valor: '', descripcion: '' },
          items[5] || { categoria: '', valor: '', descripcion: '' },
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
      setDatosItems([
        { categoria: '', valor: '', descripcion: '' },
        { categoria: '', valor: '', descripcion: '' },
        { categoria: '', valor: '', descripcion: '' },
        { categoria: '', valor: '', descripcion: '' },
        { categoria: '', valor: '', descripcion: '' },
        { categoria: '', valor: '', descripcion: '' },
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
    
    if (isDatosSection) {
      parsedContent = {
        titulo: "Datos",
        grid: {
          cols_desktop: 3,
          cols_tablet: 2,
          cols_mobile: 1,
          gap_desktop: 40,
          gap_tablet: 28,
          gap_mobile: 20,
          max_width: 1200
        },
        items: datosItems.filter(d => d.categoria && d.valor)
      };
    } else if (isKpisSection) {
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

  const updateDatosItem = (
    index: number,
    field: 'categoria' | 'valor' | 'descripcion',
    value: string
  ) => {
    const newItems = [...datosItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setDatosItems(newItems);
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
      datos: {
        titulo: "Datos",
        grid: {
          cols_desktop: 3,
          cols_tablet: 2,
          cols_mobile: 1,
          gap_desktop: 40,
          gap_tablet: 28,
          gap_mobile: 20,
          max_width: 1200
        },
        items: [
          { categoria: "Clientes", valor: "300+", descripcion: "Más de 300 empresas familiares y grupos confían en navarro." },
          { categoria: "Proyectos", valor: "500+", descripcion: "Operaciones de reestructuración, sucesión y M&A completadas con éxito." },
          { categoria: "Años de experiencia", valor: "+ 25", descripcion: "Trayectoria sólida acompañando a empresas familiares en su crecimiento." },
          { categoria: "Equipo", valor: "70+", descripcion: "Abogados y profesionales especializados en fiscal, mercantil, laboral y M&A." },
          { categoria: "Compromiso", valor: "100%", descripcion: "Dedicación total a cada mandato, con rigor técnico y confidencialidad." },
          { categoria: "Operaciones M&A", valor: "100+", descripcion: "Mandatos de compra y venta asesorados con un enfoque integral." }
        ]
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
      servicios_destacados: {
        overline: 'Nuestros Servicios Relevantes',
        services: [
          {
            title: 'Asesoramiento Fiscal',
            description: 'Asesoramos a empresas y socios en todas sus obligaciones fiscales',
            category: 'Servicios Fiscales',
            features: [
              'Planificación y optimización fiscal',
              'Procedimiento Tributario',
              'Asesoramiento fiscal recurrente'
            ]
          }
        ]
      },
      tecnologia: {
        overline: 'Tecnología que usamos',
        logos: [
          { name: 'Sage' },
          { name: 'A3 Software' },
          { name: 'Wolters Kluwer' },
        ]
      },
      clientes: {
        overline: 'Empresas que confían en nosotros',
        logos: [
          { name: 'Empresa 1', logo_url: 'https://via.placeholder.com/150x60?text=Logo+1' },
          { name: 'Empresa 2', logo_url: 'https://via.placeholder.com/150x60?text=Logo+2' },
        ]
      },
      introduccion: {
        overline: 'NUESTRO ENFOQUE',
        titulo: 'Soluciones integrales adaptadas a tu negocio',
        descripcion: 'Descripción del enfoque y valores',
        puntos: [
          'Equipo multidisciplinar',
          'Atención personalizada',
          'Tecnología avanzada',
          'Compromiso con la excelencia'
        ]
      },
      areas_destacadas: {
        overline: 'NUESTRAS ÁREAS',
        titulo: 'Cuatro pilares de excelencia',
        areas: [
          {
            nombre: 'Fiscal',
            icono: 'Receipt',
            descripcion: 'Optimización fiscal y planificación tributaria',
            servicios_ejemplo: ['Impuesto de Sociedades', 'IVA', 'IRPF']
          }
        ]
      },
      metodologia: {
        overline: 'CÓMO TRABAJAMOS',
        titulo: 'Nuestro proceso',
        descripcion: 'Un método probado que garantiza resultados',
        pasos: [
          { numero: '01', titulo: 'Análisis', descripcion: 'Estudiamos tu situación' },
          { numero: '02', titulo: 'Estrategia', descripcion: 'Diseñamos un plan' }
        ]
      },
      cta_consulta: {
        titulo: '¿Tienes dudas?',
        descripcion: 'Agenda una consulta gratuita',
        cta_texto: 'Agendar Consulta',
        cta_url: '/contacto'
      },
      faqs: {
        overline: 'PREGUNTAS FRECUENTES',
        titulo: 'Resolvemos tus dudas',
        preguntas: [
          {
            pregunta: '¿Qué servicios incluye la asesoría?',
            respuesta: 'Incluye gestión fiscal, contable, laboral y legal.'
          }
        ]
      },
      cta_final: {
        titulo: '¿Listo para optimizar tu negocio?',
        descripcion: 'Contáctanos hoy',
        cta_primario_texto: 'Solicitar Consulta',
        cta_primario_url: '/contacto',
        cta_secundario_texto: 'Ver Casos de Éxito',
        cta_secundario_url: '/casos-de-exito'
      },
      story: {
        overline: 'Mi trayectoria',
        titulo: '25 años construyendo relaciones de confianza',
        parrafos: [
          'Primer párrafo de la historia...',
          'Segundo párrafo...',
          'Tercer párrafo...'
        ],
        destacado: 'Frase destacada final'
      },
      timeline: {
        overline: 'Trayectoria',
        hitos: [
          { periodo: '2000-2016', titulo: 'Garrigues', descripcion: 'Descripción', icon: 'Briefcase' },
          { periodo: '16 años', titulo: 'Especialización', descripcion: 'Descripción', icon: 'TrendingUp' }
        ]
      },
      diferenciacion: {
        overline: 'Diferenciación',
        cards: [
          { icon: 'Award', titulo: 'Título 1', descripcion: 'Descripción 1' },
          { icon: 'Users', titulo: 'Título 2', descripcion: 'Descripción 2' }
        ]
      },
      founder: {
        overline: 'Fundador',
        nombre: 'Samuel L. Navarro',
        parrafos: [
          'Primer párrafo sobre el fundador...',
          'Segundo párrafo...'
        ],
        cta_texto: 'Conoce al equipo completo',
        cta_url: '/equipo'
      }
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

          {isDatosSection ? (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                Edita las 6 tarjetas de datos que aparecen en la página principal.
              </div>
              
              {[0, 1, 2, 3, 4, 5].map(index => (
                <div key={index} className="space-y-3 p-4 border rounded-lg bg-card">
                  <div className="font-semibold text-sm">Tarjeta {index + 1}</div>
                  
                  <div>
                    <Label>Categoría</Label>
                    <Input 
                      value={datosItems[index]?.categoria || ''} 
                      onChange={(e) => updateDatosItem(index, 'categoria', e.target.value)}
                      placeholder="Ej: Clientes, Proyectos, Equipo"
                    />
                  </div>
                  
                  <div>
                    <Label>Valor</Label>
                    <Input 
                      value={datosItems[index]?.valor || ''} 
                      onChange={(e) => updateDatosItem(index, 'valor', e.target.value)}
                      placeholder="Ej: 300+, + 25, 100%"
                    />
                  </div>
                  
                  <div>
                    <Label>Descripción</Label>
                    <Textarea 
                      value={datosItems[index]?.descripcion || ''} 
                      onChange={(e) => updateDatosItem(index, 'descripcion', e.target.value)}
                      placeholder="Descripción breve (1-2 líneas)"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : isKpisSection ? (
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
            <Button onClick={handleSave} disabled={!isKpisSection && !isDatosSection && !!jsonError}>
              Guardar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
