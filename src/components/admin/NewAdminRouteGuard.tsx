
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNewAdminAuth } from '@/hooks/useNewAdminAuth';
import LoadingScreen from '@/components/LoadingScreen';

interface NewAdminRouteGuardProps {
  children: React.ReactNode;
}

const NewAdminRouteGuard = ({ children }: NewAdminRouteGuardProps) => {
  const { isAuthenticated, loading } = useNewAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log("Admin not authenticated, redirecting to login");
      navigate('/crm-admin/login', { replace: true });
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

export default NewAdminRouteGuard;
