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
  ChevronDown,
  Shield,
  FolderOpen,
  PanelTop,
  ScanLine,
  UserCog,
  Megaphone,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface NavItem {
  path: string;
  icon: React.ElementType;
  label: string;
  showDraftsBadge?: boolean;
  requiredRole?: 'super_admin' | 'admin' | 'editor' | 'viewer' | 'hr_viewer';
}

interface SidebarSection {
  id: string;
  title?: string;
  icon?: React.ElementType;
  items: NavItem[];
  requiredRole?: 'super_admin' | 'admin' | 'editor' | 'viewer' | 'hr_viewer';
}

const sidebarSections: SidebarSection[] = [
  {
    id: 'main',
    items: [
      { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    id: 'leads',
    title: 'Leads',
    icon: FileText,
    items: [
      { path: '/admin/contact-leads', icon: FileText, label: 'Contactos' },
    ],
  },
  {
    id: 'team',
    title: 'Equipo',
    icon: UserCog,
    requiredRole: 'hr_viewer',
    items: [
      { path: '/admin/job-positions', icon: Briefcase, label: 'Ofertas' },
    ],
  },
  {
    id: 'content',
    title: 'Contenido',
    icon: Megaphone,
    items: [
      { path: '/admin/blog', icon: Newspaper, label: 'Blog', showDraftsBadge: true },
      { path: '/admin/news', icon: Rss, label: 'Noticias' },
      { path: '/admin/case-studies', icon: TrendingUp, label: 'Case Studies' },
      { path: '/admin/resources', icon: FolderOpen, label: 'Recursos' },
      { path: '/admin/landings', icon: Layout, label: 'Landings' },
      { path: '/admin/marketing-audit', icon: ScanLine, label: 'Auditoría Web' },
    ],
  },
  {
    id: 'config',
    title: 'Configuración',
    icon: Settings,
    items: [
      { path: '/admin/team', icon: Users, label: 'Equipo web' },
      { path: '/admin/services', icon: Briefcase, label: 'Servicios' },
      { path: '/admin/sitemap', icon: Map, label: 'Sitemap' },
      { path: '/admin/topbar', icon: PanelTop, label: 'TopBar' },
      { path: '/admin/users', icon: Shield, label: 'Usuarios', requiredRole: 'super_admin' },
    ],
  },
];

export const AdminSidebar = () => {
  const location = useLocation();
  const { adminUser, canManageUsers, canViewHR, hasRole } = useAdminAuth();
  const { data: pendingDraftsCount = 0 } = usePendingDraftsCount();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    leads: true,
    team: true,
    content: true,
    config: true,
  });

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const isSectionActive = (section: SidebarSection) => {
    return section.items.some((item) => isActive(item.path));
  };

  useEffect(() => {
    sidebarSections.forEach((section) => {
      if (isSectionActive(section) && section.title) {
        setOpenSections((prev) => ({ ...prev, [section.id]: true }));
      }
    });
  }, [location.pathname]);

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
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

  const renderNavItem = (item: NavItem) => {
    if (!canAccessItem(item)) return null;

    return (
      <Link key={item.path} to={item.path}>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'w-full justify-start gap-2.5 h-7 transition-all pl-9 rounded-md',
            isActive(item.path)
              ? 'bg-indigo-500/[0.12] text-indigo-300 border-l-2 border-indigo-400'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
          )}
        >
          <item.icon className="h-3.5 w-3.5 shrink-0" />
          <span className="flex-1 text-left text-[12.5px]">{item.label}</span>
          {item.showDraftsBadge && pendingDraftsCount > 0 && (
            <Badge className="ml-auto h-4 min-w-4 px-1 text-[9px] bg-indigo-500 text-white border-0 rounded-full">
              {pendingDraftsCount}
            </Badge>
          )}
        </Button>
      </Link>
    );
  };

  const renderSection = (section: SidebarSection) => {
    if (!canAccessSection(section)) return null;

    if (!section.title) {
      return (
        <div key={section.id} className="space-y-0.5">
          {section.items.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'w-full justify-start gap-2.5 h-8 transition-all rounded-md',
                  isActive(item.path)
                    ? 'bg-indigo-500/[0.12] text-indigo-300 border-l-2 border-indigo-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="text-[13px]">{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      );
    }

    const Icon = section.icon!;
    const isOpen = openSections[section.id];
    const hasActiveItem = isSectionActive(section);

    return (
      <Collapsible
        key={section.id}
        open={isOpen}
        onOpenChange={() => toggleSection(section.id)}
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'w-full justify-between h-7 transition-colors group rounded-md',
              hasActiveItem
                ? 'text-white'
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
            )}
          >
            <div className="flex items-center gap-2">
              <Icon className="h-3.5 w-3.5" />
              <span className="text-[12px] font-semibold uppercase tracking-wider">{section.title}</span>
            </div>
            <ChevronDown
              className={cn(
                'h-3 w-3 transition-transform duration-200',
                isOpen && 'rotate-180'
              )}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-0.5 mt-0.5">
          {section.items.map(renderNavItem)}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <aside className="w-[232px] shrink-0 bg-[#1B1F3B] text-white min-h-screen flex flex-col">
      {/* Logo area */}
      <div className="px-4 py-4 flex items-center gap-2.5">
        <div className="h-7 w-7 rounded-lg bg-indigo-500/20 flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-indigo-400" />
        </div>
        <div>
          <h1 className="font-display text-[15px] font-semibold lowercase tracking-tight text-white">
            nrro
          </h1>
        </div>
      </div>

      <div className="h-px bg-white/[0.06] mx-3" />

      <nav className="flex-1 px-2.5 py-2 space-y-0.5 overflow-y-auto">
        <Link to="/">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] h-7 rounded-md"
          >
            <Home className="mr-2 h-3.5 w-3.5" />
            <span className="text-[12.5px]">Volver al sitio</span>
          </Button>
        </Link>

        <div className="h-px bg-white/[0.04] my-2" />

        {sidebarSections.map((section) => renderSection(section))}
      </nav>

      <div className="px-3 py-3 border-t border-white/[0.06]">
        {adminUser && (
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
              <span className="text-[11px] font-medium text-indigo-300">
                {adminUser.full_name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium text-white/80 text-[12px] leading-tight">
                {adminUser.full_name}
              </p>
              <p className="text-[10px] text-slate-500 truncate">{adminUser.email}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
