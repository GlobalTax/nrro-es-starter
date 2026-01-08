import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink, Calendar, RefreshCw, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AuditScoresGrid } from "./AuditScoreCard";
import { AuditIssuesList } from "./AuditIssuesList";
import { AuditQuickActions } from "./AuditQuickActions";
import type { PageAudit } from "@/hooks/usePageAudit";

interface PageAuditModalProps {
  audit: PageAudit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReaudit?: () => void;
  isReauditing?: boolean;
}

export function PageAuditModal({ 
  audit, 
  open, 
  onOpenChange,
  onReaudit,
  isReauditing = false
}: PageAuditModalProps) {
  if (!audit) return null;

  const rawData = audit.raw_data as Record<string, unknown> || {};
  const seoData = rawData.seoData as Record<string, unknown> || {};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            Auditoría SEO
          </DialogTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <a 
              href={audit.page_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary flex items-center gap-1 truncate max-w-md"
            >
              {audit.page_url}
              <ExternalLink className="h-3 w-3 flex-shrink-0" />
            </a>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(audit.audit_date), "d MMM yyyy, HH:mm", { locale: es })}
            </span>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          {/* Main content - 2/3 width */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="summary">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="summary">Resumen</TabsTrigger>
                <TabsTrigger value="issues">
                  Problemas
                  {audit.issues.length > 0 && (
                    <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">
                      {audit.issues.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="recommendations">Mejoras</TabsTrigger>
                <TabsTrigger value="data">Datos</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[45vh] mt-4 pr-4">
                <TabsContent value="summary" className="space-y-6 mt-0">
                  {/* Scores Grid */}
                  <AuditScoresGrid
                    seoScore={audit.seo_score}
                    contentScore={audit.content_score}
                    structureScore={audit.structure_score}
                    overallScore={audit.overall_score}
                    size="lg"
                  />

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                      <p className="text-2xl font-bold">{audit.issues.filter(i => i.severity === 'error').length}</p>
                      <p className="text-xs text-muted-foreground">Errores</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                      <p className="text-2xl font-bold">{audit.issues.filter(i => i.severity === 'warning').length}</p>
                      <p className="text-xs text-muted-foreground">Avisos</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                      <p className="text-2xl font-bold">{audit.recommendations.filter(r => r.priority === 'high').length}</p>
                      <p className="text-xs text-muted-foreground">Prioridad Alta</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                      <p className="text-2xl font-bold">{audit.recommendations.length}</p>
                      <p className="text-xs text-muted-foreground">Mejoras</p>
                    </div>
                  </div>

                  {/* SEO Data Summary */}
                  {Object.keys(seoData).length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Datos SEO detectados</h4>
                      <div className="grid gap-2 text-sm">
                        {seoData.title && (
                          <div className="p-2 rounded bg-muted/50">
                            <span className="text-muted-foreground">Title:</span>{" "}
                            <span className="font-medium">{String(seoData.title)}</span>
                            <span className="text-xs text-muted-foreground ml-1">
                              ({String(seoData.title).length} chars)
                            </span>
                          </div>
                        )}
                        {seoData.metaDescription && (
                          <div className="p-2 rounded bg-muted/50">
                            <span className="text-muted-foreground">Meta Description:</span>{" "}
                            <span className="font-medium">{String(seoData.metaDescription).substring(0, 100)}...</span>
                            <span className="text-xs text-muted-foreground ml-1">
                              ({String(seoData.metaDescription).length} chars)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="issues" className="mt-0">
                  <AuditIssuesList issues={audit.issues} recommendations={[]} />
                </TabsContent>

                <TabsContent value="recommendations" className="mt-0">
                  <AuditIssuesList issues={[]} recommendations={audit.recommendations} />
                </TabsContent>

                <TabsContent value="data" className="mt-0">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Datos SEO extraídos</h4>
                      <pre className="p-3 rounded-lg bg-muted/50 text-xs overflow-auto max-h-40">
                        {JSON.stringify(seoData, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Metadatos de la página</h4>
                      <pre className="p-3 rounded-lg bg-muted/50 text-xs overflow-auto max-h-40">
                        {JSON.stringify(rawData.metadata || {}, null, 2)}
                      </pre>
                    </div>
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>

          {/* Quick Actions sidebar - 1/3 width */}
          <div className="lg:col-span-1">
            <AuditQuickActions
              pageUrl={audit.page_url}
              issues={audit.issues}
              recommendations={audit.recommendations}
              seoData={seoData}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          {onReaudit && (
            <Button 
              variant="outline" 
              onClick={onReaudit}
              disabled={isReauditing}
            >
              {isReauditing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Volver a auditar
            </Button>
          )}
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
