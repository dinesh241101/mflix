
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCRMAdminAuth } from '@/hooks/useCRMAdminAuth';
import LoadingScreen from '@/components/LoadingScreen';

interface CRMAdminRouteGuardProps {
  children: React.ReactNode;
}

const CRMAdminRouteGuard = ({ children }: CRMAdminRouteGuardProps) => {
  const { isAuthenticated, loading } = useCRMAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log("CRM Admin not authenticated, redirecting to login");
      navigate('/crm-admin/login', { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return <LoadingScreen message="Verifying CRM Admin Access..." />;
  }

  if (!isAuthenticated) {
    return <LoadingScreen message="Redirecting to CRM Admin Login..." />;
  }

  return <>{children}</>;
};

export default CRMAdminRouteGuard;
