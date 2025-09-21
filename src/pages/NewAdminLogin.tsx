
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import LoadingScreen from "@/components/LoadingScreen";
import { useNewAdminAuth } from "@/hooks/useNewAdminAuth";

const NewAdminLogin = () => {
  const navigate = useNavigate();
  const { 
    isAuthenticated, 
    loading, 
    currentStep,
    loginWithCredentials,
    verifySecurityCode,
    ADMIN_EMAIL 
  } = useNewAdminAuth();
  
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [securityCode, setSecurityCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if already authenticated
  if (!loading && isAuthenticated && currentStep === 'authenticated') {
    navigate("/admin");
    return null;
  }

  if (loading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const result = await loginWithCredentials(credentials.email, credentials.password);
      
      if (!result.success) {
        toast({
          title: "Login Failed",
          description: result.error,
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
      setIsProcessing(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (securityCode.length !== 7) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 7-digit security code",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const result = await verifySecurityCode(securityCode);
      
      if (result.success) {
        navigate("/admin");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const fillDemoCredentials = () => {
    setCredentials({
      email: ADMIN_EMAIL,
      password: "MFlix2025@Admin!"
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">
            {currentStep === 'login' ? 'Admin Login' : 'Security Verification'}
          </CardTitle>
          <p className="text-gray-400">
            {currentStep === 'login' 
              ? 'Enter your admin credentials' 
              : 'Enter the 7-digit security code'
            }
          </p>
        </CardHeader>
        
        <CardContent>
          {currentStep === 'login' ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
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
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isProcessing ? "Verifying..." : "Continue"}
              </Button>

              <div className="mt-4">
                <Button
                  onClick={fillDemoCredentials}
                  variant="outline"
                  size="sm"
                  className="w-full"
                  type="button"
                >
                  Use Demo Credentials
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div>
                <Label htmlFor="securityCode" className="text-white">Security Code</Label>
                <Input
                  id="securityCode"
                  type="text"
                  value={securityCode}
                  onChange={(e) => setSecurityCode(e.target.value.replace(/\D/g, '').slice(0, 7))}
                  className="bg-gray-700 border-gray-600 text-white text-center text-2xl tracking-widest"
                  placeholder="1234567"
                  maxLength={7}
                  required
                />
                <p className="text-sm text-gray-400 mt-1">
                  Enter the 7-digit security code
                </p>
              </div>

              <Button
                type="submit"
                disabled={isProcessing || securityCode.length !== 7}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? "Verifying..." : "Complete Login"}
              </Button>

              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full"
                type="button"
              >
                Start Over
              </Button>
            </form>
          )}

          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-300 mb-2">
              Demo Access:
            </p>
            <div className="space-y-1 text-xs">
              <p className="text-gray-400">
                <strong>Email:</strong> admin@mflix.com
              </p>
              <p className="text-gray-400">
                <strong>Password:</strong> MFlix2025@Admin!
              </p>
              <p className="text-gray-400">
                <strong>Security Code:</strong> 1234567
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewAdminLogin;
