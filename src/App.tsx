
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminRouteGuard from "@/components/admin/AdminRouteGuard";

// Public pages
import Index from "./pages/Index";
import Movies from "./pages/Movies";
import WebSeries from "./pages/WebSeries";
import Anime from "./pages/Anime";
import MovieDetail from "./pages/MovieDetail";
import DownloadPage from "./pages/DownloadPage";
import DownloadSources from "./pages/DownloadSources";
import DownloadVerify from "./pages/DownloadVerify";
import DownloadWithAds from "./pages/DownloadWithAds";
import SearchResults from "./pages/SearchResults";
import MobileShortsPage from "./pages/MobileShortsPage";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import MoviesPage from "./pages/admin/MoviesPage";
import MovieEditPage from "./pages/admin/MovieEditPage";
import AnimePage from "./pages/admin/AnimePage";
import ShortsPage from "./pages/admin/ShortsPage";
import UsersPage from "./pages/admin/UsersPage";
import AdsManagementPage from "./pages/admin/AdsManagementPage";
import SettingsPage from "./pages/admin/SettingsPage";
import GenresPage from "./pages/admin/GenresPage";
import DownloadLinksPage from "./pages/admin/DownloadLinksPage";
import ContentManagementPage from "./pages/admin/ContentManagementPage";
import ManageSeriesPage from "./pages/admin/ManageSeriesPage";
import ContentUploadPage from "./pages/admin/ContentUploadPage";
import HeaderConfigPage from "./pages/admin/HeaderConfigPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/series" element={<WebSeries />} />
            <Route path="/anime" element={<Anime />} />
            <Route path="/shorts" element={<MobileShortsPage />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/series/:id" element={<MovieDetail />} />
            <Route path="/anime/:id" element={<MovieDetail />} />
            <Route path="/download/:id" element={<DownloadPage />} />
            <Route path="/download/:id/sources" element={<DownloadSources />} />
            <Route path="/download/:id/verify" element={<DownloadVerify />} />
            <Route path="/download/:id/with-ads" element={<DownloadWithAds />} />
            <Route path="/search" element={<SearchResults />} />
            
            {/* Admin login (no guard needed) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Protected admin routes */}
            <Route path="/admin" element={
              <AdminRouteGuard>
                <AdminDashboard />
              </AdminRouteGuard>
            } />
            <Route path="/admin/dashboard" element={
              <AdminRouteGuard>
                <AdminDashboard />
              </AdminRouteGuard>
            } />
            <Route path="/admin/movies" element={
              <AdminRouteGuard>
                <MoviesPage />
              </AdminRouteGuard>
            } />
            <Route path="/admin/movies/edit/:id" element={
              <AdminRouteGuard>
                <MovieEditPage />
              </AdminRouteGuard>
            } />
            <Route path="/admin/series" element={
              <AdminRouteGuard>
                <ManageSeriesPage />
              </AdminRouteGuard>
            } />
            <Route path="/admin/anime" element={
              <AdminRouteGuard>
                <AnimePage />
              </AdminRouteGuard>
            } />
            <Route path="/admin/shorts" element={
              <AdminRouteGuard>
                <ShortsPage />
              </AdminRouteGuard>
            } />
            <Route path="/admin/users" element={
              <AdminRouteGuard>
                <UsersPage />
              </AdminRouteGuard>
            } />
            <Route path="/admin/ads" element={
              <AdminRouteGuard>
                <AdsManagementPage />
              </AdminRouteGuard>
            } />
            <Route path="/admin/settings" element={
              <AdminRouteGuard>
                <SettingsPage />
              </AdminRouteGuard>
            } />
            <Route path="/admin/genres" element={
              <AdminRouteGuard>
                <GenresPage />
              </AdminRouteGuard>
            } />
            <Route path="/admin/download-links" element={
              <AdminRouteGuard>
                <DownloadLinksPage />
              </AdminRouteGuard>
            } />
            <Route path="/admin/content" element={
              <AdminRouteGuard>
                <ContentManagementPage />
              </AdminRouteGuard>
            } />
            <Route path="/admin/upload" element={
              <AdminRouteGuard>
                <ContentUploadPage />
              </AdminRouteGuard>
            } />
            <Route path="/admin/header-config" element={
              <AdminRouteGuard>
                <HeaderConfigPage />
              </AdminRouteGuard>
            } />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
