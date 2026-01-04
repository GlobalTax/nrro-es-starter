import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type ResourceType = Database["public"]["Enums"]["resource_type"];
type ResourceCategory = Database["public"]["Enums"]["resource_category"];

export interface Resource {
  id: string;
  title: string;
  description: string | null;
  type: ResourceType;
  category: ResourceCategory;
  countries: string[] | null;
  personas: string[] | null;
  file_url: string | null;
  thumbnail_url: string | null;
  is_featured: boolean | null;
  download_count: number | null;
  published_at: string | null;
  is_active: boolean | null;
}

export const resourceTypes: ResourceType[] = [
  "country_guide",
  "template",
  "webinar",
  "white_paper",
];

export const resourceCategories: ResourceCategory[] = [
  "accounting",
  "corporate_legal",
  "governance",
  "payroll",
  "tax",
  "transfer_pricing",
  "treasury",
];

export const useResources = (filters?: {
  type?: string;
  category?: string;
  featured?: boolean;
}) => {
  return useQuery({
    queryKey: ["resources", filters],
    queryFn: async () => {
      let query = supabase
        .from("resources")
        .select("*")
        .eq("is_active", true)
        .not("published_at", "is", null)
        .order("is_featured", { ascending: false })
        .order("published_at", { ascending: false });

      if (filters?.type && filters.type !== "all") {
        query = query.eq("type", filters.type as ResourceType);
      }

      if (filters?.category && filters.category !== "all") {
        query = query.eq("category", filters.category as ResourceCategory);
      }

      if (filters?.featured) {
        query = query.eq("is_featured", true);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Resource[];
    },
  });
};

export const useResource = (id: string) => {
  return useQuery({
    queryKey: ["resource", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Resource;
    },
    enabled: !!id,
  });
};
