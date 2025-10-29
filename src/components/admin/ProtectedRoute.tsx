import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'super_admin' | 'admin' | 'editor';
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const { isAdmin, hasRole } = useAdminAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [serverVerified, setServerVerified] = useState(false);

  useEffect(() => {
    const verifySession = async () => {
      if (!user) {
        setIsVerifying(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('verify-admin-session');
        
        if (error || !data?.valid) {
          console.warn('[PROTECTED_ROUTE] Server verification failed');
          await supabase.auth.signOut();
          setServerVerified(false);
        } else {
          setServerVerified(true);
        }
      } catch (error) {
        console.error('[PROTECTED_ROUTE] Verification error:', error);
        setServerVerified(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifySession();
  }, [user]);

  if (isLoading || isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !serverVerified) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
        <p className="text-muted-foreground">You don't have permission to access the admin panel.</p>
      </div>
    );
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold text-destructive">Insufficient Permissions</h1>
        <p className="text-muted-foreground">You don't have the required role to access this section.</p>
      </div>
    );
  }

  return <>{children}</>;
};
