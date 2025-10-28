import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export const useAdminAuth = () => {
  const { adminUser, isAdmin } = useAuth();

  // Fetch user roles from user_roles table
  const { data: userRoles } = useQuery({
    queryKey: ['user-roles', adminUser?.user_id],
    queryFn: async () => {
      if (!adminUser?.user_id) return [];
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', adminUser.user_id);
      
      if (error) throw error;
      return data.map(r => r.role);
    },
    enabled: !!adminUser?.user_id,
  });

  const hasRole = (requiredRole: 'super_admin' | 'admin' | 'editor' | 'viewer') => {
    if (!adminUser || !userRoles) return false;
    
    // Map old role names to new enum values
    const roleMapping: Record<string, string> = {
      super_admin: 'admin',
      admin: 'admin',
      editor: 'editor',
      viewer: 'user',
    };

    const mappedRole = roleMapping[requiredRole];
    
    // Admin has all permissions
    if (userRoles.includes('admin')) return true;
    
    // Check if user has the required role
    if (userRoles.includes(mappedRole as any)) return true;
    
    return false;
  };

  const canEdit = () => {
    return isAdmin && hasRole('editor');
  };

  const canPublish = () => {
    return isAdmin && hasRole('admin');
  };

  const canDelete = () => {
    return isAdmin && hasRole('admin');
  };

  const canManageUsers = () => {
    return isAdmin && hasRole('super_admin');
  };

  const requireAdmin = () => {
    if (!isAdmin) {
      throw new Error('Admin access required');
    }
  };

  const requireSuperAdmin = () => {
    if (!hasRole('super_admin')) {
      throw new Error('Super admin access required');
    }
  };

  return {
    adminUser,
    isAdmin,
    hasRole,
    canEdit,
    canPublish,
    canDelete,
    canManageUsers,
    requireAdmin,
    requireSuperAdmin,
  };
};
