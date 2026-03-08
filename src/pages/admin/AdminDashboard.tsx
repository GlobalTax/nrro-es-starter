import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  FileText, Users, Newspaper, Layout,
  ArrowRight, Mail, Clock
} from 'lucide-react';
import { PendingDraftsWidget } from '@/components/admin/PendingDraftsWidget';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const AdminDashboard = () => {
  const { data: stats, isLoading } = useDashboardStats();

  const kpiCards = [
    {
      title: 'Leads totales',
      value: stats?.leadsTotal || 0,
      icon: FileText,
      link: '/admin/contact-leads',
    },
    {
      title: 'Leads pendientes',
      value: stats?.leadsPendientes || 0,
      icon: Clock,
      link: '/admin/contact-leads',
    },
    {
      title: 'Posts publicados',
      value: stats?.postsPublicados || 0,
      icon: Newspaper,
      link: '/admin/blog',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-medium text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-[13px] mt-0.5">Panel de administración</p>
      </div>

      {/* KPI Cards — Apollo inline icon style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {kpiCards.map((stat) => (
          <Link key={stat.title} to={stat.link}>
            <div className="bg-white border border-gray-100 rounded-lg p-5 hover:border-gray-200 transition-colors cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-[12px] text-gray-500 font-medium uppercase tracking-wider">{stat.title}</span>
              </div>
              <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[
          { label: 'Blog', icon: Newspaper, path: '/admin/blog' },
          { label: 'Contactos', icon: FileText, path: '/admin/contact-leads' },
          { label: 'Landings', icon: Layout, path: '/admin/landings' },
          { label: 'Equipo web', icon: Users, path: '/admin/team' },
        ].map((item) => (
          <Link key={item.path} to={item.path}>
            <Button variant="outline" className="w-full h-auto py-3.5 flex flex-col gap-1.5 hover:bg-gray-50 border-gray-100 hover:border-gray-200 rounded-lg">
              <item.icon className="h-4 w-4 text-gray-400" />
              <span className="text-[13px] font-medium text-gray-700">{item.label}</span>
            </Button>
          </Link>
        ))}
      </div>

      {/* Recent Leads + Pending Drafts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Recent Leads */}
        <div className="bg-white border border-gray-100 rounded-lg">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">Leads recientes</span>
            </div>
            <Link to="/admin/contact-leads">
              <Button variant="ghost" size="sm" className="text-[12px] text-gray-500 hover:text-gray-700 h-7">
                Ver todos <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
          <div>
            {(stats?.leadsRecientes || []).length > 0 ? (
              <div className="divide-y divide-gray-50">
                {stats?.leadsRecientes.map((lead) => (
                  <div key={lead.id} className="px-5 py-3 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium text-gray-900 truncate">{lead.name}</p>
                        <p className="text-[12px] text-gray-500 truncate">{lead.subject}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        <Badge className={cn(
                          "text-[10px] border-0 rounded-full",
                          lead.email_sent
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        )}>
                          {lead.email_sent ? 'Respondido' : 'Pendiente'}
                        </Badge>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">
                          {format(new Date(lead.created_at), 'dd MMM', { locale: es })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Mail className="h-8 w-8 mb-2 opacity-30" />
                <p className="text-[13px]">Sin leads recientes</p>
              </div>
            )}
          </div>
        </div>

        <PendingDraftsWidget />
      </div>
    </div>
  );
};
