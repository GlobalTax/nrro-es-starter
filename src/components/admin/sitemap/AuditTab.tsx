import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, ExternalLink, Eye, Trash2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAuditPage, usePageAudits, useAuditStats, useDeleteAudit, type PageAudit } from "@/hooks/usePageAudit";
import { AuditScoreCard } from "./AuditScoreCard";
import { PageAuditModal } from "./PageAuditModal";
import { cn } from "@/lib/utils";

export function AuditTab() {
  const [urlToAudit, setUrlToAudit] = useState("");
  const [selectedAudit, setSelectedAudit] = useState<PageAudit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate: auditPage, isPending: isAuditing } = useAuditPage();
  const { data: audits = [], isLoading: isLoadingAudits } = usePageAudits(50);
  const { data: stats } = useAuditStats();
  const { mutate: deleteAudit } = useDeleteAudit();

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
        <CardContent>
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
    </div>
  );
}
