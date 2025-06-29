
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
    
    // Set up periodic session refresh every 30 seconds
    const intervalId = setInterval(() => {
      refreshSession();
    }, 30 * 1000);

    // Listen for storage changes (for multi-tab support)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'isAuthenticated' && e.newValue === 'false') {
        setIsAuthenticated(false);
        setAdminEmail('');
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const email = localStorage.getItem("adminEmail");
      const sessionExpiry = localStorage.getItem("sessionExpiry");
      const authFlag = localStorage.getItem("isAuthenticated");

      console.log("Checking auth status:", { token: !!token, email, authFlag, sessionExpiry });

      if (token && email && authFlag === "true" && sessionExpiry) {
        const expiryTime = parseInt(sessionExpiry);
        const currentTime = Date.now();
        
        console.log("Session check:", { expiryTime, currentTime, valid: currentTime < expiryTime });
        
        if (currentTime < expiryTime) {
          setIsAuthenticated(true);
          setAdminEmail(email);
          
          // Extend session on activity
          extendSession();
        } else {
          console.log("Session expired, clearing auth");
          clearAuth();
        }
      } else {
        console.log("No valid session found");
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      // Don't clear auth on errors, just log them
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSession = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const authFlag = localStorage.getItem("isAuthenticated");
      const sessionExpiry = localStorage.getItem("sessionExpiry");
      
      if (token && authFlag === "true" && sessionExpiry) {
        const expiryTime = parseInt(sessionExpiry);
        const currentTime = Date.now();
        
        // If session is about to expire in next 30 minutes, extend it
        if (currentTime > expiryTime - (30 * 60 * 1000)) {
          console.log("Extending session");
          extendSession();
        }
      }
    } catch (error) {
      console.error("Session refresh failed:", error);
    }
  };

  const extendSession = () => {
    const newExpiry = Date.now() + (24 * 60 * 60 * 1000); // 24 hours from now
    localStorage.setItem("sessionExpiry", newExpiry.toString());
    console.log("Session extended to:", new Date(newExpiry));
  };

  const clearAuth = () => {
    console.log("Clearing authentication");
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
