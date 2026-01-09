import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Upload, Loader2, FileText, Image } from 'lucide-react';
import { toast } from 'sonner';
import {
  CorporatePresentation,
  CorporatePresentationFormData,
  PRESENTATION_CATEGORIES,
  PRESENTATION_LANGUAGES,
  PRESENTATION_FORMATS,
  useCreateCorporatePresentation,
  useUpdateCorporatePresentation,
  uploadPresentationFile,
  uploadPresentationThumbnail,
} from '@/hooks/useCorporatePresentations';

const formSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  description: z.string().optional(),
  category: z.enum(['general', 'fiscal', 'legal', 'ma', 'laboral', 'sector']),
  format: z.enum(['horizontal', 'vertical']),
  language: z.enum(['es', 'en', 'ca']),
  target_audience: z.string().optional(),
  page_count: z.number().optional(),
  tags: z.string().optional(),
  is_active: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface PresentationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  presentation?: CorporatePresentation | null;
}

export function PresentationFormDialog({
  open,
  onOpenChange,
  presentation,
}: PresentationFormDialogProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const createMutation = useCreateCorporatePresentation();
  const updateMutation = useUpdateCorporatePresentation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'general',
      format: 'horizontal',
      language: 'es',
      target_audience: '',
      page_count: undefined,
      tags: '',
      is_active: true,
    },
  });

  useEffect(() => {
    if (presentation) {
      form.reset({
        title: presentation.title,
        description: presentation.description || '',
        category: presentation.category,
        format: presentation.format,
        language: presentation.language,
        target_audience: presentation.target_audience || '',
        page_count: presentation.page_count || undefined,
        tags: presentation.tags?.join(', ') || '',
        is_active: presentation.is_active,
      });
      setFileUrl(presentation.file_url);
      setThumbnailUrl(presentation.thumbnail_url);
      setFileName(null);
    } else {
      form.reset({
        title: '',
        description: '',
        category: 'general',
        format: 'horizontal',
        language: 'es',
        target_audience: '',
        page_count: undefined,
        tags: '',
        is_active: true,
      });
      setFileUrl(null);
      setThumbnailUrl(null);
      setFileName(null);
    }
  }, [presentation, form]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('pdf')) {
      toast.error('Solo se permiten archivos PDF');
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadPresentationFile(file);
      setFileUrl(url);
      setFileName(file.name);
      toast.success('Archivo subido correctamente');
    } catch (error) {
      toast.error('Error al subir el archivo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('image')) {
      toast.error('Solo se permiten imágenes');
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadPresentationThumbnail(file);
      setThumbnailUrl(url);
      toast.success('Thumbnail subido correctamente');
    } catch (error) {
      toast.error('Error al subir el thumbnail');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!fileUrl) {
      toast.error('Debes subir un archivo PDF');
      return;
    }

    const data: CorporatePresentationFormData = {
      title: values.title,
      description: values.description,
      category: values.category,
      format: values.format,
      language: values.language,
      target_audience: values.target_audience,
      page_count: values.page_count,
      tags: values.tags ? values.tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
      is_active: values.is_active,
      file_url: fileUrl,
      thumbnail_url: thumbnailUrl || undefined,
    };

    try {
      if (presentation) {
        await updateMutation.mutateAsync({ id: presentation.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending || isUploading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {presentation ? 'Editar presentación' : 'Nueva presentación'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* File Upload */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Archivo PDF *</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  {fileUrl ? (
                    <div className="flex items-center gap-2 justify-center text-sm">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="truncate max-w-[150px]">
                        {fileName || 'Archivo cargado'}
                      </span>
                    </div>
                  ) : (
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  )}
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="pdf-upload"
                    disabled={isUploading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('pdf-upload')?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {fileUrl ? 'Cambiar PDF' : 'Subir PDF'}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Thumbnail (opcional)</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt="Thumbnail"
                      className="h-16 w-auto mx-auto object-contain"
                    />
                  ) : (
                    <Image className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                    id="thumb-upload"
                    disabled={isUploading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('thumb-upload')?.click()}
                    disabled={isUploading}
                  >
                    {thumbnailUrl ? 'Cambiar' : 'Subir imagen'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input placeholder="Presentación corporativa 2026" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción interna de la presentación..."
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category, Format, Language */}
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PRESENTATION_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Formato</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PRESENTATION_FORMATS.map((fmt) => (
                          <SelectItem key={fmt.value} value={fmt.value}>
                            {fmt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Idioma</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PRESENTATION_LANGUAGES.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Target audience and page count */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="target_audience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Público objetivo</FormLabel>
                    <FormControl>
                      <Input placeholder="Empresas familiares, startups..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="page_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nº de páginas</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="12"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tags */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Etiquetas (separadas por coma)</FormLabel>
                  <FormControl>
                    <Input placeholder="M&A, due diligence, valoración" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Active toggle */}
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <FormLabel>Activa</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Las presentaciones inactivas no aparecen en el listado
                    </p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {presentation ? 'Guardar cambios' : 'Crear presentación'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
