import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SitemapHistoryData {
  date: string;
  totalUrls: number;
  urlsEs: number;
  urlsCa: number;
  urlsEn: number;
  fileSize: number;
  generationTime?: number;
}

interface RawHistoryData {
  created_at: string;
  total_urls: number;
  urls_es: number;
  urls_ca: number;
  urls_en: number;
  file_size: number;
  generation_time_ms: number | null;
}

async function fetchSitemapHistory(days: number = 30): Promise<SitemapHistoryData[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const { data, error } = await supabase
    .from('sitemap_history')
    .select('created_at, total_urls, urls_es, urls_ca, urls_en, file_size, generation_time_ms')
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  
  // Agrupar por día (puede haber múltiples regeneraciones por día)
  const groupedByDay = (data as RawHistoryData[]).reduce((acc, item) => {
    const date = new Date(item.created_at).toISOString().split('T')[0];
    
    if (!acc[date]) {
      acc[date] = {
        date,
        totalUrls: item.total_urls,
        urlsEs: item.urls_es,
        urlsCa: item.urls_ca,
        urlsEn: item.urls_en,
        fileSize: item.file_size,
        generationTime: item.generation_time_ms || undefined
      };
    } else {
      // Si hay múltiples entradas en el mismo día, tomar la más reciente
      acc[date].totalUrls = item.total_urls;
      acc[date].urlsEs = item.urls_es;
      acc[date].urlsCa = item.urls_ca;
      acc[date].urlsEn = item.urls_en;
      acc[date].fileSize = item.file_size;
      acc[date].generationTime = item.generation_time_ms || undefined;
    }
    
    return acc;
  }, {} as Record<string, SitemapHistoryData>);
  
  // Convertir a array y ordenar
  return Object.values(groupedByDay).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export function useSitemapHistory(days: number = 30) {
  return useQuery({
    queryKey: ['sitemap-history', days],
    queryFn: () => fetchSitemapHistory(days),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    enabled: true
  });
}
