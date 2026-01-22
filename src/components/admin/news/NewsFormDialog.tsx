import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Languages, Star, Link as LinkIcon, Clock, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { NewsPreview } from "./NewsPreview";

const newsFormSchema = z.object({
  // Spanish (required)
  title_es: z.string().min(1, "El título es obligatorio").max(100, "Máximo 100 caracteres"),
  excerpt_es: z.string().min(1, "El extracto es obligatorio").max(160, "Máximo 160 caracteres"),
  content_es: z.string().min(1, "El contenido es obligatorio"),
  // Catalan (optional)
  title_ca: z.string().max(100, "Máximo 100 caracteres").optional().or(z.literal("")),
  excerpt_ca: z.string().max(160, "Máximo 160 caracteres").optional().or(z.literal("")),
  content_ca: z.string().optional().or(z.literal("")),
  // English (optional)
  title_en: z.string().max(100, "Máximo 100 caracteres").optional().or(z.literal("")),
  excerpt_en: z.string().max(160, "Máximo 160 caracteres").optional().or(z.literal("")),
  content_en: z.string().optional().or(z.literal("")),
  // Metadata
  category: z.string().min(1, "Selecciona una categoría"),
  source_name: z.string().min(1, "Selecciona una fuente"),
  source_url: z.string().url("URL inválida").optional().or(z.literal("")),
  featured_image_url: z.string().url("URL inválida").optional().or(z.literal("")),
  tags: z.array(z.string()).optional(),
  is_featured: z.boolean(),
  is_published: z.boolean(),
  read_time: z.number().min(1).max(30),
});

type NewsFormData = z.infer<typeof newsFormSchema>;

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
  generated_with_ai: boolean | null;
}

interface NewsFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article?: NewsArticle | null;
}

const CATEGORIES = ["Fiscal", "Mercantil", "Laboral", "Internacional", "M&A", "Contabilidad", "Digitalización"];
const SOURCES = ["BOE", "AEAT", "CGPJ", "Normativa UE", "Mercado", "Seguridad Social", "CNMV"];
const COMMON_TAGS = ["Urgente", "Autónomos", "Pymes", "Multinacional", "Startups", "Familia", "Impuestos", "IRPF", "IVA", "IS"];

