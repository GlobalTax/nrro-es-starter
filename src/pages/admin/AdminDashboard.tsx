import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      link: '/admin/contact-leads',
    },
    {
      title: 'Leads pendientes',
      value: stats?.leadsPendientes || 0,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      link: '/admin/contact-leads',
    },
    {
      title: 'Posts publicados',
      value: stats?.postsPublicados || 0,
      icon: Newspaper,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      link: '/admin/blog',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-slate-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-0.5">Panel de administración</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((stat) => (
          <Link key={stat.title} to={stat.link}>
            <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold text-slate-900">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Blog', icon: Newspaper, path: '/admin/blog' },
          { label: 'Contactos', icon: FileText, path: '/admin/contact-leads' },
          { label: 'Landings', icon: Layout, path: '/admin/landings' },
          { label: 'Equipo web', icon: Users, path: '/admin/team' },
        ].map((item) => (
          <Link key={item.path} to={item.path}>
            <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 hover:bg-slate-50">
              <item.icon className="h-5 w-5 text-slate-500" />
              <span className="text-sm font-medium">{item.label}</span>
            </Button>
          </Link>
        ))}
      </div>

      {/* Recent Leads + Pending Drafts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Leads */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-400" />
              <CardTitle className="text-base font-medium text-slate-900">
                Leads recientes
              </CardTitle>
            </div>
            <Link to="/admin/contact-leads">
              <Button variant="ghost" size="sm" className="text-xs text-slate-500">
                Ver todos <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {(stats?.leadsRecientes || []).length > 0 ? (
              <div className="divide-y divide-slate-100">
                {stats?.leadsRecientes.map((lead) => (
                  <div key={lead.id} className="px-4 py-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 truncate">{lead.name}</p>
                        <p className="text-xs text-slate-500 truncate">{lead.subject}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        <Badge className={cn(
                          "text-[10px] border-0",
                          lead.email_sent
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        )}>
                          {lead.email_sent ? 'Respondido' : 'Pendiente'}
                        </Badge>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {format(new Date(lead.created_at), 'dd MMM', { locale: es })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Mail className="h-8 w-8 mb-2 opacity-30" />
                <p className="text-sm">Sin leads recientes</p>
              </div>
            )}
          </CardContent>
        </Card>

        <PendingDraftsWidget />
      </div>
    </div>
  );
};
