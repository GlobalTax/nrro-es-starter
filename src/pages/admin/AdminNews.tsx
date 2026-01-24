import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";
import { MoreHorizontal, Trash2, Bot, Newspaper, Search, Plus, Pencil, Copy, TrendingUp, FileText, Calendar, Settings2, Activity } from "lucide-react";
import { TranslateNewsToCatalan } from "@/components/admin/news/TranslateNewsToCatalan";
import { TranslateNewsToEnglish } from "@/components/admin/news/TranslateNewsToEnglish";
import { NewsAutomationPanel } from "@/components/admin/news/NewsAutomationPanel";
import { NewsDiagnosticsPanel } from "@/components/admin/news/NewsDiagnosticsPanel";
import { NewsFormDialog } from "@/components/admin/news/NewsFormDialog";
import { NewsActionsBar } from "@/components/admin/news/NewsActionsBar";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { useDuplicateNewsArticle } from "@/hooks/useDuplicateContent";
import { 
  useNewsArticles, 
  useDeleteNewsArticle, 
  useUpdateNewsArticle,
  useNewsAutomationSettings
} from "@/hooks/useNewsAutomation";

interface NewsArticle {
  id: string;
  title_es: string | null;
  title_ca: string | null;
  title_en: string | null;
  excerpt_es: string | null;
  excerpt_ca: string | null;
  excerpt_en: string | null;
  content_es: string | null;
  content_ca: string | null;
  content_en: string | null;
  category: string | null;
  source_name: string | null;
  source_url: string | null;
  featured_image_url: string | null;
  tags: string[] | null;
  is_featured: boolean | null;
  is_published: boolean;
  read_time: number | null;
  published_at: string | null;
  generated_with_ai: boolean | null;
  created_at: string | null;
}

const PAGE_SIZE = 10;

