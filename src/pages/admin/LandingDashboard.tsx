import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLandingStats } from '@/hooks/useLandingStats';
import { useLandingPages } from '@/hooks/useLandingPages';
import { LandingStatusBadge } from '@/components/admin/landings/LandingStatusBadge';
import { LandingCategoryBadge } from '@/components/admin/landings/LandingCategoryBadge';
import { LayoutGrid, CheckCircle2, Tag, Calendar, ArrowRight, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CATEGORY_COLORS: Record<string, string> = {
  'Tax': '#0D3B66',
  'Legal': '#166534',
  'M&A': '#EA580C',
  'Corporate': '#1F2937',
  'Payroll': '#7C3AED',
  'International': '#0891B2',
  'Family Business': '#DC2626',
  'Contact': '#059669',
  'Other': '#6B7280',
};

const STATUS_COLORS: Record<string, string> = {
  'published': '#059669',
  'draft': '#6B7280',
  'needs_review': '#EA580C',
  'archived': '#DC2626',
};

const MetricCard = ({ 
  icon: Icon, 
  label, 
  value, 
  description, 
  color = 'bg-primary/10 text-primary' 
}: {
  icon: any;
  label: string;
  value: number;
  description: string;
  color?: string;
}) => (
  <Card className="bg-white shadow-sm border-gray-100 hover:shadow-md transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
          <p className="text-4xl font-bold text-foreground mb-1">{value}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const LandingDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useLandingStats();
  const { data: recentLandings, isLoading: landingsLoading } = useLandingPages({
    status: '',
    search: '',
    category: '',
  });

  // Preparar datos para gráficos
  const categoryData = stats?.byCategory 
    ? Object.entries(stats.byCategory)
        .map(([name, value]) => ({ name, value, fill: CATEGORY_COLORS[name] || '#6B7280' }))
        .sort((a, b) => b.value - a.value)
    : [];

  const statusData = stats?.byStatus
    ? Object.entries(stats.byStatus).map(([name, value]) => ({
        name: name === 'published' ? 'Active' : name === 'draft' ? 'Draft' : name === 'needs_review' ? 'Needs Review' : 'Archived',
        value,
        fill: STATUS_COLORS[name] || '#6B7280',
      }))
    : [];

  const totalForDonut = statusData.reduce((acc, curr) => acc + curr.value, 0);

  if (statsLoading || landingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-normal text-foreground">Landing Dashboard</h1>
          <p className="text-muted-foreground mt-1">Resumen y métricas de todas las landing pages</p>
        </div>
        <Button asChild>
          <Link to="/admin/landings">
            Ir al Landing Control Center
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={LayoutGrid}
          label="Total Landings"
          value={stats?.total || 0}
          description="páginas creadas"
          color="bg-blue-50 text-blue-600"
        />
        <MetricCard
          icon={CheckCircle2}
          label="Activas"
          value={stats?.active || 0}
          description="publicadas y activas"
          color="bg-green-50 text-green-600"
        />
        <MetricCard
          icon={Tag}
          label="Categorías"
          value={stats?.uniqueCategories || 0}
          description="categorías diferentes"
          color="bg-orange-50 text-orange-600"
        />
        <MetricCard
          icon={Calendar}
          label="Este Mes"
          value={stats?.thisMonth || 0}
          description="creadas este mes"
          color="bg-cyan-50 text-cyan-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Chart */}
        <Card className="bg-white shadow-sm border-gray-100">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Distribución por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData} layout="vertical" margin={{ left: 100, right: 20, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={90} style={{ fontSize: '12px' }} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Chart */}
        <Card className="bg-white shadow-sm border-gray-100">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-4">
              <p className="text-3xl font-bold text-foreground">{totalForDonut}</p>
              <p className="text-sm text-muted-foreground">Total Landings</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Latest Landings Table */}
      <Card className="bg-white shadow-sm border-gray-100">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Últimas 10 Landing Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Creada</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentLandings?.slice(0, 10).map((landing) => (
                <TableRow key={landing.id}>
                  <TableCell className="font-medium">{landing.title}</TableCell>
                  <TableCell>
                    <LandingCategoryBadge category={landing.category || 'Other'} />
                  </TableCell>
                  <TableCell>
                    <LandingStatusBadge status={landing.status || 'draft'} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {landing.created_at
                      ? formatDistanceToNow(new Date(landing.created_at), {
                          addSuffix: true,
                          locale: es,
                        })
                      : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link to={`/admin/landings/${landing.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LandingDashboard;
