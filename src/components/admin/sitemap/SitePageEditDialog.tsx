import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SitePage, useUpdateSitePage } from "@/hooks/useSitePages";

interface SitePageEditDialogProps {
  page: SitePage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SitePageEditDialog = ({ page, open, onOpenChange }: SitePageEditDialogProps) => {
  const [formData, setFormData] = useState<Partial<SitePage>>({});
  const updateMutation = useUpdateSitePage();

  useEffect(() => {
    if (page) {
      setFormData(page);
    }
  }, [page]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!page) return;

    updateMutation.mutate(
      { id: page.id, data: formData },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  if (!page) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Página</DialogTitle>
          <DialogDescription>
            Modifica los datos de la página en el mapa del sitio
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Básico</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="landing">Landing/Marketing</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={formData.url || ""}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="language">Idioma</Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value: any) => setFormData({ ...formData, language: value })}
                  >
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="ca">Catalán</SelectItem>
                      <SelectItem value="en">Inglés</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Publicada</SelectItem>
                      <SelectItem value="draft">Borrador</SelectItem>
                      <SelectItem value="archived">Archivada</SelectItem>
                      <SelectItem value="redirect">Redirección</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="business_area">Área de práctica</Label>
                <Input
                  id="business_area"
                  value={formData.business_area || ""}
                  onChange={(e) => setFormData({ ...formData, business_area: e.target.value })}
                  placeholder="Ej: Fiscal, M&A, Mercantil..."
                />
              </div>

              <div>
                <Label htmlFor="owner">Responsable</Label>
                <Input
                  id="owner"
                  value={formData.owner || ""}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  placeholder="Nombre o área responsable"
                />
              </div>

              <div>
                <Label htmlFor="notes">Notas internas</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Notas para el equipo..."
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title || ""}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  placeholder="Título optimizado para SEO (50-60 caracteres)"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {(formData.meta_title || "").length}/60 caracteres
                </p>
              </div>

              <div>
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description || ""}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  placeholder="Descripción optimizada para SEO (150-160 caracteres)"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {(formData.meta_description || "").length}/160 caracteres
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="is_noindex">No Index / No Follow</Label>
                  <p className="text-sm text-muted-foreground">
                    Evitar que los motores de búsqueda indexen esta página
                  </p>
                </div>
                <Switch
                  id="is_noindex"
                  checked={formData.is_noindex || false}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_noindex: checked })}
                />
              </div>
            </TabsContent>

            <TabsContent value="landing" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="is_landing">Esta es una Landing Page</Label>
                  <p className="text-sm text-muted-foreground">
                    Marca si es una página de captación de leads
                  </p>
                </div>
                <Switch
                  id="is_landing"
                  checked={formData.is_landing || false}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_landing: checked })}
                />
              </div>

              {formData.is_landing && (
                <>
                  <div>
                    <Label htmlFor="campaign_name">Nombre de campaña</Label>
                    <Input
                      id="campaign_name"
                      value={formData.campaign_name || ""}
                      onChange={(e) => setFormData({ ...formData, campaign_name: e.target.value })}
                      placeholder="Ej: Campaña Q4 2024 - Fiscal"
                    />
                  </div>

                  <div>
                    <Label htmlFor="traffic_source">Fuente de tráfico</Label>
                    <Select
                      value={formData.traffic_source || "other"}
                      onValueChange={(value: any) => setFormData({ ...formData, traffic_source: value })}
                    >
                      <SelectTrigger id="traffic_source">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="seo">SEO (Orgánico)</SelectItem>
                        <SelectItem value="sem">SEM (Google Ads)</SelectItem>
                        <SelectItem value="social">Redes Sociales</SelectItem>
                        <SelectItem value="email">Email Marketing</SelectItem>
                        <SelectItem value="referral">Referral</SelectItem>
                        <SelectItem value="direct">Directo</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="conversion_goal">Objetivo de conversión</Label>
                    <Input
                      id="conversion_goal"
                      value={formData.conversion_goal || ""}
                      onChange={(e) => setFormData({ ...formData, conversion_goal: e.target.value })}
                      placeholder="Ej: Lead fiscal, descarga guía, consulta..."
                    />
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};