import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, ExternalLink, Eye, Trash2, TrendingUp, TrendingDown, Minus, PlayCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAuditPage, usePageAudits, useAuditStats, useDeleteAudit, type PageAudit } from "@/hooks/usePageAudit";
import { useSitePages } from "@/hooks/useSitePages";
import { useBatchAudit } from "@/hooks/useBatchAudit";
import { AuditScoreCard } from "./AuditScoreCard";
import { PageAuditModal } from "./PageAuditModal";
import { BatchAuditModal } from "./BatchAuditModal";
import { cn } from "@/lib/utils";

export function AuditTab() {
  const [urlToAudit, setUrlToAudit] = useState("");
  const [selectedAudit, setSelectedAudit] = useState<PageAudit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchFilter, setBatchFilter] = useState<string>("all");

  const { mutate: auditPage, isPending: isAuditing } = useAuditPage();
  const { data: audits = [], isLoading: isLoadingAudits } = usePageAudits(50);
  const { data: stats } = useAuditStats();
  const { mutate: deleteAudit } = useDeleteAudit();
  
  // Get published site pages for batch audit
  const { data: sitePages = [] } = useSitePages({ status: 'published' });
  
  // Batch audit hook
  const batchAudit = useBatchAudit({
    onComplete: () => {
      // Refresh audits after batch completes
    },
  });
  
  // Get pages that haven't been audited (no matching audit in last 7 days)
  const auditedUrls = new Set(audits.map(a => {
    try {
      return new URL(a.page_url).pathname;
    } catch {
      return a.page_url;
    }
  }));
  
  const pagesWithoutAudit = sitePages.filter(page => !auditedUrls.has(page.url));
  
  // Filter pages based on selection
  const getFilteredPages = () => {
    switch (batchFilter) {
      case "unaudited":
        return pagesWithoutAudit;
      case "services":
        return sitePages.filter(p => p.page_type === 'service');
      case "blog":
        return sitePages.filter(p => p.page_type === 'blog');
      case "landing":
        return sitePages.filter(p => p.is_landing);
      default:
        return sitePages;
    }
  };
  
  const filteredPages = getFilteredPages();
  
  const handleStartBatchAudit = () => {
    setIsBatchModalOpen(true);
    batchAudit.auditPages(filteredPages.map(p => ({ 
      id: p.id, 
      url: p.url, 
      title: p.title 
    })));
  };

  const handleAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlToAudit.trim()) return;
    
    auditPage({ url: urlToAudit });
    setUrlToAudit("");
  };

  const handleViewAudit = (audit: PageAudit) => {
    setSelectedAudit(audit);
    setIsModalOpen(true);
  };

  const handleReaudit = () => {
    if (selectedAudit) {
      auditPage({ url: selectedAudit.page_url });
    }
  };

  const getScoreBadge = (score: number | null) => {
    if (score === null) return null;
    
    let variant: "default" | "secondary" | "destructive" | "outline" = "default";
    let className = "";
    
    if (score >= 80) {
      className = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    } else if (score >= 60) {
      className = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    } else if (score >= 40) {
      className = "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
    } else {
      className = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    }
    
    return (
      <Badge variant="outline" className={cn("font-bold", className)}>
        {score}
      </Badge>
    );
  };

  const getTrendIcon = () => {
    if (!stats) return null;
    switch (stats.recentTrend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Auditorías</CardDescription>
            <CardTitle className="text-2xl">{stats?.totalAudits || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              Promedio Global {getTrendIcon()}
            </CardDescription>
            <CardTitle className="text-2xl">{stats?.avgOverallScore || 0}/100</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>SEO Promedio</CardDescription>
            <CardTitle className="text-2xl">{stats?.avgSeoScore || 0}/100</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Contenido Promedio</CardDescription>
            <CardTitle className="text-2xl">{stats?.avgContentScore || 0}/100</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Estructura Promedio</CardDescription>
            <CardTitle className="text-2xl">{stats?.avgStructureScore || 0}/100</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Audit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Auditar página</CardTitle>
          <CardDescription>
            Introduce una URL para analizar su SEO, contenido y estructura
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAudit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="url"
                placeholder="https://ejemplo.com/pagina"
                value={urlToAudit}
                onChange={(e) => setUrlToAudit(e.target.value)}
                className="pl-9"
                disabled={isAuditing}
              />
            </div>
            <Button type="submit" disabled={isAuditing || !urlToAudit.trim()}>
              {isAuditing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Auditando...
                </>
              ) : (
                "Auditar"
              )}
            </Button>
          </form>
          
          {/* Batch Audit Section */}
          <div className="border-t pt-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex-1">
                <h4 className="font-medium text-sm">Auditoría masiva</h4>
                <p className="text-xs text-muted-foreground">
                  Audita múltiples páginas del sitemap automáticamente
                </p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Select value={batchFilter} onValueChange={setBatchFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar páginas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas ({sitePages.length})</SelectItem>
                    <SelectItem value="unaudited">Sin auditar ({pagesWithoutAudit.length})</SelectItem>
                    <SelectItem value="services">Servicios</SelectItem>
                    <SelectItem value="blog">Blog</SelectItem>
                    <SelectItem value="landing">Landings</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleStartBatchAudit}
                  disabled={filteredPages.length === 0 || batchAudit.isRunning}
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Auditar {filteredPages.length} páginas
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audits History */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de auditorías</CardTitle>
          <CardDescription>
            Últimas auditorías realizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingAudits ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : audits.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay auditorías todavía. Introduce una URL para empezar.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URL</TableHead>
                  <TableHead className="text-center w-20">SEO</TableHead>
                  <TableHead className="text-center w-20">Contenido</TableHead>
                  <TableHead className="text-center w-20">Estructura</TableHead>
                  <TableHead className="text-center w-20">Global</TableHead>
                  <TableHead className="text-center w-24">Issues</TableHead>
                  <TableHead className="w-32">Fecha</TableHead>
                  <TableHead className="w-24">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {audits.map((audit) => (
                  <TableRow key={audit.id}>
                    <TableCell>
                      <a
                        href={audit.page_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-primary truncate max-w-xs"
                      >
                        {new URL(audit.page_url).pathname || '/'}
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      </a>
                    </TableCell>
                    <TableCell className="text-center">
                      {getScoreBadge(audit.seo_score)}
                    </TableCell>
                    <TableCell className="text-center">
                      {getScoreBadge(audit.content_score)}
                    </TableCell>
                    <TableCell className="text-center">
                      {getScoreBadge(audit.structure_score)}
                    </TableCell>
                    <TableCell className="text-center">
                      {getScoreBadge(audit.overall_score)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {audit.issues.filter(i => i.severity === 'error').length > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {audit.issues.filter(i => i.severity === 'error').length}
                          </Badge>
                        )}
                        {audit.issues.filter(i => i.severity === 'warning').length > 0 && (
                          <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                            {audit.issues.filter(i => i.severity === 'warning').length}
                          </Badge>
                        )}
                        {audit.issues.length === 0 && (
                          <Badge variant="outline" className="text-xs text-green-600">✓</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(audit.audit_date), "d MMM, HH:mm", { locale: es })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewAudit(audit)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteAudit(audit.id)}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Audit Detail Modal */}
      <PageAuditModal
        audit={selectedAudit}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onReaudit={handleReaudit}
        isReauditing={isAuditing}
      />
      
      {/* Batch Audit Modal */}
      <BatchAuditModal
        open={isBatchModalOpen}
        onOpenChange={setIsBatchModalOpen}
        isRunning={batchAudit.isRunning}
        progress={batchAudit.progress}
        total={batchAudit.total}
        results={batchAudit.results}
        onCancel={batchAudit.cancel}
        onComplete={batchAudit.reset}
      />
    </div>
  );
}
