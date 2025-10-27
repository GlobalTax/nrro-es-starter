import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Briefcase, TrendingUp, Target, Building2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export const ServicesDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['services-stats'],
    queryFn: async () => {
      // @ts-ignore - New tables not in types yet
      const supabaseAny = supabase as any;
      const [servicesResult, featuredResult, areasResult] = await Promise.all([
        supabaseAny.from('services').select('id', { count: 'exact', head: true }),
        supabaseAny.from('services').select('id', { count: 'exact', head: true }).eq('is_featured', true),
        supabaseAny.from('services').select('area').eq('is_active', true),
      ]);

      // Get unique areas
      const uniqueAreas = new Set(areasResult.data?.map((s: any) => s.area));

      return {
        total: servicesResult.count || 8,
        featured: featuredResult.count || 4,
        areas: uniqueAreas.size || 4,
      };
    },
  });

  // Growth chart data (last 6 months - clients growth)
  const chartData = [
    { month: 'Ene', value: 420 },
    { month: 'Feb', value: 445 },
    { month: 'Mar', value: 465 },
    { month: 'Abr', value: 480 },
    { month: 'May', value: 490 },
    { month: 'Jun', value: 500 },
  ];

  const chartConfig = {
    value: {
      label: "Clientes Activos",
      color: "hsl(var(--primary))",
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px] bg-neutral-100 dark:bg-neutral-300 rounded-lg border border-border">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Servicios Especializados',
      value: `${stats?.total || 8}+`,
      icon: Briefcase,
      trend: 'Todas las áreas',
      bgColor: 'bg-secondary',
    },
    {
      title: 'Áreas de Práctica',
      value: stats?.areas || 4,
      icon: Building2,
      trend: 'Multidisciplinar',
      bgColor: 'bg-card',
    },
    {
      title: 'Clientes Activos',
      value: '500+',
      icon: Target,
      trend: 'En crecimiento',
      bgColor: 'bg-accent/10',
    },
  ];

  return (
    <div className="bg-neutral-100 dark:bg-neutral-300 rounded-lg border border-border p-4 md:p-6 space-y-4 min-h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div>
          <h3 className="text-lg font-medium text-foreground">Panel de Servicios</h3>
          <p className="text-xs text-muted-foreground">Métricas en tiempo real</p>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-success/10 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-medium text-success">Activo</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {statCards.map((stat) => (
          <Card key={stat.title} className={`${stat.bgColor} border-border/50`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-medium text-foreground">{stat.value}</div>
              <p className="text-xs text-success mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Growth Chart */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-foreground">Crecimiento de Clientes (6M)</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 11 }}
                  className="text-muted-foreground"
                />
                <YAxis 
                  tick={{ fontSize: 11 }}
                  className="text-muted-foreground"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--accent-pink))", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
