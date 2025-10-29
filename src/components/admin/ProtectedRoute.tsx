import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'super_admin' | 'admin' | 'editor' | 'hr_viewer';
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const { isAdmin, hasRole } = useAdminAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [serverVerified, setServerVerified] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Session timeout (30 minutes)
  const SESSION_TIMEOUT = 30 * 60 * 1000;

  // Track user activity
  useEffect(() => {
    const updateActivity = () => setLastActivity(Date.now());
    
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, updateActivity));
    
    return () => {
      events.forEach(event => window.removeEventListener(event, updateActivity));
    };
  }, []);

  // Check for inactivity timeout
  useEffect(() => {
    const checkTimeout = setInterval(() => {
      if (Date.now() - lastActivity > SESSION_TIMEOUT) {
        console.warn('[PROTECTED_ROUTE] Session timeout due to inactivity');
        supabase.auth.signOut();
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkTimeout);
  }, [lastActivity]);

  // Initial and periodic session verification
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

    // Revalidate session every 5 minutes
    const revalidationInterval = setInterval(verifySession, 5 * 60 * 1000);

    return () => clearInterval(revalidationInterval);
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
