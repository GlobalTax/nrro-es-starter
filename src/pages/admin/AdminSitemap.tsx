import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Globe, TrendingUp } from "lucide-react";
import { useSitePages, useSitePageStats, SitePageFilters } from "@/hooks/useSitePages";
import { SitePageTable } from "@/components/admin/sitemap/SitePageTable";
import { SitePageFilters as FiltersComponent } from "@/components/admin/sitemap/SitePageFilters";
import { SitePageEditDialog } from "@/components/admin/sitemap/SitePageEditDialog";
import { SitePage, useUpdateSitePage } from "@/hooks/useSitePages";
import { toast } from "sonner";

const AdminSitemap = () => {
  const [filters, setFilters] = useState<SitePageFilters>({});
  const [selectedPage, setSelectedPage] = useState<SitePage | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const { data: pages = [], isLoading } = useSitePages(filters);
  const { data: stats } = useSitePageStats();
  const updateMutation = useUpdateSitePage();

  const handleEdit = (page: SitePage) => {
    setSelectedPage(page);
    setIsEditDialogOpen(true);
  };

  const handleDuplicate = (page: SitePage) => {
    toast.info("Función de duplicar en desarrollo");
  };

  const handleArchive = (page: SitePage) => {
    updateMutation.mutate({
      id: page.id,
      data: { status: 'archived' }
    });
  };

  const handleSync = () => {
    toast.info("Sincronización manual en desarrollo (Fase 2)");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mapa del Sitio</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona todas las páginas y landings de nrro.es
          </p>
        </div>
        <Button onClick={handleSync} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Sincronizar
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total de Páginas</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                En todo el sitio
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Landings</CardDescription>
              <CardTitle className="text-3xl">{stats.landings}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                Páginas de captación
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Publicadas</CardDescription>
              <CardTitle className="text-3xl">{stats.by_status.published || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                Accesibles públicamente
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Idiomas</CardDescription>
              <CardTitle className="text-3xl">{Object.keys(stats.by_language).length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                ES: {stats.by_language.es || 0} | CA: {stats.by_language.ca || 0} | EN: {stats.by_language.en || 0}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtra y busca páginas en el mapa del sitio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FiltersComponent filters={filters} onFiltersChange={setFilters} />
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Páginas</CardTitle>
              <CardDescription>
                {isLoading ? "Cargando..." : `${pages.length} páginas encontradas`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <SitePageTable
              pages={pages}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onArchive={handleArchive}
            />
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <SitePageEditDialog
        page={selectedPage}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </div>
  );
};

export default AdminSitemap;
