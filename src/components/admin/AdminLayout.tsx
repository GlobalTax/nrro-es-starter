import { useEffect, useState, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { useContactLeadsRealtime } from '@/hooks/useContactLeadsRealtime';
import { useBlogDraftsRealtime } from '@/hooks/useBlogDraftsRealtime';
import { useBrowserNotifications } from '@/hooks/useBrowserNotifications';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Bell, X } from 'lucide-react';

// Fallback skeleton for sidebar - Apollo style
const SidebarFallback = () => (
  <aside className="w-[232px] bg-[#1B1F3B] text-white min-h-screen flex flex-col animate-pulse">
    <div className="p-4">
      <div className="h-7 w-7 bg-white/10 rounded-lg" />
    </div>
  </aside>
);

export const AdminLayout = () => {
  useContactLeadsRealtime();
  useBlogDraftsRealtime();
  
  const { permission, isSupported, requestPermission } = useBrowserNotifications();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
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
    <div className="admin-layout flex min-h-screen w-full overflow-x-hidden">
      <Suspense fallback={<SidebarFallback />}>
        <AdminSidebar />
      </Suspense>
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50/50">
        <AdminHeader />
        <main className="flex-1 p-5">
          {showBanner && (
            <Alert className="mb-4 border-gray-200/60 bg-white shadow-none">
              <Bell className="h-4 w-4 text-gray-400" />
              <AlertTitle className="flex items-center justify-between text-gray-900">
                <span>Activa las notificaciones push</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </AlertTitle>
              <AlertDescription className="flex items-center justify-between text-gray-500">
                <span>
                  Recibe alertas de nuevos contactos incluso cuando el panel esté cerrado
                </span>
                <Button 
                  onClick={handleEnable} 
                  size="sm" 
                  className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
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
