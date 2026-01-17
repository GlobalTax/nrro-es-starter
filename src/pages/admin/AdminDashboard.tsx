import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Newspaper, Briefcase } from 'lucide-react';
import { PendingDraftsWidget } from '@/components/admin/PendingDraftsWidget';

export const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [caseStudies, team, news, jobs] = await Promise.all([
        supabase.from('case_studies').select('id', { count: 'exact', head: true }),
        supabase.from('team_members').select('id', { count: 'exact', head: true }),
        supabase.from('news_articles').select('id', { count: 'exact', head: true }),
        supabase.from('job_positions').select('id', { count: 'exact', head: true }).eq('status', 'published'),
      ]);

      return {
        caseStudies: caseStudies.count || 0,
        team: team.count || 0,
        news: news.count || 0,
        openJobs: jobs.count || 0,
      };
    },
  });

  const statCards = [
    {
      title: 'Case Studies',
      value: stats?.caseStudies || 0,
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Team Members',
      value: stats?.team || 0,
      icon: Users,
      color: 'text-slate-600',
      bgColor: 'bg-slate-100',
    },
    {
      title: 'News Articles',
      value: stats?.news || 0,
      icon: Newspaper,
      color: 'text-slate-600',
      bgColor: 'bg-slate-100',
    },
    {
      title: 'Open Positions',
      value: stats?.openJobs || 0,
      icon: Briefcase,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
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
        <p className="text-slate-500 text-sm mt-0.5">Bienvenido al panel de administración</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
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
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-base font-medium text-slate-900">Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-500 text-sm">No hay actividad reciente</p>
          </CardContent>
        </Card>

        <PendingDraftsWidget />
      </div>
    </div>
  );
};