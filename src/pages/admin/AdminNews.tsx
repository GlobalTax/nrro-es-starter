import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MoreHorizontal, Trash2, Bot, Newspaper, Search, Plus, Pencil } from "lucide-react";
import { TranslateNewsToCatalan } from "@/components/admin/news/TranslateNewsToCatalan";
import { TranslateNewsToEnglish } from "@/components/admin/news/TranslateNewsToEnglish";
import { NewsAutomationPanel } from "@/components/admin/news/NewsAutomationPanel";
import { NewsFormDialog } from "@/components/admin/news/NewsFormDialog";
import { 
  useNewsArticles, 
  useDeleteNewsArticle, 
  useUpdateNewsArticle 
} from "@/hooks/useNewsAutomation";

interface NewsArticle {
  id: string;
  title_es: string | null;
  title_ca: string | null;
  title_en: string | null;
  excerpt_es: string | null;
  content_es: string | null;
  category: string | null;
  source_name: string | null;
  is_published: boolean;
  published_at: string | null;
  generated_with_ai: boolean | null;
}

export const AdminNews = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);

  const { data: articles, isLoading } = useNewsArticles();
  const deleteArticle = useDeleteNewsArticle();
  const updateArticle = useUpdateNewsArticle();

  const filteredArticles = (articles as NewsArticle[] | undefined)?.filter((article) => {
    const matchesSearch = 
      !searchTerm || 
      article.title_es?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt_es?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || article.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(articles?.map((a) => a.category).filter(Boolean))];

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

  const confirmDelete = () => {
    if (articleToDelete) {
      deleteArticle.mutate(articleToDelete);
      setDeleteDialogOpen(false);
      setArticleToDelete(null);
    }
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
        <div className="flex items-center gap-3">
          <Badge className="bg-slate-100 text-slate-700 border-0 font-medium">
            {articles?.length || 0} noticias
          </Badge>
          <Button 
            onClick={handleCreate}
            className="bg-slate-900 hover:bg-slate-800 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nueva noticia
          </Button>
        </div>
      </div>

      {/* Automation Panel */}
      <NewsAutomationPanel />

      {/* Translation Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TranslateNewsToCatalan />
        <TranslateNewsToEnglish />
      </div>

      {/* Filters */}
      <Card className="p-4 border-0 shadow-sm bg-white">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar noticias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              onClick={() => setCategoryFilter(null)}
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
                onClick={() => setCategoryFilter(cat as string)}
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
              <TableHead className="text-slate-600 font-medium">Título</TableHead>
              <TableHead className="text-slate-600 font-medium">Categoría</TableHead>
              <TableHead className="text-slate-600 font-medium">Fuente</TableHead>
              <TableHead className="text-slate-600 font-medium">Fecha</TableHead>
              <TableHead className="text-slate-600 font-medium">Estado</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredArticles?.map((article) => (
              <TableRow key={article.id} className="hover:bg-slate-50/50">
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-slate-900 flex items-center gap-2">
                      {article.title_es || article.title_ca || article.title_en}
                      {article.generated_with_ai && (
                        <span title="Generado con IA">
                          <Bot className="h-3.5 w-3.5 text-indigo-500" />
                        </span>
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
                  <span className="text-sm text-slate-500">
                    {article.source_name || "—"}
                  </span>
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
            ))}
            {filteredArticles?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
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
