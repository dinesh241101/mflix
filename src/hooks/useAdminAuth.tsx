
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
        if (event === 'SIGNED_OUT' || !session) {
          setIsAuthenticated(false);
          setAdminEmail("");
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminEmail");
          localStorage.removeItem("adminSessionActive");
          localStorage.removeItem("adminLastActivity");
        } else if (session?.user) {
          // Check if user is admin
          const { data: isAdmin } = await supabase.rpc('is_admin', {
            user_id: session.user.id
          });
          
          if (isAdmin) {
            setAdminEmail(session.user.email || "");
            setIsAuthenticated(true);
            updateActivity();
          }
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const email = localStorage.getItem("adminEmail");
      const sessionActive = localStorage.getItem("adminSessionActive");
      
      // For demo purposes, accept the demo credentials
      if (email === "dinesh001kaushik@gmail.com" && sessionActive === "true") {
        setAdminEmail(email);
        setIsAuthenticated(true);
        updateActivity();
        setLoading(false);
        return;
      }

      // Check session validity with Supabase
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session?.user) {
        console.log("No valid session found, redirecting to login");
        handleLogout();
        return;
      }

      // Verify admin role
      const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin', {
        user_id: session.user.id
      });

      if (adminError || !isAdmin) {
        console.log("Not authorized as admin");
        handleLogout();
        return;
      }

      setAdminEmail(session.user.email || "");
      setIsAuthenticated(true);
      updateActivity();
      
    } catch (error) {
      console.error("Auth error:", error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminSessionActive");
    localStorage.removeItem("adminLastActivity");
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
