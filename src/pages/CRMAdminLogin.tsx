
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import LoadingScreen from "@/components/LoadingScreen";
import { useCRMAdminAuth } from "@/hooks/useCRMAdminAuth";

const CRMAdminLogin = () => {
  const navigate = useNavigate();
  const { 
    isAuthenticated, 
    loading, 
    login, 
    CRM_ADMIN_EMAIL, 
    CRM_ADMIN_PASSWORD 
  } = useCRMAdminAuth();
  
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [isLogging, setIsLogging] = useState(false);

  // Redirect if already authenticated
  if (!loading && isAuthenticated) {
    navigate("/crm-admin");
    return null;
  }

  if (loading) {
    return <LoadingScreen message="Checking CRM Admin authentication..." />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLogging(true);

    try {
      const result = await login(credentials.email, credentials.password);
      
      if (result.success) {
        toast({
          title: "Login Successful",
          description: "Welcome to MFlix CRM Admin Dashboard!",
        });
        navigate("/crm-admin");
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
      email: CRM_ADMIN_EMAIL,
      password: CRM_ADMIN_PASSWORD
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">
            MFlix CRM Admin
          </CardTitle>
          <p className="text-gray-400">
            Secure access to content management system
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
              {isLogging ? "Logging in..." : "Access CRM Admin"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-300 mb-3">
              Demo Credentials:
            </p>
            <div className="space-y-2 text-xs">
              <p className="text-gray-400">
                <strong>Email:</strong> {CRM_ADMIN_EMAIL}
              </p>
              <p className="text-gray-400">
                <strong>Password:</strong> {CRM_ADMIN_PASSWORD}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default CRMAdminLogin;
