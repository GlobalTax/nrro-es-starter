import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { 
  Check, 
  X, 
  Trash2, 
  Eye, 
  EyeOff,
  Languages,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface NewsActionsBarProps {
  selectedIds: Set<string>;
  onClearSelection: () => void;
  onSelectAll: () => void;
  totalCount: number;
  allSelected: boolean;
}

export function NewsActionsBar({
  selectedIds,
  onClearSelection,
  onSelectAll,
  totalCount,
  allSelected,
}: NewsActionsBarProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"delete" | "publish" | "unpublish" | null>(null);
  const queryClient = useQueryClient();
  const count = selectedIds.size;

  if (count === 0) return null;

  const handleBatchPublish = async (publish: boolean) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from("news_articles")
        .update({ 
          is_published: publish,
          published_at: publish ? new Date().toISOString() : null,
        })
        .in("id", Array.from(selectedIds));

      if (error) throw error;
      
      toast.success(`${count} noticias ${publish ? "publicadas" : "despublicadas"}`);
      queryClient.invalidateQueries({ queryKey: ["news-articles"] });
      onClearSelection();
    } catch (error) {
      console.error("Batch update error:", error);
      toast.error("Error al actualizar las noticias");
    } finally {
      setIsProcessing(false);
      setConfirmAction(null);
    }
  };

  const handleBatchDelete = async () => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from("news_articles")
        .delete()
        .in("id", Array.from(selectedIds));

      if (error) throw error;
      
      toast.success(`${count} noticias eliminadas`);
      queryClient.invalidateQueries({ queryKey: ["news-articles"] });
      onClearSelection();
    } catch (error) {
      console.error("Batch delete error:", error);
      toast.error("Error al eliminar las noticias");
    } finally {
      setIsProcessing(false);
      setConfirmAction(null);
    }
  };

  const handleBatchTranslate = async (targetLang: "ca" | "en") => {
    setIsProcessing(true);
    const langName = targetLang === "ca" ? "catalán" : "inglés";
    
    try {
      // Get articles that need translation
      const { data: articles, error: fetchError } = await supabase
        .from("news_articles")
        .select("id, title_es, excerpt_es, content_es")
        .in("id", Array.from(selectedIds));

      if (fetchError) throw fetchError;

      let translated = 0;
      let failed = 0;

      for (const article of articles || []) {
        try {
          const { data: translateResult, error: translateError } = await supabase.functions.invoke(
            "translate-content",
            {
              body: {
                content: {
                  title: article.title_es,
                  excerpt: article.excerpt_es,
                  content: article.content_es,
                },
                sourceLang: "es",
                targetLang,
              },
            }
          );

          if (translateError) throw translateError;

          const updateData = targetLang === "ca" 
            ? {
                title_ca: translateResult.title,
                excerpt_ca: translateResult.excerpt,
                content_ca: translateResult.content,
              }
            : {
                title_en: translateResult.title,
                excerpt_en: translateResult.excerpt,
                content_en: translateResult.content,
              };

          await supabase
            .from("news_articles")
            .update(updateData)
            .eq("id", article.id);

          translated++;
        } catch (err) {
          console.error(`Error translating article ${article.id}:`, err);
          failed++;
        }
      }

      toast.success(`${translated} noticias traducidas al ${langName}${failed > 0 ? ` (${failed} errores)` : ""}`);
      queryClient.invalidateQueries({ queryKey: ["news-articles"] });
      onClearSelection();
    } catch (error) {
      console.error("Batch translate error:", error);
      toast.error(`Error al traducir al ${langName}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg">
        <div className="flex items-center gap-3">
          <Badge className="bg-white/20 text-white hover:bg-white/20">
            {count} seleccionadas
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={allSelected ? onClearSelection : onSelectAll}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            {allSelected ? (
              <>
                <X className="mr-1 h-4 w-4" />
                Deseleccionar
              </>
            ) : (
              <>
                <Check className="mr-1 h-4 w-4" />
                Seleccionar todas ({totalCount})
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirmAction("publish")}
            disabled={isProcessing}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            <Eye className="mr-1 h-4 w-4" />
            Publicar
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirmAction("unpublish")}
            disabled={isProcessing}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            <EyeOff className="mr-1 h-4 w-4" />
            Despublicar
          </Button>

          <div className="w-px h-5 bg-white/20 mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleBatchTranslate("ca")}
            disabled={isProcessing}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            <Languages className="mr-1 h-4 w-4" />
            → CA
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleBatchTranslate("en")}
            disabled={isProcessing}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            <Languages className="mr-1 h-4 w-4" />
            → EN
          </Button>

          <div className="w-px h-5 bg-white/20 mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirmAction("delete")}
            disabled={isProcessing}
            className="text-red-300 hover:text-red-200 hover:bg-red-500/20"
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <AlertDialog open={confirmAction !== null} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900">
              {confirmAction === "delete" && "¿Eliminar noticias?"}
              {confirmAction === "publish" && "¿Publicar noticias?"}
              {confirmAction === "unpublish" && "¿Despublicar noticias?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              {confirmAction === "delete" && 
                `Se eliminarán permanentemente ${count} noticias. Esta acción no se puede deshacer.`}
              {confirmAction === "publish" && 
                `Se publicarán ${count} noticias y serán visibles en la web.`}
              {confirmAction === "unpublish" && 
                `Se despublicarán ${count} noticias y dejarán de ser visibles.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-200 text-slate-600 hover:bg-slate-50">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmAction === "delete") handleBatchDelete();
                if (confirmAction === "publish") handleBatchPublish(true);
                if (confirmAction === "unpublish") handleBatchPublish(false);
              }}
              className={
                confirmAction === "delete"
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-slate-900 hover:bg-slate-800 text-white"
              }
            >
              {confirmAction === "delete" && "Eliminar"}
              {confirmAction === "publish" && "Publicar"}
              {confirmAction === "unpublish" && "Despublicar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
