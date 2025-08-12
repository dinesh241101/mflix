
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import FixedGlobalHeader from "@/components/enhanced/FixedGlobalHeader";
import NewAdminRouteGuard from "@/components/admin/NewAdminRouteGuard";

// Lazy load components
const Index = lazy(() => import("@/pages/Index"));
const Movies = lazy(() => import("@/pages/Movies"));
const WebSeries = lazy(() => import("@/pages/WebSeries"));
const Anime = lazy(() => import("@/pages/Anime"));
const MovieDetail = lazy(() => import("@/pages/MovieDetail"));
const SearchResults = lazy(() => import("@/pages/SearchResults"));
const DownloadPage = lazy(() => import("@/pages/DownloadPage"));
const DownloadVerify = lazy(() => import("@/pages/DownloadVerify"));
const DownloadWithAds = lazy(() => import("@/pages/DownloadWithAds"));
const DownloadSources = lazy(() => import("@/pages/DownloadSources"));
const MobileShortsPage = lazy(() => import("@/pages/MobileShortsPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// New Admin components
const NewAdminLogin = lazy(() => import("@/pages/NewAdminLogin"));
const NewAdminDashboard = lazy(() => import("@/pages/NewAdminDashboard"));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gray-900">
            {/* Fixed Global Header - shown on all pages except admin */}
            <Routes>
              <Route path="/crm-admin/*" element={null} />
              <Route path="*" element={<FixedGlobalHeader />} />
            </Routes>

            {/* Main content with padding for fixed header */}
            <div className="pt-16">
              <Suspense fallback={<LoadingScreen />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/movies" element={<Movies />} />
                  <Route path="/web-series" element={<WebSeries />} />
                  <Route path="/anime" element={<Anime />} />
                  <Route path="/movie/:id" element={<MovieDetail />} />
                  <Route path="/series/:id" element={<MovieDetail />} />
                  <Route path="/anime/:id" element={<MovieDetail />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/download/:id" element={<DownloadPage />} />
                  <Route path="/download-verify/:id" element={<DownloadVerify />} />
                  <Route path="/download-with-ads/:id" element={<DownloadWithAds />} />
                  <Route path="/download-sources/:id" element={<DownloadSources />} />
                  <Route path="/shorts" element={<MobileShortsPage />} />

                  {/* New Admin Routes */}
                  <Route path="/crm-admin/login" element={<NewAdminLogin />} />
                  <Route
                    path="/crm-admin"
                    element={
                      <NewAdminRouteGuard>
                        <NewAdminDashboard />
                      </NewAdminRouteGuard>
                    }
                  />

                  {/* Fallback */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
