import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Megaphone, 
  Archive, 
  Copy, 
  QrCode, 
  Link, 
  Stethoscope,
  History,
  CheckCircle,
  ArchiveX
} from 'lucide-react';
import { LandingPage } from '@/hooks/useLandingPages';
import { toast } from 'sonner';

interface LandingQuickActionsProps {
  landing: LandingPage;
  onStatusChange: (status: string) => void;
  onDuplicate: () => void;
  onRunHealthCheck: () => void;
  onViewVersions: () => void;
}

export const LandingQuickActions = ({ 
  landing, 
  onStatusChange, 
  onDuplicate,
  onRunHealthCheck,
  onViewVersions
}: LandingQuickActionsProps) => {
  
  const handleCopyQR = () => {
    if (landing.qr_code) {
      navigator.clipboard.writeText(landing.qr_code);
      toast.success('Código QR copiado al portapapeles');
    } else {
      toast.error('No hay código QR generado');
    }
  };

  const handleCopyUTM = () => {
    if (landing.utm_url) {
      navigator.clipboard.writeText(landing.utm_url);
      toast.success('URL UTM copiada al portapapeles');
    } else {
      toast.error('No hay URL UTM generada');
    }
  };

  const handleMarkReadyForAds = () => {
    if (landing.status !== 'published') {
      onStatusChange('published');
      toast.success('Landing marcada como lista para anuncios');
    } else {
      toast.info('La landing ya está publicada');
    }
  };

  const handleArchive = () => {
    if (landing.status !== 'archived') {
      onStatusChange('archived');
      toast.success('Landing archivada');
    } else {
      toast.info('La landing ya está archivada');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
        <CardDescription>
          Operaciones comunes para esta landing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Status Actions */}
        {landing.status !== 'published' && (
          <Button
            onClick={handleMarkReadyForAds}
            variant="default"
            className="w-full justify-start"
          >
            <Megaphone className="mr-2 h-4 w-4" />
            Marcar Lista para Ads
          </Button>
        )}

        {landing.status !== 'archived' ? (
          <Button
            onClick={handleArchive}
            variant="outline"
            className="w-full justify-start"
          >
            <Archive className="mr-2 h-4 w-4" />
            Archivar Landing
          </Button>
        ) : (
          <Button
            onClick={() => onStatusChange('draft')}
            variant="outline"
            className="w-full justify-start"
          >
            <ArchiveX className="mr-2 h-4 w-4" />
            Desarchivar Landing
          </Button>
        )}

        {/* Divider */}
        <div className="border-t my-2" />

        {/* Copy Actions */}
        <Button
          onClick={onDuplicate}
          variant="outline"
          className="w-full justify-start"
        >
          <Copy className="mr-2 h-4 w-4" />
          Duplicar Landing
        </Button>

        <Button
          onClick={handleCopyQR}
          variant="outline"
          className="w-full justify-start"
          disabled={!landing.qr_code}
        >
          <QrCode className="mr-2 h-4 w-4" />
          Copiar Código QR
        </Button>

        <Button
          onClick={handleCopyUTM}
          variant="outline"
          className="w-full justify-start"
          disabled={!landing.utm_url}
        >
          <Link className="mr-2 h-4 w-4" />
          Copiar URL UTM
        </Button>

        {/* Divider */}
        <div className="border-t my-2" />

        {/* Analysis Actions */}
        <Button
          onClick={onRunHealthCheck}
          variant="outline"
          className="w-full justify-start"
        >
          <Stethoscope className="mr-2 h-4 w-4" />
          Ejecutar Health Check
        </Button>

        <Button
          onClick={onViewVersions}
          variant="outline"
          className="w-full justify-start"
        >
          <History className="mr-2 h-4 w-4" />
          Ver Historial de Versiones
        </Button>
      </CardContent>
    </Card>
  );
};
