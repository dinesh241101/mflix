
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
  }, []);

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
        const maxInactiveTime = 7 * 24 * 60 * 60 * 1000; // 7 days instead of 24 hours
        
        console.log("Session check:", { lastActivityTime, currentTime, timeDiff: currentTime - lastActivityTime });
        
        if (currentTime - lastActivityTime < maxInactiveTime) {
          setIsAuthenticated(true);
          setAdminEmail(email);
          
          // Update last activity on every check
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
    } finally {
      setIsLoading(false);
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

  // Update activity on any admin action - call this from components
  const updateActivity = () => {
    if (isAuthenticated) {
      const currentTime = Date.now();
      localStorage.setItem("adminLastActivity", currentTime.toString());
      console.log("Activity updated at:", new Date(currentTime));
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
