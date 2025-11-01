import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface GeneratedArticle {
  title_es: string;
  title_en: string;
  excerpt_es: string;
  excerpt_en: string;
  content_es: string;
  content_en: string;
  category: string;
  tags: string[];
  seo_title_es?: string;
  seo_title_en?: string;
  seo_description_es?: string;
  seo_description_en?: string;
  read_time: number;
  generated_with_ai: boolean;
}

export interface GenerationOptions {
  tone?: "professional" | "technical" | "divulgative";
  language?: "es" | "en" | "both";
}

type GenerationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; article: GeneratedArticle }
  | { status: "error"; message: string };

export const useAIBlogGenerator = () => {
  const [state, setState] = useState<GenerationState>({ status: "idle" });

  const generateArticle = async (prompt: string, options?: GenerationOptions) => {
    if (!prompt.trim()) {
      toast.error("Por favor introduce un tema para el artículo");
      return null;
    }

    setState({ status: "loading" });

    try {
      const { data, error } = await supabase.functions.invoke("generate-blog-article", {
        body: { 
          prompt: prompt.trim(), 
          tone: options?.tone || "professional",
          language: options?.language || "both"
        },
      });

      if (error) {
        let errorMessage = "Error al generar el artículo";
        
        if (error.message?.includes("429")) {
          errorMessage = "Límite de solicitudes excedido. Intenta de nuevo en unos minutos.";
        } else if (error.message?.includes("402")) {
          errorMessage = "Sin créditos de IA. Contacta con soporte.";
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        throw new Error(errorMessage);
      }

      if (!data) {
        throw new Error("No se recibió respuesta del servidor");
      }

      setState({ status: "success", article: data as GeneratedArticle });
      toast.success("¡Artículo generado con éxito!");
      return data as GeneratedArticle;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      setState({ status: "error", message: errorMessage });
      toast.error(errorMessage);
      return null;
    }
  };

  const reset = () => {
    setState({ status: "idle" });
  };

  return {
    state,
    generateArticle,
    reset,
    isLoading: state.status === "loading",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    article: state.status === "success" ? state.article : null,
    error: state.status === "error" ? state.message : null,
  };
};
