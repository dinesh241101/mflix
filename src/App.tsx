
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import MovieDetail from "./pages/MovieDetail";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import MoviesPage from "./pages/admin/MoviesPage";
import WebSeriesPage from "./pages/admin/WebSeriesPage";
import AnimePage from "./pages/admin/AnimePage";
import ShortsPage from "./pages/admin/ShortsPage";
import AdsManagementPage from "./pages/admin/AdsManagementPage";
import ContentManagementPage from "./pages/admin/ContentManagementPage";
import NotFound from "./pages/NotFound";
import Movies from "./pages/Movies";
import WebSeries from "./pages/WebSeries";
import Anime from "./pages/Anime";
import MobileShortsPage from "./pages/MobileShortsPage";
import AdManager from "./components/ads/AdManager";
import ClickAdModal from "./components/ads/ClickAdModal";
import DownloadPage from "./pages/DownloadPage";
import { useSecureAuth } from "./hooks/useSecureAuth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [isAdminDomain, setIsAdminDomain] = useState(false);
  const { isAuthenticated, isLoading: isCheckingAuth } = useSecureAuth();

  // Handle custom domain for admin
  useEffect(() => {
    const hostname = window.location.hostname;
    setIsAdminDomain(hostname.includes("admin") || hostname === "crmadmin.mflix");
  }, []);

  // Security headers and CSP (Content Security Policy)
  useEffect(() => {
    // Add security-related meta tags
    const addSecurityHeaders = () => {
      // Prevent clickjacking
      if (window.top !== window.self) {
        window.top.location = window.self.location;
      }
      
      // Disable right-click context menu in admin areas
      if (isAdminDomain) {
        const handleContextMenu = (e: MouseEvent) => e.preventDefault();
        document.addEventListener('contextmenu', handleContextMenu);
        return () => document.removeEventListener('contextmenu', handleContextMenu);
      }
    };
    
    addSecurityHeaders();
  }, [isAdminDomain]);

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* Global ad manager */}
          <AdManager />
          
          {/* Click-based ad modal - only on public pages */}
          {!isAdminDomain && <ClickAdModal />}
          
          <Routes>
            {/* Admin domain routing */}
            {isAdminDomain ? (
              <>
                <Route path="/admin/login" element={!isAuthenticated ? <AdminLogin /> : <Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" replace />} />
                <Route path="/admin/movies" element={isAuthenticated ? <MoviesPage /> : <Navigate to="/admin/login" replace />} />
                <Route path="/admin/web-series" element={isAuthenticated ? <WebSeriesPage /> : <Navigate to="/admin/login" replace />} />
                <Route path="/admin/anime" element={isAuthenticated ? <AnimePage /> : <Navigate to="/admin/login" replace />} />
                <Route path="/admin/shorts" element={isAuthenticated ? <ShortsPage /> : <Navigate to="/admin/login" replace />} />
                <Route path="/admin/content" element={isAuthenticated ? <ContentManagementPage /> : <Navigate to="/admin/login" replace />} />
                <Route path="/admin/ads" element={isAuthenticated ? <AdsManagementPage /> : <Navigate to="/admin/login" replace />} />
                <Route path="/admin/users" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" replace />} />
                <Route path="/admin/settings" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" replace />} />
                <Route path="/admin/*" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" replace />} />
                <Route path="*" element={<Navigate to="/admin/login" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Index />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/web-series" element={<WebSeries />} />
                <Route path="/anime" element={<Anime />} />
                <Route path="/shorts" element={<MobileShortsPage />} />
                <Route path="/movie/:id" element={<MovieDetail />} />
                <Route path="/download/:id/:linkId" element={<DownloadPage />} />
                <Route path="/admin/login" element={!isAuthenticated ? <AdminLogin /> : <Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" replace />} />
                <Route path="/admin/movies" element={isAuthenticated ? <MoviesPage /> : <Navigate to="/admin/login" replace />} />
                <Route path="/admin/web-series" element={isAuthenticated ? <WebSeriesPage /> : <Navigate to="/admin/login" replace />} />
                <Route path="/admin/anime" element={isAuthenticated ? <AnimePage /> : <Navigate to="/admin/login" replace />} />
                <Route path="/admin/shorts" element={isAuthenticated ? <ShortsPage /> : <Navigate to="/admin/login" replace />} />
                <Route path="/admin/content" element={isAuthenticated ? <ContentManagementPage /> : <Navigate to="/admin/login" replace />} />
                <Route path="/admin/ads" element={isAuthenticated ? <AdsManagementPage /> : <Navigate to="/admin/login" replace />} />
                <Route path="/admin/users" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" replace />} />
                <Route path="/admin/settings" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" replace />} />
                <Route path="/admin/*" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" replace />} />
                <Route path="*" element={<NotFound />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
