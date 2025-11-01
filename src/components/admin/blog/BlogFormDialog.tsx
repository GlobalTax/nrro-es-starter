import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { BlogEditor } from "./BlogEditor";
import { AIBlogGenerator } from "./AIBlogGenerator";
import { Loader2, Sparkles } from "lucide-react";
import { uploadCompanyLogo } from "@/lib/uploadCompanyLogo";
import type { GeneratedArticle } from "@/hooks/useAIBlogGenerator";
import { useAnalyzeBlogContent } from "@/hooks/useAnalyzeBlogContent";

const blogFormSchema = z.object({
  title_es: z.string().min(1, "El título es requerido"),
  slug_es: z.string().min(1, "El slug es requerido"),
  excerpt_es: z.string().optional(),
  content_es: z.string().optional(),
  title_en: z.string().optional(),
  slug_en: z.string().optional(),
  excerpt_en: z.string().optional(),
  content_en: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
  featured_image: z.string().optional(),
  read_time: z.number().optional(),
  status: z.enum(['draft', 'published', 'scheduled']),
  scheduled_at: z.string().optional(),
  seo_title_es: z.string().optional(),
  seo_description_es: z.string().optional(),
  seo_title_en: z.string().optional(),
  seo_description_en: z.string().optional(),
  author_name: z.string().optional(),
  author_specialization: z.string().optional(),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

interface BlogFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post?: any;
}

export const BlogFormDialog = ({ open, onOpenChange, post }: BlogFormDialogProps) => {
  const { toast } = useToast();
  const { adminUser } = useAuth();
  const queryClient = useQueryClient();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [isAIGenerated, setIsAIGenerated] = useState(false);
  const { analyzeContent, isAnalyzing } = useAnalyzeBlogContent();

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title_es: "",
      slug_es: "",
      excerpt_es: "",
      content_es: "",
      title_en: "",
      slug_en: "",
      excerpt_en: "",
      content_en: "",
      category: "",
      tags: "",
      featured_image: "",
      read_time: 5,
      status: "draft",
      scheduled_at: "",
      seo_title_es: "",
      seo_description_es: "",
      seo_title_en: "",
      seo_description_en: "",
      author_name: "",
      author_specialization: "",
    },
  });

  useEffect(() => {
    if (post) {
      form.reset({
        title_es: post.title_es || "",
        slug_es: post.slug_es || "",
        excerpt_es: post.excerpt_es || "",
        content_es: post.content_es || "",
        title_en: post.title_en || "",
        slug_en: post.slug_en || "",
        excerpt_en: post.excerpt_en || "",
        content_en: post.content_en || "",
        category: post.category || "",
        tags: post.tags?.join(", ") || "",
        featured_image: post.featured_image || "",
        read_time: post.read_time || 5,
        status: post.status || "draft",
        scheduled_at: post.scheduled_at || "",
        seo_title_es: post.seo_title_es || "",
        seo_description_es: post.seo_description_es || "",
        seo_title_en: post.seo_title_en || "",
        seo_description_en: post.seo_description_en || "",
        author_name: post.author_name || "",
        author_specialization: post.author_specialization || "",
      });
      setIsAIGenerated(false);
      setShowAIGenerator(false);
    }
  }, [post, form]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const saveMutation = useMutation({
    mutationFn: async (values: BlogFormValues) => {
      let featuredImageUrl = values.featured_image;

      if (imageFile) {
        setUploadingImage(true);
        try {
          featuredImageUrl = await uploadCompanyLogo(imageFile, "blog-media");
        } catch (error) {
          throw new Error("Error al subir la imagen");
        } finally {
          setUploadingImage(false);
        }
      }

      const tagsArray = values.tags
        ? values.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : [];

      const postData = {
        title_es: values.title_es,
        slug_es: values.slug_es,
        excerpt_es: values.excerpt_es || null,
        content_es: values.content_es || null,
        title_en: values.title_en || null,
        slug_en: values.slug_en || null,
        excerpt_en: values.excerpt_en || null,
        content_en: values.content_en || null,
        category: values.category || null,
        tags: tagsArray,
        featured_image: featuredImageUrl || null,
        read_time: values.read_time || calculateReadTime(values.content_es || ""),
        status: values.status,
        scheduled_at: values.scheduled_at || null,
        published_at: values.status === "published" && !post ? new Date().toISOString() : post?.published_at || null,
        seo_title_es: values.seo_title_es || null,
        seo_description_es: values.seo_description_es || null,
        seo_title_en: values.seo_title_en || null,
        seo_description_en: values.seo_description_en || null,
        author_id: adminUser?.user_id,
        author_name: values.author_name || null,
        author_specialization: values.author_specialization || null,
      };

      if (post) {
        const { error } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", post.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_posts").insert([postData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-search"] });
      queryClient.invalidateQueries({ queryKey: ["blog-stats"] });
      toast({
        title: post ? "Artículo actualizado" : "Artículo creado",
        description: post
          ? "El artículo se ha actualizado correctamente"
          : "El artículo se ha creado correctamente",
      });
      onOpenChange(false);
      form.reset();
      setIsAIGenerated(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: BlogFormValues) => {
    saveMutation.mutate(values);
  };

  const handleAIGenerated = (article: GeneratedArticle) => {
    form.setValue("title_es", article.title_es);
    form.setValue("title_en", article.title_en);
    form.setValue("slug_es", generateSlug(article.title_es));
    form.setValue("slug_en", generateSlug(article.title_en));
    form.setValue("excerpt_es", article.excerpt_es || "");
    form.setValue("excerpt_en", article.excerpt_en || "");
    form.setValue("content_es", article.content_es);
    form.setValue("content_en", article.content_en);
    form.setValue("category", article.category);
    form.setValue("tags", article.tags.join(", "));
    form.setValue("read_time", article.read_time);
    
    if (article.seo_title_es) form.setValue("seo_title_es", article.seo_title_es);
    if (article.seo_title_en) form.setValue("seo_title_en", article.seo_title_en);
    if (article.seo_description_es) form.setValue("seo_description_es", article.seo_description_es);
    if (article.seo_description_en) form.setValue("seo_description_en", article.seo_description_en);
    
    // Importar imagen generada si existe
    if (article.featured_image_url) {
      form.setValue('featured_image', article.featured_image_url);
    }
    
    setIsAIGenerated(true);
    setShowAIGenerator(false);
    toast({
      title: "Contenido importado",
      description: article.featured_image_url 
        ? "Artículo e imagen generados. Puedes editarlos antes de guardar."
        : "Contenido importado. Puedes editarlo antes de guardar.",
    });
  };

  const handleAutocomplete = async () => {
    const currentContentEs = form.getValues('content_es');
    
    if (!currentContentEs || currentContentEs.trim().length < 100) {
      toast({
        title: 'Contenido insuficiente',
        description: 'Por favor escribe o pega el contenido del artículo primero (mínimo 100 caracteres)',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Analizando contenido...',
      description: 'La IA está generando los metadatos',
    });

    const result = await analyzeContent(currentContentEs);
    
    if (result) {
      // Solo llenar campos VACÍOS
      if (!form.getValues('title_es')) {
        form.setValue('title_es', result.title_es);
        form.setValue('slug_es', generateSlug(result.title_es));
      }
      if (!form.getValues('title_en')) {
        form.setValue('title_en', result.title_en);
        form.setValue('slug_en', generateSlug(result.title_en));
      }
      if (!form.getValues('excerpt_es')) form.setValue('excerpt_es', result.excerpt_es);
      if (!form.getValues('excerpt_en')) form.setValue('excerpt_en', result.excerpt_en);
      if (!form.getValues('seo_title_es')) form.setValue('seo_title_es', result.seo_title_es);
      if (!form.getValues('seo_title_en')) form.setValue('seo_title_en', result.seo_title_en);
      if (!form.getValues('seo_description_es')) form.setValue('seo_description_es', result.seo_description_es);
      if (!form.getValues('seo_description_en')) form.setValue('seo_description_en', result.seo_description_en);
      if (!form.getValues('category')) form.setValue('category', result.category);
      if (!form.getValues('tags') || form.getValues('tags').length === 0) {
        form.setValue('tags', result.tags.join(', '));
      }
      if (!form.getValues('read_time')) form.setValue('read_time', result.read_time);
      
      // Auto-rellenar imagen si se generó y no hay una existente
      if (result.featured_image_url && !form.getValues('featured_image')) {
        form.setValue('featured_image', result.featured_image_url);
      }

      toast({
        title: '✨ Autocompletado exitoso',
        description: result.featured_image_url 
          ? 'Los campos vacíos se han completado e imagen generada. Revisa y ajusta si es necesario.'
          : 'Los campos vacíos se han completado. Revisa y ajusta si es necesario.',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DialogTitle>
                {post ? "Editar Artículo" : "Nuevo Artículo"}
              </DialogTitle>
              {isAIGenerated && (
                <Badge variant="secondary" className="gap-1">
                  <Sparkles className="h-3 w-3" />
                  Generado con IA
                </Badge>
              )}
            </div>
            {!post && !showAIGenerator && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAIGenerator(true)}
                className="gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Generar con IA
              </Button>
            )}
          </div>
          {!showAIGenerator && (
            <DialogDescription>
              {post ? "Actualiza la información del artículo" : "Crea un nuevo artículo para el blog"}
            </DialogDescription>
          )}
        </DialogHeader>

        {showAIGenerator ? (
          <AIBlogGenerator
            onGenerated={handleAIGenerated}
            onCancel={() => setShowAIGenerator(false)}
          />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="es">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="es">Español</TabsTrigger>
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="meta">Metadata & SEO</TabsTrigger>
                </TabsList>

                <TabsContent value="es" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title_es"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título (ES) *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Título del artículo"
                            onBlur={(e) => {
                              field.onBlur();
                              if (!form.getValues("slug_es")) {
                                form.setValue("slug_es", generateSlug(e.target.value));
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug_es"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug (ES) *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="slug-del-articulo" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="excerpt_es"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Extracto (ES)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Breve resumen del artículo"
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content_es"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <BlogEditor
                            value={field.value || ""}
                            onChange={field.onChange}
                            label="Contenido (ES)"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Autocomplete Button */}
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAutocomplete}
                      disabled={isAnalyzing || saveMutation.isPending}
                      className="shrink-0"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analizando...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Autocompletar con IA
                        </>
                      )}
                    </Button>
                    <p className="text-sm text-muted-foreground pt-2">
                      Pega tu contenido arriba y usa este botón para que la IA complete automáticamente título, extracto, SEO, categoría, tags y tiempo de lectura.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="en" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título (EN)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Article title"
                            onBlur={(e) => {
                              field.onBlur();
                              if (!form.getValues("slug_en") && e.target.value) {
                                form.setValue("slug_en", generateSlug(e.target.value));
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug (EN)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="article-slug" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="excerpt_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt (EN)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Brief article summary"
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <BlogEditor
                            value={field.value || ""}
                            onChange={field.onChange}
                            label="Content (EN)"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="meta" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoría</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Fiscal">Fiscal</SelectItem>
                            <SelectItem value="Mercantil">Mercantil</SelectItem>
                            <SelectItem value="Laboral">Laboral</SelectItem>
                            <SelectItem value="Corporativo">Corporativo</SelectItem>
                            <SelectItem value="Análisis">Análisis</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags (separados por comas)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="tag1, tag2, tag3" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="featured_image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Imagen Destacada</FormLabel>
                        <FormControl>
                          <ImageUpload
                            value={field.value || null}
                            onChange={(url, file) => {
                              if (file) {
                                setImageFile(file);
                              } else if (url) {
                                field.onChange(url);
                              } else {
                                field.onChange(null);
                                setImageFile(null);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="read_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tiempo de lectura (minutos)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="author_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del Autor</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Carlos Navarro" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="author_specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Especialización del Autor</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Derecho Fiscal" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Borrador</SelectItem>
                            <SelectItem value="published">Publicado</SelectItem>
                            <SelectItem value="scheduled">Programado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("status") === "scheduled" && (
                    <FormField
                      control={form.control}
                      name="scheduled_at"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha de publicación</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-semibold">SEO</h3>
                    <FormField
                      control={form.control}
                      name="seo_title_es"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SEO Title (ES)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Título para SEO (max 60 caracteres)" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="seo_description_es"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SEO Description (ES)</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Descripción para SEO (max 160 caracteres)" rows={2} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={saveMutation.isPending || uploadingImage}>
                  {(saveMutation.isPending || uploadingImage) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {post ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
