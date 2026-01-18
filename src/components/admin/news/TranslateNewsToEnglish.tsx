import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Languages, Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export const TranslateNewsToEnglish = () => {
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

      const { data, error } = await supabase.functions.invoke('translate-news-to-english', {
        body: {}
      });

      if (error) throw error;

      if (data.success) {
        setResults(data.results);
        toast.success(`✅ Traducción completada: ${data.results.success} artículos traducidos`);
      } else {
        throw new Error(data.error || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error translating news:', error);
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`Error al traducir: ${errorMsg}`);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-100 rounded-md">
            <Languages className="h-4 w-4 text-slate-600" />
          </div>
          <CardTitle className="text-lg font-medium text-slate-900">
            Traducir al Inglés
          </CardTitle>
        </div>
        <CardDescription className="text-slate-500">
          Traduce automáticamente todos los artículos que no tengan traducción al inglés.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!results && (
          <Alert className="bg-slate-50 border-slate-200">
            <AlertCircle className="h-4 w-4 text-slate-500" />
            <AlertDescription className="text-slate-600">
              Esta operación puede tardar varios minutos dependiendo del número de artículos.
            </AlertDescription>
          </Alert>
        )}

        {results && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-emerald-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <div>
                    <p className="text-xl font-semibold text-emerald-700">{results.success}</p>
                    <p className="text-xs text-emerald-600">Exitosos</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <div>
                    <p className="text-xl font-semibold text-amber-700">{results.skipped}</p>
                    <p className="text-xs text-amber-600">Omitidos</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="text-xl font-semibold text-red-700">{results.failed}</p>
                    <p className="text-xs text-red-600">Errores</p>
                  </div>
                </div>
              </div>
            </div>

            {results.errors.length > 0 && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-medium mb-2 text-red-800">Errores durante la traducción:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                    {results.errors.map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <Button 
          onClick={handleTranslate} 
          disabled={isTranslating}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white"
        >
          {isTranslating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Traduciendo artículos...
            </>
          ) : (
            <>
              <Languages className="mr-2 h-4 w-4" />
              Traducir al Inglés
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
