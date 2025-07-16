
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { LoaderCircle, AtSign, Lock, KeyRound, Eye, EyeOff, Shield } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import MFlixLogo from "@/components/MFlixLogo";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("dinesh001kaushik@gmail.com");
  const [password, setPassword] = useState("dinesh001");
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // Simulate page load
  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Check if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check demo credentials
        const storedEmail = localStorage.getItem("adminEmail");
        const sessionActive = localStorage.getItem("adminSessionActive");
        const lastActivity = localStorage.getItem("adminLastActivity");

        if (storedEmail === "dinesh001kaushik@gmail.com" && sessionActive === "true" && lastActivity) {
          const lastActivityTime = parseInt(lastActivity);
          const currentTime = Date.now();
          const maxInactiveTime = 24 * 60 * 60 * 1000; // 24 hours
          
          if (currentTime - lastActivityTime < maxInactiveTime) {
            console.log("Demo session active, redirecting to dashboard");
            navigate("/admin/dashboard", { replace: true });
            return;
          }
        }

        // Check Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          try {
            const { data: isAdmin } = await supabase.rpc('is_admin', {
              user_id: session.user.id
            });
            
            if (isAdmin) {
              console.log("Supabase admin session found, redirecting to dashboard");
              const currentTime = Date.now();
              localStorage.setItem("adminToken", `admin-${currentTime}`);
              localStorage.setItem("adminEmail", session.user.email || "");
              localStorage.setItem("adminSessionActive", "true");
              localStorage.setItem("adminLastActivity", currentTime.toString());
              navigate("/admin/dashboard", { replace: true });
            }
          } catch (error) {
            console.error("Error checking admin status:", error);
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Attempting login with:", { email: email.trim() });
      
      // Handle demo credentials
      if (email.trim() === "dinesh001kaushik@gmail.com" && password.trim() === "dinesh001") {
        console.log("Demo credentials detected, logging in...");
        
        const currentTime = Date.now();
        localStorage.setItem("adminToken", `admin-${currentTime}`);
        localStorage.setItem("adminEmail", email.trim());
        localStorage.setItem("adminSessionActive", "true");
        localStorage.setItem("adminLastActivity", currentTime.toString());
        
        console.log("Demo login successful, session started at:", new Date(currentTime));
        
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard!",
        });
        
        setTimeout(() => {
          navigate("/admin/dashboard", { replace: true });
        }, 1000);
        return;
      }

      // Try Supabase authentication for other credentials
      console.log("Attempting Supabase authentication...");
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        console.error("Supabase auth error:", error);
        throw new Error("Invalid email or password. Please check your credentials.");
      }

      if (!data.user) {
        throw new Error("Authentication failed. Please try again.");
      }

      // Check if user is admin
      console.log("Checking admin privileges...");
      const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin', {
        user_id: data.user.id
      });

      if (adminError) {
        console.error("Admin check error:", adminError);
        await supabase.auth.signOut();
        throw new Error("Failed to verify admin privileges. Please try again.");
      }

      if (!isAdmin) {
        console.log("User is not admin");
        await supabase.auth.signOut();
        throw new Error("You don't have admin privileges to access this panel.");
      }

      // Set admin credentials with persistent session
      const currentTime = Date.now();
      localStorage.setItem("adminToken", `admin-${currentTime}`);
      localStorage.setItem("adminEmail", data.user.email || "");
      localStorage.setItem("adminSessionActive", "true");
      localStorage.setItem("adminLastActivity", currentTime.toString());
      
      console.log("Supabase admin login successful, session started at:", new Date(currentTime));
      
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard!",
      });
      
      setTimeout(() => {
        navigate("/admin/dashboard", { replace: true });
      }, 1000);
      
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials provided.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (pageLoading) {
    return <LoadingScreen message="Preparing Secure Admin Portal" />;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <MFlixLogo />
          </div>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Shield className="text-green-500" size={16} />
            <p className="text-gray-400">Secure Admin Access</p>
          </div>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="relative">
              <AtSign className="absolute left-3 top-3 text-gray-400" size={16} />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Admin Email"
                className="bg-gray-700 border-gray-600 text-white pl-10"
                required
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={16} />
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="bg-gray-700 border-gray-600 text-white pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <KeyRound className="mr-2 h-4 w-4" />
                  Secure Sign In
                </>
              )}
            </Button>
            
            <div className="text-center text-sm text-gray-500">
              <p>Demo credentials:</p>
              <p className="text-green-400 mt-1">Email: dinesh001kaushik@gmail.com</p>
              <p className="text-green-400">Password: dinesh001</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
