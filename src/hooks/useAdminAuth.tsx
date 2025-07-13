
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
    
    // Set up activity tracking
    const activityInterval = setInterval(() => {
      if (isAuthenticated) {
        localStorage.setItem("adminLastActivity", Date.now().toString());
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(activityInterval);
  }, [isAuthenticated]);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const email = localStorage.getItem("adminEmail");
      const sessionActive = localStorage.getItem("adminSessionActive");
      
      if (!token || sessionActive !== "true") {
        throw new Error("No valid session");
      }

      // Check session validity with Supabase
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("Invalid session");
      }

      // Verify admin role
      const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin', {
        user_id: user.id
      });

      if (adminError || !isAdmin) {
        throw new Error("Not authorized as admin");
      }

      // Update activity
      localStorage.setItem("adminLastActivity", Date.now().toString());
      
      setAdminEmail(email || user.email || "admin@example.com");
      setIsAuthenticated(true);
      
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
    navigate("/admin/login");
  };

  const updateActivity = () => {
    if (isAuthenticated) {
      localStorage.setItem("adminLastActivity", Date.now().toString());
    }
  };

  return {
    adminEmail,
    loading,
    isAuthenticated,
    handleLogout,
    updateActivity
  };
};
