
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNewAdminAuth } from '@/hooks/useNewAdminAuth';
import LoadingScreen from '@/components/LoadingScreen';

interface NewAdminRouteGuardProps {
  children: React.ReactNode;
}

const NewAdminRouteGuard = ({ children }: NewAdminRouteGuardProps) => {
  const { isAuthenticated, loading, currentStep } = useNewAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!isAuthenticated || currentStep !== 'authenticated')) {
      console.log("Admin not authenticated, redirecting to login");
      navigate('/admin/login', { replace: true });
    }
  }, [loading, isAuthenticated, currentStep, navigate]);

  if (loading) {
    return <LoadingScreen message="Verifying Admin Access..." />;
  }

  if (!isAuthenticated || currentStep !== 'authenticated') {
    return <LoadingScreen message="Redirecting to Login..." />;
  }

  return <>{children}</>;
};

export default NewAdminRouteGuard;
