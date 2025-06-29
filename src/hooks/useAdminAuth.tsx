
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
    
    // Set up periodic session refresh
    const intervalId = setInterval(() => {
      refreshSession();
    }, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(intervalId);
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const email = localStorage.getItem("adminEmail");
      const sessionExpiry = localStorage.getItem("sessionExpiry");
      const authFlag = localStorage.getItem("isAuthenticated");

      if (token && email && authFlag === "true") {
        // Check if session is still valid
        if (sessionExpiry && Date.now() < parseInt(sessionExpiry)) {
          setIsAuthenticated(true);
          setAdminEmail(email);
          
          // Try to verify with Supabase if possible
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { data: isAdmin } = await supabase.rpc('is_admin', {
              user_id: session.user.id
            });
            
            if (isAdmin) {
              // Extend session
              extendSession();
            }
          }
        } else {
          // Session expired, clear auth
          clearAuth();
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      // Don't clear auth on network errors, just log them
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSession = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (token && isAuthenticated) {
        // Extend session expiry
        extendSession();
      }
    } catch (error) {
      console.error("Session refresh failed:", error);
    }
  };

  const extendSession = () => {
    const newExpiry = Date.now() + (8 * 60 * 60 * 1000); // 8 hours from now
    localStorage.setItem("sessionExpiry", newExpiry.toString());
  };

  const clearAuth = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("sessionExpiry");
    setIsAuthenticated(false);
    setAdminEmail('');
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuth();
      navigate('/admin/login');
    }
  };

  const requireAuth = () => {
    if (!isAuthenticated && !isLoading) {
      navigate('/admin/login');
      return false;
    }
    return true;
  };

  return {
    isAuthenticated,
    isLoading,
    adminEmail,
    logout,
    requireAuth,
    extendSession
  };
};
