import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Shield, ShieldAlert, ShieldCheck, Edit, Ban, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

type AdminRole = 'super_admin' | 'admin' | 'editor' | 'viewer';

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

const roleIcons = {
  super_admin: ShieldAlert,
  admin: ShieldCheck,
  editor: Edit,
  viewer: Shield,
};

const roleLabels = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  editor: 'Editor',
  viewer: 'Viewer',
};

export const AdminUsers = () => {
  const { canManageUsers } = useAdminAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<AdminRole>('editor');

  // Fetch admin users from profiles with their roles from user_roles table
  const { data: adminUsers, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      // First get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profilesError) throw profilesError;

      // Then get roles for each user
      const usersWithRoles = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: roles, error: rolesError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', profile.id);

          if (rolesError) throw rolesError;

          // Map the first role to the old format for compatibility
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

  // Create admin user mutation - Simplified version
  const createAdminMutation = useMutation({
    mutationFn: async (userData: { email: string; full_name: string; role: AdminRole }) => {
      // Generate unique ID for new user
      const newUserId = crypto.randomUUID();
      
      // 1. Insert into profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: newUserId,
          email: userData.email,
          created_at: new Date().toISOString(),
        });

      if (profileError) throw new Error('Error al crear perfil: ' + profileError.message);

      // 2. Map role to database enum
      const roleMapping: Record<AdminRole, string> = {
        super_admin: 'admin',
        admin: 'admin',
        editor: 'moderator',
        viewer: 'user',
      };

      // 3. Insert role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: newUserId,
          role: roleMapping[userData.role] as any,
        });

      if (roleError) {
        // Rollback: delete profile if role assignment fails
        await supabase.from('profiles').delete().eq('id', newUserId);
        throw new Error('Error al asignar rol: ' + roleError.message);
      }

      return { 
        user_id: newUserId, 
        email: userData.email,
        full_name: userData.full_name 
      };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setIsCreateDialogOpen(false);
      setNewUserEmail('');
      setNewUserName('');
      setNewUserRole('editor');
      
      toast({
        title: 'Usuario pre-registrado',
        description: `Email ${data.email} autorizado. El usuario puede completar su registro en /admin/login.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error al crear usuario',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: AdminRole }) => {
      // Map old role to new enum
      const roleMapping: Record<AdminRole, string> = {
        super_admin: 'admin',
        admin: 'admin',
        editor: 'moderator',
        viewer: 'user',
      };

      const mappedRole = roleMapping[newRole];

      // First, delete existing roles for this user
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      // Then insert the new role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: mappedRole as any });

      if (insertError) throw insertError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: 'Rol actualizado',
        description: 'El rol del usuario ha sido actualizado exitosamente',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Deactivate user mutation - not implemented yet
  const deactivateUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      toast({
        title: 'Feature not implemented',
        description: 'User deactivation requires Supabase Auth changes',
        variant: 'destructive',
      });
      throw new Error('Not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: 'Usuario desactivado',
        description: 'El usuario ha sido desactivado exitosamente',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  if (!canManageUsers()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <ShieldAlert className="h-16 w-16 text-destructive" />
        <h2 className="text-2xl font-bold">Acceso Denegado</h2>
        <p className="text-muted-foreground">Solo los super administradores pueden gestionar usuarios.</p>
      </div>
    );
  }

  const handleCreateUser = () => {
    if (!newUserEmail || !newUserName) {
      toast({
        title: 'Error',
        description: 'Por favor completa todos los campos',
        variant: 'destructive',
      });
      return;
    }

    createAdminMutation.mutate({
      email: newUserEmail,
      full_name: newUserName,
      role: newUserRole,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-normal">Usuarios Admin</h1>
          <p className="text-muted-foreground mt-1">Gestiona los usuarios administradores del sistema</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Crear Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Pre-registrar Nuevo Usuario</DialogTitle>
              <DialogDescription>
                Autoriza un email para que pueda registrarse en /admin/login. El usuario creará su propia contraseña al registrarse.
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
                />
              </div>
              <div>
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  placeholder="Juan Pérez"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="role">Rol</Label>
                <Select value={newUserRole} onValueChange={(value) => setNewUserRole(value as AdminRole)}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer (Solo lectura)</SelectItem>
                    <SelectItem value="editor">Editor (Crear/Editar)</SelectItem>
                    <SelectItem value="admin">Admin (Publicar/Eliminar)</SelectItem>
                    <SelectItem value="super_admin">Super Admin (Todo)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                className="w-full" 
                onClick={handleCreateUser}
                disabled={createAdminMutation.isPending}
              >
                {createAdminMutation.isPending ? 'Creando...' : 'Crear Usuario'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios Registrados</CardTitle>
          <CardDescription>
            {adminUsers?.length || 0} usuarios administradores en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Último Acceso</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminUsers?.map((user) => {
                  const RoleIcon = roleIcons[user.role];
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.full_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'super_admin' ? 'default' : 'secondary'}>
                          <RoleIcon className="h-3 w-3 mr-1" />
                          {roleLabels[user.role]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.is_active ? (
                          <Badge variant="default">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Activo
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <Ban className="h-3 w-3 mr-1" />
                            Inactivo
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.last_login 
                          ? format(new Date(user.last_login), 'dd/MM/yyyy HH:mm')
                          : 'Nunca'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Select
                            value={user.role}
                            onValueChange={(value) => updateRoleMutation.mutate({
                              userId: user.user_id,
                              newRole: value as AdminRole
                            })}
                            disabled={!user.is_active}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="viewer">Viewer</SelectItem>
                              <SelectItem value="editor">Editor</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="super_admin">Super Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          {user.is_active && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deactivateUserMutation.mutate(user.user_id)}
                              disabled={deactivateUserMutation.isPending}
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
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
