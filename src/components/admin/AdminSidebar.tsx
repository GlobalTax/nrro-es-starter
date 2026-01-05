import { Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { usePendingDraftsCount } from '@/hooks/usePendingDrafts';
import {
  LayoutDashboard,
  Home,
  Settings,
  Map,
  UserCog,
  FileText,
  Newspaper,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/blog', icon: Newspaper, label: 'Blog', showDraftsBadge: true },
  { path: '/admin/resources', icon: FileText, label: 'Recursos' },
  { path: '/admin/sitemap', icon: Map, label: 'Mapa del Sitio' },
  { path: '/admin/settings', icon: Settings, label: 'Configuración' },
];

export const AdminSidebar = () => {
  const location = useLocation();
  const { adminUser, canManageUsers } = useAdminAuth();
  const { data: pendingDraftsCount } = usePendingDraftsCount();

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-teal-900 text-white min-h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold">int.nrro.es</h1>
        <p className="text-xs text-teal-300 mt-1">Panel de Administración</p>
        {adminUser && (
          <div className="mt-3">
            <Badge variant="secondary" className="text-xs bg-teal-700 text-teal-100 hover:bg-teal-600">
              {adminUser.role.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        )}
      </div>

      <Separator className="bg-teal-700" />

      <nav className="flex-1 p-4 space-y-2">
        <Link to="/">
          <Button
            variant="ghost"
            className="w-full justify-start text-teal-200 hover:text-white hover:bg-teal-800"
          >
            <Home className="mr-3 h-4 w-4" />
            Volver al sitio
          </Button>
        </Link>

        <Separator className="bg-teal-700 my-4" />

        {navItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 ${
                isActive(item.path)
                  ? 'bg-teal-800 text-white'
                  : 'text-teal-200 hover:text-white hover:bg-teal-800'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.showDraftsBadge && pendingDraftsCount && pendingDraftsCount > 0 ? (
                <Badge 
                  variant="destructive" 
                  className="ml-auto h-5 min-w-5 px-1.5 text-xs"
                >
                  {pendingDraftsCount}
                </Badge>
              ) : null}
            </Button>
          </Link>
        ))}

        {canManageUsers() && (
          <>
            <Separator className="bg-teal-700 my-4" />
            <Link to="/admin/users">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  isActive('/admin/users')
                    ? 'bg-teal-800 text-white'
                    : 'text-teal-200 hover:text-white hover:bg-teal-800'
                }`}
              >
                <UserCog className="mr-3 h-4 w-4" />
                Admin Users
              </Button>
            </Link>
          </>
        )}
      </nav>

      <div className="p-4">
        {adminUser && (
          <div className="text-sm text-teal-300 mb-2">
            <p className="truncate font-medium text-teal-100">{adminUser.full_name}</p>
            <p className="text-xs truncate">{adminUser.email}</p>
          </div>
        )}
      </div>
    </aside>
  );
};
