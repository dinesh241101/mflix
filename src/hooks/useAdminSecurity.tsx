import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { sanitizeInput, validateEmail, RateLimiter } from '@/utils/security';

const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes

export const useAdminSecurity = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [sessionExpiry, setSessionExpiry] = useState<number | null>(null);

  useEffect(() => {
    checkAuthStatus();
    
    // Set up session monitoring
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event);
        
        if (event === 'SIGNED_OUT' || !session) {
          handleLogout();
        } else if (session?.user) {
          // Verify admin status
          setTimeout(() => {
            verifyAdminAccess(session.user.id, session.user.email || '');
          }, 0);
        }
        setLoading(false);
      }
    );

    // Check session expiry every minute
    const sessionChecker = setInterval(checkSessionExpiry, 60000);

    return () => {
      subscription.unsubscribe();
      clearInterval(sessionChecker);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Session error:", error);
        handleLogout();
        return;
      }

      if (!session?.user) {
        console.log("No active session found");
        handleLogout();
        return;
      }

      await verifyAdminAccess(session.user.id, session.user.email || '');
      
    } catch (error) {
      console.error("Auth check error:", error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const verifyAdminAccess = async (userId: string, email: string) => {
    try {
      const { data: isAdmin, error } = await supabase.rpc('is_admin', {
        user_id: userId
      });

      if (error) {
        console.error("Admin verification error:", error);
        handleLogout();
        return;
      }

      if (!isAdmin) {
        console.log("User is not an admin");
        handleLogout();
        return;
      }

      console.log("Admin access verified");
      setIsAuthenticated(true);
      setAdminEmail(email);
      setSessionExpiry(Date.now() + (24 * 60 * 60 * 1000)); // 24 hours
      
    } catch (error) {
      console.error("Error verifying admin access:", error);
      handleLogout();
    }
  };

  const checkSessionExpiry = () => {
    if (sessionExpiry && Date.now() > sessionExpiry) {
      toast({
        title: "Session Expired",
        description: "Please log in again for security.",
        variant: "destructive"
      });
      handleLogout();
    }
  };

  const secureLogin = async (email: string, password: string) => {
    const sanitizedEmail = sanitizeInput(email);
    
    // Input validation
    if (!validateEmail(sanitizedEmail)) {
      return { success: false, error: 'Invalid email format' };
    }

    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    // Rate limiting check
    if (loginRateLimiter.isBlocked(sanitizedEmail)) {
      return { 
        success: false, 
        error: 'Too many login attempts. Please try again in 15 minutes.' 
      };
    }

    try {
      // Record login attempt
      loginRateLimiter.recordAttempt(sanitizedEmail);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        return { success: false, error: 'Invalid credentials' };
      }

      if (!data.user) {
        return { success: false, error: 'Authentication failed' };
      }

      // Verify admin status
      const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin', {
        user_id: data.user.id
      });

      if (adminError || !isAdmin) {
        await supabase.auth.signOut();
        return { 
          success: false, 
          error: 'You do not have admin privileges' 
        };
      }

      return { success: true, error: null };

    } catch (error) {
      console.error("Secure login error:", error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const handleLogout = async () => {
    console.log("Logging out admin...");
    setIsAuthenticated(false);
    setAdminEmail('');
    setSessionExpiry(null);
    
    await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  };

  const extendSession = () => {
    if (isAuthenticated) {
      setSessionExpiry(Date.now() + (24 * 60 * 60 * 1000)); // Extend by 24 hours
    }
  };

  return {
    isAuthenticated,
    adminEmail,
    loading,
    sessionExpiry,
    secureLogin,
    handleLogout,
    extendSession
  };
};