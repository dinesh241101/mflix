
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
    
    // Set up periodic session refresh every 5 minutes instead of 30 seconds
    const intervalId = setInterval(() => {
      refreshSession();
    }, 5 * 60 * 1000);

    // Listen for storage changes (for multi-tab support)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'adminSessionActive' && e.newValue === 'false') {
        setIsAuthenticated(false);
        setAdminEmail('');
      }
    };

    // Listen for page visibility changes to refresh session
    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated) {
        refreshSession();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated]);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const email = localStorage.getItem("adminEmail");
      const sessionActive = localStorage.getItem("adminSessionActive");
      const lastActivity = localStorage.getItem("adminLastActivity");

      console.log("Checking auth status:", { token: !!token, email, sessionActive, lastActivity });

      if (token && email && sessionActive === "true" && lastActivity) {
        const lastActivityTime = parseInt(lastActivity);
        const currentTime = Date.now();
        const maxInactiveTime = 24 * 60 * 60 * 1000; // 24 hours
        
        console.log("Session check:", { lastActivityTime, currentTime, timeDiff: currentTime - lastActivityTime });
        
        if (currentTime - lastActivityTime < maxInactiveTime) {
          setIsAuthenticated(true);
          setAdminEmail(email);
          
          // Update last activity
          localStorage.setItem("adminLastActivity", currentTime.toString());
        } else {
          console.log("Session expired due to inactivity, clearing auth");
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
      const sessionActive = localStorage.getItem("adminSessionActive");
      const lastActivity = localStorage.getItem("adminLastActivity");
      
      if (sessionActive === "true" && lastActivity) {
        const currentTime = Date.now();
        const lastActivityTime = parseInt(lastActivity);
        const timeSinceLastActivity = currentTime - lastActivityTime;
        
        // Only refresh if there's been recent activity (within 1 hour)
        if (timeSinceLastActivity < 60 * 60 * 1000) {
          localStorage.setItem("adminLastActivity", currentTime.toString());
          console.log("Session refreshed at:", new Date(currentTime));
        }
      }
    } catch (error) {
      console.error("Session refresh failed:", error);
    }
  };

  const clearAuth = () => {
    console.log("Clearing authentication");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminSessionActive");
    localStorage.removeItem("adminLastActivity");
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

  // Update activity on any admin action
  const updateActivity = () => {
    if (isAuthenticated) {
      localStorage.setItem("adminLastActivity", Date.now().toString());
    }
  };

  return {
    isAuthenticated,
    isLoading,
    adminEmail,
    logout,
    requireAuth,
    updateActivity
  };
};
