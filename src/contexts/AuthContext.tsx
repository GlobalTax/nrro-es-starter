import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type AdminRole = 'super_admin' | 'admin' | 'editor' | 'viewer' | 'hr_viewer';

interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: AdminRole;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  adminUser: AdminUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [revalidationInterval, setRevalidationInterval] = useState<number | null>(null);

  const fetchAdminUser = async (userId: string): Promise<AdminUser | null> => {
    try {
      // Check if user has any admin panel roles by querying user_roles directly
      const { data: userRoles, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (roleError) throw roleError;

      const roles = userRoles?.map(r => r.role) || [];
      const hasPanelAccess = roles.some(r => ['admin', 'editor', 'marketing', 'hr_viewer'].includes(r));

      if (hasPanelAccess) {
        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (profileError) throw profileError;

        const adminUserData: AdminUser = {
          id: profile.id,
          user_id: profile.id,
          email: profile.email || '',
          full_name: profile.email || '',
          role: roles.includes('admin') ? 'admin' : 'editor',
          is_active: true,
        };
        setAdminUser(adminUserData);
        return adminUserData;
      }
    } catch (err) {
      console.warn('Error fetching admin user:', err);
    }
    setAdminUser(null);
    return null;
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchAdminUser(session.user.id);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        // Defer fetchAdminUser to avoid deadlock
        setTimeout(() => {
          fetchAdminUser(session.user.id);
        }, 0);
      } else {
        setAdminUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Setup periodic session revalidation (every 5 minutes)
  useEffect(() => {
    if (!user) return;

    const interval = window.setInterval(async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.warn('[AUTH] Session expired, signing out');
          await signOut();
        } else {
          // Refresh admin user data during revalidation
          await fetchAdminUser(session.user.id);
        }
      } catch (error) {
        console.error('[AUTH] Session revalidation error:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes

    setRevalidationInterval(interval);

    return () => {
      if (revalidationInterval) {
        clearInterval(revalidationInterval);
      }
    };
  }, [user]);

  // Setup realtime subscription for role changes
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('user_roles_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_roles',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          console.log('[AUTH] User roles changed, refreshing admin data');
          setTimeout(() => {
            fetchAdminUser(user.id);
          }, 0);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const signIn = async (email: string, password: string) => {
    try {
      // Intentar con edge function primero usando supabase.functions.invoke
      try {
        const { data, error: functionError } = await supabase.functions.invoke('admin-auth', {
          body: { email, password },
        });

        if (!functionError && data) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          });

          if (sessionError) throw sessionError;
          setAdminUser(data.adminUser);
          return;
        }
      } catch (functionError) {
        console.log('Edge Function not available, using fallback authentication');
      }

      // Si falla, intentar con supabase auth directamente
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Verificar que es admin
      const adminData = await fetchAdminUser(authData.user.id);
      
      if (!adminData) {
        await supabase.auth.signOut();
        throw new Error('Access denied: Not an admin user');
      }

      setAdminUser(adminData);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        adminUser,
        isAdmin: !!adminUser,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
