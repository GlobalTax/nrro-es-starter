import { Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { usePendingDraftsCount } from '@/hooks/usePendingDrafts';
import {
  LayoutDashboard,
  Home,
  Settings,
  Map,
  FileText,
  Newspaper,
  Briefcase,
  Rss,
  Users,
  TrendingUp,
  Layout,
  Shield,
  FolderOpen,
  PanelTop,
  ScanLine,
  UserCog,
  Megaphone,
  Bot,
  Calendar,
  Clock,
  FileCheck,
  Building2,
  UserCircle,
  Plus,
  GraduationCap,
  Plug,
  BarChart3,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NavItem {
  path: string;
  icon: React.ElementType;
  label: string;
  showDraftsBadge?: boolean;
  requiredRole?: 'super_admin' | 'admin' | 'editor' | 'viewer' | 'hr_viewer';
}

interface SidebarSection {
  id: string;
  title: string;
  items: NavItem[];
  requiredRole?: 'super_admin' | 'admin' | 'editor' | 'viewer' | 'hr_viewer';
}

interface QuickAction {
  label: string;
  path: string;
}

const sidebarSections: SidebarSection[] = [
  {
    id: 'principal',
    title: 'PRINCIPAL',
    items: [
      { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/admin/calendar', icon: Calendar, label: 'Calendario' },
    ],
  },
  {
    id: 'contacts',
    title: 'CONTACTOS',
    items: [
      { path: '/admin/contact-leads', icon: FileText, label: 'Contactos' },
      { path: '/admin/people', icon: UserCircle, label: 'Personas Físicas' },
      { path: '/admin/companies', icon: Building2, label: 'Empresas' },
    ],
  },
  {
    id: 'content',
    title: 'CONTENIDO',
    items: [
      { path: '/admin/blog', icon: Newspaper, label: 'Blog', showDraftsBadge: true },
      { path: '/admin/news', icon: Rss, label: 'Noticias' },
      { path: '/admin/case-studies', icon: TrendingUp, label: 'Case Studies' },
      { path: '/admin/resources', icon: FolderOpen, label: 'Recursos' },
      { path: '/admin/landings', icon: Layout, label: 'Landings' },
    ],
  },
  {
    id: 'productivity',
    title: 'PRODUCTIVIDAD',
    items: [
      { path: '/admin/tasks', icon: FileCheck, label: 'Tareas' },
      { path: '/admin/time-tracking', icon: Clock, label: 'Time Tracking' },
      { path: '/admin/reports', icon: BarChart3, label: 'Reportes' },
      { path: '/admin/marketing-audit', icon: ScanLine, label: 'Auditoría Web' },
    ],
  },
  {
    id: 'team',
    title: 'EQUIPO',
    requiredRole: 'hr_viewer',
    items: [
      { path: '/admin/team', icon: Users, label: 'Equipo web' },
      { path: '/admin/job-positions', icon: Briefcase, label: 'Ofertas' },
    ],
  },
  {
    id: 'config',
    title: 'CONFIGURACIÓN',
    items: [
      { path: '/admin/services', icon: Briefcase, label: 'Servicios' },
      { path: '/admin/sitemap', icon: Map, label: 'Sitemap' },
      { path: '/admin/topbar', icon: PanelTop, label: 'TopBar' },
      { path: '/admin/integrations', icon: Plug, label: 'Integraciones' },
      { path: '/admin/users', icon: Shield, label: 'Usuarios', requiredRole: 'super_admin' },
    ],
  },
  {
    id: 'ai',
    title: 'IA & ACADEMIA',
    items: [
      { path: '/admin/ai-assistant', icon: Bot, label: 'Asistente IA' },
      { path: '/admin/academy', icon: GraduationCap, label: 'Academia' },
    ],
  },
];

const quickActions: QuickAction[] = [
  { label: 'Nuevo contacto', path: '/admin/contact-leads' },
  { label: 'Nuevo artículo', path: '/admin/blog' },
  { label: 'Nueva tarea', path: '/admin/tasks' },
];

export const AdminSidebar = () => {
  const location = useLocation();
  const { adminUser, canManageUsers, canViewHR, hasRole } = useAdminAuth();
  const { data: pendingDraftsCount = 0 } = usePendingDraftsCount();

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const canAccessSection = (section: SidebarSection) => {
    if (!section.requiredRole) return true;
    if (section.requiredRole === 'hr_viewer') return canViewHR();
    return hasRole(section.requiredRole);
  };

  const canAccessItem = (item: NavItem) => {
    if (!item.requiredRole) return true;
    if (item.requiredRole === 'super_admin') return canManageUsers();
    return hasRole(item.requiredRole);
  };

  return (
    <aside className="w-[220px] shrink-0 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-4 py-3.5 flex items-center">
        <Link to="/admin" className="flex items-center gap-2">
          <h1 className="text-[15px] font-medium text-gray-900 tracking-tight">
            nrro<span className="text-gray-400 font-normal">CRM</span>
          </h1>
        </Link>
      </div>

      <div className="h-px bg-gray-100 mx-3" />

      <ScrollArea className="flex-1">
        <nav className="px-2.5 py-2 space-y-3">
          {/* Back to site */}
          <Link
            to="/"
            className="flex items-center gap-2.5 px-2.5 h-7 text-gray-400 hover:text-gray-600 transition-colors text-[12px]"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Volver al sitio</span>
          </Link>

          <div className="h-px bg-gray-100" />

          {sidebarSections.map((section) => {
            if (!canAccessSection(section)) return null;

            return (
              <div key={section.id} className="space-y-0.5">
                <p className="px-2.5 text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-1">
                  {section.title}
                </p>
                {section.items.map((item) => {
                  if (!canAccessItem(item)) return null;
                  const active = isActive(item.path);
                  return (
                    <Link key={item.path} to={item.path}>
                      <div
                        className={cn(
                          'flex items-center gap-2.5 px-2.5 h-7 rounded-md text-[12.5px] transition-colors cursor-pointer',
                          active
                            ? 'bg-indigo-50 text-indigo-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        )}
                      >
                        <item.icon className="h-3.5 w-3.5 shrink-0" />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.showDraftsBadge && pendingDraftsCount > 0 && (
                          <Badge className="h-4 min-w-4 px-1 text-[9px] bg-indigo-500 text-white border-0 rounded-full">
                            {pendingDraftsCount}
                          </Badge>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            );
          })}

          {/* Quick actions */}
          <div className="h-px bg-gray-100" />
          <div className="space-y-0.5">
            <p className="px-2.5 text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-1">
              ACCIONES RÁPIDAS
            </p>
            {quickActions.map((action) => (
              <Link key={action.label} to={action.path}>
                <div className="flex items-center gap-2 px-2.5 h-7 rounded-md text-[12.5px] text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors cursor-pointer">
                  <Plus className="h-3 w-3" />
                  <span>{action.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </nav>
      </ScrollArea>

      {/* User footer */}
      <div className="px-3 py-3 border-t border-gray-100">
        {adminUser && (
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
              <span className="text-[11px] font-normal text-indigo-600">
                {adminUser.full_name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="truncate font-normal text-gray-700 text-[12px] leading-tight">
                {adminUser.full_name}
              </p>
              <p className="text-[10px] text-gray-400 truncate">{adminUser.email}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
