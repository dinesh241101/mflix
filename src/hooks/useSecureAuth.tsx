
import { useState, useEffect } from 'react';
import { sanitizeInput, validateEmail, RateLimiter } from '@/utils/security';
import { toast } from '@/components/ui/use-toast';

const loginLimiter = new RateLimiter(3, 15 * 60 * 1000); // 3 attempts per 15 minutes

export const useSecureAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpiry, setSessionExpiry] = useState<number | null>(null);

  useEffect(() => {
    checkAuthStatus();
    
    // Check session expiry every minute
    const interval = setInterval(checkSessionExpiry, 60000);
    return () => clearInterval(interval);
  }, []);

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem('adminToken');
      const expiry = localStorage.getItem('sessionExpiry');
      const isAuth = localStorage.getItem('isAuthenticated') === 'true';
      
      if (token && isAuth && expiry) {
        const expiryTime = parseInt(expiry);
        if (Date.now() < expiryTime) {
          setIsAuthenticated(true);
          setSessionExpiry(expiryTime);
        } else {
          logout();
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const checkSessionExpiry = () => {
    if (sessionExpiry && Date.now() >= sessionExpiry) {
      toast({
        title: "Session Expired",
        description: "Please log in again for security.",
        variant: "destructive"
      });
      logout();
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const clientIP = 'user-session'; // In production, get actual IP
    
    if (loginLimiter.isBlocked(clientIP)) {
      toast({
        title: "Too many attempts",
        description: "Please wait 15 minutes before trying again.",
        variant: "destructive"
      });
      return false;
    }

    const sanitizedEmail = sanitizeInput(email.toLowerCase());
    const sanitizedPassword = sanitizeInput(password);

    if (!validateEmail(sanitizedEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return false;
    }

    if (sanitizedPassword.length < 4) {
      toast({
        title: "Invalid password",
        description: "Password is too short.",
        variant: "destructive"
      });
      return false;
    }

    try {
      // For demo purposes - in production, this should be server-side validation
      if (sanitizedEmail && sanitizedPassword) {
        const sessionDuration = 8 * 60 * 60 * 1000; // 8 hours
        const expiryTime = Date.now() + sessionDuration;
        
        localStorage.setItem('adminEmail', sanitizedEmail);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('adminToken', `secure-${Date.now()}`);
        localStorage.setItem('sessionExpiry', expiryTime.toString());
        
        setIsAuthenticated(true);
        setSessionExpiry(expiryTime);
        
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard!",
        });
        
        return true;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      loginLimiter.recordAttempt(clientIP);
      toast({
        title: "Login failed",
        description: "Invalid credentials provided.",
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('sessionExpiry');
    setIsAuthenticated(false);
    setSessionExpiry(null);
  };

  const extendSession = () => {
    if (isAuthenticated) {
      const newExpiry = Date.now() + (8 * 60 * 60 * 1000);
      localStorage.setItem('sessionExpiry', newExpiry.toString());
      setSessionExpiry(newExpiry);
    }
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    extendSession,
    sessionExpiry
  };
};
