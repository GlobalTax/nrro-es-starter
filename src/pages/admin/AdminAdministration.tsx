import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Bell, 
  Settings, 
  Wrench, 
  TrendingUp,
  Shield,
  AlertCircle,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  stats: { label: string; value: string | number }[];
  color: string;
}

export default function AdminAdministration() {
  // Fetch users count
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users-stats'],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id');
      if (error) throw error;
      
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role');
      
      const adminCount = roles?.filter(r => r.role === 'admin').length || 0;
      
      return {
        total: profiles?.length || 0,
        admins: adminCount,
      };
    },
  });

  // Fetch notifications count
  const { data: notificationsData, isLoading: notificationsLoading } = useQuery({
    queryKey: ['admin-notifications-stats'],
    queryFn: async () => {
      const { data: all, error } = await supabase
        .from('notifications')
        .select('id, read');
      if (error) throw error;
      
      const unread = all?.filter(n => !n.read).length || 0;
      
      return {
        total: all?.length || 0,
        unread,
      };
    },
  });

  // Fetch tools count
  const { data: toolsData, isLoading: toolsLoading } = useQuery({
    queryKey: ['admin-tools-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('internal_tools')
        .select('id, is_active, category');
      if (error) throw error;
      
      const active = data?.filter(t => t.is_active).length || 0;
      const categories = new Set(data?.map(t => t.category).filter(Boolean)).size;
      
      return {
        total: data?.length || 0,
        active,
        categories,
      };
    },
  });

  // Fetch settings count
  const { data: settingsData, isLoading: settingsLoading } = useQuery({
    queryKey: ['admin-settings-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('id, category');
      if (error) throw error;
      
      const categories = new Set(data?.map(s => s.category).filter(Boolean)).size;
      
      return {
        total: data?.length || 0,
        categories,
      };
    },
  });

  const isLoading = usersLoading || notificationsLoading || toolsLoading || settingsLoading;

  const cards: DashboardCard[] = [
    {
      title: 'Usuarios y Roles',
      description: 'Gestiona usuarios administradores y permisos',
      icon: <Users className="h-6 w-6" />,
      href: '/admin/users',
      stats: [
        { label: 'Total usuarios', value: usersData?.total || 0 },
        { label: 'Administradores', value: usersData?.admins || 0 },
      ],
      color: 'bg-indigo-500',
    },
    {
      title: 'Notificaciones',
      description: 'Centro de alertas y notificaciones del sistema',
      icon: <Bell className="h-6 w-6" />,
      href: '/admin/notifications',
      stats: [
        { label: 'Sin leer', value: notificationsData?.unread || 0 },
        { label: 'Totales', value: notificationsData?.total || 0 },
      ],
      color: 'bg-amber-500',
    },
    {
      title: 'Herramientas Internas',
      description: 'Hub de aplicaciones y herramientas del equipo',
      icon: <Wrench className="h-6 w-6" />,
      href: '/admin/hub',
      stats: [
        { label: 'Activas', value: toolsData?.active || 0 },
        { label: 'Categorías', value: toolsData?.categories || 0 },
      ],
      color: 'bg-emerald-500',
    },
    {
      title: 'Configuración del Sitio',
      description: 'Redes sociales, contacto, APIs y legal',
      icon: <Settings className="h-6 w-6" />,
      href: '/admin/settings',
      stats: [
        { label: 'Configuraciones', value: settingsData?.total || 0 },
        { label: 'Categorías', value: settingsData?.categories || 0 },
      ],
      color: 'bg-slate-600',
    },
    {
      title: 'Parámetros de Marketing',
      description: 'Templates de landing, UTMs y valores por defecto',
      icon: <TrendingUp className="h-6 w-6" />,
      href: '/admin/marketing-settings',
      stats: [
        { label: 'Templates', value: '-' },
        { label: 'Activos', value: '-' },
      ],
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium text-slate-900">Administración</h1>
        <p className="text-slate-500 text-sm mt-1">
          Configuración general del sistema y gestión de accesos
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Sistema operativo
        </Badge>
        <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
          <Shield className="h-3 w-3 mr-1" />
          {usersData?.admins || 0} administradores activos
        </Badge>
        {(notificationsData?.unread || 0) > 0 && (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            {notificationsData?.unread} notificaciones pendientes
          </Badge>
        )}
      </div>

      {/* Cards Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-lg bg-slate-100" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link key={card.href} to={card.href} className="group">
              <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200 h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className={`p-2.5 rounded-lg ${card.color} text-white`}>
                      {card.icon}
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <CardTitle className="text-lg font-medium text-slate-900 mt-3">
                    {card.title}
                  </CardTitle>
                  <p className="text-sm text-slate-500">{card.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-6">
                    {card.stats.map((stat, idx) => (
                      <div key={idx}>
                        <p className="text-2xl font-medium text-slate-900">{stat.value}</p>
                        <p className="text-xs text-slate-500">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Recent Activity Section */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-slate-900">
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">
            Las últimas acciones administrativas aparecerán aquí.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
