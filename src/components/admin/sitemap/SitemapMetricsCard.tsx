import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Globe, Calendar, HardDrive, ExternalLink, RefreshCw } from "lucide-react";
import { useSitemapMetrics } from "@/hooks/useSitemapMetrics";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export const SitemapMetricsCard = () => {
  const { data: metrics, isLoading, error, refetch } = useSitemapMetrics();
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('regenerate-sitemap');
      
      if (error) throw error;
      
      toast.success('Sitemap regenerado exitosamente');
      // Esperar 2 segundos y refrescar métricas
      setTimeout(() => {
        refetch();
      }, 2000);
    } catch (err) {
      console.error('Error regenerando sitemap:', err);
      toast.error('Error al regenerar sitemap');
    } finally {
      setIsRegenerating(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error al cargar métricas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Error desconocido'}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) return null;

  const statCards = [
    {
      title: "Total URLs",
      value: metrics.totalUrls,
      icon: FileText,
      description: "URLs en el sitemap",
      color: "text-primary"
    },
    {
      title: "Última Actualización",
      value: metrics.lastUpdated 
        ? formatDistanceToNow(new Date(metrics.lastUpdated), { 
            addSuffix: true, 
            locale: es 
          })
        : "Nunca",
      icon: Calendar,
      description: new Date(metrics.lastUpdated || '').toLocaleString('es-ES'),
      color: "text-blue-600"
    },
    {
      title: "Tamaño del Archivo",
      value: formatFileSize(metrics.fileSize),
      icon: HardDrive,
      description: `${metrics.fileSize.toLocaleString()} bytes`,
      color: "text-green-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header con botones de acción */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Métricas del Sitemap</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Estadísticas en tiempo real desde CDN
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(metrics.publicUrl, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver Sitemap
          </Button>
          <Button
            size="sm"
            onClick={handleRegenerate}
            disabled={isRegenerating}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
            Regenerar
          </Button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </div>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* URLs por idioma */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Distribución por Idioma
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Español (ES)</span>
                <span className="text-2xl font-bold">{metrics.urlsByLanguage.es}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ 
                    width: `${(metrics.urlsByLanguage.es / metrics.totalUrls) * 100}%` 
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {((metrics.urlsByLanguage.es / metrics.totalUrls) * 100).toFixed(1)}% del total
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">English (EN)</span>
                <span className="text-2xl font-bold">{metrics.urlsByLanguage.en}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500"
                  style={{ 
                    width: `${(metrics.urlsByLanguage.en / metrics.totalUrls) * 100}%` 
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {((metrics.urlsByLanguage.en / metrics.totalUrls) * 100).toFixed(1)}% del total
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Català (CA)</span>
                <span className="text-2xl font-bold">{metrics.urlsByLanguage.ca}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ 
                    width: `${(metrics.urlsByLanguage.ca / metrics.totalUrls) * 100}%` 
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {((metrics.urlsByLanguage.ca / metrics.totalUrls) * 100).toFixed(1)}% del total
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle>Información del CDN</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">URL Pública</span>
            <a 
              href={metrics.publicUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Ver en CDN
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Cache Control</span>
            <span className="text-sm font-medium">3600s (1 hora)</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">Storage Bucket</span>
            <span className="text-sm font-medium">public-files</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