export function NewsFormDialog({ open, onOpenChange, article }: NewsFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTranslating, setIsTranslating] = useState<"ca" | "en" | null>(null);
  const [activeTab, setActiveTab] = useState("es");
  const [newTag, setNewTag] = useState("");
  const queryClient = useQueryClient();
  const isEditing = !!article;

  const form = useForm<NewsFormData>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: {
      title_es: "",
      excerpt_es: "",
      content_es: "",
      title_ca: "",
      excerpt_ca: "",
      content_ca: "",
      title_en: "",
      excerpt_en: "",
      content_en: "",
      category: "Fiscal",
      source_name: "BOE",
      source_url: "",
      featured_image_url: "",
      tags: [],
      is_featured: false,
      is_published: false,
      read_time: 2,
    },
  });

  const watchedValues = form.watch();

  useEffect(() => {
    if (article) {
      form.reset({
        title_es: article.title_es || "",
        excerpt_es: article.excerpt_es || "",
        content_es: article.content_es || "",
        title_ca: article.title_ca || "",
        excerpt_ca: article.excerpt_ca || "",
        content_ca: article.content_ca || "",
        title_en: article.title_en || "",
        excerpt_en: article.excerpt_en || "",
        content_en: article.content_en || "",
        category: article.category || "Fiscal",
        source_name: article.source_name || "BOE",
        source_url: article.source_url || "",
        featured_image_url: article.featured_image_url || "",
        tags: article.tags || [],
        is_featured: article.is_featured || false,
        is_published: article.is_published,
        read_time: article.read_time || 2,
      });
    } else {
      form.reset({
        title_es: "",
        excerpt_es: "",
        content_es: "",
        title_ca: "",
        excerpt_ca: "",
        content_ca: "",
        title_en: "",
        excerpt_en: "",
        content_en: "",
        category: "Fiscal",
        source_name: "BOE",
        source_url: "",
        featured_image_url: "",
        tags: [],
        is_featured: false,
        is_published: false,
        read_time: 2,
      });
      setActiveTab("es");
    }
  }, [article, form, open]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 50);
  };

  const handleTranslate = async (targetLang: "ca" | "en") => {
    const title = form.getValues("title_es");
    const excerpt = form.getValues("excerpt_es");
    const content = form.getValues("content_es");

    if (!title || !excerpt || !content) {
      toast.error("Completa el contenido en español antes de traducir");
      return;
    }

    setIsTranslating(targetLang);
    try {
      const { data, error } = await supabase.functions.invoke("translate-content", {
        body: {
          content: { title, excerpt, content },
          sourceLang: "es",
          targetLang,
        },
      });

      if (error) throw error;

      if (targetLang === "ca") {
        form.setValue("title_ca", data.title);
        form.setValue("excerpt_ca", data.excerpt);
        form.setValue("content_ca", data.content);
        setActiveTab("ca");
      } else {
        form.setValue("title_en", data.title);
        form.setValue("excerpt_en", data.excerpt);
        form.setValue("content_en", data.content);
        setActiveTab("en");
      }

      toast.success(`Traducido al ${targetLang === "ca" ? "catalán" : "inglés"}`);
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Error al traducir");
    } finally {
      setIsTranslating(null);
    }
  };

  const handleAddTag = (tag: string) => {
    const currentTags = form.getValues("tags") || [];
    if (!currentTags.includes(tag)) {
      form.setValue("tags", [...currentTags, tag]);
    }
    setNewTag("");
  };

  const handleRemoveTag = (tag: string) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue("tags", currentTags.filter(t => t !== tag));
  };

  const onSubmit = async (data: NewsFormData) => {
    setIsSubmitting(true);

    try {
      const slugEs = generateSlug(data.title_es);
      const slugCa = data.title_ca ? generateSlug(data.title_ca) : null;
      const slugEn = data.title_en ? generateSlug(data.title_en) : null;

      const payload = {
        title_es: data.title_es,
        excerpt_es: data.excerpt_es,
        content_es: data.content_es,
        title_ca: data.title_ca || null,
        excerpt_ca: data.excerpt_ca || null,
        content_ca: data.content_ca || null,
        title_en: data.title_en || null,
        excerpt_en: data.excerpt_en || null,
        content_en: data.content_en || null,
        category: data.category,
        source_name: data.source_name,
        source_url: data.source_url || null,
        featured_image_url: data.featured_image_url || null,
        tags: data.tags || [],
        is_featured: data.is_featured,
        is_published: data.is_published,
        read_time: data.read_time,
        published_at: data.is_published ? new Date().toISOString() : null,
      };

      if (isEditing && article) {
        const { error } = await supabase
          .from("news_articles")
          .update({
            ...payload,
            slug_ca: slugCa ? `${slugCa}-${Date.now()}` : null,
            slug_en: slugEn ? `${slugEn}-${Date.now()}` : null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", article.id);

        if (error) throw error;
        toast.success("Noticia actualizada correctamente");
      } else {
        const { error } = await supabase.from("news_articles").insert([{
          ...payload,
          slug_es: `${slugEs}-${Date.now()}`,
          slug_ca: slugCa ? `${slugCa}-${Date.now()}` : null,
          slug_en: slugEn ? `${slugEn}-${Date.now()}` : null,
          source_site: "es",
          generated_with_ai: false,
        }]);

        if (error) throw error;
        toast.success("Noticia creada correctamente");
      }

      queryClient.invalidateQueries({ queryKey: ["news-articles"] });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error saving news:", error);
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get translation status for tabs
  const hasCA = !!(watchedValues.title_ca && watchedValues.content_ca);
  const hasEN = !!(watchedValues.title_en && watchedValues.content_en);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-xl font-medium text-slate-900">
            {isEditing ? "Editar Noticia" : "Nueva Noticia"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex gap-6 p-6">
              {/* Left Column - Form */}
              <div className="flex-1 space-y-4">
                {/* Language Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <div className="flex items-center justify-between mb-4">
                    <TabsList className="bg-slate-100">
                      <TabsTrigger value="es" className="data-[state=active]:bg-white">
                        🇪🇸 Español
                      </TabsTrigger>
                      <TabsTrigger value="ca" className="data-[state=active]:bg-white">
                        {hasCA ? "✅" : "⚪"} Catalán
                      </TabsTrigger>
                      <TabsTrigger value="en" className="data-[state=active]:bg-white">
                        {hasEN ? "✅" : "⚪"} English
                      </TabsTrigger>
                    </TabsList>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleTranslate("ca")}
                        disabled={isTranslating !== null}
                        className="text-slate-600"
                      >
                        {isTranslating === "ca" ? (
                          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                        ) : (
                          <Languages className="mr-1 h-4 w-4" />
                        )}
                        → CA
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleTranslate("en")}
                        disabled={isTranslating !== null}
                        className="text-slate-600"
                      >
                        {isTranslating === "en" ? (
                          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                        ) : (
                          <Languages className="mr-1 h-4 w-4" />
                        )}
                        → EN
                      </Button>
                    </div>
                  </div>

                  {/* Spanish Tab */}
                  <TabsContent value="es" className="space-y-4 mt-0">
                    <FormField
                      control={form.control}
                      name="title_es"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700">Título</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Título de la noticia"
                              className="border-slate-200 focus:border-slate-300 focus:ring-slate-200"
                            />
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
                          <FormLabel className="text-slate-700">
                            Extracto <span className="text-slate-400 text-xs">({field.value?.length || 0}/160)</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Breve resumen de la noticia..."
                              rows={2}
                              maxLength={160}
                              className="border-slate-200 focus:border-slate-300 focus:ring-slate-200 resize-none"
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
                          <FormLabel className="text-slate-700">Contenido</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Contenido completo de la noticia..."
                              rows={8}
                              className="border-slate-200 focus:border-slate-300 focus:ring-slate-200"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  {/* Catalan Tab */}
                  <TabsContent value="ca" className="space-y-4 mt-0">
                    <FormField
                      control={form.control}
                      name="title_ca"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700">Títol</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Títol de la notícia"
                              className="border-slate-200 focus:border-slate-300 focus:ring-slate-200"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="excerpt_ca"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700">
                            Extracte <span className="text-slate-400 text-xs">({field.value?.length || 0}/160)</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Breu resum de la notícia..."
                              rows={2}
                              maxLength={160}
                              className="border-slate-200 focus:border-slate-300 focus:ring-slate-200 resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="content_ca"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700">Contingut</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Contingut complet de la notícia..."
                              rows={8}
                              className="border-slate-200 focus:border-slate-300 focus:ring-slate-200"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  {/* English Tab */}
                  <TabsContent value="en" className="space-y-4 mt-0">
                    <FormField
                      control={form.control}
                      name="title_en"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700">Title</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="News title"
                              className="border-slate-200 focus:border-slate-300 focus:ring-slate-200"
                            />
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
                          <FormLabel className="text-slate-700">
                            Excerpt <span className="text-slate-400 text-xs">({field.value?.length || 0}/160)</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Brief summary of the news..."
                              rows={2}
                              maxLength={160}
                              className="border-slate-200 focus:border-slate-300 focus:ring-slate-200 resize-none"
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
                          <FormLabel className="text-slate-700">Content</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Full news content..."
                              rows={8}
                              className="border-slate-200 focus:border-slate-300 focus:ring-slate-200"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>

                {/* Metadata Section */}
                <div className="border-t border-slate-200 pt-4 space-y-4">
                  <h3 className="text-sm font-medium text-slate-700">Metadatos</h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700">Categoría</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-slate-200 focus:ring-slate-200">
                                <SelectValue placeholder="Selecciona" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CATEGORIES.map((cat) => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="source_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700">Fuente</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-slate-200 focus:ring-slate-200">
                                <SelectValue placeholder="Selecciona" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {SOURCES.map((src) => (
                                <SelectItem key={src} value={src}>{src}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="read_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Lectura (min)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={30}
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 2)}
                              className="border-slate-200 focus:ring-slate-200"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="source_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 flex items-center gap-1">
                          <LinkIcon className="h-3 w-3" /> URL de la fuente
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="https://www.boe.es/..."
                            className="border-slate-200 focus:ring-slate-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="featured_image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700">Imagen destacada (URL)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="https://..."
                            className="border-slate-200 focus:ring-slate-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tags */}
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700">Etiquetas</FormLabel>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            {(field.value || []).map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                                onClick={() => handleRemoveTag(tag)}
                              >
                                {tag}
                                <X className="ml-1 h-3 w-3" />
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Input
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              placeholder="Nueva etiqueta..."
                              className="flex-1 border-slate-200 focus:ring-slate-200"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  if (newTag.trim()) handleAddTag(newTag.trim());
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => newTag.trim() && handleAddTag(newTag.trim())}
                              className="border-slate-200"
                            >
                              Añadir
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {COMMON_TAGS.filter(t => !(field.value || []).includes(t)).slice(0, 6).map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-slate-500 cursor-pointer hover:bg-slate-50"
                                onClick={() => handleAddTag(tag)}
                              >
                                + {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Switches */}
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="is_featured"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-amber-500"
                            />
                          </FormControl>
                          <FormLabel className="text-slate-600 flex items-center gap-1 font-normal">
                            <Star className="h-3 w-3" /> Destacada
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="is_published"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-emerald-500"
                            />
                          </FormControl>
                          <FormLabel className="text-slate-600 font-normal">
                            Publicar ahora
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Preview */}
              <div className="w-72 shrink-0">
                <div className="sticky top-0">
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Vista previa</h3>
                  <NewsPreview
                    title={watchedValues.title_es || ""}
                    excerpt={watchedValues.excerpt_es || ""}
                    category={watchedValues.category || ""}
                    sourceName={watchedValues.source_name || ""}
                    isAI={article?.generated_with_ai || false}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-slate-50">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-slate-900 hover:bg-slate-800 text-white"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Guardar cambios" : "Crear noticia"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
