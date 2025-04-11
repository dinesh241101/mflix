
import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Signup fields
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Placeholder implementation for demonstration
    if (email === "dinesh001kaushik@gmail.com" && password === "dinesh001") {
      setTimeout(() => {
        setIsLoading(false);
        
        // In a real implementation, this would save auth token to localStorage
        localStorage.setItem("adminToken", "demo-token");
        localStorage.setItem("adminEmail", email);
        
        toast({
          title: "Login successful",
          description: "Redirecting to admin dashboard...",
        });
        
        window.location.href = "/admin";
      }, 1500);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Login failed",
          description: "Invalid email or password. Try dinesh001kaushik@gmail.com/dinesh001",
          variant: "destructive"
        });
      }, 1500);
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (signupPassword !== confirmPassword) {
      setIsLoading(false);
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive"
      });
      return;
    }
    
    // This is a placeholder - we'll implement actual signup with Supabase
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Not Implemented",
        description: "User registration requires Supabase integration. Please connect to Supabase first.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">MFlix Admin</h1>
          <p className="text-gray-400 mt-2">Access the admin control panel</p>
        </div>
        
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Signup</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                
                <div className="text-right">
                  <a href="#" className="text-sm text-blue-400 hover:text-blue-300">
                    Forgot password?
                  </a>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
                
                <div className="text-center text-sm text-gray-500">
                  <p>Default admin credentials:</p>
                  <p>Email: dinesh001kaushik@gmail.com</p>
                  <p>Password: dinesh001</p>
                </div>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-gray-400 mb-1">
                    Email
                  </label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="new-admin@example.com"
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-gray-400 mb-1">
                    Password
                  </label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-400 mb-1">
                    Confirm Password
                  </label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
                
                <div className="text-center text-xs text-gray-500">
                  <p>Note: Signup feature requires Supabase integration.</p>
                </div>
              </div>
            </form>
          </TabsContent>
        </Tabs>
        
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
