import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MarketingAuditState, AuditCategory, AuditItemStatus, ScrapedData } from '@/lib/marketingAuditTypes';
import { createDefaultChecklist, calculateCategoryScore, calculateGlobalScore } from '@/lib/marketingAuditChecklist';
import { analyzeScrapedData, generateQuickWins, generateRecommendations } from '@/lib/marketingAuditAnalyzer';
import { toast } from 'sonner';

export const useMarketingAudit = () => {
  const [state, setState] = useState<MarketingAuditState>({
    url: '',
    categories: createDefaultChecklist(),
    globalScore: 0,
    quickWins: [],
    recommendations: [],
    isLoading: false,
    isAnalyzed: false,
  });

  const recalculateScores = useCallback((categories: AuditCategory[]) => {
    const scored = categories.map(cat => ({
      ...cat,
      score: calculateCategoryScore(cat.items),
    }));
    const globalScore = calculateGlobalScore(scored);
    const quickWins = generateQuickWins(scored);
    const recommendations = generateRecommendations(scored);
    return { categories: scored, globalScore, quickWins, recommendations };
  }, []);

  const runAudit = useCallback(async (url: string) => {
    setState(prev => ({ ...prev, url, isLoading: true }));

    try {
      const { data, error } = await supabase.functions.invoke('marketing-audit', {
        body: { url },
      });

      if (error) throw new Error(error.message);
      if (!data?.success) throw new Error(data?.error || 'Error al analizar');

      const scrapedData: ScrapedData = data.data;
      const checklist = createDefaultChecklist();
      const analyzed = analyzeScrapedData(scrapedData, checklist);
      const { categories, globalScore, quickWins, recommendations } = recalculateScores(analyzed);

      setState(prev => ({
        ...prev,
        url,
        categories,
        globalScore,
        quickWins,
        recommendations,
        isLoading: false,
        isAnalyzed: true,
        rawData: scrapedData,
      }));

      toast.success(`Auditoría completada: ${globalScore}/100`);
    } catch (err: any) {
      toast.error(err.message || 'Error en la auditoría');
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [recalculateScores]);

  const updateItemStatus = useCallback((categoryId: string, itemId: string, status: AuditItemStatus) => {
    setState(prev => {
      const categories = prev.categories.map(cat => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          items: cat.items.map(item => item.id === itemId ? { ...item, status } : item),
        };
      });
      const { categories: scored, globalScore, quickWins, recommendations } = recalculateScores(categories);
      return { ...prev, categories: scored, globalScore, quickWins, recommendations };
    });
  }, [recalculateScores]);

  const updateItemNote = useCallback((categoryId: string, itemId: string, note: string) => {
    setState(prev => ({
      ...prev,
      categories: prev.categories.map(cat => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          items: cat.items.map(item => item.id === itemId ? { ...item, note } : item),
        };
      }),
    }));
  }, []);

  const saveAudit = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const payload = {
        url: state.url,
        global_score: state.globalScore,
        category_scores: Object.fromEntries(state.categories.map(c => [c.id, c.score])),
        checklist_data: state.categories,
        quick_wins: state.quickWins,
        recommendations: state.recommendations,
        raw_analysis: state.rawData || {},
        created_by: user.id,
      };

      const { error } = await supabase.from('marketing_audits' as any).insert(payload as any);
      if (error) throw error;
      toast.success('Auditoría guardada correctamente');
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar');
    }
  }, [state]);

  const resetAudit = useCallback(() => {
    setState({
      url: '',
      categories: createDefaultChecklist(),
      globalScore: 0,
      quickWins: [],
      recommendations: [],
      isLoading: false,
      isAnalyzed: false,
    });
  }, []);

  return {
    ...state,
    runAudit,
    updateItemStatus,
    updateItemNote,
    saveAudit,
    resetAudit,
  };
};
