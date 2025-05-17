
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LoaderCircle, AtSign, Lock, KeyRound, Eye, EyeOff } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import MFlixLogo from "@/components/MFlixLogo";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // Simulate page load
  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    const checkLoginStatus = () => {
      const adminEmail = localStorage.getItem("adminEmail");
      const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
      
      if (adminEmail && isAuthenticated) {
        // Admin is already logged in, redirect to dashboard
        navigate("/admin/dashboard", { replace: true });
      }
    };
    
    checkLoginStatus();
    
    // Add event listener for storage changes (in case user logs in from another tab)
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For demo purposes, any valid email/password combination works
      if (email.trim() && password.trim()) {
        // Store session data
        localStorage.setItem("adminEmail", email);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("adminLoginTime", new Date().toISOString());
        
        // Broadcast storage update to other tabs
        window.dispatchEvent(new Event("storage"));
        
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard!",
        });
        
        // Use replace to prevent back button from returning to login page
        navigate("/admin/dashboard", { replace: true });
      } else {
        throw new Error("Please fill in all fields");
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (pageLoading) {
    return <LoadingScreen message="Preparing Admin Portal" />;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <MFlixLogo />
          </div>
          <p className="text-gray-400 mt-2">Access the admin control panel</p>
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
                  Logging in...
                </>
              ) : (
                <>
                  <KeyRound className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
            
            <div className="text-center text-sm text-gray-500">
              <p>For demo: enter any email and password</p>
            </div>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <Link to="/" className="text-blue-400 hover:text-blue-300">
            Back to Website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
