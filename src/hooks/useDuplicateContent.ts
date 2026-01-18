import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type ContentType = "blog_posts" | "news_articles" | "case_studies" | "resources";

interface DuplicateOptions {
  type: ContentType;
  id: string;
  titleField?: string;
  slugField?: string;
}

// Fields to exclude when duplicating
const excludeFields = ["id", "created_at", "updated_at", "published_at", "view_count", "download_count"];

function generateCopyTitle(title: string): string {
  const copyPattern = /\s*\(copia(?:\s+(\d+))?\)$/;
  const match = title.match(copyPattern);
  
  if (match) {
    const num = match[1] ? parseInt(match[1], 10) + 1 : 2;
    return title.replace(copyPattern, ` (copia ${num})`);
  }
  return `${title} (copia)`;
}

function generateCopySlug(slug: string): string {
  const copyPattern = /-copia(?:-(\d+))?$/;
  const match = slug.match(copyPattern);
  
  if (match) {
    const num = match[1] ? parseInt(match[1], 10) + 1 : 2;
    return slug.replace(copyPattern, `-copia-${num}`);
  }
  return `${slug}-copia`;
}

export function useDuplicateContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ type, id, titleField = "title_es", slugField = "slug_es" }: DuplicateOptions) => {
      // Fetch the original content
      const { data: original, error: fetchError } = await supabase
        .from(type)
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;
      if (!original) throw new Error("Content not found");

      // Create the duplicate
      const duplicate: Record<string, unknown> = {};
      
      for (const [key, value] of Object.entries(original)) {
        if (excludeFields.includes(key)) continue;
        
        // Handle title fields
        if (key.startsWith("title")) {
          duplicate[key] = value ? generateCopyTitle(value as string) : value;
        }
        // Handle slug fields
        else if (key.startsWith("slug")) {
          duplicate[key] = value ? generateCopySlug(value as string) : value;
        }
        // Set status to draft
        else if (key === "status") {
          duplicate[key] = "draft";
        }
        // Set is_published to false
        else if (key === "is_published") {
          duplicate[key] = false;
        }
        // Set is_featured to false
        else if (key === "is_featured") {
          duplicate[key] = false;
        }
        // Set is_active to false for resources
        else if (key === "is_active" && type === "resources") {
          duplicate[key] = false;
        }
        else {
          duplicate[key] = value;
        }
      }

      const { data, error: insertError } = await supabase
        .from(type)
        .insert(duplicate as any)
        .select()
        .single();

      if (insertError) throw insertError;
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate related queries
      const queryKeyMap: Record<ContentType, string[]> = {
        blog_posts: ["blog-search", "blog-stats"],
        news_articles: ["news-articles"],
        case_studies: ["admin-case-studies", "case-studies"],
        resources: ["admin-resources", "admin-resources-stats", "resources"],
      };

      queryKeyMap[variables.type]?.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });

      toast.success("Contenido duplicado correctamente");
    },
    onError: (error: Error) => {
      toast.error(`Error al duplicar: ${error.message}`);
    },
  });
}

// Specific hooks for each content type
export function useDuplicateBlogPost() {
  const duplicateMutation = useDuplicateContent();
  
  return {
    ...duplicateMutation,
    mutate: (id: string) => duplicateMutation.mutate({ 
      type: "blog_posts", 
      id,
      titleField: "title_es",
      slugField: "slug_es"
    }),
    mutateAsync: (id: string) => duplicateMutation.mutateAsync({ 
      type: "blog_posts", 
      id,
      titleField: "title_es",
      slugField: "slug_es"
    }),
  };
}

export function useDuplicateNewsArticle() {
  const duplicateMutation = useDuplicateContent();
  
  return {
    ...duplicateMutation,
    mutate: (id: string) => duplicateMutation.mutate({ 
      type: "news_articles", 
      id,
      titleField: "title_es",
      slugField: "slug_es"
    }),
    mutateAsync: (id: string) => duplicateMutation.mutateAsync({ 
      type: "news_articles", 
      id,
      titleField: "title_es",
      slugField: "slug_es"
    }),
  };
}

export function useDuplicateCaseStudy() {
  const duplicateMutation = useDuplicateContent();
  
  return {
    ...duplicateMutation,
    mutate: (id: string) => duplicateMutation.mutate({ 
      type: "case_studies", 
      id,
      titleField: "title",
      slugField: "slug"
    }),
    mutateAsync: (id: string) => duplicateMutation.mutateAsync({ 
      type: "case_studies", 
      id,
      titleField: "title",
      slugField: "slug"
    }),
  };
}

export function useDuplicateResource() {
  const duplicateMutation = useDuplicateContent();
  
  return {
    ...duplicateMutation,
    mutate: (id: string) => duplicateMutation.mutate({ 
      type: "resources", 
      id,
      titleField: "title",
      slugField: "slug"
    }),
    mutateAsync: (id: string) => duplicateMutation.mutateAsync({ 
      type: "resources", 
      id,
      titleField: "title",
      slugField: "slug"
    }),
  };
}
