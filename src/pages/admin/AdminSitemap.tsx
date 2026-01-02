import { useState } from "react";
import { LayoutGrid, List, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, RefreshCw, Globe, TrendingUp, Archive, Download, Wand2 } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useSitePages, useSitePageStats, SitePageFilters } from "@/hooks/useSitePages";
import { useSyncSitePages } from "@/hooks/useSyncSitePages";
import { useFetchPageMeta } from "@/hooks/useFetchPageMeta";
import { SitePageTable } from "@/components/admin/sitemap/SitePageTable";
import { SitePageTreeView } from "@/components/admin/sitemap/SitePageTreeView";
import { SeoAlertsPanel } from "@/components/admin/sitemap/SeoAlertsPanel";
import { RedirectDialog } from "@/components/admin/sitemap/RedirectDialog";
import { SitePageFilters as FiltersComponent } from "@/components/admin/sitemap/SitePageFilters";
import { SitePageEditDialog } from "@/components/admin/sitemap/SitePageEditDialog";
import { SyncProgressModal } from "@/components/admin/sitemap/SyncProgressModal";
import { SyncHistoryTable } from "@/components/admin/sitemap/SyncHistoryTable";
import { SitemapMetricsCard } from "@/components/admin/sitemap/SitemapMetricsCard";
import { SitemapHistoryChart } from "@/components/admin/sitemap/SitemapHistoryChart";
import { ExportButton } from "@/components/admin/sitemap/ExportButton";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { SitePage, useUpdateSitePage, useCreateSitePage } from "@/hooks/useSitePages";
import { toast } from "sonner";

const PAGES_PER_PAGE = 25;

