import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Languages, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function TranslateServicesToCatalan() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [results, setResults] = useState<{
    success: number;
    failed: number;
    skipped: number;
    errors: string[];
  } | null>(null);

  const handleTranslate = async () => {
    try {
      setIsTranslating(true);
      setResults(null);
      
      toast.info('Iniciando traducción de servicios al catalán...');

      const { data, error } = await supabase.functions.invoke('translate-services-to-catalan');

      if (error) throw error;

      setResults(data.results);
      
      if (data.results.success > 0) {
        toast.success(
          `Traducción completada: ${data.results.success} servicios traducidos, ${data.results.skipped} omitidos, ${data.results.failed} errores`
        );
      } else {
        toast.warning('No se tradujeron servicios nuevos');
      }
    } catch (error: any) {
      console.error('Error translating services:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Traducir Servicios al Catalán
          </h3>
          <p className="text-sm text-muted-foreground">
            Traduce automáticamente todos los servicios que no tengan traducción al catalán.
            Se traducen: nombre, descripción, área, metodología, servicios transversales y estadísticas.
          </p>
        </div>

        <Button
          onClick={handleTranslate}
          disabled={isTranslating}
          className="w-full"
        >
          {isTranslating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Traduciendo servicios...
            </>
          ) : (
            <>
              <Languages className="mr-2 h-4 w-4" />
              Traducir Servicios al Catalán
            </>
          )}
        </Button>

        {results && (
          <Alert>
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">Resultados:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>✅ Traducidos: {results.success}</li>
                  <li>⏭️ Omitidos: {results.skipped}</li>
                  <li>❌ Errores: {results.failed}</li>
                </ul>
                {results.errors.length > 0 && (
                  <div className="mt-3">
                    <p className="font-semibold text-sm text-destructive">Errores:</p>
                    <ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground">
                      {results.errors.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  );
}
