
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useAdminAuth = () => {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
    
    // Set up session monitoring
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event, session?.user?.email);
        
        if (event === 'SIGNED_OUT' || !session) {
          setIsAuthenticated(false);
          setAdminEmail("");
          clearAdminSession();
        } else if (session?.user) {
          // Check if user is admin
          try {
            const { data: isAdmin } = await supabase.rpc('is_admin', {
              user_id: session.user.id
            });
            
            if (isAdmin) {
              setAdminEmail(session.user.email || "");
              setIsAuthenticated(true);
              setAdminSession(session.user.email || "");
              updateActivity();
            } else {
              console.log("User is not admin");
              handleLogout();
            }
          } catch (error) {
            console.error("Error checking admin status:", error);
          }
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    try {
      console.log("Checking authentication...");
      
      // Check for demo credentials first
      const storedEmail = localStorage.getItem("adminEmail");
      const sessionActive = localStorage.getItem("adminSessionActive");
      
      if (storedEmail === "dinesh001kaushik@gmail.com" && sessionActive === "true") {
        console.log("Demo credentials found, authenticating...");
        setAdminEmail(storedEmail);
        setIsAuthenticated(true);
        updateActivity();
        setLoading(false);
        return;
      }

      // Check Supabase session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Session error:", error);
        handleLogout();
        return;
      }

      if (!session?.user) {
        console.log("No active session found");
        handleLogout();
        return;
      }

      // Verify admin role
      const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin', {
        user_id: session.user.id
      });

      if (adminError) {
        console.error("Admin check error:", adminError);
        handleLogout();
        return;
      }

      if (!isAdmin) {
        console.log("User is not an admin");
        handleLogout();
        return;
      }

      console.log("Admin authenticated via Supabase");
      setAdminEmail(session.user.email || "");
      setIsAuthenticated(true);
      setAdminSession(session.user.email || "");
      updateActivity();
      
    } catch (error) {
      console.error("Auth check error:", error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const setAdminSession = (email: string) => {
    const currentTime = Date.now();
    localStorage.setItem("adminToken", `admin-${currentTime}`);
    localStorage.setItem("adminEmail", email);
    localStorage.setItem("adminSessionActive", "true");
    localStorage.setItem("adminLastActivity", currentTime.toString());
  };

  const clearAdminSession = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminSessionActive");
    localStorage.removeItem("adminLastActivity");
  };

  const handleLogout = () => {
    console.log("Logging out admin...");
    clearAdminSession();
    setIsAuthenticated(false);
    setAdminEmail("");
    supabase.auth.signOut();
    navigate("/admin/login");
  };

  const updateActivity = () => {
    localStorage.setItem("adminLastActivity", Date.now().toString());
  };

  return {
    adminEmail,
    loading,
    isAuthenticated,
    handleLogout,
    updateActivity
  };
};
