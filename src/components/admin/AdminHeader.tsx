import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Bell, BellOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUnreadContactLeads } from '@/hooks/useUnreadContactLeads';
import { useBrowserNotifications } from '@/hooks/useBrowserNotifications';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast as sonnerToast } from 'sonner';

export const AdminHeader = () => {
  const { adminUser, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const unreadLeads = useUnreadContactLeads();
  const { 
    isEnabled, 
    isSupported, 
    permission, 
    toggleNotifications 
  } = useBrowserNotifications();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully',
      });
      navigate('/admin/login');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign out',
        variant: 'destructive',
      });
    }
  };

  return (
    <header className="bg-slate-50/80 backdrop-blur-sm border-b border-slate-200/60 px-6 py-3 sticky top-0 z-10">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            onClick={() => navigate('/admin/contact-leads')}
          >
            <Bell className="h-4 w-4" />
            {unreadLeads > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[9px] font-medium text-white">
                {unreadLeads > 9 ? '9+' : unreadLeads}
              </span>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center">
                  <User className="h-3.5 w-3.5 text-slate-600" />
                </div>
                <span className="text-sm font-medium">{adminUser?.full_name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium text-slate-900">{adminUser?.full_name}</p>
                  <p className="text-xs text-slate-500">{adminUser?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    {isEnabled ? (
                      <Bell className="h-4 w-4 text-slate-500" />
                    ) : (
                      <BellOff className="h-4 w-4 text-slate-400" />
                    )}
                    <Label htmlFor="browser-notifications" className="cursor-pointer text-sm">
                      Notificaciones Push
                    </Label>
                  </div>
                  <Switch
                    id="browser-notifications"
                    checked={isEnabled}
                    onCheckedChange={async () => {
                      const result = await toggleNotifications();
                      if (result) {
                        sonnerToast.success('Notificaciones activadas', {
                          description: 'Recibirás alertas incluso con el panel cerrado',
                        });
                      } else if (permission === 'denied') {
                        sonnerToast.error('Permisos denegados', {
                          description: 'Habilita las notificaciones en la configuración del navegador',
                        });
                      }
                    }}
                    disabled={!isSupported}
                  />
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="text-slate-600 focus:text-slate-900"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};