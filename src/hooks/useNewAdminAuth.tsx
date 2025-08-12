
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Admin credentials
const ADMIN_EMAIL = "admin@mflix.com";
const ADMIN_PASSWORD = "MFlix2025@Admin!";

export const useNewAdminAuth = () => {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event);
        
        if (event === 'SIGNED_OUT' || !session) {
          handleLogout();
        } else if (session?.user) {
          await verifyAdminAccess(session.user.id, session.user.email || '');
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        console.log("No active session found");
        setIsAuthenticated(false);
        setAdminEmail("");
        setLoading(false);
        return;
      }

      await verifyAdminAccess(session.user.id, session.user.email || '');
      
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
      setAdminEmail("");
    } finally {
      setLoading(false);
    }
  };

  const verifyAdminAccess = async (userId: string, email: string) => {
    try {
      const { data: isAdmin, error } = await supabase.rpc('is_admin', {
        user_id: userId
      });

      if (error || !isAdmin) {
        console.log("User is not an admin");
        setIsAuthenticated(false);
        setAdminEmail("");
        return;
      }

      console.log("Admin access verified");
      setIsAuthenticated(true);
      setAdminEmail(email);
      
    } catch (error) {
      console.error("Error verifying admin access:", error);
      setIsAuthenticated(false);
      setAdminEmail("");
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Validate credentials
      if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
        return { 
          success: false, 
          error: 'Invalid admin credentials' 
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        return { success: false, error: 'Authentication failed' };
      }

      if (!data.user) {
        return { success: false, error: 'Authentication failed' };
      }

      // Verify admin status
      const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin', {
        user_id: data.user.id
      });

      if (adminError || !isAdmin) {
        await supabase.auth.signOut();
        return { 
          success: false, 
          error: 'Admin privileges required' 
        };
      }

      return { success: true, error: null };

    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setAdminEmail("");
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate('/crm-admin/login', { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to logout properly.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    logout();
  };

  return {
    isAuthenticated,
    adminEmail,
    loading,
    login,
    logout: handleLogout,
    ADMIN_EMAIL,
    ADMIN_PASSWORD
  };
};
