import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MoreHorizontal, Trash2, Bot, Newspaper, Search } from "lucide-react";
import { TranslateNewsToCatalan } from "@/components/admin/news/TranslateNewsToCatalan";
import { TranslateNewsToEnglish } from "@/components/admin/news/TranslateNewsToEnglish";
import { NewsAutomationPanel } from "@/components/admin/news/NewsAutomationPanel";
import { 
  useNewsArticles, 
  useDeleteNewsArticle, 
  useUpdateNewsArticle 
} from "@/hooks/useNewsAutomation";

export const AdminNews = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const { data: articles, isLoading } = useNewsArticles();
  const deleteArticle = useDeleteNewsArticle();
  const updateArticle = useUpdateNewsArticle();

  const filteredArticles = articles?.filter((article) => {
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
        <Badge className="bg-slate-100 text-slate-700 border-0 font-medium">
          {articles?.length || 0} noticias
        </Badge>
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
                        className="text-red-600 focus:text-red-700 focus:bg-red-50"
                        onClick={() => deleteArticle.mutate(article.id)}
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
                <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                  No hay noticias que mostrar. Usa el botón "Generar ahora" para crear contenido.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};