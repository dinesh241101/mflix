
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster as Sonner } from "sonner";
import LoadingScreen from "@/components/LoadingScreen";
import NewAdminRouteGuard from "@/components/admin/NewAdminRouteGuard";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Movies = lazy(() => import("./pages/Movies"));
const WebSeries = lazy(() => import("./pages/WebSeries"));
const Anime = lazy(() => import("./pages/Anime"));
const MovieDetail = lazy(() => import("./pages/MovieDetail"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const DownloadPage = lazy(() => import("./pages/DownloadPage"));
const EpisodeDownloadPage = lazy(() => import("./pages/EpisodeDownloadPage"));
const DownloadSources = lazy(() => import("./pages/DownloadSources"));
const DownloadVerify = lazy(() => import("./pages/DownloadVerify"));
const DownloadWithAds = lazy(() => import("./pages/DownloadWithAds"));
const MobileShortsPage = lazy(() => import("./pages/MobileShortsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin pages
const NewAdminLogin = lazy(() => import("./pages/NewAdminLogin"));
const NewAdminDashboard = lazy(() => import("./pages/NewAdminDashboard"));
const UpdateContentPage = lazy(() => import("./pages/admin/UpdateContentPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gray-900">
            <Suspense fallback={<LoadingScreen />}> 
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/web-series" element={<WebSeries />} />
                <Route path="/anime" element={<Anime />} />
                <Route path="/movie/:id" element={<MovieDetail />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/shorts" element={<MobileShortsPage />} />

                {/* Download Pages */}
                <Route path="/download/:movieId" element={<DownloadPage />} />
                <Route path="/download-episodes/:movieId/:quality" element={<EpisodeDownloadPage />} />
                <Route path="/download-sources/:movieId" element={<DownloadSources />} />
                <Route path="/download-verify/:movieId" element={<DownloadVerify />} />
                <Route path="/download-with-ads/:movieId" element={<DownloadWithAds />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<NewAdminLogin />} />
                <Route
                  path="/admin"
                  element={
                    <NewAdminRouteGuard>
                      <NewAdminDashboard />
                    </NewAdminRouteGuard>
                  }
                />
                <Route
                  path="/admin/update-content"
                  element={
                    <NewAdminRouteGuard>
                      <UpdateContentPage />
                    </NewAdminRouteGuard>
                  }
                />

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
