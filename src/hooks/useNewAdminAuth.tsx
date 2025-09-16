
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// Admin credentials and security code
const ADMIN_EMAIL = "admin@mflix.com";
const ADMIN_PASSWORD = "MFlix2025@Admin!";
const SECURITY_CODE = "2411200"; // 7-digit predefined code

interface AdminAuthState {
  isAuthenticated: boolean;
  adminEmail: string;
  loading: boolean;
  currentStep: 'login' | 'code' | 'authenticated';
}

export const useNewAdminAuth = () => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AdminAuthState>({
    isAuthenticated: false,
    adminEmail: "",
    loading: true,
    currentStep: 'login'
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const adminSession = localStorage.getItem('mflix_admin_session');
    if (adminSession) {
      try {
        const session = JSON.parse(adminSession);
        if (session.email === ADMIN_EMAIL && session.authenticated) {
          setAuthState({
            isAuthenticated: true,
            adminEmail: session.email,
            loading: false,
            currentStep: 'authenticated'
          });
          return;
        }
      } catch (error) {
        localStorage.removeItem('mflix_admin_session');
      }
    }
    
    setAuthState(prev => ({ ...prev, loading: false }));
  };

  const loginWithCredentials = async (email: string, password: string) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setAuthState(prev => ({
        ...prev,
        currentStep: 'code',
        adminEmail: email
      }));
      
      toast({
        title: "Credentials Verified",
        description: "Please enter the 7-digit security code to complete login.",
      });
      
      return { success: true, requiresCode: true };
    }
    
    return { 
      success: false, 
      error: "Invalid email or password. Please try again.",
      requiresCode: false 
    };
  };

  const verifySecurityCode = async (code: string) => {
    if (code === SECURITY_CODE) {
      const session = {
        email: ADMIN_EMAIL,
        authenticated: true,
        timestamp: Date.now()
      };
      
      localStorage.setItem('mflix_admin_session', JSON.stringify(session));
      
      setAuthState({
        isAuthenticated: true,
        adminEmail: ADMIN_EMAIL,
        loading: false,
        currentStep: 'authenticated'
      });
      
      toast({
        title: "Login Successful",
        description: "Welcome to the MFlix Admin Panel!",
      });
      
      return { success: true };
    }
    
    // Reset to login step on wrong code
    setAuthState(prev => ({
      ...prev,
      currentStep: 'login',
      adminEmail: ""
    }));
    
    toast({
      title: "Invalid Security Code",
      description: "Please login again with your credentials.",
      variant: "destructive"
    });
    
    return { success: false, error: "Invalid security code. Please login again." };
  };

  const logout = () => {
    localStorage.removeItem('mflix_admin_session');
    setAuthState({
      isAuthenticated: false,
      adminEmail: "",
      loading: false,
      currentStep: 'login'
    });
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    
    navigate('/admin/login', { replace: true });
  };

  return {
    ...authState,
    loginWithCredentials,
    verifySecurityCode,
    logout,
    ADMIN_EMAIL,
    SECURITY_CODE
  };
};
