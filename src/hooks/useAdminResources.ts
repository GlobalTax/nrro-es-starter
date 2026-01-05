import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";

type ResourceType = Database["public"]["Enums"]["resource_type"];
type ResourceCategory = Database["public"]["Enums"]["resource_category"];

export interface AdminResource {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
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
  created_at: string | null;
}

interface UseAdminResourcesParams {
  searchQuery?: string;
  typeFilter?: string;
  categoryFilter?: string;
  statusFilter?: string;
  page?: number;
  pageSize?: number;
}

export const useAdminResources = ({
  searchQuery = "",
  typeFilter = "all",
  categoryFilter = "all",
  statusFilter = "all",
  page = 1,
  pageSize = 10,
}: UseAdminResourcesParams = {}) => {
  return useQuery({
    queryKey: ["admin-resources", searchQuery, typeFilter, categoryFilter, statusFilter, page, pageSize],
    queryFn: async () => {
      let query = supabase
        .from("resources")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

      // Search filter
      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      // Type filter
      if (typeFilter && typeFilter !== "all") {
        query = query.eq("type", typeFilter as ResourceType);
      }

      // Category filter
      if (categoryFilter && categoryFilter !== "all") {
        query = query.eq("category", categoryFilter as ResourceCategory);
      }

      // Status filter
      if (statusFilter === "active") {
        query = query.eq("is_active", true);
      } else if (statusFilter === "inactive") {
        query = query.eq("is_active", false);
      }

      // Pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;
      return { resources: data as AdminResource[], totalCount: count || 0 };
    },
  });
};

export const useResourceStats = () => {
  return useQuery({
    queryKey: ["admin-resources-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("is_active, is_featured, download_count");

      if (error) throw error;

      const total = data.length;
      const active = data.filter((r) => r.is_active).length;
      const featured = data.filter((r) => r.is_featured).length;
      const downloads = data.reduce((acc, r) => acc + (r.download_count || 0), 0);

      return { total, active, featured, downloads };
    },
  });
};

export const useCreateResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resource: Omit<AdminResource, "id" | "created_at" | "download_count">) => {
      const { data, error } = await supabase
        .from("resources")
        .insert(resource)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-resources"] });
      queryClient.invalidateQueries({ queryKey: ["admin-resources-stats"] });
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      toast.success("Recurso creado correctamente");
    },
    onError: (error) => {
      toast.error(`Error al crear el recurso: ${error.message}`);
    },
  });
};

export const useUpdateResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...resource }: Partial<AdminResource> & { id: string }) => {
      const { data, error } = await supabase
        .from("resources")
        .update(resource)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-resources"] });
      queryClient.invalidateQueries({ queryKey: ["admin-resources-stats"] });
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      toast.success("Recurso actualizado correctamente");
    },
    onError: (error) => {
      toast.error(`Error al actualizar el recurso: ${error.message}`);
    },
  });
};

export const useDeleteResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("resources")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-resources"] });
      queryClient.invalidateQueries({ queryKey: ["admin-resources-stats"] });
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      toast.success("Recurso eliminado correctamente");
    },
    onError: (error) => {
      toast.error(`Error al eliminar el recurso: ${error.message}`);
    },
  });
};
