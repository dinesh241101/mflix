
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import LoadingScreen from '@/components/LoadingScreen';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

const AdminRouteGuard = ({ children }: AdminRouteGuardProps) => {
  const { isAuthenticated, loading } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log("Admin not authenticated, redirecting to login");
      navigate('/admin/login', { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return <LoadingScreen message="Verifying Admin Access..." />;
  }

  if (!isAuthenticated) {
    return <LoadingScreen message="Redirecting to Login..." />;
  }

  return <>{children}</>;
};

export default AdminRouteGuard;
