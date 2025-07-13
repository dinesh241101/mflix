
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import MoviesPage from "./pages/admin/MoviesPage";
import WebSeriesPage from "./pages/admin/WebSeriesPage";
import AnimePage from "./pages/admin/AnimePage";
import ShortsPage from "./pages/admin/ShortsPage";
import AdsManagementPage from "./pages/admin/AdsManagementPage";
import GenresPage from "./pages/admin/GenresPage";
import HeaderConfigPage from "./pages/admin/HeaderConfigPage";
import UsersPage from "./pages/admin/UsersPage";
import SettingsPage from "./pages/admin/SettingsPage";
import ContentManagementPage from "./pages/admin/ContentManagementPage";
import Movies from "./pages/Movies";
import WebSeries from "./pages/WebSeries";
import Anime from "./pages/Anime";
import MobileShortsPage from "./pages/MobileShortsPage";
import MovieDetail from "./pages/MovieDetail";
import SearchResults from "./pages/SearchResults";
import DownloadPage from "./pages/DownloadPage";
import DownloadSources from "./pages/DownloadSources";
import DownloadVerify from "./pages/DownloadVerify";
import DownloadWithAds from "./pages/DownloadWithAds";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/web-series" element={<WebSeries />} />
            <Route path="/anime" element={<Anime />} />
            <Route path="/shorts" element={<MobileShortsPage />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/download/:id" element={<DownloadPage />} />
            <Route path="/download-sources/:id" element={<DownloadSources />} />
            <Route path="/download-verify/:sourceId/:linkId" element={<DownloadVerify />} />
            <Route path="/download-with-ads/:url" element={<DownloadWithAds />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/movies" element={<MoviesPage />} />
            <Route path="/admin/web-series" element={<WebSeriesPage />} />
            <Route path="/admin/anime" element={<AnimePage />} />
            <Route path="/admin/shorts" element={<ShortsPage />} />
            <Route path="/admin/ads-management" element={<AdsManagementPage />} />
            <Route path="/admin/genres" element={<GenresPage />} />
            <Route path="/admin/header-config" element={<HeaderConfigPage />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
            <Route path="/admin/content-management" element={<ContentManagementPage />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
