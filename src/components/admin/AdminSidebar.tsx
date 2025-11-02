import { Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import {
  LayoutDashboard,
  TrendingUp,
  LogOut as ExitIcon,
  Users,
  Newspaper,
  UserCog,
  Home,
  Settings,
  ExternalLink,
  FileText,
  Briefcase,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/settings', icon: Settings, label: 'Site Settings' },
    { path: '/admin/content', icon: FileText, label: 'Gestión de Contenido' },
    { path: '/admin/case-studies', icon: TrendingUp, label: 'Case Studies' },
    { path: '/admin/services', icon: Settings, label: 'Services' },
    { path: '/admin/blog', icon: Newspaper, label: 'Blog' },
    { path: '/admin/team', icon: Users, label: 'Team Members' },
    { path: '/admin/job-positions', icon: Briefcase, label: 'Vacantes' },
    { path: '/admin/candidatos', icon: Briefcase, label: 'Candidatos' },
    { path: '/admin/contact-leads', icon: Users, label: 'Leads de Contacto' },
    { path: '/admin/demo-requests', icon: Users, label: 'Demo Requests' },
    { path: '/orquest-kairoshr', icon: ExternalLink, label: 'Orquest + KairosHR', external: true },
  ];

export const AdminSidebar = () => {
  const location = useLocation();
  const { adminUser, canManageUsers } = useAdminAuth();

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        {adminUser && (
          <div className="mt-2">
            <Badge variant="secondary" className="text-xs">
              {adminUser.role.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        )}
      </div>

      <Separator className="bg-slate-700" />

      <nav className="flex-1 p-4 space-y-2">
        <Link to="/">
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <Home className="mr-3 h-4 w-4" />
            Back to Site
          </Button>
        </Link>

        <Separator className="bg-slate-700 my-4" />

        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            {...((item as any).external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                isActive(item.path)
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        ))}

        {canManageUsers() && (
          <>
            <Separator className="bg-slate-700 my-4" />
            <Link to="/admin/users">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  isActive('/admin/users')
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
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
          <div className="text-sm text-slate-400 mb-2">
            <p className="truncate">{adminUser.full_name}</p>
            <p className="text-xs truncate">{adminUser.email}</p>
          </div>
        )}
      </div>
    </aside>
  );
};
