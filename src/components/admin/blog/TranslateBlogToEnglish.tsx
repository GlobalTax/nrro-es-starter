import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Languages, Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export const TranslateBlogToEnglish = () => {
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

      const { data, error } = await supabase.functions.invoke('translate-blog-to-english', {
        body: {}
      });

      if (error) throw error;

      if (data.success) {
        setResults(data.results);
        toast.success(`✅ Traducción completada: ${data.results.success} posts traducidos`);
      } else {
        throw new Error(data.error || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error translating blog:', error);
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`Error al traducir: ${errorMsg}`);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5" />
          Traducción Automática al Inglés
        </CardTitle>
        <CardDescription>
          Traduce automáticamente todos los posts del blog al inglés usando Google Translate API.
          Solo se traducirán los posts que aún no tengan traducción al inglés.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!results && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Esta operación puede tardar varios minutos dependiendo del número de posts.
              Se traducirán automáticamente: título, extracto, contenido, SEO title y SEO description.
            </AlertDescription>
          </Alert>
        )}

        {results && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <Card className="bg-green-50 dark:bg-green-950">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {results.success}
                      </p>
                      <p className="text-xs text-muted-foreground">Exitosos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-yellow-50 dark:bg-yellow-950">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    <div>
                      <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {results.skipped}
                      </p>
                      <p className="text-xs text-muted-foreground">Omitidos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-50 dark:bg-red-950">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <div>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {results.failed}
                      </p>
                      <p className="text-xs text-muted-foreground">Errores</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {results.errors.length > 0 && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-medium mb-2">Errores durante la traducción:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
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
          className="w-full"
        >
          {isTranslating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Traduciendo posts...
            </>
          ) : (
            <>
              <Languages className="mr-2 h-4 w-4" />
              Traducir Blog al Inglés
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
