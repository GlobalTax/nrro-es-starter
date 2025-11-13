import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SitemapMetrics {
  lastUpdated: string | null;
  totalUrls: number;
  urlsByLanguage: {
    es: number;
    en: number;
    ca: number;
  };
  fileSize: number;
  publicUrl: string;
}

async function fetchSitemapMetrics(): Promise<SitemapMetrics> {
  // Obtener metadata del archivo desde Storage
  const { data: fileData, error: fileError } = await supabase.storage
    .from('public-files')
    .list('', {
      limit: 1,
      search: 'sitemap.xml'
    });

  if (fileError) throw fileError;
  if (!fileData || fileData.length === 0) {
    throw new Error('Sitemap no encontrado en Storage');
  }

  const file = fileData[0];
  
  // Obtener URL pública
  const { data: urlData } = supabase.storage
    .from('public-files')
    .getPublicUrl('sitemap.xml');

  // Descargar y parsear el contenido del sitemap
  const response = await fetch(urlData.publicUrl);
  if (!response.ok) throw new Error('Error descargando sitemap');
  
  const xmlText = await response.text();
  
  // Contar URLs totales
  const urlMatches = xmlText.match(/<url>/g);
  const totalUrls = urlMatches ? urlMatches.length : 0;

  // Contar URLs por idioma
  const esUrls = (xmlText.match(/<loc>https:\/\/nrro\.es\/es\//g) || []).length;
  const enUrls = (xmlText.match(/<loc>https:\/\/nrro\.es\/en\//g) || []).length;
  const caUrls = (xmlText.match(/<loc>https:\/\/nrro\.es\/ca\//g) || []).length;

  return {
    lastUpdated: file.updated_at || file.created_at || null,
    totalUrls,
    urlsByLanguage: {
      es: esUrls,
      en: enUrls,
      ca: caUrls
    },
    fileSize: file.metadata?.size || 0,
    publicUrl: urlData.publicUrl
  };
}

export function useSitemapMetrics() {
  return useQuery({
    queryKey: ['sitemap-metrics'],
    queryFn: fetchSitemapMetrics,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 2
  });
}
