import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface AuthorInfo {
  id: string;
  name: string;
  position: string;
  bio: string;
  avatar_url: string | null;
  linkedin: string | null;
}

export const useAuthorInfo = (authorName: string | null) => {
  const { language } = useLanguage();

  return useQuery({
    queryKey: ["author-info", authorName, language],
    queryFn: async (): Promise<AuthorInfo | null> => {
      if (!authorName) return null;

      // Search by name (partial match)
      const { data, error } = await supabase
        .from("team_members")
        .select("id, name, position_es, position_en, position_ca, bio_es, bio_en, bio_ca, avatar_url, linkedin")
        .ilike("name", `%${authorName.split(" ")[0]}%`)
        .limit(1)
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        name: data.name,
        position: data[`position_${language}`] || data.position_es || "",
        bio: data[`bio_${language}`] || data.bio_es || "",
        avatar_url: data.avatar_url,
        linkedin: data.linkedin,
      };
    },
    enabled: !!authorName,
  });
};
