
import { useState } from "react";
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
  setTimeout(() => setPageLoading(false), 1000);

  // Check if user is already logged in
  useState(() => {
    const adminEmail = localStorage.getItem("adminEmail");
    if (adminEmail) {
      navigate("/admin");
    }
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // const { data, error } = await supabase.auth.signInWithPassword({
      //   email:email,
      //   password:password
      // });

      const data = {
        user:{
          id:1,
          email:"dinesh@gmail.com",
          password:"1234"
        }
      }

      const error = null;


      console.log(data);

      

      if (error) throw error;

      if (data.user) {
       
        // const { data: roleData, error: roleError } = await supabase.rpc('is_admin', {
        //   user_id: data.user.id
        // });

        // if (roleError) {
        //   throw roleError;
        // }

        // if (roleData) {
        //   // localStorage.setItem("adminToken", data.session?.access_token || "");
        //   localStorage.setItem("adminEmail", email);
          
          toast({
            title: "Login successful",
            description: "Redirecting to admin dashboard...",
          });
          
          navigate("/admin");
        } else {
          throw new Error("You don't have admin privileges");
        }
      
    } catch (error) {
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
              <p>Default admin credentials:</p>
              <p>dinesh001kaushik@gmail.com</p>
              <p>dinesh001</p>
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
