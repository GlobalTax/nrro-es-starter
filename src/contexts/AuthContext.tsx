import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type AdminRole = 'super_admin' | 'admin' | 'editor' | 'viewer';

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

  const fetchAdminUser = async (userId: string): Promise<AdminUser | null> => {
    try {
      // Use profiles table with role check instead of admin_users
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data && data.role === 'admin') {
        const adminUserData: AdminUser = {
          id: data.id,
          user_id: data.id,
          email: data.email || '',
          full_name: data.email || '',
          role: 'admin',
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
        fetchAdminUser(session.user.id);
      } else {
        setAdminUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