const AdminSitemap = () => {
  const [filters, setFilters] = useState<SitePageFilters>({});
  const [selectedPage, setSelectedPage] = useState<SitePage | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'tree'>('table');
  const [redirectPage, setRedirectPage] = useState<SitePage | null>(null);
  const [isRedirectDialogOpen, setIsRedirectDialogOpen] = useState(false);
  
  const { data: pages = [], isLoading } = useSitePages(filters);
  const { data: stats } = useSitePageStats();
  const updateMutation = useUpdateSitePage();
  const createMutation = useCreateSitePage();
  const syncMutation = useSyncSitePages();
  const fetchMetaMutation = useFetchPageMeta();

  // Paginación
  const totalPages = Math.ceil(pages.length / PAGES_PER_PAGE);
  const paginatedPages = pages.slice(
    (currentPage - 1) * PAGES_PER_PAGE,
    currentPage * PAGES_PER_PAGE
  );

  const handleEdit = (page: SitePage) => {
    setSelectedPage(page);
    setIsEditDialogOpen(true);
  };

  const handleDuplicate = (page: SitePage) => {
    const { id, created_at, updated_at, ...pageData } = page;
    const duplicatedPage = {
      ...pageData,
      title: `${page.title} (Copia)`,
      url: `${page.url}-copy`,
      status: 'draft' as const,
    };
    
    createMutation.mutate(
      duplicatedPage,
      {
        onSuccess: () => {
          toast.success('Página duplicada correctamente');
        },
      }
    );
  };

  const handleArchive = (page: SitePage) => {
    updateMutation.mutate({
      id: page.id,
      data: { status: 'archived' }
    });
  };

  const handleSync = () => {
    setIsSyncModalOpen(true);
    syncMutation.mutate();
  };

  const handleSelectPage = (pageId: string, selected: boolean) => {
    setSelectedPages(prev =>
      selected ? [...prev, pageId] : prev.filter(id => id !== pageId)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedPages(selected ? paginatedPages.map(p => p.id) : []);
  };

  const handleBatchArchive = () => {
    if (selectedPages.length === 0) return;
    
    Promise.all(
      selectedPages.map(id =>
        updateMutation.mutateAsync({ id, data: { status: 'archived' } })
      )
    ).then(() => {
      toast.success(`${selectedPages.length} páginas archivadas`);
      setSelectedPages([]);
    });
  };

  const handleRedirect = (page: SitePage) => {
    setRedirectPage(page);
    setIsRedirectDialogOpen(true);
  };

  const handleSort = (column: string) => {
    const newSortOrder = 
      filters.sort_by === column && filters.sort_order === 'asc' ? 'desc' : 'asc';
    
    setFilters({
      ...filters,
      sort_by: column as any,
      sort_order: newSortOrder
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mapa del Sitio</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona todas las páginas y landings de int.nrro.es
          </p>
        </div>
      </div>

      <Tabs defaultValue="pages" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pages">Páginas</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="sync">Sincronización</TabsTrigger>
        </TabsList>

        {/* Tab 1: Páginas */}
        <TabsContent value="pages" className="space-y-6">
          {/* Panel de Alertas SEO */}
          <Card>
            <CardHeader>
              <CardTitle>Alertas SEO</CardTitle>
            </CardHeader>
            <CardContent>
              <SeoAlertsPanel />
            </CardContent>
          </Card>
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

          {/* Table/Tree View */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Páginas</CardTitle>
                  <CardDescription>
                    {isLoading ? "Cargando..." : `${pages.length} páginas encontradas`}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as any)}>
                    <ToggleGroupItem value="table" aria-label="Vista tabla">
                      <List className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="tree" aria-label="Vista árbol">
                      <LayoutGrid className="h-4 w-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                  {selectedPages.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBatchArchive}
                    >
                      <Archive className="h-4 w-4 mr-2" />
                      Archivar {selectedPages.length}
                    </Button>
                  )}
                  <ExportButton pages={pages} disabled={isLoading} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : viewMode === 'table' ? (
                <>
                  <SitePageTable
                    pages={paginatedPages}
                    onEdit={handleEdit}
                    onDuplicate={handleDuplicate}
                    onArchive={handleArchive}
                    onRedirect={handleRedirect}
                    selectedPages={selectedPages}
                    onSelectPage={handleSelectPage}
                    onSelectAll={handleSelectAll}
                    sortBy={filters.sort_by}
                    sortOrder={filters.sort_order}
                    onSort={handleSort}
                  />
                  {totalPages > 1 && (
                    <CustomPagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </>
              ) : (
                <SitePageTreeView pages={pages} onEdit={handleEdit} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Métricas */}
        <TabsContent value="metrics" className="space-y-6">
          <SitemapMetricsCard />
          <SitemapHistoryChart />
        </TabsContent>

        {/* Tab 3: Sincronización */}
        <TabsContent value="sync" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Sincronización Manual</CardTitle>
                  <CardDescription>
                    Sincroniza la base de datos con el sitemap.xml publicado
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => fetchMetaMutation.mutate()}
                    disabled={fetchMetaMutation.isPending}
                    variant="outline"
                  >
                    <Wand2 className={`h-4 w-4 mr-2 ${fetchMetaMutation.isPending ? 'animate-spin' : ''}`} />
                    Detectar Meta Tags
                  </Button>
                  <Button 
                    onClick={handleSync}
                    disabled={syncMutation.isPending}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
                    Sincronizar Ahora
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <p className="text-sm font-medium">¿Qué hace la sincronización?</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>Lee todas las URLs del sitemap.xml publicado</li>
                  <li>Detecta páginas nuevas y las añade automáticamente</li>
                  <li>Identifica páginas eliminadas y las marca como archivadas</li>
                  <li>Actualiza la fecha de última modificación de páginas existentes</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <SyncHistoryTable />
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <SitePageEditDialog
        page={selectedPage}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      {/* Sync Progress Modal */}
      <SyncProgressModal
        open={isSyncModalOpen}
        onOpenChange={setIsSyncModalOpen}
        isLoading={syncMutation.isPending}
        summary={syncMutation.data?.summary || null}
        error={syncMutation.error?.message || null}
      />

      {/* Redirect Dialog */}
      <RedirectDialog
        page={redirectPage}
        isOpen={isRedirectDialogOpen}
        onClose={() => {
          setIsRedirectDialogOpen(false);
          setRedirectPage(null);
        }}
      />
    </div>
  );
};

export default AdminSitemap;
