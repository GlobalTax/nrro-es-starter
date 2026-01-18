import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const newsFormSchema = z.object({
  title_es: z.string().min(1, "El título es obligatorio").max(100, "Máximo 100 caracteres"),
  excerpt_es: z.string().min(1, "El extracto es obligatorio").max(150, "Máximo 150 caracteres"),
  content_es: z.string().min(1, "El contenido es obligatorio"),
  category: z.string().min(1, "Selecciona una categoría"),
  source_name: z.string().min(1, "Selecciona una fuente"),
  is_published: z.boolean(),
});

type NewsFormData = z.infer<typeof newsFormSchema>;

interface NewsArticle {
  id: string;
  title_es: string | null;
  excerpt_es: string | null;
  content_es: string | null;
  category: string | null;
  source_name: string | null;
  is_published: boolean;
}

interface NewsFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article?: NewsArticle | null;
}

const CATEGORIES = ["Fiscal", "Mercantil", "Laboral", "Internacional", "M&A"];
const SOURCES = ["BOE", "AEAT", "CGPJ", "Normativa UE", "Mercado"];

export function NewsFormDialog({ open, onOpenChange, article }: NewsFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const isEditing = !!article;

  const form = useForm<NewsFormData>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: {
      title_es: "",
      excerpt_es: "",
      content_es: "",
      category: "Fiscal",
      source_name: "BOE",
      is_published: false,
    },
  });

  useEffect(() => {
    if (article) {
      form.reset({
        title_es: article.title_es || "",
        excerpt_es: article.excerpt_es || "",
        content_es: article.content_es || "",
        category: article.category || "Fiscal",
        source_name: article.source_name || "BOE",
        is_published: article.is_published,
      });
    } else {
      form.reset({
        title_es: "",
        excerpt_es: "",
        content_es: "",
        category: "Fiscal",
        source_name: "BOE",
        is_published: false,
      });
    }
  }, [article, form]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 50);
  };

  const onSubmit = async (data: NewsFormData) => {
    setIsSubmitting(true);

    try {
      if (isEditing && article) {
        const { error } = await supabase
          .from("news_articles")
          .update({
            ...data,
            published_at: data.is_published ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", article.id);

        if (error) throw error;
        toast.success("Noticia actualizada correctamente");
      } else {
        const slug = generateSlug(data.title_es);
        const { error } = await supabase.from("news_articles").insert([{
          title_es: data.title_es,
          excerpt_es: data.excerpt_es,
          content_es: data.content_es,
          category: data.category,
          source_name: data.source_name,
          is_published: data.is_published,
          slug_es: `${slug}-${Date.now()}`,
          source_site: "es",
          published_at: data.is_published ? new Date().toISOString() : null,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-slate-900">
            {isEditing ? "Editar Noticia" : "Nueva Noticia"}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            {isEditing
              ? "Modifica los detalles de la noticia."
              : "Crea una nueva noticia manualmente."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    Extracto <span className="text-slate-400">(máx. 150 caracteres)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Breve resumen de la noticia..."
                      rows={2}
                      maxLength={150}
                      className="border-slate-200 focus:border-slate-300 focus:ring-slate-200 resize-none"
                    />
                  </FormControl>
                  <div className="text-xs text-slate-400 text-right">
                    {field.value?.length || 0}/150
                  </div>
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
                      rows={5}
                      className="border-slate-200 focus:border-slate-300 focus:ring-slate-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
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
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
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
                          <SelectItem key={src} value={src}>
                            {src}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_published"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                  <div>
                    <FormLabel className="text-slate-700">Publicar inmediatamente</FormLabel>
                    <p className="text-xs text-slate-500">
                      La noticia será visible en la web
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-emerald-500"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
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
