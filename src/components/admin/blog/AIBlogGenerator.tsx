import DOMPurify from 'dompurify';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { useAIBlogGenerator, GenerationOptions, GeneratedArticle } from "@/hooks/useAIBlogGenerator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AIBlogGeneratorProps {
  onGenerated: (article: GeneratedArticle) => void;
  onCancel: () => void;
}

export const AIBlogGenerator = ({ onGenerated, onCancel }: AIBlogGeneratorProps) => {
  const [prompt, setPrompt] = useState("");
  const [options, setOptions] = useState<GenerationOptions>({
    tone: "professional",
    language: "both"
  });

  const { state, generateArticle, reset, isLoading } = useAIBlogGenerator();

  const handleGenerate = async () => {
    const article = await generateArticle(prompt, options);
    if (article) {
      // No cerramos automáticamente, dejamos que el usuario vea el preview
    }
  };

  const handleUseContent = () => {
    if (state.status === "success") {
      onGenerated(state.article);
    }
  };

  const handleRegenerate = () => {
    reset();
  };

  return (
    <div className="space-y-6">
      {state.status === "idle" || state.status === "loading" ? (
        <>
          <div className="space-y-4">
            <div>
              <Label htmlFor="prompt" className="text-base">
                Tema del artículo
              </Label>
              <Textarea
                id="prompt"
                placeholder="Ej: Novedades fiscales en el Impuesto de Sociedades 2025 para empresas familiares..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="mt-2 min-h-[100px]"
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground mt-2">
                Describe el tema sobre el que quieres generar el artículo. Sé específico para obtener mejores resultados.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tone">Tono del artículo</Label>
                <Select
                  value={options.tone}
                  onValueChange={(value: any) => setOptions({ ...options, tone: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger id="tone" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Profesional</SelectItem>
                    <SelectItem value="technical">Técnico</SelectItem>
                    <SelectItem value="divulgative">Divulgativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="language">Idioma</Label>
                <Select
                  value={options.language}
                  onValueChange={(value: any) => setOptions({ ...options, language: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger id="language" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="both">Ambos (ES + EN)</SelectItem>
                    <SelectItem value="es">Solo Español</SelectItem>
                    <SelectItem value="en">Solo Inglés</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {isLoading && (
            <Card className="p-6 bg-muted/50">
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <div className="text-center">
                  <p className="font-medium">Generando artículo con IA...</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Esto puede tardar 20-30 segundos
                  </p>
                </div>
              </div>
            </Card>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={handleGenerate} disabled={isLoading || !prompt.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generar con IA
                </>
              )}
            </Button>
          </div>
        </>
      ) : state.status === "success" ? (
        <>
          <Card className="p-4 bg-success/10 border-success">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-success">¡Artículo generado con éxito!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Revisa el contenido generado y haz clic en "Usar este contenido" para importarlo al formulario.
                </p>
              </div>
            </div>
          </Card>

          <ScrollArea className="h-[400px] rounded-md border p-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{state.article.category}</Badge>
                  <Badge variant="secondary">{state.article.read_time} min lectura</Badge>
                </div>
                <h3 className="text-xl font-bold">{state.article.title_es}</h3>
                <p className="text-sm text-muted-foreground mt-2">{state.article.excerpt_es}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Tags:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {state.article.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Vista previa del contenido (ES):</Label>
                <div 
                  className="prose prose-sm max-w-none mt-2 p-4 bg-muted/50 rounded-md"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(state.article.content_es.substring(0, 500) + "...") }}
                />
              </div>

              {state.article.title_en && (
                <div className="pt-4 border-t">
                  <h4 className="text-lg font-semibold">{state.article.title_en}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{state.article.excerpt_en}</p>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleRegenerate}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerar
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button onClick={handleUseContent}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Usar este contenido
            </Button>
          </div>
        </>
      ) : (
        <>
          <Card className="p-6 bg-destructive/10 border-destructive">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-destructive">Error al generar el artículo</p>
                <p className="text-sm text-muted-foreground mt-1">{state.message}</p>
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button onClick={handleRegenerate}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Intentar de nuevo
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
