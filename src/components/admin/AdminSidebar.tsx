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
  Briefcase,
  FileCheck,
  Presentation,
  Grid3X3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/hub', icon: Grid3X3, label: 'Hub' },
  { path: '/admin/blog', icon: Newspaper, label: 'Blog', showDraftsBadge: true },
  { path: '/admin/resources', icon: FileText, label: 'Recursos' },
  { path: '/admin/sitemap', icon: Map, label: 'Mapa del Sitio' },
  { path: '/admin/settings', icon: Settings, label: 'Configuración' },
];

const comercialItems = [
  { path: '/admin/proposals', icon: Briefcase, label: 'Propuestas' },
  { path: '/admin/proposal-templates', icon: FileCheck, label: 'Plantillas' },
  { path: '/admin/presentations', icon: Presentation, label: 'Presentaciones' },
];

export const AdminSidebar = () => {
  console.log('[AdminSidebar] Rendering...');
  
  const location = useLocation();
  const { adminUser, canManageUsers } = useAdminAuth();
  const { data: pendingDraftsCount = 0 } = usePendingDraftsCount();
  
  console.log('[AdminSidebar] adminUser:', adminUser);
  console.log('[AdminSidebar] location:', location.pathname);

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 shrink-0 bg-black text-white min-h-screen flex flex-col">
      <div className="p-6">
        <h1 className="font-display text-2xl font-normal lowercase tracking-tight">nrro</h1>
        <p className="text-xs text-white/40 mt-1">Panel de Administración</p>
        {adminUser && (
          <div className="mt-3">
            <Badge variant="outline" className="text-xs bg-white/10 text-white/80 border-white/20 hover:bg-white/20">
              {adminUser.role.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        )}
      </div>

      <Separator className="bg-white/10" />

      <nav className="flex-1 p-4 space-y-2">
        <Link to="/">
          <Button
            variant="ghost"
            className="w-full justify-start text-white/60 hover:text-white hover:bg-white/10"
          >
            <Home className="mr-3 h-4 w-4" />
            Volver al sitio
          </Button>
        </Link>

        <Separator className="bg-white/10 my-4" />

        {navItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 ${
                isActive(item.path)
                  ? 'bg-white/10 text-white border-l-2 border-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
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

        <Separator className="bg-white/10 my-4" />
        <p className="text-xs text-white/40 px-3 mb-2">Comercial</p>
        {comercialItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                isActive(item.path)
                  ? 'bg-white/10 text-white border-l-2 border-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        ))}

        {canManageUsers() && (
          <>
            <Separator className="bg-white/10 my-4" />
            <Link to="/admin/users">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  isActive('/admin/users')
                    ? 'bg-white/10 text-white border-l-2 border-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
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
          <div className="text-sm text-white/60 mb-2">
            <p className="truncate font-medium text-white/90">{adminUser.full_name}</p>
            <p className="text-xs truncate">{adminUser.email}</p>
          </div>
        )}
      </div>
    </aside>
  );
};
