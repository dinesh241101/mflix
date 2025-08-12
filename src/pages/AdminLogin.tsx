
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import LoadingScreen from "@/components/LoadingScreen";
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
  
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [isLogging, setIsLogging] = useState(false);

  // Redirect if already authenticated
  if (!loading && isAuthenticated) {
    navigate("/admin");
    return null;
  }

  if (loading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLogging(true);

    try {
      const result = await secureLogin(credentials.email, credentials.password);
      
      if (result.success) {
        toast({
          title: "Login Successful",
          description: "Welcome to the admin dashboard!",
        });
        navigate("/admin");
      } else {
        toast({
          title: "Login Failed",
          description: result.error || "Invalid credentials",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLogging(false);
    }
  };

  const fillDemoCredentials = () => {
    setCredentials({
      email: PERMANENT_ADMIN_EMAIL,
      password: PERMANENT_ADMIN_PASSWORD
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">
            Admin Login
          </CardTitle>
          <p className="text-gray-400">
            Secure access to MFlix administration
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="admin@mflix.com"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter your password"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLogging}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLogging ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-300 mb-3">
              Demo Credentials (for testing):
            </p>
            <div className="space-y-2 text-xs">
              <p className="text-gray-400">
                <strong>Email:</strong> {PERMANENT_ADMIN_EMAIL}
              </p>
              <p className="text-gray-400">
                <strong>Password:</strong> {PERMANENT_ADMIN_PASSWORD}
              </p>
            </div>
            <Button
              onClick={fillDemoCredentials}
              variant="outline"
              size="sm"
              className="mt-3 w-full"
            >
              Use Demo Credentials
            </Button>
          </div>

          <div className="mt-4 p-3 bg-amber-900/20 border border-amber-600/50 rounded-lg">
            <p className="text-xs text-amber-200">
              🔒 <strong>Security Notice:</strong> Admin sessions are permanent and cannot be logged out for security purposes. Only authorized personnel should access this system.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
