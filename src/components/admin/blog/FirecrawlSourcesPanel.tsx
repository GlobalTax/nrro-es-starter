import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Plus, Trash2, Loader2, ExternalLink } from "lucide-react";
import {
  useBlogResearchSources,
  useAddResearchSource,
  useToggleResearchSource,
  useDeleteResearchSource,
} from "@/hooks/useBlogResearchSources";

const CATEGORIES = ["Fiscal", "Mercantil", "Laboral", "Corporativo"];

export function FirecrawlSourcesPanel() {
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [activeCategory, setActiveCategory] = useState("Fiscal");

  const { data: sources, isLoading } = useBlogResearchSources();
  const addSource = useAddResearchSource();
  const toggleSource = useToggleResearchSource();
  const deleteSource = useDeleteResearchSource();

  const handleAdd = () => {
    if (!newName.trim() || !newUrl.trim()) return;
    addSource.mutate({
      category: activeCategory,
      site_name: newName.trim(),
      site_url: newUrl.trim().replace(/^https?:\/\//, "").replace(/\/+$/, ""),
    });
    setNewName("");
    setNewUrl("");
  };

  const filteredSources = (cat: string) =>
    sources?.filter((s) => s.category === cat) || [];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          <CardTitle>Fuentes de Investigación Firecrawl</CardTitle>
        </div>
        <CardDescription>
          Configura los sitios web que Firecrawl consultará para investigar cada categoría de artículos.
          Los sitios habilitados se usarán como filtro <code>site:</code> en las búsquedas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="mb-4">
            {CATEGORIES.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="gap-1.5">
                {cat}
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {filteredSources(cat).filter((s) => s.is_enabled).length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {CATEGORIES.map((cat) => (
            <TabsContent key={cat} value={cat} className="space-y-4">
              {/* Add new source form */}
              <div className="flex gap-2">
                <Input
                  placeholder="Nombre (ej: BOE)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-44"
                />
                <Input
                  placeholder="URL (ej: boe.es)"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                />
                <Button
                  onClick={handleAdd}
                  disabled={!newName.trim() || !newUrl.trim() || addSource.isPending}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Añadir
                </Button>
              </div>

              {/* Sources list */}
              <div className="space-y-2">
                {filteredSources(cat).length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    No hay fuentes configuradas para {cat}
                  </div>
                ) : (
                  filteredSources(cat).map((source) => (
                    <div
                      key={source.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border bg-card"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Switch
                          checked={source.is_enabled}
                          onCheckedChange={(checked) =>
                            toggleSource.mutate({ id: source.id, is_enabled: checked })
                          }
                        />
                        <div className="min-w-0">
                          <div className="font-medium text-sm truncate">
                            {source.site_name}
                          </div>
                          <a
                            href={`https://${source.site_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                          >
                            {source.site_url}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!source.is_enabled && (
                          <Badge variant="secondary" className="text-xs">Desactivada</Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => deleteSource.mutate(source.id)}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Info */}
              <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded">
                Las fuentes habilitadas se usarán como filtros <code className="bg-muted px-1 rounded">site:dominio.com</code> en
                las búsquedas de Firecrawl al generar artículos de la categoría <strong>{cat}</strong>.
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
