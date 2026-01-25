import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Types
export interface TopBarConfig {
  id: string;
  phone_number: string | null;
  phone_link: string | null;
  show_search: boolean;
  show_language_selector: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TopBarLink {
  id: string;
  label: string;
  href: string;
  is_external: boolean;
  position: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GroupCompany {
  id: string;
  name: string;
  url: string;
  logo_url: string | null;
  is_current: boolean;
  position: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Fetch hooks
export const useTopBarConfig = () => {
  return useQuery({
    queryKey: ["topbar-config"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("topbar_config")
        .select("*")
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data as TopBarConfig | null;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useTopBarLinks = () => {
  return useQuery({
    queryKey: ["topbar-links"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("topbar_links")
        .select("*")
        .eq("is_active", true)
        .order("position", { ascending: true });
      
      if (error) throw error;
      return (data || []) as TopBarLink[];
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useGroupCompanies = () => {
  return useQuery({
    queryKey: ["topbar-group-companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("topbar_group_companies")
        .select("*")
        .eq("is_active", true)
        .order("position", { ascending: true });
      
      if (error) throw error;
      return (data || []) as GroupCompany[];
    },
    staleTime: 1000 * 60 * 5,
  });
};

// Combined hook for TopBar component
export const useTopBar = () => {
  const { data: config, isLoading: configLoading } = useTopBarConfig();
  const { data: links, isLoading: linksLoading } = useTopBarLinks();
  const { data: companies, isLoading: companiesLoading } = useGroupCompanies();

  return {
    config,
    links: links || [],
    companies: companies || [],
    isLoading: configLoading || linksLoading || companiesLoading,
    currentCompany: companies?.find((c) => c.is_current),
    otherCompanies: companies?.filter((c) => !c.is_current) || [],
  };
};

// Admin hooks - Fetch all (including inactive)
export const useAllTopBarLinks = () => {
  return useQuery({
    queryKey: ["topbar-links-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("topbar_links")
        .select("*")
        .order("position", { ascending: true });
      
      if (error) throw error;
      return (data || []) as TopBarLink[];
    },
  });
};

export const useAllGroupCompanies = () => {
  return useQuery({
    queryKey: ["topbar-group-companies-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("topbar_group_companies")
        .select("*")
        .order("position", { ascending: true });
      
      if (error) throw error;
      return (data || []) as GroupCompany[];
    },
  });
};

// Mutation hooks
export const useUpdateTopBarConfig = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: Partial<TopBarConfig> & { id: string }) => {
      const { data, error } = await supabase
        .from("topbar_config")
        .update(updates)
        .eq("id", updates.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topbar-config"] });
    },
  });
};

export const useCreateTopBarLink = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (link: Omit<TopBarLink, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("topbar_links")
        .insert(link)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topbar-links"] });
      queryClient.invalidateQueries({ queryKey: ["topbar-links-all"] });
    },
  });
};

export const useUpdateTopBarLink = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: Partial<TopBarLink> & { id: string }) => {
      const { data, error } = await supabase
        .from("topbar_links")
        .update(updates)
        .eq("id", updates.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topbar-links"] });
      queryClient.invalidateQueries({ queryKey: ["topbar-links-all"] });
    },
  });
};

export const useDeleteTopBarLink = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("topbar_links")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topbar-links"] });
      queryClient.invalidateQueries({ queryKey: ["topbar-links-all"] });
    },
  });
};

export const useCreateGroupCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (company: Omit<GroupCompany, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("topbar_group_companies")
        .insert(company)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topbar-group-companies"] });
      queryClient.invalidateQueries({ queryKey: ["topbar-group-companies-all"] });
    },
  });
};

export const useUpdateGroupCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: Partial<GroupCompany> & { id: string }) => {
      const { data, error } = await supabase
        .from("topbar_group_companies")
        .update(updates)
        .eq("id", updates.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topbar-group-companies"] });
      queryClient.invalidateQueries({ queryKey: ["topbar-group-companies-all"] });
    },
  });
};

export const useDeleteGroupCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("topbar_group_companies")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topbar-group-companies"] });
      queryClient.invalidateQueries({ queryKey: ["topbar-group-companies-all"] });
    },
  });
};

export const useSetCurrentCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // First, set all companies to not current
      await supabase
        .from("topbar_group_companies")
        .update({ is_current: false })
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Update all
      
      // Then set the selected one as current
      const { data, error } = await supabase
        .from("topbar_group_companies")
        .update({ is_current: true })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topbar-group-companies"] });
      queryClient.invalidateQueries({ queryKey: ["topbar-group-companies-all"] });
    },
  });
};
