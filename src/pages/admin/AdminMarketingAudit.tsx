import { useState } from 'react';
import { useMarketingAudit } from '@/hooks/useMarketingAudit';
import { AuditDashboard } from '@/components/admin/marketing-audit/AuditDashboard';
import { AuditCategoryTab } from '@/components/admin/marketing-audit/AuditCategoryTab';
import { AuditQuickWins } from '@/components/admin/marketing-audit/AuditQuickWins';
import { AuditRecommendations } from '@/components/admin/marketing-audit/AuditRecommendations';
import { AuditPdfExport } from '@/components/admin/marketing-audit/AuditPdfExport';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScanLine, Loader2, RotateCcw, Save } from 'lucide-react';

const AdminMarketingAudit = () => {
  const audit = useMarketingAudit();
  const [urlInput, setUrlInput] = useState('');

  const handleAudit = () => {
    if (!urlInput.trim()) return;
    audit.runAudit(urlInput.trim());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Auditoría de Marketing Digital y SEO</h1>
          <p className="text-sm text-slate-400 mt-1">Analiza cualquier sitio web y obtén una puntuación detallada</p>
        </div>
        {audit.isAnalyzed && (
          <div className="flex gap-2">
            <AuditPdfExport state={audit} />
            <Button onClick={audit.saveAudit} variant="outline" className="gap-2 border-slate-600 text-slate-300 hover:bg-slate-700">
              <Save className="h-4 w-4" />
              Guardar
            </Button>
            <Button onClick={audit.resetAudit} variant="ghost" className="gap-2 text-slate-400 hover:text-white">
              <RotateCcw className="h-4 w-4" />
              Nueva
            </Button>
          </div>
        )}
      </div>

      {/* URL Input */}
      <div className="flex gap-3">
        <Input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="https://ejemplo.com"
          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 flex-1"
          onKeyDown={(e) => e.key === 'Enter' && handleAudit()}
          disabled={audit.isLoading}
        />
        <Button
          onClick={handleAudit}
          disabled={audit.isLoading || !urlInput.trim()}
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6"
        >
          {audit.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanLine className="h-4 w-4" />}
          {audit.isLoading ? 'Analizando...' : 'Auditar'}
        </Button>
      </div>

      {/* Loading state */}
      {audit.isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
          <p className="text-lg">Analizando {urlInput}...</p>
          <p className="text-sm text-slate-500 mt-1">Scrapeando contenido y detectando elementos SEO</p>
        </div>
      )}

      {/* Results */}
      {audit.isAnalyzed && !audit.isLoading && (
        <div className="space-y-8">
          {/* Dashboard */}
          <AuditDashboard globalScore={audit.globalScore} categories={audit.categories} url={audit.url} />

          {/* Category Tabs */}
          <Tabs defaultValue={audit.categories[0]?.id} className="w-full">
            <TabsList className="w-full flex-wrap h-auto gap-1 bg-slate-800/50 p-1">
              {audit.categories.map(cat => {
                const scoreColor = cat.score >= 75 ? 'text-emerald-400' : cat.score >= 50 ? 'text-yellow-400' : 'text-red-400';
                return (
                  <TabsTrigger
                    key={cat.id}
                    value={cat.id}
                    className="text-xs data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400 gap-1"
                  >
                    {cat.name}
                    <span className={scoreColor}>{cat.score}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {audit.categories.map(cat => (
              <TabsContent key={cat.id} value={cat.id} className="mt-4">
                <AuditCategoryTab
                  category={cat}
                  onStatusChange={audit.updateItemStatus}
                  onNoteChange={audit.updateItemNote}
                />
              </TabsContent>
            ))}
          </Tabs>

          {/* Quick Wins */}
          <AuditQuickWins quickWins={audit.quickWins} />

          {/* Recommendations */}
          <AuditRecommendations recommendations={audit.recommendations} />
        </div>
      )}

      {/* Empty state */}
      {!audit.isAnalyzed && !audit.isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <ScanLine className="h-16 w-16 mb-4 text-slate-600" />
          <p className="text-lg">Introduce una URL para comenzar la auditoría</p>
          <p className="text-sm mt-1">Se analizará el HTML, meta tags, scripts de analytics, legal y más</p>
        </div>
      )}
    </div>
  );
};

export default AdminMarketingAudit;
