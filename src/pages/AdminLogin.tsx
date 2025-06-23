
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { LoaderCircle, AtSign, Lock, KeyRound, Eye, EyeOff, Shield } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import MFlixLogo from "@/components/MFlixLogo";

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
    const token = localStorage.getItem("adminToken");
    if (token) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email !== "dinesh001kaushik@gmail.com" || password !== "dinesh001") {
      toast({
        title: "Login failed",
        description: "Invalid credentials provided.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);

    try {
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set admin credentials
      localStorage.setItem("adminToken", `admin-${Date.now()}`);
      localStorage.setItem("adminEmail", email);
      localStorage.setItem("isAuthenticated", "true");
      
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard!",
      });
      
      navigate("/admin/dashboard", { replace: true });
      
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: "An error occurred during login.",
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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
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
                readOnly
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
                readOnly
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
              <p>Hardcoded credentials for demo</p>
              <p className="text-green-400 mt-1">Email: dinesh001kaushik@gmail.com</p>
              <p className="text-green-400">Password: dinesh001</p>
            </div>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <a href="/" className="text-blue-400 hover:text-blue-300">
            Back to Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
