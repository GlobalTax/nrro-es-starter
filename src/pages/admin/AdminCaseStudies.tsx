import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CaseStudy } from '@/types/caseStudy';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pencil, Trash2, Plus, Search, Eye, MoreHorizontal, Copy, Briefcase, Star, TrendingUp, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { CaseStudyFormDialog } from '@/components/admin/case-studies/CaseStudyFormDialog';
import { CaseStudyPreviewModal } from '@/components/admin/case-studies/CaseStudyPreviewModal';
import { TranslateCaseStudiesToCatalan } from '@/components/admin/case-studies/TranslateCaseStudiesToCatalan';
import { TranslateCaseStudiesToEnglish } from '@/components/admin/case-studies/TranslateCaseStudiesToEnglish';
import { ContentStatusBadge } from '@/components/admin/content/ContentStatusBadge';
import { useDuplicateCaseStudy } from '@/hooks/useDuplicateContent';
import { useCaseStudyFilterOptions } from '@/hooks/useCaseStudies';
import { CustomPagination } from '@/components/ui/custom-pagination';

const PAGE_SIZE = 10;

export function AdminCaseStudies() {
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [caseStudyToDelete, setCaseStudyToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const duplicateMutation = useDuplicateCaseStudy();

  const { data: filterOptions } = useCaseStudyFilterOptions();

  const { data: caseStudies, isLoading } = useQuery({
    queryKey: ['admin-case-studies', searchQuery, industryFilter, serviceFilter, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('case_studies')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,client_name.ilike.%${searchQuery}%`);
      }
      if (industryFilter !== 'all') {
        query = query.eq('client_industry', industryFilter);
      }
      if (serviceFilter !== 'all') {
        query = query.eq('primary_service', serviceFilter);
      }
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as any);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        metrics: Array.isArray(item.metrics) ? item.metrics : [],
        timeline: Array.isArray(item.timeline) ? item.timeline : [],
        gallery: Array.isArray(item.gallery) ? item.gallery : [],
        related_services: Array.isArray(item.related_services) ? item.related_services : [],
        tags: Array.isArray(item.tags) ? item.tags : [],
      })) as unknown as CaseStudy[];
    },
  });

  const allCaseStudies = caseStudies || [];
  const industries = filterOptions?.industries || [];
  const services = filterOptions?.services || [];

  // Stats
  const publishedCount = allCaseStudies.filter(cs => cs.status === 'published').length;
  const featuredCount = allCaseStudies.filter(cs => cs.is_featured).length;
  const totalViews = allCaseStudies.reduce((acc, cs) => acc + (cs.view_count || 0), 0);

  // Pagination
  const totalCount = allCaseStudies.length;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const paginatedStudies = allCaseStudies.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('case_studies')
        .update({ is_featured: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success('Estado actualizado correctamente');
      queryClient.invalidateQueries({ queryKey: ['admin-case-studies'] });
    } catch (error) {
      toast.error('Error al actualizar el estado');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('case_studies')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Caso de éxito eliminado correctamente');
      queryClient.invalidateQueries({ queryKey: ['admin-case-studies'] });
      setCaseStudyToDelete(null);
    } catch (error) {
      toast.error('Error al eliminar el caso de éxito');
    }
  };

  const handleEdit = (caseStudy: CaseStudy) => {
    setSelectedCaseStudy(caseStudy);
    setIsFormOpen(true);
  };

  const handlePreview = (caseStudy: CaseStudy) => {
    setSelectedCaseStudy(caseStudy);
    setIsPreviewOpen(true);
  };

  const handleDuplicate = (caseStudy: CaseStudy) => {
    duplicateMutation.mutate(caseStudy.id);
  };

  const handleAddNew = () => {
    setSelectedCaseStudy(null);
    setIsFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-slate-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg">
            <Briefcase className="h-5 w-5 text-slate-600" />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-slate-900">Casos de Éxito</h1>
            <p className="text-sm text-slate-500">Gestiona los casos de éxito de tus clientes</p>
          </div>
        </div>
        <Button onClick={handleAddNew} className="bg-slate-900 hover:bg-slate-800">
          <Plus className="h-4 w-4 mr-2" />
          Añadir Caso de Éxito
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <FileText className="h-4 w-4 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{allCaseStudies.length}</p>
              <p className="text-xs text-slate-500">Total casos</p>
            </div>
          </div>
        </Card>
        <Card className="border-0 shadow-sm bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{publishedCount}</p>
              <p className="text-xs text-slate-500">Publicados</p>
            </div>
          </div>
        </Card>
        <Card className="border-0 shadow-sm bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Star className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{featuredCount}</p>
              <p className="text-xs text-slate-500">Destacados</p>
            </div>
          </div>
        </Card>
        <Card className="border-0 shadow-sm bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Eye className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{totalViews.toLocaleString()}</p>
              <p className="text-xs text-slate-500">Vistas totales</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Translation Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TranslateCaseStudiesToCatalan />
        <TranslateCaseStudiesToEnglish />
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm bg-white p-4">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar casos de éxito..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-10 border-slate-200 focus:border-slate-300 focus:ring-slate-200"
            />
          </div>
          <Select value={industryFilter} onValueChange={(v) => { setIndustryFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[180px] border-slate-200">
              <SelectValue placeholder="Industria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las industrias</SelectItem>
              {industries.map((ind) => (
                <SelectItem key={ind} value={ind}>{ind}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={serviceFilter} onValueChange={(v) => { setServiceFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[180px] border-slate-200">
              <SelectValue placeholder="Servicio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los servicios</SelectItem>
              {services.map((svc) => (
                <SelectItem key={svc} value={svc}>{svc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[150px] border-slate-200">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="published">Publicados</SelectItem>
              <SelectItem value="draft">Borradores</SelectItem>
              <SelectItem value="review">En revisión</SelectItem>
              <SelectItem value="archived">Archivados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-sm bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="text-slate-600 font-medium">Cliente</TableHead>
              <TableHead className="text-slate-600 font-medium">Título</TableHead>
              <TableHead className="text-slate-600 font-medium">Sector</TableHead>
              <TableHead className="text-slate-600 font-medium">Servicio</TableHead>
              <TableHead className="text-slate-600 font-medium">Estado</TableHead>
              <TableHead className="text-slate-600 font-medium text-center">Destacado</TableHead>
              <TableHead className="text-slate-600 font-medium text-center">Vistas</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStudies.length > 0 ? (
              paginatedStudies.map((caseStudy) => (
                <TableRow key={caseStudy.id} className="hover:bg-slate-50/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {caseStudy.client_logo_url && (
                        <img
                          src={caseStudy.client_logo_url}
                          alt={caseStudy.client_name}
                          className="h-8 w-8 object-contain"
                        />
                      )}
                      <span className="font-medium text-slate-900">{caseStudy.client_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <span className="line-clamp-1 text-slate-700">{caseStudy.hero_title}</span>
                  </TableCell>
                  <TableCell className="text-slate-600">{caseStudy.client_industry}</TableCell>
                  <TableCell className="text-slate-600">{caseStudy.primary_service || '-'}</TableCell>
                  <TableCell>
                    <ContentStatusBadge status={caseStudy.status} />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={caseStudy.is_featured}
                      onCheckedChange={() => toggleFeatured(caseStudy.id, caseStudy.is_featured)}
                      className="data-[state=checked]:bg-amber-500"
                    />
                  </TableCell>
                  <TableCell className="text-center text-slate-600">{caseStudy.view_count || 0}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handlePreview(caseStudy)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Vista previa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(caseStudy)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(caseStudy)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setCaseStudyToDelete(caseStudy.id)}
                          className="text-red-600 focus:text-red-700 focus:bg-red-50"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3 bg-slate-100 rounded-full">
                      <Briefcase className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="text-slate-500">No se encontraron casos de éxito</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <CaseStudyFormDialog
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedCaseStudy(null);
        }}
        caseStudy={selectedCaseStudy}
      />

      <CaseStudyPreviewModal
        open={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setSelectedCaseStudy(null);
        }}
        caseStudy={selectedCaseStudy}
      />

      <AlertDialog open={!!caseStudyToDelete} onOpenChange={() => setCaseStudyToDelete(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900">¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              Esta acción no se puede deshacer. Se eliminará permanentemente este caso de éxito.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-200">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => caseStudyToDelete && handleDelete(caseStudyToDelete)}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
