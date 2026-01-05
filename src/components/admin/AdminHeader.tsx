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
    <header className="bg-white border-b border-teal-100 px-6 py-4">
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative"
            onClick={() => navigate('/admin/contact-leads')}
          >
            <Bell className="h-5 w-5" />
            {unreadLeads > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                {unreadLeads > 9 ? '9+' : unreadLeads}
              </span>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span>{adminUser?.full_name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{adminUser?.full_name}</p>
                  <p className="text-xs text-muted-foreground">{adminUser?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    {isEnabled ? (
                      <Bell className="h-4 w-4" />
                    ) : (
                      <BellOff className="h-4 w-4" />
                    )}
                    <Label htmlFor="browser-notifications" className="cursor-pointer">
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
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
