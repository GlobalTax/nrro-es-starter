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
  Rss,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/hub', icon: Grid3X3, label: 'Hub' },
  { path: '/admin/blog', icon: Newspaper, label: 'Blog', showDraftsBadge: true },
  { path: '/admin/news', icon: Rss, label: 'Noticias' },
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
  const location = useLocation();
  const { adminUser, canManageUsers } = useAdminAuth();
  const { data: pendingDraftsCount = 0 } = usePendingDraftsCount();

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 shrink-0 bg-slate-900 text-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-5 pb-4">
        <h1 className="font-display text-xl font-normal lowercase tracking-tight text-white/90">nrro</h1>
        <p className="text-[11px] text-slate-500 mt-0.5">Panel de Administración</p>
        {adminUser && (
          <div className="mt-3">
            <Badge className="text-[10px] bg-indigo-500/20 text-indigo-300 border-0 font-medium px-2 py-0.5">
              {adminUser.role.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.06] mx-4" />

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5">
        <Link to="/">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-slate-400 hover:text-white hover:bg-white/[0.06] h-9"
          >
            <Home className="mr-2.5 h-4 w-4" />
            Volver al sitio
          </Button>
        </Link>

        <div className="h-px bg-white/[0.06] my-3" />

        {navItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start gap-2.5 h-9 transition-colors ${
                isActive(item.path)
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1 text-left text-sm">{item.label}</span>
              {item.showDraftsBadge && pendingDraftsCount && pendingDraftsCount > 0 ? (
                <Badge 
                  className="ml-auto h-5 min-w-5 px-1.5 text-[10px] bg-indigo-500 text-white border-0"
                >
                  {pendingDraftsCount}
                </Badge>
              ) : null}
            </Button>
          </Link>
        ))}

        <div className="h-px bg-white/[0.06] my-3" />
        <p className="text-[10px] text-slate-500 px-3 mb-1.5 uppercase tracking-wider font-medium">Comercial</p>
        
        {comercialItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start h-9 transition-colors ${
                isActive(item.path)
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <item.icon className="mr-2.5 h-4 w-4" />
              <span className="text-sm">{item.label}</span>
            </Button>
          </Link>
        ))}

        {canManageUsers() && (
          <>
            <div className="h-px bg-white/[0.06] my-3" />
            <Link to="/admin/users">
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start h-9 transition-colors ${
                  isActive('/admin/users')
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <UserCog className="mr-2.5 h-4 w-4" />
                <span className="text-sm">Admin Users</span>
              </Button>
            </Link>
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/[0.06]">
        {adminUser && (
          <div className="text-sm">
            <p className="truncate font-medium text-white/80 text-sm">{adminUser.full_name}</p>
            <p className="text-[11px] text-slate-500 truncate">{adminUser.email}</p>
          </div>
        )}
      </div>
    </aside>
  );
};