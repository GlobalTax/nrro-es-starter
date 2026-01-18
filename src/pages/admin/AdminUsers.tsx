import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { 
  UserPlus, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Edit, 
  Ban, 
  CheckCircle,
  Search,
  Users,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';

type AdminRole = 'super_admin' | 'admin' | 'editor' | 'viewer' | 'hr_manager' | 'hr_viewer' | 'marketing';

interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: AdminRole;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

const roleConfig: Record<AdminRole, { icon: React.ElementType; label: string; color: string }> = {
  super_admin: { icon: ShieldAlert, label: 'Super Admin', color: 'bg-red-50 text-red-700 border-red-200' },
  admin: { icon: ShieldCheck, label: 'Admin', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  hr_manager: { icon: Users, label: 'HR Manager', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  hr_viewer: { icon: Users, label: 'HR Viewer', color: 'bg-purple-50 text-purple-600 border-purple-200' },
  marketing: { icon: Edit, label: 'Marketing', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  editor: { icon: Edit, label: 'Editor', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  viewer: { icon: Shield, label: 'Viewer', color: 'bg-slate-50 text-slate-700 border-slate-200' },
};

export const AdminUsers = () => {
  const { canManageUsers } = useAdminAuth();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<AdminRole>('editor');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Fetch admin users
  const { data: adminUsers, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profilesError) throw profilesError;

      const usersWithRoles = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', profile.id);

          const roleValue = roles?.[0]?.role as string;
          const role = roleValue === 'admin' ? 'admin' : 
                      roleValue === 'moderator' ? 'editor' : 'viewer';

          return {
            id: profile.id,
            user_id: profile.id,
            email: profile.email || '',
            full_name: profile.email?.split('@')[0] || 'Unknown',
            role: role as AdminRole,
            is_active: true,
            last_login: null,
            created_at: profile.created_at || new Date().toISOString(),
          };
        })
      );

      return usersWithRoles as AdminUser[];
    },
  });

  // Filtered users
  const filteredUsers = useMemo(() => {
    if (!adminUsers) return [];
    return adminUsers.filter((user) => {
      const matchesSearch = !searchQuery || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.full_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [adminUsers, searchQuery, roleFilter]);

  // Stats
  const stats = useMemo(() => {
    if (!adminUsers) return { total: 0, admins: 0, editors: 0, viewers: 0 };
    return {
      total: adminUsers.length,
      admins: adminUsers.filter(u => u.role === 'admin' || u.role === 'super_admin').length,
      editors: adminUsers.filter(u => u.role === 'editor' || u.role === 'marketing').length,
      viewers: adminUsers.filter(u => u.role === 'viewer').length,
    };
  }, [adminUsers]);

  // Create admin user mutation
  const createAdminMutation = useMutation({
    mutationFn: async (userData: { email: string; full_name: string; role: AdminRole }) => {
      const newUserId = crypto.randomUUID();
      
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: newUserId,
          email: userData.email,
          created_at: new Date().toISOString(),
        });

      if (profileError) throw new Error('Error al crear perfil: ' + profileError.message);

      const roleMapping: Record<AdminRole, string> = {
        super_admin: 'admin',
        admin: 'admin',
        hr_manager: 'admin',
        hr_viewer: 'moderator',
        marketing: 'moderator',
        editor: 'moderator',
        viewer: 'user',
      };

      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: newUserId,
          role: roleMapping[userData.role] as any,
        });

      if (roleError) {
        await supabase.from('profiles').delete().eq('id', newUserId);
        throw new Error('Error al asignar rol: ' + roleError.message);
      }

      return { user_id: newUserId, email: userData.email };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setIsCreateDialogOpen(false);
      setNewUserEmail('');
      setNewUserName('');
      setNewUserRole('editor');
      toast.success(`Usuario ${data.email} pre-registrado correctamente`);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: AdminRole }) => {
      const roleMapping: Record<AdminRole, string> = {
        super_admin: 'admin',
        admin: 'admin',
        hr_manager: 'admin',
        hr_viewer: 'moderator',
        marketing: 'moderator',
        editor: 'moderator',
        viewer: 'user',
      };

      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: roleMapping[newRole] as any });

      if (insertError) throw insertError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Rol actualizado correctamente');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  // Bulk role assignment
  const bulkUpdateRoleMutation = useMutation({
    mutationFn: async ({ userIds, newRole }: { userIds: string[]; newRole: AdminRole }) => {
      const roleMapping: Record<AdminRole, string> = {
        super_admin: 'admin',
        admin: 'admin',
        hr_manager: 'admin',
        hr_viewer: 'moderator',
        marketing: 'moderator',
        editor: 'moderator',
        viewer: 'user',
      };

      for (const userId of userIds) {
        await supabase.from('user_roles').delete().eq('user_id', userId);
        await supabase.from('user_roles').insert({ user_id: userId, role: roleMapping[newRole] as any });
      }
    },
    onSuccess: (_, { userIds, newRole }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setSelectedUsers([]);
      toast.success(`Rol actualizado para ${userIds.length} usuarios`);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map(u => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, id]);
    } else {
      setSelectedUsers(prev => prev.filter(i => i !== id));
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (!canManageUsers()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <ShieldAlert className="h-16 w-16 text-red-500" />
        <h2 className="text-2xl font-medium text-slate-900">Acceso Denegado</h2>
        <p className="text-slate-500">Solo los super administradores pueden gestionar usuarios.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium text-slate-900">Usuarios y Roles</h1>
          <p className="text-slate-500 text-sm mt-1">
            Gestiona los usuarios administradores del sistema
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-slate-900 hover:bg-slate-800">
              <UserPlus className="h-4 w-4 mr-2" />
              Crear Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Pre-registrar Nuevo Usuario</DialogTitle>
              <DialogDescription>
                Autoriza un email para que pueda registrarse en /admin/login
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@example.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="border-slate-200"
                />
              </div>
              <div>
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  placeholder="Juan Pérez"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="border-slate-200"
                />
              </div>
              <div>
                <Label htmlFor="role">Rol</Label>
                <Select value={newUserRole} onValueChange={(value) => setNewUserRole(value as AdminRole)}>
                  <SelectTrigger className="border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer (Solo lectura)</SelectItem>
                    <SelectItem value="editor">Editor (Crear/Editar)</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="hr_viewer">HR Viewer</SelectItem>
                    <SelectItem value="hr_manager">HR Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                className="w-full bg-slate-900 hover:bg-slate-800" 
                onClick={() => {
                  if (newUserEmail && newUserName) {
                    createAdminMutation.mutate({ email: newUserEmail, full_name: newUserName, role: newUserRole });
                  } else {
                    toast.error('Completa todos los campos');
                  }
                }}
                disabled={createAdminMutation.isPending}
              >
                {createAdminMutation.isPending ? 'Creando...' : 'Crear Usuario'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium text-slate-900">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Administradores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium text-indigo-600">{stats.admins}</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Editores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium text-slate-900">{stats.editors}</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Viewers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium text-slate-900">{stats.viewers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <span className="text-sm font-medium text-indigo-900">
            {selectedUsers.length} usuarios seleccionados
          </span>
          <Select onValueChange={(value) => bulkUpdateRoleMutation.mutate({ userIds: selectedUsers, newRole: value as AdminRole })}>
            <SelectTrigger className="w-44 bg-white border-indigo-200">
              <SelectValue placeholder="Asignar rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="viewer">Viewer</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="hr_viewer">HR Viewer</SelectItem>
              <SelectItem value="hr_manager">HR Manager</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedUsers([])}
            className="text-slate-600"
          >
            Cancelar
          </Button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Buscar usuarios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 border-slate-200"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[150px] border-slate-200">
            <Filter className="h-4 w-4 mr-2 text-slate-400" />
            <SelectValue placeholder="Rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="super_admin">Super Admin</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="hr_manager">HR Manager</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="border-0 shadow-sm bg-white">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full bg-slate-100" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 border-b border-slate-100">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Último Acceso</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const config = roleConfig[user.role];
                  const RoleIcon = config.icon;
                  return (
                    <TableRow key={user.id} className="border-b border-slate-50">
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={(checked) => handleSelectOne(user.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-slate-100 text-slate-600 text-sm">
                              {getInitials(user.full_name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-slate-900">{user.full_name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={config.color}>
                          <RoleIcon className="h-3 w-3 mr-1" />
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.is_active ? (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Activo
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            <Ban className="h-3 w-3 mr-1" />
                            Inactivo
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {user.last_login 
                          ? format(new Date(user.last_login), 'dd/MM/yyyy HH:mm')
                          : 'Nunca'}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onValueChange={(value) => updateRoleMutation.mutate({
                            userId: user.user_id,
                            newRole: value as AdminRole
                          })}
                          disabled={!user.is_active}
                        >
                          <SelectTrigger className="w-[140px] border-slate-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="viewer">Viewer</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="hr_viewer">HR Viewer</SelectItem>
                            <SelectItem value="hr_manager">HR Manager</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="super_admin">Super Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
