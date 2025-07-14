
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
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const email = localStorage.getItem("adminEmail");
      const sessionActive = localStorage.getItem("adminSessionActive");
      
      if (!token || sessionActive !== "true") {
        console.log("No valid session found");
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      // For demo purposes, accept the demo credentials
      if (email === "dinesh001kaushik@gmail.com") {
        setAdminEmail(email);
        setIsAuthenticated(true);
        updateActivity();
        setLoading(false);
        return;
      }

      // Check session validity with Supabase
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.log("Invalid Supabase session");
        handleLogout();
        return;
      }

      // Verify admin role
      const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin', {
        user_id: user.id
      });

      if (adminError || !isAdmin) {
        console.log("Not authorized as admin");
        handleLogout();
        return;
      }

      setAdminEmail(email || user.email || "admin@example.com");
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
