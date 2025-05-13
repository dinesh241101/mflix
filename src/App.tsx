
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
import ContentManagementPage from "./pages/admin/ContentManagementPage";
import NotFound from "./pages/NotFound";
import Movies from "./pages/Movies";
import WebSeries from "./pages/WebSeries";
import Anime from "./pages/Anime";

const queryClient = new QueryClient();

const App = () => {
  const [isAdminDomain, setIsAdminDomain] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Handle custom domain for admin and check authentication
  useEffect(() => {
    const hostname = window.location.hostname;
    const adminEmail = localStorage.getItem("adminEmail");
    
    setIsAdminDomain(hostname === "crmadmin.mflix");
    setIsAuthenticated(!!adminEmail);
    
    if (hostname === "crmadmin.mflix" && 
        !window.location.pathname.startsWith("/admin")) {
      window.location.pathname = "/admin/login";
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