export const AdminNews = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [mainTab, setMainTab] = useState("gestion");

  const { data: articles, isLoading } = useNewsArticles();
  const { data: automationSettings } = useNewsAutomationSettings();
  const deleteArticle = useDeleteNewsArticle();
  const updateArticle = useUpdateNewsArticle();
  const duplicateMutation = useDuplicateNewsArticle();

  // Check if automation is stale (last run > 48h ago)
  const lastRunAt = automationSettings?.last_run_at ? new Date(automationSettings.last_run_at) : null;
  const isAutomationStale = lastRunAt && (Date.now() - lastRunAt.getTime()) > 48 * 60 * 60 * 1000;

  const allArticles = (articles as NewsArticle[] | undefined) || [];

  // Filter articles
  const filteredArticles = allArticles.filter((article) => {
    const matchesSearch = 
      !searchTerm || 
      article.title_es?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt_es?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || article.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalCount = filteredArticles.length;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const categories = [...new Set(allArticles.map((a) => a.category).filter(Boolean))];

  // Stats calculations
  const publishedCount = allArticles.filter(a => a.is_published).length;
  const aiGeneratedCount = allArticles.filter(a => a.generated_with_ai).length;
  const weekAgo = subDays(new Date(), 7);
  const thisWeekCount = allArticles.filter(a => 
    a.created_at && new Date(a.created_at) >= weekAgo
  ).length;

  // Selection handlers
  const handleSelectAll = () => {
    const allIds = new Set(filteredArticles.map(a => a.id));
    setSelectedIds(allIds);
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleToggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  const togglePublished = (id: string, currentStatus: boolean) => {
    updateArticle.mutate({
      id,
      updates: { 
        is_published: !currentStatus,
        published_at: !currentStatus ? new Date().toISOString() : null,
      },
    });
  };

  const handleEdit = (article: NewsArticle) => {
    setEditingArticle(article);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setEditingArticle(null);
    setFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setArticleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDuplicate = (article: NewsArticle) => {
    duplicateMutation.mutate(article.id);
  };

  const confirmDelete = () => {
    if (articleToDelete) {
      deleteArticle.mutate(articleToDelete);
      setDeleteDialogOpen(false);
      setArticleToDelete(null);
    }
  };

  // Check translation status
  const getTranslationStatus = (article: NewsArticle) => {
    const hasCA = !!(article.title_ca && article.content_ca);
    const hasEN = !!(article.title_en && article.content_en);
    return { hasCA, hasEN };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-slate-600"></div>
      </div>
    );
  }

  const allSelected = selectedIds.size === filteredArticles.length && filteredArticles.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg">
            <Newspaper className="h-5 w-5 text-slate-600" />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-slate-900">Noticias Legales</h1>
            <p className="text-sm text-slate-500">Gestiona las noticias del sector</p>
          </div>
        </div>
        <Button 
          onClick={handleCreate}
          className="bg-slate-900 hover:bg-slate-800 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nueva noticia
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
              <p className="text-2xl font-semibold text-slate-900">{allArticles.length}</p>
              <p className="text-xs text-slate-500">Total noticias</p>
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
              <p className="text-xs text-slate-500">Publicadas</p>
            </div>
          </div>
        </Card>
        <Card className="border-0 shadow-sm bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Bot className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{aiGeneratedCount}</p>
              <p className="text-xs text-slate-500">Generadas IA</p>
            </div>
          </div>
        </Card>
        <Card className="border-0 shadow-sm bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Calendar className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{thisWeekCount}</p>
              <p className="text-xs text-slate-500">Esta semana</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Tabs: Gestión vs Automatización */}
      <Tabs value={mainTab} onValueChange={setMainTab}>
        <TabsList className="bg-slate-100">
          <TabsTrigger value="gestion" className="data-[state=active]:bg-white">
            <FileText className="h-4 w-4 mr-2" />
            Gestión
          </TabsTrigger>
          <TabsTrigger value="automatizacion" className="data-[state=active]:bg-white">
            <Settings2 className="h-4 w-4 mr-2" />
            Automatización
          </TabsTrigger>
          <TabsTrigger value="diagnostico" className="data-[state=active]:bg-white">
            <Activity className="h-4 w-4 mr-2" />
            Diagnóstico
            {isAutomationStale && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                !
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Gestión Tab */}
        <TabsContent value="gestion" className="space-y-4 mt-4">
          {/* Batch Actions Bar */}
          <NewsActionsBar
            selectedIds={selectedIds}
            onClearSelection={handleClearSelection}
            onSelectAll={handleSelectAll}
            totalCount={filteredArticles.length}
            allSelected={allSelected}
          />

          {/* Filters */}
          <Card className="p-4 border-0 shadow-sm bg-white">
            <div className="flex flex-wrap gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar noticias..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="pl-10 border-slate-200 focus:border-slate-300 focus:ring-slate-200"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge
                  variant={categoryFilter === null ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    categoryFilter === null 
                      ? "bg-slate-900 text-white hover:bg-slate-800" 
                      : "bg-transparent text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                  onClick={() => { setCategoryFilter(null); setCurrentPage(1); }}
                >
                  Todas
                </Badge>
                {categories.map((cat) => (
                  <Badge
                    key={cat}
                    variant={categoryFilter === cat ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      categoryFilter === cat 
                        ? "bg-slate-900 text-white hover:bg-slate-800" 
                        : "bg-transparent text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                    onClick={() => { setCategoryFilter(cat as string); setCurrentPage(1); }}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>

          {/* News Table */}
          <Card className="border-0 shadow-sm bg-white overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleSelectAll();
                        } else {
                          handleClearSelection();
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead className="text-slate-600 font-medium">Título</TableHead>
                  <TableHead className="text-slate-600 font-medium">Categoría</TableHead>
                  <TableHead className="text-slate-600 font-medium">Idiomas</TableHead>
                  <TableHead className="text-slate-600 font-medium">Fecha</TableHead>
                  <TableHead className="text-slate-600 font-medium">Estado</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedArticles.map((article) => {
                  const { hasCA, hasEN } = getTranslationStatus(article);
                  return (
                    <TableRow 
                      key={article.id} 
                      className={`hover:bg-slate-50/50 ${selectedIds.has(article.id) ? "bg-slate-50" : ""}`}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(article.id)}
                          onCheckedChange={() => handleToggleSelection(article.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-slate-900 flex items-center gap-2">
                            <span className="line-clamp-1">{article.title_es || article.title_ca || article.title_en}</span>
                            {article.generated_with_ai && (
                              <span title="Generado con IA">
                                <Bot className="h-3.5 w-3.5 text-indigo-500 flex-shrink-0" />
                              </span>
                            )}
                            {article.is_featured && (
                              <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px] px-1">
                                ★
                              </Badge>
                            )}
                          </div>
                          {article.excerpt_es && (
                            <p className="text-sm text-slate-500 line-clamp-1">
                              {article.excerpt_es}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-slate-200 text-slate-600 font-normal">
                          {article.category || "Sin categoría"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Badge className="bg-slate-900 text-white hover:bg-slate-800 text-[10px] px-1.5">
                            ES
                          </Badge>
                          <Badge 
                            className={`text-[10px] px-1.5 ${
                              hasCA 
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" 
                                : "bg-slate-100 text-slate-400 hover:bg-slate-100"
                            }`}
                          >
                            CA
                          </Badge>
                          <Badge 
                            className={`text-[10px] px-1.5 ${
                              hasEN 
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" 
                                : "bg-slate-100 text-slate-400 hover:bg-slate-100"
                            }`}
                          >
                            EN
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-slate-600">
                          {article.published_at
                            ? format(new Date(article.published_at), "dd MMM yyyy", { locale: es })
                            : "No publicado"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={article.is_published}
                          onCheckedChange={() => togglePublished(article.id, article.is_published)}
                          className="data-[state=checked]:bg-emerald-500"
                        />
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-slate-700 focus:text-slate-900 focus:bg-slate-50"
                              onClick={() => handleEdit(article)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-slate-700 focus:text-slate-900 focus:bg-slate-50"
                              onClick={() => handleDuplicate(article)}
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-700 focus:bg-red-50"
                              onClick={() => handleDeleteClick(article.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {paginatedArticles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-3 bg-slate-100 rounded-full">
                          <Newspaper className="h-6 w-6 text-slate-400" />
                        </div>
                        <p className="text-slate-500">No hay noticias que mostrar.</p>
                        <p className="text-sm text-slate-400">
                          Usa el botón "Generar ahora" o "Nueva noticia" para crear contenido.
                        </p>
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
        </TabsContent>

        {/* Automatización Tab */}
        <TabsContent value="automatizacion" className="space-y-6 mt-4">
          <NewsAutomationPanel />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TranslateNewsToCatalan />
            <TranslateNewsToEnglish />
          </div>
        </TabsContent>

        {/* Diagnóstico Tab */}
        <TabsContent value="diagnostico" className="space-y-6 mt-4">
          <NewsDiagnosticsPanel />
        </TabsContent>
      </Tabs>

      {/* Form Dialog */}
      <NewsFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        article={editingArticle}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900">¿Eliminar noticia?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              Esta acción no se puede deshacer. La noticia será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-200 text-slate-600 hover:bg-slate-50">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
