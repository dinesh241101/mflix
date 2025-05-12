
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import MovieDetail from "./pages/MovieDetail";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import MoviesPage from "./pages/admin/MoviesPage";
import WebSeriesPage from "./pages/admin/WebSeriesPage";
import AnimePage from "./pages/admin/AnimePage";
import ShortsPage from "./pages/admin/ShortsPage";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [isAdminDomain, setIsAdminDomain] = useState(false);

  // Handle custom domain for admin
  useEffect(() => {
    const hostname = window.location.hostname;
    setIsAdminDomain(hostname === "crmadmin.mflix");
    
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
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/movies" element={<MoviesPage />} />
                <Route path="/admin/web-series" element={<WebSeriesPage />} />
                <Route path="/admin/anime" element={<AnimePage />} />
                <Route path="/admin/shorts" element={<ShortsPage />} />
                <Route path="/admin/*" element={<AdminDashboard />} />
                <Route path="*" element={<Navigate to="/admin/login" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Index />} />
                <Route path="/movie/:id" element={<MovieDetail />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/movies" element={<MoviesPage />} />
                <Route path="/admin/web-series" element={<WebSeriesPage />} />
                <Route path="/admin/anime" element={<AnimePage />} />
                <Route path="/admin/shorts" element={<ShortsPage />} />
                <Route path="/admin/*" element={<AdminDashboard />} />
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
