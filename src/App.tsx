
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
import AdManager from "./components/ads/AdManager";

const queryClient = new QueryClient();

const App = () => {
  const [isAdminDomain, setIsAdminDomain] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Handle custom domain for admin and check authentication
  useEffect(() => {
    const checkAuth = () => {
      const hostname = window.location.hostname;
      const isAuth = localStorage.getItem("isAuthenticated") === "true";
      
      setIsAdminDomain(hostname === "crmadmin.mflix");
      setIsAuthenticated(isAuth);
      
      // Check if session is still valid (24 hours)
      if (isAuth) {
        const loginTime = localStorage.getItem("adminLoginTime");
        if (loginTime) {
          const loginDate = new Date(loginTime);
          const currentDate = new Date();
          const hoursDiff = (currentDate.getTime() - loginDate.getTime()) / (1000 * 60 * 60);
          
          // If session is older than 24 hours, logout
          if (hoursDiff > 24) {
            localStorage.removeItem("adminEmail");
            localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("adminLoginTime");
            setIsAuthenticated(false);
          }
        }
      }
      
      setIsCheckingAuth(false);
    };
    
    checkAuth();
    
    // Add event listener for storage changes (in case user logs in/out from another tab)
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // Redirect to admin login if on admin domain but not on admin path
  useEffect(() => {
    if (isAdminDomain && 
        !window.location.pathname.startsWith("/admin") && 
        !isCheckingAuth) {
      window.location.pathname = "/admin/login";
    }
  }, [isAdminDomain, isCheckingAuth]);
  
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
                <Route path="/admin/*" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" replace />} />
                <Route path="*" element={<Navigate to="/admin/login" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Index />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/web-series" element={<WebSeries />} />
                <Route path="/anime" element={<Anime />} />
                <Route path="/movie/:id" element={<MovieDetail />} />
                <Route path="/admin/login" element={!isAuthenticated ? <AdminLogin /> : <Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" replace />} />
                <Route path="/admin/movies" element={isAuthenticated ? <MoviesPage /> : <Navigate to="/admin/login" replace />} />
                <Route path="/admin/web-series" element={isAuthenticated ? <WebSeriesPage /> : <Navigate to="/admin/login" replace />} />
                <Route path="/admin/anime" element={isAuthenticated ? <AnimePage /> : <Navigate to="/admin/login" replace />} />
                <Route path="/admin/shorts" element={isAuthenticated ? <ShortsPage /> : <Navigate to="/admin/login" replace />} />
                <Route path="/admin/content" element={isAuthenticated ? <ContentManagementPage /> : <Navigate to="/admin/login" replace />} />
                <Route path="/admin/ads" element={isAuthenticated ? <AdsManagementPage /> : <Navigate to="/admin/login" replace />} />
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
