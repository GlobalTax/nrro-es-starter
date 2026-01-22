import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';

const SESSION_VERIFIED_KEY = 'navarro-session-verified';
const VERIFICATION_CACHE_MS = 5 * 60 * 1000; // 5 minutes

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'super_admin' | 'admin' | 'editor' | 'hr_viewer';
}

// Helper to get cached verification status
const getCachedVerification = (): boolean => {
  try {
    const cached = sessionStorage.getItem(SESSION_VERIFIED_KEY);
    if (cached) {
      const { verified, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < VERIFICATION_CACHE_MS) {
        return verified;
      }
    }
  } catch {
    // Ignore
  }
  return false;
};

// Helper to cache verification status
const setCachedVerification = (verified: boolean) => {
  try {
    sessionStorage.setItem(SESSION_VERIFIED_KEY, JSON.stringify({
      verified,
      timestamp: Date.now(),
    }));
  } catch {
    // Ignore
  }
};

// Clear cached verification
const clearCachedVerification = () => {
  try {
    sessionStorage.removeItem(SESSION_VERIFIED_KEY);
  } catch {
    // Ignore
  }
};

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const { isAdmin, hasRole } = useAdminAuth();
  const [isVerifying, setIsVerifying] = useState(!getCachedVerification());
  const [serverVerified, setServerVerified] = useState(getCachedVerification());
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Session timeout - 8 hours (full work day)
  const SESSION_TIMEOUT = 8 * 60 * 60 * 1000;

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
        console.warn('[PROTECTED_ROUTE] Session timeout due to inactivity (8h)');
        clearCachedVerification();
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
        setServerVerified(false);
        return;
      }

      // Skip if we have a recent cached verification
      if (getCachedVerification()) {
        setServerVerified(true);
        setIsVerifying(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('verify-admin-session');
        
        if (error) {
          // Network error - be tolerant, assume valid temporarily
          console.warn('[PROTECTED_ROUTE] Network error during verification, assuming valid');
          setServerVerified(true);
          // Don't cache this - retry on next navigation
        } else if (!data?.valid) {
          // Server explicitly said invalid - sign out
          console.warn('[PROTECTED_ROUTE] Server verification failed: session invalid');
          clearCachedVerification();
          await supabase.auth.signOut();
          setServerVerified(false);
        } else {
          // Valid session
          setServerVerified(true);
          setCachedVerification(true);
        }
      } catch (error) {
        // Catch-all for network errors - be tolerant
        console.error('[PROTECTED_ROUTE] Verification error (network?):', error);
        setServerVerified(true); // Assume valid on network errors
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
