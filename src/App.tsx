
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import FixedGlobalHeader from "@/components/enhanced/FixedGlobalHeader";
import CRMAdminRouteGuard from "@/components/admin/CRMAdminRouteGuard";

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

// CRM Admin components
const CRMAdminLogin = lazy(() => import("@/pages/CRMAdminLogin"));
const CRMAdminDashboard = lazy(() => import("@/pages/CRMAdminDashboard"));

const queryClient = new QueryClient();

// Component to determine if header should be shown
const HeaderWrapper = () => {
  const location = useLocation();
  const hideHeaderPaths = [
    '/crm-admin',
    '/download-verify',
    '/download-with-ads'
  ];
  
  const shouldHideHeader = hideHeaderPaths.some(path => 
    location.pathname.startsWith(path)
  );

  if (shouldHideHeader) {
    return null;
  }

  return <FixedGlobalHeader />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gray-900">
            {/* Fixed Global Header - shown on all pages except specified ones */}
            <HeaderWrapper />

            {/* Main content with conditional padding for fixed header */}
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

                  {/* CRM Admin Routes */}
                  <Route path="/crm-admin/login" element={<CRMAdminLogin />} />
                  <Route
                    path="/crm-admin"
                    element={
                      <CRMAdminRouteGuard>
                        <CRMAdminDashboard />
                      </CRMAdminRouteGuard>
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
