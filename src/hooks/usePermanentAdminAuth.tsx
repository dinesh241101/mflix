import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Permanent admin credentials - cannot be logged out
const PERMANENT_ADMIN_EMAIL = "admin@mflix.com";
const PERMANENT_ADMIN_PASSWORD = "MFlix2025@Admin!";

export const usePermanentAdminAuth = () => {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
    
    // Monitor session but prevent logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event);
        
        if (event === 'SIGNED_OUT') {
          // Prevent logout - automatically re-login
          console.log("Preventing logout - re-authenticating...");
          await autoLogin();
        } else if (session?.user) {
          await verifyAdminAccess(session.user.id, session.user.email || '');
        }
        setLoading(false);
      }
    );

    // Prevent browser back/refresh logout
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isAuthenticated) {
        e.preventDefault();
        e.returnValue = 'Admin session is active. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isAuthenticated]);

  const checkAuth = async () => {
    try {
      // Check if admin session exists
      const adminSession = localStorage.getItem("permanentAdminSession");
      const sessionTimestamp = localStorage.getItem("adminSessionTimestamp");
      
      if (adminSession && sessionTimestamp) {
        console.log("Found permanent admin session");
        setAdminEmail(PERMANENT_ADMIN_EMAIL);
        setIsAuthenticated(true);
        updateSessionTimestamp();
        return;
      }

      // Check Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await verifyAdminAccess(session.user.id, session.user.email || '');
      } else {
        console.log("No session found, redirecting to login");
        navigate("/admin/login");
      }
      
    } catch (error) {
      console.error("Auth check error:", error);
      navigate("/admin/login");
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
        navigate("/admin/login");
        return;
      }

      console.log("Admin access verified");
      setIsAuthenticated(true);
      setAdminEmail(email);
      setPermanentSession(email);
      
    } catch (error) {
      console.error("Error verifying admin access:", error);
      navigate("/admin/login");
    }
  };

  const autoLogin = async () => {
    try {
      console.log("Auto-login initiated...");
      const { error } = await supabase.auth.signInWithPassword({
        email: PERMANENT_ADMIN_EMAIL,
        password: PERMANENT_ADMIN_PASSWORD,
      });

      if (error) {
        console.error("Auto-login failed:", error);
        // Fallback to manual login page
        navigate("/admin/login");
      }
    } catch (error) {
      console.error("Auto-login error:", error);
      navigate("/admin/login");
    }
  };

  const setPermanentSession = (email: string) => {
    const timestamp = Date.now();
    localStorage.setItem("permanentAdminSession", "active");
    localStorage.setItem("adminEmail", email);
    localStorage.setItem("adminSessionTimestamp", timestamp.toString());
  };

  const updateSessionTimestamp = () => {
    localStorage.setItem("adminSessionTimestamp", Date.now().toString());
  };

  const secureLogin = async (email: string, password: string) => {
    try {
      // Only accept the permanent admin credentials
      if (email !== PERMANENT_ADMIN_EMAIL || password !== PERMANENT_ADMIN_PASSWORD) {
        return { 
          success: false, 
          error: 'Invalid admin credentials. Contact system administrator.' 
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: PERMANENT_ADMIN_EMAIL,
        password: PERMANENT_ADMIN_PASSWORD,
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

      setPermanentSession(PERMANENT_ADMIN_EMAIL);
      return { success: true, error: null };

    } catch (error) {
      console.error("Secure login error:", error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  // Disabled logout function - admin cannot logout
  const handleLogout = () => {
    toast({
      title: "Logout Disabled",
      description: "Admin session is permanent for security. Contact system administrator to end session.",
      variant: "destructive"
    });
  };

  return {
    isAuthenticated,
    adminEmail,
    loading,
    secureLogin,
    handleLogout, // This will show a warning instead of logging out
    updateSessionTimestamp,
    // Expose credentials for login form
    PERMANENT_ADMIN_EMAIL,
    PERMANENT_ADMIN_PASSWORD
  };
};