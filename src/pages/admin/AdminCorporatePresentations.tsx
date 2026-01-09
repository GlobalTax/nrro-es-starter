import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Plus, Search, Presentation, Download, FileText, Filter } from 'lucide-react';
import { PresentationCard } from '@/components/admin/presentations/PresentationCard';
import { PresentationFormDialog } from '@/components/admin/presentations/PresentationFormDialog';
import {
  CorporatePresentation,
  useCorporatePresentations,
  useDeleteCorporatePresentation,
  useIncrementDownloadCount,
  PRESENTATION_CATEGORIES,
  PRESENTATION_LANGUAGES,
  PRESENTATION_FORMATS,
} from '@/hooks/useCorporatePresentations';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminCorporatePresentations() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [formatFilter, setFormatFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPresentation, setEditingPresentation] = useState<CorporatePresentation | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: presentations, isLoading } = useCorporatePresentations();
  const deleteMutation = useDeleteCorporatePresentation();
  const incrementDownload = useIncrementDownloadCount();

  const filteredPresentations = presentations?.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesLanguage = languageFilter === 'all' || p.language === languageFilter;
    const matchesFormat = formatFilter === 'all' || p.format === formatFilter;

    return matchesSearch && matchesCategory && matchesLanguage && matchesFormat;
  });

  const handleEdit = (presentation: CorporatePresentation) => {
    setEditingPresentation(presentation);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const handleDownload = (presentation: CorporatePresentation) => {
    incrementDownload.mutate(presentation.id);
    window.open(presentation.file_url, '_blank');
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingPresentation(null);
    }
  };

  const totalPresentations = presentations?.length || 0;
  const totalDownloads = presentations?.reduce((sum, p) => sum + p.download_count, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Presentation className="h-6 w-6" />
            Presentaciones Corporativas
          </h1>
          <p className="text-muted-foreground">
            Gestiona las presentaciones de capabilities para clientes
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva presentación
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <FileText className="h-4 w-4" />
            <span className="text-sm">Total</span>
          </div>
          <p className="text-2xl font-bold">{totalPresentations}</p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Download className="h-4 w-4" />
            <span className="text-sm">Descargas</span>
          </div>
          <p className="text-2xl font-bold">{totalDownloads}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar presentaciones..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {PRESENTATION_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={languageFilter} onValueChange={setLanguageFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Idioma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {PRESENTATION_LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={formatFilter} onValueChange={setFormatFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Formato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {PRESENTATION_FORMATS.map((fmt) => (
                <SelectItem key={fmt.value} value={fmt.value}>
                  {fmt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-video w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredPresentations?.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <Presentation className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-medium text-foreground mb-1">No hay presentaciones</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Sube tu primera presentación corporativa
          </p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Subir presentación
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPresentations?.map((presentation) => (
            <PresentationCard
              key={presentation.id}
              presentation={presentation}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}

      <PresentationFormDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        presentation={editingPresentation}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar presentación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
