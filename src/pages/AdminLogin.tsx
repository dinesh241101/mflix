
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { LoaderCircle, AtSign, Lock, KeyRound, Eye, EyeOff, Shield, Copy, Check } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import MFlixLogo from "@/components/MFlixLogo";
import { usePermanentAdminAuth } from "@/hooks/usePermanentAdminAuth";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { 
    isAuthenticated, 
    loading, 
    secureLogin, 
    PERMANENT_ADMIN_EMAIL, 
    PERMANENT_ADMIN_PASSWORD 
  } = usePermanentAdminAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showCredentials, setShowCredentials] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  // Simulate page load
  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
      toast({
        title: "Copied!",
        description: `${field} copied to clipboard`,
      });
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const fillCredentials = () => {
    setEmail(PERMANENT_ADMIN_EMAIL);
    setPassword(PERMANENT_ADMIN_PASSWORD);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await secureLogin(email.trim(), password.trim());
      
      if (result.success) {
        toast({
          title: "Login successful",
          description: "Welcome to the permanent admin session!",
        });
        
        setTimeout(() => {
          navigate("/admin/dashboard", { replace: true });
        }, 1000);
      } else {
        throw new Error(result.error || "Authentication failed");
      }
      
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

  if (pageLoading || loading) {
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
            <p className="text-gray-400">Permanent Admin Access</p>
          </div>
        </div>

        {/* Admin Credentials Display */}
        {showCredentials && (
          <div className="mb-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-blue-400">Admin Credentials</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={fillCredentials}
                className="text-xs"
              >
                Auto Fill
              </Button>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between bg-gray-800 p-2 rounded">
                <span className="text-gray-300">Email:</span>
                <div className="flex items-center gap-2">
                  <code className="text-blue-400">{PERMANENT_ADMIN_EMAIL}</code>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(PERMANENT_ADMIN_EMAIL, 'Email')}
                    className="h-6 w-6 p-0"
                  >
                    {copiedField === 'Email' ? 
                      <Check size={12} className="text-green-400" /> : 
                      <Copy size={12} />
                    }
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between bg-gray-800 p-2 rounded">
                <span className="text-gray-300">Password:</span>
                <div className="flex items-center gap-2">
                  <code className="text-blue-400">{PERMANENT_ADMIN_PASSWORD}</code>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(PERMANENT_ADMIN_PASSWORD, 'Password')}
                    className="h-6 w-6 p-0"
                  >
                    {copiedField === 'Password' ? 
                      <Check size={12} className="text-green-400" /> : 
                      <Copy size={12} />
                    }
                  </Button>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-yellow-400 mt-2">
              ⚠️ Admin cannot logout once logged in (Permanent Session)
            </p>
          </div>
        )}
        
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
              <p>Use the credentials above to access the permanent admin session.</p>
              <p className="text-yellow-400 mt-1">Once logged in, admin cannot logout.</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
