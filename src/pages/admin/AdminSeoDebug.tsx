import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Search, RefreshCw, Globe, CheckCircle, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import { siteRoutes } from '@/data/siteRoutes';

const healthColors: Record<string, string> = {
  green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const healthIcons: Record<string, typeof CheckCircle> = {
  green: CheckCircle,
  yellow: AlertTriangle,
  red: XCircle,
};

export default function AdminSeoDebug() {
  const { requireAdmin } = useAdminAuth();
  const queryClient = useQueryClient();
  const [inspectPath, setInspectPath] = useState('');
  const [inspectResult, setInspectResult] = useState<any>(null);

  try { requireAdmin(); } catch { return <p className="p-8 text-destructive">Admin access required</p>; }

  // Fetch cached data
  const { data: cachedRoutes, isLoading: loadingCache } = useQuery({
    queryKey: ['prerender-cache'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prerender_cache')
        .select('*')
        .order('path');
      if (error) throw error;
      return data as any[];
    },
  });

  // Inspect single page
  const inspectMutation = useMutation({
    mutationFn: async (path: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const funcUrl = `https://zntotcpagkunvkwpubqu.supabase.co/functions/v1/prerender?path=${encodeURIComponent(path)}&refresh=true`;
      const response = await fetch(funcUrl, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpudG90Y3BhZ2t1bnZrd3B1YnF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5Mjc5MDUsImV4cCI6MjA2ODUwMzkwNX0.YaVxgYF91UyCkSc8nqsVSACP2Xs4r5--sE8EtLnzMCI',
        },
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Scan failed');
      }
      return response.json();
    },
    onSuccess: (data) => {
      setInspectResult(data);
      queryClient.invalidateQueries({ queryKey: ['prerender-cache'] });
      toast.success('Página escaneada');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // Bulk scan
  const bulkMutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const funcUrl = `https://zntotcpagkunvkwpubqu.supabase.co/functions/v1/prerender?bulk=true`;
      const response = await fetch(funcUrl, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpudG90Y3BhZ2t1bnZrd3B1YnF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5Mjc5MDUsImV4cCI6MjA2ODUwMzkwNX0.YaVxgYF91UyCkSc8nqsVSACP2Xs4r5--sE8EtLnzMCI',
        },
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Bulk scan failed');
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['prerender-cache'] });
      toast.success(`Escaneo masivo completado: ${data.scanned} rutas`);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // Regenerate sitemap
  const sitemapMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('https://zntotcpagkunvkwpubqu.supabase.co/functions/v1/regenerate-sitemap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Sitemap regeneration failed');
      return response.text();
    },
    onSuccess: () => toast.success('Sitemap regenerado correctamente'),
    onError: (err: Error) => toast.error(err.message),
  });

  const handleInspect = () => {
    const path = inspectPath.startsWith('/') ? inspectPath : `/${inspectPath}`;
    inspectMutation.mutate(path);
  };

  // Merge registry routes with cache data
  const mergedRoutes = siteRoutes.map(route => {
    const cached = cachedRoutes?.find(c => c.path === route.path);
    return {
      ...route,
      cached,
      health: cached?.health || 'pending',
      lastScan: cached?.rendered_at,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SEO Debug</h1>
          <p className="text-sm text-muted-foreground">
            {siteRoutes.length} rutas registradas · {cachedRoutes?.length || 0} escaneadas
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => sitemapMutation.mutate()}
            disabled={sitemapMutation.isPending}
          >
            {sitemapMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Globe className="h-4 w-4 mr-1" />}
            Regenerar Sitemap
          </Button>
          <Button
            onClick={() => bulkMutation.mutate()}
            disabled={bulkMutation.isPending}
          >
            {bulkMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <RefreshCw className="h-4 w-4 mr-1" />}
            Escaneo masivo
          </Button>
        </div>
      </div>

      {/* Single Page Inspector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Inspector de Página</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="/ruta-a-inspeccionar"
              value={inspectPath}
              onChange={(e) => setInspectPath(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleInspect()}
            />
            <Button onClick={handleInspect} disabled={inspectMutation.isPending || !inspectPath}>
              {inspectMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>

          {inspectResult && (
            <div className="space-y-3 border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Badge className={healthColors[inspectResult.health] || 'bg-muted'}>
                  {inspectResult.health?.toUpperCase()}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Fuente: {inspectResult.source}
                </span>
              </div>
              <div className="grid gap-2 text-sm">
                <div>
                  <span className="font-medium">Title:</span>{' '}
                  <span className={inspectResult.title ? '' : 'text-destructive'}>
                    {inspectResult.title || '⚠️ No encontrado'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Description:</span>{' '}
                  <span className={inspectResult.meta_description ? '' : 'text-destructive'}>
                    {inspectResult.meta_description || '⚠️ No encontrado'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">H1:</span>{' '}
                  <span className={inspectResult.h1 ? '' : 'text-destructive'}>
                    {inspectResult.h1 || '⚠️ No encontrado'}
                  </span>
                </div>
                {inspectResult.h2s?.length > 0 && (
                  <div>
                    <span className="font-medium">H2s:</span>{' '}
                    <span>{inspectResult.h2s.join(', ')}</span>
                  </div>
                )}
                <div>
                  <span className="font-medium">Enlaces internos:</span>{' '}
                  {inspectResult.internal_link_count || 0}
                </div>
              </div>
              {inspectResult.extraction_notes?.length > 0 && (
                <div className="mt-2 p-2 bg-muted rounded text-xs space-y-1">
                  <p className="font-medium">Notas de extracción:</p>
                  {inspectResult.extraction_notes.map((note: string, i: number) => (
                    <p key={i}>• {note}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Crawl Coverage Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cobertura de Rastreo</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingCache ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">Ruta</th>
                    <th className="text-left py-2 px-2">Lang</th>
                    <th className="text-center py-2 px-2">Salud</th>
                    <th className="text-center py-2 px-2">Title</th>
                    <th className="text-center py-2 px-2">Desc</th>
                    <th className="text-center py-2 px-2">H1</th>
                    <th className="text-center py-2 px-2">Links</th>
                    <th className="text-left py-2 px-2">Último escaneo</th>
                    <th className="text-right py-2 px-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {mergedRoutes.map((route) => {
                    const HealthIcon = healthIcons[route.health] || XCircle;
                    return (
                      <tr key={route.path} className="border-b hover:bg-muted/50">
                        <td className="py-1.5 px-2 font-mono text-xs max-w-[300px] truncate" title={route.path}>
                          {route.path}
                        </td>
                        <td className="py-1.5 px-2">
                          <Badge variant="outline" className="text-xs">{route.lang}</Badge>
                        </td>
                        <td className="py-1.5 px-2 text-center">
                          {route.health === 'pending' ? (
                            <span className="text-xs text-muted-foreground">—</span>
                          ) : (
                            <HealthIcon className={`h-4 w-4 mx-auto ${route.health === 'green' ? 'text-green-600' : route.health === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`} />
                          )}
                        </td>
                        <td className="py-1.5 px-2 text-center">{route.cached?.title ? '✓' : '—'}</td>
                        <td className="py-1.5 px-2 text-center">{route.cached?.meta_description ? '✓' : '—'}</td>
                        <td className="py-1.5 px-2 text-center">{route.cached?.h1 ? '✓' : '—'}</td>
                        <td className="py-1.5 px-2 text-center">{route.cached?.internal_link_count || '—'}</td>
                        <td className="py-1.5 px-2 text-xs text-muted-foreground">
                          {route.lastScan ? new Date(route.lastScan).toLocaleDateString('es-ES') : '—'}
                        </td>
                        <td className="py-1.5 px-2 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => {
                              setInspectPath(route.path);
                              inspectMutation.mutate(route.path);
                            }}
                            disabled={inspectMutation.isPending}
                          >
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
