import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { useContactLeadsRealtime } from '@/hooks/useContactLeadsRealtime';
import { useBlogDraftsRealtime } from '@/hooks/useBlogDraftsRealtime';
import { useBrowserNotifications } from '@/hooks/useBrowserNotifications';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Bell, X } from 'lucide-react';

export const AdminLayout = () => {
  // Activar suscripción a notificaciones en tiempo real
  useContactLeadsRealtime();
  useBlogDraftsRealtime();
  
  const { permission, isSupported, requestPermission } = useBrowserNotifications();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Mostrar banner solo si:
    // - Las notificaciones son soportadas
    // - No se han solicitado permisos aún (default)
    // - No se ha cerrado el banner anteriormente
    const bannerDismissed = localStorage.getItem('notification-banner-dismissed');
    
    if (isSupported && permission === 'default' && !bannerDismissed) {
      setShowBanner(true);
    }
  }, [isSupported, permission]);

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('notification-banner-dismissed', 'true');
  };

  const handleEnable = async () => {
    const granted = await requestPermission();
    if (granted) {
      setShowBanner(false);
    }
  };
  
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 bg-neutral-50 p-6">
          {showBanner && (
            <Alert className="mb-4">
              <Bell className="h-4 w-4" />
              <AlertTitle className="flex items-center justify-between">
                <span>Activa las notificaciones push</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </AlertTitle>
              <AlertDescription className="flex items-center justify-between">
                <span>
                  Recibe alertas de nuevos contactos incluso cuando el panel esté cerrado
                </span>
                <Button onClick={handleEnable} size="sm" className="ml-4">
                  Activar
                </Button>
              </AlertDescription>
            </Alert>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};
