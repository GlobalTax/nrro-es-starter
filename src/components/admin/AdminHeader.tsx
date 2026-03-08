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
import { LogOut, Bell, BellOff, Search, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUnreadContactLeads } from '@/hooks/useUnreadContactLeads';
import { useBrowserNotifications } from '@/hooks/useBrowserNotifications';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast as sonnerToast } from 'sonner';
import { useEffect, useState } from 'react';

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="text-[12px] text-gray-400 tabular-nums flex items-center gap-1">
      <Clock className="h-3 w-3" />
      {time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
    </span>
  );
}

export const AdminHeader = () => {
  const { adminUser, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const unreadLeads = useUnreadContactLeads();
  const { isEnabled, isSupported, permission, toggleNotifications } = useBrowserNotifications();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({ title: 'Signed out', description: 'You have been signed out successfully' });
      navigate('/admin/login');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to sign out', variant: 'destructive' });
    }
  };

  return (
    <header className="bg-white border-b border-gray-100 px-5 h-11 flex items-center sticky top-0 z-10">
      {/* Search */}
      <button
        className="flex items-center gap-2 h-7 px-3 rounded-md bg-gray-50 border border-gray-200/60 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors text-[12px] w-56"
        onClick={() => {}}
      >
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1 text-left">Buscar...</span>
        <kbd className="hidden sm:inline-flex h-4 items-center rounded border border-gray-200 bg-white px-1 font-mono text-[9px] text-gray-400">
          ⌘K
        </kbd>
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        <LiveClock />

        <div className="h-4 w-px bg-gray-200" />

        <Button
          variant="ghost"
          size="sm"
          className="relative h-7 w-7 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md"
          onClick={() => navigate('/admin/contact-leads')}
        >
          <Bell className="h-3.5 w-3.5" />
          {unreadLeads > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-indigo-500 text-[8px] font-medium text-white">
              {unreadLeads > 9 ? '9+' : unreadLeads}
            </span>
          )}
        </Button>

        <div className="h-4 w-px bg-gray-200" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 h-7 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md px-1.5"
            >
              <div className="h-6 w-6 rounded-full bg-indigo-50 flex items-center justify-center">
                <span className="text-[10px] font-medium text-indigo-600">
                  {adminUser?.full_name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <span className="text-[12px] font-medium hidden sm:inline">{adminUser?.full_name}</span>
              <span className="text-[9px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-full font-medium hidden sm:inline">
                partner
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="font-medium text-gray-900">{adminUser?.full_name}</p>
              <p className="text-xs text-gray-500">{adminUser?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  {isEnabled ? <Bell className="h-4 w-4 text-gray-500" /> : <BellOff className="h-4 w-4 text-gray-400" />}
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
                      sonnerToast.success('Notificaciones activadas');
                    } else if (permission === 'denied') {
                      sonnerToast.error('Permisos denegados');
                    }
                  }}
                  disabled={!isSupported}
                />
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-gray-600 focus:text-gray-900">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
