import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AnalyzedContent {
  title_es: string;
  title_en: string;
  excerpt_es: string;
  excerpt_en: string;
  seo_title_es: string;
  seo_title_en: string;
  seo_description_es: string;
  seo_description_en: string;
  category: string;
  tags: string[];
  read_time: number;
}

type AnalyzeState = 'idle' | 'analyzing' | 'success' | 'error';

export const useAnalyzeBlogContent = () => {
  const { toast } = useToast();
  const [state, setState] = useState<AnalyzeState>('idle');
  const [result, setResult] = useState<AnalyzedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeContent = async (content_es: string, content_en?: string): Promise<AnalyzedContent | null> => {
    setState('analyzing');
    setError(null);
    setResult(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('analyze-blog-content', {
        body: { content_es, content_en }
      });

      if (functionError) {
        console.error('Function error:', functionError);
        
        if (functionError.message?.includes('429')) {
          const errorMsg = 'Límite de solicitudes excedido. Intenta de nuevo en unos minutos.';
          setError(errorMsg);
          toast({
            title: 'Error',
            description: errorMsg,
            variant: 'destructive',
          });
          setState('error');
          return null;
        }

        if (functionError.message?.includes('402')) {
          const errorMsg = 'Créditos de IA agotados. Recarga tu cuenta en Settings > Workspace > Usage.';
          setError(errorMsg);
          toast({
            title: 'Sin créditos',
            description: errorMsg,
            variant: 'destructive',
          });
          setState('error');
          return null;
        }

        throw functionError;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (!data) {
        throw new Error('No se recibió respuesta de la IA');
      }

      setState('success');
      setResult(data);
      return data;

    } catch (err) {
      console.error('Error analyzing content:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al analizar el contenido';
      setError(errorMessage);
      setState('error');
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    }
  };

  const reset = () => {
    setState('idle');
    setResult(null);
    setError(null);
  };

  return {
    state,
    result,
    error,
    analyzeContent,
    reset,
    isAnalyzing: state === 'analyzing',
    isSuccess: state === 'success',
    isError: state === 'error',
  };
};
