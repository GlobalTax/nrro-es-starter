import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, Loader2, FileText } from 'lucide-react';
import { 
  useCreateProposalTemplate, 
  useUpdateProposalTemplate,
  useProposalTemplates,
  uploadTemplateFile,
  TEMPLATE_CATEGORIES,
} from '@/hooks/useProposalTemplates';
import { toast } from 'sonner';

interface ProposalTemplateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateId?: string | null;
}

export function ProposalTemplateFormDialog({ open, onOpenChange, templateId }: ProposalTemplateFormDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [existingFileUrl, setExistingFileUrl] = useState<string | null>(null);
  
  const { data: templates } = useProposalTemplates();
  const createTemplate = useCreateProposalTemplate();
  const updateTemplate = useUpdateProposalTemplate();

  const existingTemplate = templates?.find(t => t.id === templateId);

  useEffect(() => {
    if (existingTemplate) {
      setTitle(existingTemplate.title);
      setDescription(existingTemplate.description || '');
      setCategory(existingTemplate.category);
      setExistingFileUrl(existingTemplate.file_url);
    } else {
      resetForm();
    }
  }, [existingTemplate, open]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setFile(null);
    setExistingFileUrl(null);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Solo se permiten archivos PDF');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!title || !category) {
      toast.error('Completa los campos obligatorios');
      return;
    }

    if (!templateId && !file) {
      toast.error('Selecciona un archivo PDF');
      return;
    }

    setIsUploading(true);

    try {
      let fileUrl = existingFileUrl;

      if (file) {
        fileUrl = await uploadTemplateFile(file);
      }

      if (!fileUrl) {
        throw new Error('No file URL');
      }

      if (templateId) {
        await updateTemplate.mutateAsync({
          id: templateId,
          title,
          description: description || undefined,
          category,
          file_url: fileUrl,
          version: existingTemplate ? existingTemplate.version + 1 : 1,
        });
      } else {
        await createTemplate.mutateAsync({
          title,
          description: description || undefined,
          category,
          file_url: fileUrl,
        });
      }

      handleClose();
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Error al guardar la plantilla');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {templateId ? 'Editar Plantilla' : 'Subir Nueva Plantilla'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Propuesta de servicios fiscales"
            />
          </div>

          <div>
            <Label htmlFor="category">Categoría *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {TEMPLATE_CATEGORIES.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descripción del contenido..."
              rows={3}
            />
          </div>

          <div>
            <Label>Archivo PDF {!templateId && '*'}</Label>
            <div className="mt-2">
              {existingFileUrl && !file && (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg mb-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm flex-1">Archivo actual</span>
                  <a 
                    href={existingFileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Ver PDF
                  </a>
                </div>
              )}
              
              <label 
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  {file ? (
                    <p className="text-sm font-medium">{file.name}</p>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">
                        {templateId ? 'Subir nuevo archivo' : 'Haz clic o arrastra un PDF'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">PDF (máx. 10MB)</p>
                    </>
                  )}
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isUploading}>
            {isUploading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {templateId ? 'Actualizar' : 'Subir Plantilla'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
