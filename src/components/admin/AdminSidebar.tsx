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
  Users,
  Building,
  Globe,
  TrendingUp,
  UserPlus,
  Calendar,
  Receipt,
  Megaphone,
  Layout,
  ChevronDown,
  Shield,
  FolderOpen,
  PanelTop,
  ScanLine,
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
      { path: '/admin/hub', icon: Grid3X3, label: 'Hub' },
    ],
  },
  {
    id: 'crm',
    title: 'CRM',
    icon: Users,
    items: [
      { path: '/admin/contact-leads', icon: FileText, label: 'Contactos' },
      { path: '/admin/company-setup-leads', icon: Building, label: 'Company Setup' },
      { path: '/admin/ley-beckham-leads', icon: Globe, label: 'Ley Beckham' },
      { path: '/admin/demo-requests', icon: Presentation, label: 'Demo Requests' },
      { path: '/admin/proposals', icon: Briefcase, label: 'Propuestas' },
      { path: '/admin/proposal-templates', icon: FileCheck, label: 'Plantillas' },
      { path: '/admin/presentations', icon: Presentation, label: 'Presentaciones' },
    ],
  },
  {
    id: 'hr',
    title: 'Recursos Humanos',
    icon: UserCog,
    requiredRole: 'hr_viewer',
    items: [
      { path: '/admin/empleados', icon: Users, label: 'Empleados' },
      { path: '/admin/candidatos', icon: UserPlus, label: 'Candidatos' },
      { path: '/admin/job-positions', icon: Briefcase, label: 'Ofertas' },
      { path: '/admin/entrevistas', icon: Calendar, label: 'Entrevistas' },
      { path: '/admin/nominas', icon: Receipt, label: 'Nóminas' },
    ],
  },
  {
    id: 'content',
    title: 'Marketing',
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
    id: 'admin',
    title: 'Administración',
    icon: Settings,
    items: [
      { path: '/admin/team', icon: Users, label: 'Equipo' },
      { path: '/admin/services', icon: Briefcase, label: 'Servicios' },
      { path: '/admin/technology', icon: Grid3X3, label: 'Tecnología' },
      { path: '/admin/sitemap', icon: Map, label: 'Sitemap' },
      { path: '/admin/topbar', icon: PanelTop, label: 'TopBar' },
      { path: '/admin/whistleblower', icon: Shield, label: 'Denuncias', requiredRole: 'super_admin' },
      { path: '/admin/settings', icon: Settings, label: 'Configuración' },
      { path: '/admin/users', icon: Shield, label: 'Usuarios', requiredRole: 'super_admin' },
    ],
  },
];

export const AdminSidebar = () => {
  const location = useLocation();
  const { adminUser, canManageUsers, canViewHR, hasRole } = useAdminAuth();
  const { data: pendingDraftsCount = 0 } = usePendingDraftsCount();

  // Track which sections are open
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    crm: true,
    hr: true,
    content: true,
    admin: true,
  });

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Check if any item in section is active
  const isSectionActive = (section: SidebarSection) => {
    return section.items.some((item) => isActive(item.path));
  };

  // Auto-open section containing active route
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
            'w-full justify-start gap-2.5 h-8 transition-colors pl-9',
            isActive(item.path)
              ? 'bg-white/10 text-white'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
          )}
        >
          <item.icon className="h-3.5 w-3.5" />
          <span className="flex-1 text-left text-[13px]">{item.label}</span>
          {item.showDraftsBadge && pendingDraftsCount > 0 && (
            <Badge className="ml-auto h-4 min-w-4 px-1 text-[9px] bg-indigo-500 text-white border-0">
              {pendingDraftsCount}
            </Badge>
          )}
        </Button>
      </Link>
    );
  };

  const renderSection = (section: SidebarSection) => {
    if (!canAccessSection(section)) return null;

    // Section without title (main items)
    if (!section.title) {
      return (
        <div key={section.id} className="space-y-0.5">
          {section.items.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'w-full justify-start gap-2.5 h-9 transition-colors',
                  isActive(item.path)
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="text-sm">{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      );
    }

    // Collapsible section
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
              'w-full justify-between h-8 transition-colors group',
              hasActiveItem
                ? 'text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
            )}
          >
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <span className="text-[13px] font-medium">{section.title}</span>
            </div>
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 transition-transform duration-200',
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
    <aside className="w-64 shrink-0 bg-slate-900 text-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-5 pb-4">
        <h1 className="font-display text-xl font-normal lowercase tracking-tight text-white/90">
          nrro
        </h1>
        <p className="text-[11px] text-slate-500 mt-0.5">Intranet</p>
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
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
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

        {sidebarSections.map((section) => renderSection(section))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/[0.06]">
        {adminUser && (
          <div className="text-sm">
            <p className="truncate font-medium text-white/80 text-sm">
              {adminUser.full_name}
            </p>
            <p className="text-[11px] text-slate-500 truncate">{adminUser.email}</p>
          </div>
        )}
      </div>
    </aside>
  );
};
