import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SeoAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  pageId: string;
  pageTitle: string;
  pageUrl: string;
}

async function analyzeSeoIssues(): Promise<SeoAlert[]> {
  const { data: pages, error } = await supabase
    .from('site_pages')
    .select('*')
    .neq('status', 'archived')
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (!pages) return [];

  const alerts: SeoAlert[] = [];

  pages.forEach((page) => {
    // Alertas críticas: páginas sin título Y descripción
    if (!page.meta_title && !page.meta_description) {
      alerts.push({
        id: `critical-${page.id}`,
        type: 'critical',
        title: 'Meta tags faltantes',
        description: 'Página sin título ni descripción',
        pageId: page.id,
        pageTitle: page.title || page.url,
        pageUrl: page.url
      });
    }
    // Advertencias: meta incompleto
    else if (!page.meta_title) {
      alerts.push({
        id: `warning-title-${page.id}`,
        type: 'warning',
        title: 'Título faltante',
        description: 'La página no tiene meta title',
        pageId: page.id,
        pageTitle: page.title || page.url,
        pageUrl: page.url
      });
    } else if (!page.meta_description) {
      alerts.push({
        id: `warning-desc-${page.id}`,
        type: 'warning',
        title: 'Descripción faltante',
        description: 'La página no tiene meta description',
        pageId: page.id,
        pageTitle: page.title || page.url,
        pageUrl: page.url
      });
    }

    // Info: páginas con noindex
    if (page.is_noindex) {
      alerts.push({
        id: `info-${page.id}`,
        type: 'info',
        title: 'Página con noindex',
        description: 'Esta página está excluida de indexación',
        pageId: page.id,
        pageTitle: page.title || page.url,
        pageUrl: page.url
      });
    }

    // Advertencias: título muy corto o largo
    if (page.meta_title) {
      if (page.meta_title.length < 30) {
        alerts.push({
          id: `warning-short-${page.id}`,
          type: 'warning',
          title: 'Título demasiado corto',
          description: `Título con solo ${page.meta_title.length} caracteres (recomendado: 50-60)`,
          pageId: page.id,
          pageTitle: page.title || page.url,
          pageUrl: page.url
        });
      } else if (page.meta_title.length > 70) {
        alerts.push({
          id: `warning-long-${page.id}`,
          type: 'warning',
          title: 'Título demasiado largo',
          description: `Título con ${page.meta_title.length} caracteres (se truncará en Google)`,
          pageId: page.id,
          pageTitle: page.title || page.url,
          pageUrl: page.url
        });
      }
    }

    // Advertencias: descripción muy corta o larga
    if (page.meta_description) {
      if (page.meta_description.length < 120) {
        alerts.push({
          id: `warning-short-desc-${page.id}`,
          type: 'warning',
          title: 'Descripción demasiado corta',
          description: `Descripción con solo ${page.meta_description.length} caracteres (recomendado: 150-160)`,
          pageId: page.id,
          pageTitle: page.title || page.url,
          pageUrl: page.url
        });
      } else if (page.meta_description.length > 170) {
        alerts.push({
          id: `warning-long-desc-${page.id}`,
          type: 'warning',
          title: 'Descripción demasiado larga',
          description: `Descripción con ${page.meta_description.length} caracteres (se truncará en Google)`,
          pageId: page.id,
          pageTitle: page.title || page.url,
          pageUrl: page.url
        });
      }
    }
  });

  return alerts;
}

export function useSeoAlerts() {
  return useQuery({
    queryKey: ['seo-alerts'],
    queryFn: analyzeSeoIssues,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
