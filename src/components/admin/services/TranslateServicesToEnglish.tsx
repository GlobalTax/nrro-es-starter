import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Languages, Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export const TranslateServicesToEnglish = () => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [results, setResults] = useState<{
    success: number;
    failed: number;
    skipped: number;
    errors: string[];
  } | null>(null);

  const handleTranslate = async () => {
    setIsTranslating(true);
    setResults(null);

    try {
      toast.info("Iniciando traducción automática al inglés...");

      const { data, error } = await supabase.functions.invoke('translate-services-to-english', {
        body: {}
      });

      if (error) throw error;

      if (data.success) {
        setResults(data.results);
        toast.success(`✅ Traducción completada: ${data.results.success} servicios traducidos`);
      } else {
        throw new Error(data.error || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error translating services:', error);
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`Error al traducir: ${errorMsg}`);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Traducir al Inglés
          </h3>
          <p className="text-sm text-muted-foreground">
            Traduce automáticamente todos los servicios que no tengan traducción al inglés.
            Se traducen: nombre, descripción, área, metodología, servicios transversales y estadísticas.
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Button 
          onClick={handleTranslate} 
          disabled={isTranslating}
          className="w-full"
          variant="default"
        >
          {isTranslating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Traduciendo...
            </>
          ) : (
            <>
              <Languages className="mr-2 h-4 w-4" />
              Traducir Servicios al Inglés
            </>
          )}
        </Button>

        {results && (
          <Alert>
            <AlertDescription>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="font-medium">Exitosos: {results.success}</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Omitidos: {results.skipped}</span>
                </div>
                {results.failed > 0 && (
                  <>
                    <div className="flex items-center gap-2 text-red-600">
                      <XCircle className="h-4 w-4" />
                      <span className="font-medium">Errores: {results.failed}</span>
                    </div>
                    {results.errors.length > 0 && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        <p className="font-medium mb-1">Detalles de errores:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {results.errors.map((error, idx) => (
                            <li key={idx} className="text-xs">{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
