import { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  ExternalLink, 
  Copy, 
  Download, 
  Edit, 
  FileText,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  useLandingPageById, 
  useDuplicateLanding,
  useUpdateLandingPage 
} from '@/hooks/useLandingPages';
import { LandingStatusBadge } from '@/components/admin/landings/LandingStatusBadge';
import { LandingCategoryBadge } from '@/components/admin/landings/LandingCategoryBadge';
import { LandingFormDialog } from '@/components/admin/landings/LandingFormDialog';
import { LandingHealthCheck } from '@/components/admin/landings/LandingHealthCheck';
import { LandingQuickActions } from '@/components/admin/landings/LandingQuickActions';
import { LandingVersionHistory } from '@/components/admin/landings/LandingVersionHistory';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const LandingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const healthCheckRef = useRef<{ runCheck: () => void }>(null);
  
  const { data: landing, isLoading } = useLandingPageById(id!);
  const duplicateMutation = useDuplicateLanding();
  const updateMutation = useUpdateLandingPage();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado al portapapeles`);
  };

  const handleDownloadQR = () => {
    if (!landing?.qr_code) return;
    
    const link = document.createElement('a');
    link.href = landing.qr_code;
    link.download = `qr-${landing.slug}.png`;
    link.click();
    toast.success('QR code descargado');
  };

  const handleDuplicate = async () => {
    if (!landing) return;
    
    try {
      const duplicated = await duplicateMutation.mutateAsync(landing);
      toast.success('Landing duplicada');
      navigate(`/admin/landings/${duplicated.id}`);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!landing) return;
    
    try {
      await updateMutation.mutateAsync({
        id: landing.id,
        updates: { status: newStatus },
        skipVersion: true, // Skip versioning for simple status changes
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleRestoreVersion = async (snapshot: any) => {
    if (!landing) return;
    
    try {
      // Restaurar desde snapshot sin crear nueva versión
      const { id, created_at, updated_at, version, health_score, ...restoreData } = snapshot;
      await updateMutation.mutateAsync({
        id: landing.id,
        updates: restoreData,
        skipVersion: false, // Crear versión al restaurar
      });
      toast.success('Versión restaurada correctamente');
    } catch (error) {
      toast.error('Error al restaurar versión');
    }
  };

  const handleOpenLanding = () => {
    if (landing?.url) {
      window.open(landing.url, '_blank');
    } else {
      toast.error('No hay URL configurada');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Cargando landing...</p>
      </div>
    );
  }

  if (!landing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">Landing no encontrada</p>
        <Button asChild variant="outline">
          <Link to="/admin/landings">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Landings
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin/landings">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{landing.title}</h1>
              <div className="flex items-center gap-2 mt-2">
                <LandingCategoryBadge category={landing.category || 'Other'} />
                <LandingStatusBadge status={landing.status || 'draft'} />
                <Badge variant="secondary">v{landing.version || 1}</Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button variant="outline" onClick={handleDuplicate}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicar
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleOpenLanding}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Abrir Landing
                </DropdownMenuItem>
                {landing.qr_code && (
                  <DropdownMenuItem onClick={handleDownloadQR}>
                    <Download className="h-4 w-4 mr-2" />
                    Descargar QR
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* URLs Card */}
            <Card>
              <CardHeader>
                <CardTitle>Enlaces</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {landing.url && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">URL Principal</label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(landing.url!, 'URL')}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copiar
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                      <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <a
                        href={landing.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline truncate"
                      >
                        {landing.url}
                      </a>
                    </div>
                  </div>
                )}

                {landing.utm_url && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">URL con UTM</label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(landing.utm_url!, 'URL con UTM')}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copiar
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                      <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <code className="text-xs text-muted-foreground truncate">
                        {landing.utm_url}
                      </code>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* QR Code Card */}
            {landing.qr_code && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Código QR</CardTitle>
                    <Button variant="outline" size="sm" onClick={handleDownloadQR}>
                      <Download className="h-4 w-4 mr-1" />
                      Descargar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-4">
                    <img
                      src={landing.qr_code}
                      alt="QR Code"
                      className="w-64 h-64 border rounded-lg"
                    />
                    <p className="text-xs text-center text-muted-foreground">
                      QR generado para: {landing.utm_url || landing.url}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes Card */}
            {landing.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notas Internas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {landing.notes}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Campaigns Card */}
            {landing.ads_campaigns && (
              <Card>
                <CardHeader>
                  <CardTitle>Campañas de Ads</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {landing.ads_campaigns}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <LandingQuickActions
              landing={landing}
              onStatusChange={handleStatusChange}
              onDuplicate={handleDuplicate}
              onRunHealthCheck={() => healthCheckRef.current?.runCheck()}
              onViewVersions={() => setVersionHistoryOpen(true)}
            />

            {/* Health Check */}
            <LandingHealthCheck landing={landing} />

            {/* Metadata Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Slug</label>
                  <p className="text-sm mt-1">{landing.slug}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Versión</label>
                  <p className="text-sm mt-1">v{landing.version || 1}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Creado</label>
                  <p className="text-sm mt-1">
                    {landing.created_at
                      ? new Date(landing.created_at).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })
                      : '—'}
                  </p>
                </div>
                <Separator />
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Actualizado</label>
                  <p className="text-sm mt-1">
                    {landing.updated_at
                      ? new Date(landing.updated_at).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })
                      : '—'}
                  </p>
                </div>
                <Separator />
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Visitas</label>
                  <p className="text-sm mt-1">{landing.view_count?.toLocaleString() || 0}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Conversiones</label>
                  <p className="text-sm mt-1">{landing.conversion_count?.toLocaleString() || 0}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Edit Dialog */}
        <LandingFormDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          landing={landing}
        />

        {/* Version History Modal */}
        <LandingVersionHistory
          landingId={landing.id}
          open={versionHistoryOpen}
          onOpenChange={setVersionHistoryOpen}
          onRestore={handleRestoreVersion}
        />
      </div>
  );
};

export default LandingDetailPage;
