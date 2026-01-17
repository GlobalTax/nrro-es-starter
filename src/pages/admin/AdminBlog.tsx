import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlogStatsCard } from "@/components/admin/blog/BlogStatsCard";
import { BlogFormDialog } from "@/components/admin/blog/BlogFormDialog";
import { BlogPreviewModal } from "@/components/admin/blog/BlogPreviewModal";
import { BlogAutomationPanel } from "@/components/admin/blog/BlogAutomationPanel";
import { TranslateBlogToCatalan } from "@/components/admin/blog/TranslateBlogToCatalan";
import { TranslateBlogToEnglish } from "@/components/admin/blog/TranslateBlogToEnglish";
import { useBlogSearch } from "@/hooks/useBlogSearch";
import { Plus, Eye, Edit, Trash2, CheckCircle, Search, Bot, FileText } from "lucide-react";
import { format } from "date-fns";
import { CustomPagination } from "@/components/ui/custom-pagination";

const ITEMS_PER_PAGE = 10;

export const AdminBlog = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);

  const { data, isLoading, refetch } = useBlogSearch({
    searchQuery: searchQuery || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
    limit: ITEMS_PER_PAGE,
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
    sourceSite: "int",
  });

  const posts = data?.posts || [];
  const totalCount = data?.totalCount || 0;

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-search"] });
      queryClient.invalidateQueries({ queryKey: ["blog-stats"] });
      toast({
        title: "Artículo eliminado",
        description: "El artículo se ha eliminado correctamente",
      });
      setDeletePostId(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const publishMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("blog_posts")
        .update({ status: "published", published_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["blog-stats"] });
      toast({
        title: "Artículo publicado",
        description: "El artículo se ha publicado correctamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-emerald-100 text-emerald-700 border-0 font-medium">Publicado</Badge>;
      case "draft":
        return <Badge className="bg-slate-100 text-slate-600 border-0 font-medium">Borrador</Badge>;
      case "scheduled":
        return <Badge className="bg-amber-100 text-amber-700 border-0 font-medium">Programado</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-600 border-0">{status}</Badge>;
    }
  };

  const [loadingEdit, setLoadingEdit] = useState(false);

  const handleEdit = async (post: any) => {
    setLoadingEdit(true);
    try {
      const { data: fullPost, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", post.id)
        .single();
      
      if (error) throw error;
      
      setSelectedPost(fullPost);
      setIsFormOpen(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo cargar el artículo",
        variant: "destructive",
      });
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleNew = () => {
    setSelectedPost(null);
    setIsFormOpen(true);
  };

  const handlePreview = (post: any) => {
    setSelectedPost(post);
    setIsPreviewOpen(true);
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium text-slate-900">Blog</h1>
          <p className="text-sm text-slate-500">Gestiona los artículos del blog</p>
        </div>
        <Button onClick={handleNew} className="bg-slate-900 hover:bg-slate-800">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Artículo
        </Button>
      </div>

      <BlogStatsCard />

      <Tabs defaultValue="posts" className="space-y-4">
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger 
            value="posts" 
            className="gap-2 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
          >
            <FileText className="h-4 w-4" />
            Artículos
          </TabsTrigger>
          <TabsTrigger 
            value="automation" 
            className="gap-2 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
          >
            <Bot className="h-4 w-4" />
            Automatización
          </TabsTrigger>
        </TabsList>

        <TabsContent value="automation" className="space-y-4">
          <BlogAutomationPanel />
        </TabsContent>

        <TabsContent value="posts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TranslateBlogToCatalan />
            <TranslateBlogToEnglish />
          </div>

          <Card className="border-0 shadow-sm bg-white p-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar artículos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-slate-200 focus:border-slate-300 focus:ring-slate-200"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px] border-slate-200">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="published">Publicados</SelectItem>
                  <SelectItem value="draft">Borradores</SelectItem>
                  <SelectItem value="scheduled">Programados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center min-h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-slate-600"></div>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                      <TableHead className="text-slate-600 font-medium">Título</TableHead>
                      <TableHead className="text-slate-600 font-medium">Categoría</TableHead>
                      <TableHead className="text-slate-600 font-medium">Estado</TableHead>
                      <TableHead className="text-slate-600 font-medium">Fecha</TableHead>
                      <TableHead className="text-slate-600 font-medium">Vistas</TableHead>
                      <TableHead className="text-right text-slate-600 font-medium">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map((post: any) => (
                      <TableRow key={post.id} className="hover:bg-slate-50/50">
                        <TableCell className="font-medium text-slate-900">{post.title}</TableCell>
                        <TableCell>
                          {post.category && (
                            <Badge variant="outline" className="border-slate-200 text-slate-600 font-normal">
                              {post.category}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(post.status)}</TableCell>
                        <TableCell className="text-slate-600">
                          {post.published_at
                            ? format(new Date(post.published_at), "dd/MM/yyyy")
                            : "-"}
                        </TableCell>
                        <TableCell className="text-slate-600">{post.view_count || 0}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePreview(post)}
                              className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEdit(post)}
                              className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {post.status === "draft" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => publishMutation.mutate(post.id)}
                                disabled={publishMutation.isPending}
                                className="h-8 w-8 p-0 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeletePostId(post.id)}
                              className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {totalPages > 1 && (
                  <div className="flex justify-center mt-6">
                    <CustomPagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      <BlogFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        post={selectedPost}
      />

      {selectedPost && (
        <BlogPreviewModal
          open={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
          post={selectedPost}
        />
      )}

      <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El artículo será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletePostId && deleteMutation.mutate(deletePostId)}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};