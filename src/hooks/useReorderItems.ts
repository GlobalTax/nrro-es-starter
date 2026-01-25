import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ReorderUpdate {
  id: string;
  position: number;
}

export const useReorderItems = (
  tableName: "topbar_links" | "topbar_group_companies",
  queryKeys: string[]
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: ReorderUpdate[]) => {
      // Batch update all positions
      const promises = updates.map(({ id, position }) =>
        supabase.from(tableName).update({ position }).eq("id", id)
      );
      
      const results = await Promise.all(promises);
      
      // Check for errors
      const errors = results.filter((r) => r.error);
      if (errors.length > 0) {
        throw new Error(`Failed to update positions: ${errors[0].error?.message}`);
      }
    },
    onSuccess: () => {
      queryKeys.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: [key] })
      );
    },
  });
};
