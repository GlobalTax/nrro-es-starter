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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Newspaper className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Noticias Legales</h1>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-1">
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
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar noticias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge
              variant={categoryFilter === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setCategoryFilter(null)}
            >
              Todas
            </Badge>
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant={categoryFilter === cat ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setCategoryFilter(cat as string)}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* News Table */}
      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Fuente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredArticles?.map((article) => (
              <TableRow key={article.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium flex items-center gap-2">
                      {article.title_es || article.title_ca || article.title_en}
                      {article.generated_with_ai && (
                        <span title="Generado con IA">
                          <Bot className="h-4 w-4 text-primary" />
                        </span>
                      )}
                    </div>
                    {article.excerpt_es && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {article.excerpt_es}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{article.category || "Sin categoría"}</Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {article.source_name || "—"}
                  </span>
                </TableCell>
                <TableCell>
                  {article.published_at
                    ? format(new Date(article.published_at), "dd MMM yyyy", { locale: es })
                    : "No publicado"}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={article.is_published}
                    onCheckedChange={() => togglePublished(article.id, article.is_published)}
                  />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-destructive"
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
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
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
