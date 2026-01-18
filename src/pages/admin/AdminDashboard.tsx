import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users, UserPlus, Building, Receipt, Bell, 
  BarChart3, PieChart as PieChartIcon, TrendingUp 
} from 'lucide-react';
import { PendingDraftsWidget } from '@/components/admin/PendingDraftsWidget';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig 
} from '@/components/ui/chart';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import { cn } from '@/lib/utils';

// Chart configurations
const leadsChartConfig: ChartConfig = {
  count: {
    label: "Leads",
    color: "hsl(var(--primary))",
  },
};

const nominasChartConfig: ChartConfig = {
  previsto: { 
    label: "Previsto", 
    color: "hsl(var(--primary))",
  },
  real: { 
    label: "Real", 
    color: "hsl(142 76% 36%)",
  },
};

// Colors for pie chart
const DEPARTMENT_COLORS = [
  'hsl(var(--primary))',
  'hsl(262 83% 58%)',
  'hsl(280 65% 60%)',
  'hsl(215 16% 47%)',
  'hsl(142 76% 36%)',
  'hsl(45 93% 47%)',
];

export const AdminDashboard = () => {
  const { data: stats, isLoading } = useDashboardStats();

  const kpiCards = [
    {
      title: 'Leads Activos',
      value: stats?.leadsActivos || 0,
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'Company setup leads',
    },
    {
      title: 'Candidatos en Proceso',
      value: stats?.candidatosEnProceso || 0,
      icon: UserPlus,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      description: 'Candidaturas activas',
    },
    {
      title: 'Empleados Activos',
      value: stats?.empleadosActivos || 0,
      icon: Building,
      color: 'text-slate-600',
      bgColor: 'bg-slate-100',
      description: 'Plantilla actual',
    },
    {
      title: 'Nóminas Pendientes',
      value: stats?.nominasPendientes || 0,
      icon: Receipt,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: 'Cierres pendientes',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-slate-600"></div>
      </div>
    );
  }

  const hasLeadsData = (stats?.leadsPorEstado || []).length > 0;
  const hasCandidatosData = (stats?.candidatosPorDepartamento || []).length > 0;
  const hasNominasData = (stats?.previsionesVsReal || []).length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-0.5">Bienvenido al panel de administración</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((stat) => (
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
              <p className="text-xs text-slate-400 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row - 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar Chart: Leads por Estado */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center gap-2">
            <BarChart3 className="h-4 w-4 text-slate-400" />
            <CardTitle className="text-base font-medium text-slate-900">
              Leads por Estado
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hasLeadsData ? (
              <ChartContainer config={leadsChartConfig} className="h-[220px] w-full">
                <BarChart data={stats?.leadsPorEstado} layout="vertical" margin={{ left: 0, right: 16 }}>
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="status" 
                    type="category" 
                    width={100}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="count" 
                    fill="hsl(var(--primary))" 
                    radius={[0, 4, 4, 0]}
                    maxBarSize={24}
                  />
                </BarChart>
              </ChartContainer>
            ) : (
              <EmptyChartState icon={BarChart3} message="Sin leads registrados" />
            )}
          </CardContent>
        </Card>

        {/* Donut Chart: Candidatos por Departamento */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center gap-2">
            <PieChartIcon className="h-4 w-4 text-slate-400" />
            <CardTitle className="text-base font-medium text-slate-900">
              Candidatos por Departamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hasCandidatosData ? (
              <ChartContainer config={{}} className="h-[220px] w-full">
                <PieChart>
                  <Pie
                    data={stats?.candidatosPorDepartamento}
                    dataKey="count"
                    nameKey="departamento"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {stats?.candidatosPorDepartamento.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={DEPARTMENT_COLORS[index % DEPARTMENT_COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent nameKey="departamento" />} />
                  <ChartLegend 
                    content={<ChartLegendContent nameKey="departamento" />} 
                    verticalAlign="bottom"
                  />
                </PieChart>
              </ChartContainer>
            ) : (
              <EmptyChartState icon={PieChartIcon} message="Sin candidatos registrados" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Area Chart: Previsiones vs Real - Full Width */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="flex flex-row items-center gap-2">
          <TrendingUp className="h-4 w-4 text-slate-400" />
          <div>
            <CardTitle className="text-base font-medium text-slate-900">
              Previsiones vs Gastos Reales
            </CardTitle>
            <CardDescription className="text-slate-500 text-xs mt-0.5">
              Comparativa mensual de costes de nómina
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {hasNominasData ? (
            <ChartContainer config={nominasChartConfig} className="h-[250px] w-full">
              <AreaChart data={stats?.previsionesVsReal} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradientPrevisto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gradientReal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142 76% 36%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(142 76% 36%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" vertical={false} />
                <XAxis 
                  dataKey="mes" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />} 
                  formatter={(value: number) => [`€${value.toLocaleString()}`, '']}
                />
                <Area 
                  type="monotone" 
                  dataKey="previsto" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  fill="url(#gradientPrevisto)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="real" 
                  stroke="hsl(142 76% 36%)" 
                  strokeWidth={2}
                  fill="url(#gradientReal)" 
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          ) : (
            <EmptyChartState icon={TrendingUp} message="Sin datos de nóminas" />
          )}
        </CardContent>
      </Card>

      {/* Bottom Row: Pending Drafts + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <PendingDraftsWidget />
        </div>

        {/* Notifications Panel */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-slate-400" />
              <CardTitle className="text-base font-medium text-slate-900">
                Notificaciones
              </CardTitle>
            </div>
            {(stats?.notificacionesNoLeidas || 0) > 0 && (
              <Badge className="bg-indigo-100 text-indigo-700 border-0 text-xs">
                {stats?.notificacionesNoLeidas} nuevas
              </Badge>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[280px]">
              {(stats?.notificaciones || []).length > 0 ? (
                stats?.notificaciones.map((notif) => (
                  <div 
                    key={notif.id}
                    className={cn(
                      "px-4 py-3 border-b border-slate-100 last:border-0",
                      "hover:bg-slate-50 transition-colors cursor-pointer",
                      !notif.read && "bg-indigo-50/50"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "p-2 rounded-lg shrink-0",
                        notif.type === 'info' && "bg-blue-100",
                        notif.type === 'success' && "bg-emerald-100",
                        notif.type === 'warning' && "bg-amber-100",
                        notif.type === 'error' && "bg-red-100",
                      )}>
                        <Bell className="h-3 w-3 text-slate-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {notif.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <Bell className="h-8 w-8 mb-2 opacity-30" />
                  <p className="text-sm font-medium">Sin notificaciones</p>
                  <p className="text-xs mt-1">Las notificaciones aparecerán aquí</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Empty state component for charts
interface EmptyChartStateProps {
  icon: React.ComponentType<{ className?: string }>;
  message: string;
}

const EmptyChartState = ({ icon: Icon, message }: EmptyChartStateProps) => (
  <div className="flex flex-col items-center justify-center h-[200px] text-slate-400">
    <Icon className="h-12 w-12 mb-3 opacity-30" />
    <p className="text-sm font-medium">{message}</p>
    <p className="text-xs mt-1">Los datos aparecerán cuando haya registros</p>
  </div>
);
