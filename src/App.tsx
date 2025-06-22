
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GlobalAdInterceptor from "./components/ads/GlobalAdInterceptor";
import GlobalAdTracker from "./components/ads/GlobalAdTracker";
import Index from "./pages/Index";
import Movies from "./pages/Movies";
import Anime from "./pages/Anime";
import WebSeries from "./pages/WebSeries";
import MovieDetail from "./pages/MovieDetail";
import DownloadPage from "./pages/DownloadPage";
import DownloadWithAds from "./pages/DownloadWithAds";
import MobileShortsPage from "./pages/MobileShortsPage";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ContentManagementPage from "./pages/admin/ContentManagementPage";
import MoviesPage from "./pages/admin/MoviesPage";
import MovieEditPage from "./pages/admin/MovieEditPage";
import AnimePage from "./pages/admin/AnimePage";
import WebSeriesPage from "./pages/admin/WebSeriesPage";
import ShortsPage from "./pages/admin/ShortsPage";
import AdsManagementPage from "./pages/admin/AdsManagementPage";
import GenresPage from "./pages/admin/GenresPage";
import HeaderConfigPage from "./pages/admin/HeaderConfigPage";
import SearchResults from "./pages/SearchResults";
import DownloadLinksPage from "./pages/admin/DownloadLinksPage";

function App() {
  return (
    <Router>
      <GlobalAdInterceptor>
        <div className="min-h-screen bg-gray-900">
          <GlobalAdTracker />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/anime" element={<Anime />} />
            <Route path="/web-series" element={<WebSeries />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/anime/:id" element={<MovieDetail />} />
            <Route path="/series/:id" element={<MovieDetail />} />
            <Route path="/download/:id/:linkId" element={<DownloadPage />} />
            <Route path="/download-ads/:id/:linkId" element={<DownloadWithAds />} />
            <Route path="/shorts" element={<MobileShortsPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/content" element={<ContentManagementPage />} />
            <Route path="/admin/movies" element={<MoviesPage />} />
            <Route path="/admin/movies/edit/:id" element={<MovieEditPage />} />
            <Route path="/admin/anime" element={<AnimePage />} />
            <Route path="/admin/web-series" element={<WebSeriesPage />} />
            <Route path="/admin/shorts" element={<ShortsPage />} />
            <Route path="/admin/ads" element={<AdsManagementPage />} />
            <Route path="/admin/genres" element={<GenresPage />} />
            <Route path="/admin/header" element={<HeaderConfigPage />} />
            <Route path="/admin/download-links" element={<DownloadLinksPage />} />
            
            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </GlobalAdInterceptor>
    </Router>
  );
}

export default App;
