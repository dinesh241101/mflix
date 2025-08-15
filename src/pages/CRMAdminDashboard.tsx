
import { useState } from "react";
import { useCRMAdminAuth } from "@/hooks/useCRMAdminAuth";
import LoadingScreen from "@/components/LoadingScreen";
import AdminNavTabs from "@/components/admin/AdminNavTabs";
import MoviesTab from "@/components/admin/movies/MoviesTab";
import AdsTab from "@/components/admin/ads/AdsTab";
import AnalyticsTab from "@/components/admin/analytics/AnalyticsTab";
import SettingsTab from "@/components/admin/settings/SettingsTab";
import UsersTab from "@/components/admin/users/UsersTab";
import ShortsTab from "@/components/admin/shorts/ShortsTab";
import AnimeTab from "@/components/admin/anime/AnimeTab";
import RedirectLoopTab from "@/components/admin/redirect/RedirectLoopTab";
import SeriesEpisodesTab from "@/components/admin/series/SeriesEpisodesTab";
import BulkUploadTab from "@/components/admin/bulk/BulkUploadTab";
import SampleDataInitializer from "@/components/admin/SampleDataInitializer";
import { Button } from "@/components/ui/button";
import { LogOut, Home, Database } from "lucide-react";

const CRMAdminDashboard = () => {
  const { adminEmail, loading: authLoading, isAuthenticated, logout } = useCRMAdminAuth();
  const [activeTab, setActiveTab] = useState("movies");

  if (authLoading) {
    return <LoadingScreen message="Loading MFlix CRM Admin Dashboard" />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case "movies":
        return <MoviesTab />;
      case "series":
        return <MoviesTab />;
      case "anime":
        return <AnimeTab />;
      case "shorts":
        return <ShortsTab />;
      case "episodes":
        return <SeriesEpisodesTab />;
      case "redirect":
        return <RedirectLoopTab />;
      case "bulk":
        return <BulkUploadTab />;
      case "ads":
        return <AdsTab />;
      case "analytics":
        return <AnalyticsTab />;
      case "users":
        return <UsersTab />;
      case "settings":
        return <SettingsTab />;
      case "sample-data":
        return <SampleDataInitializer />;
      default:
        return <MoviesTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Fixed Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab("movies")}
              className="text-white hover:bg-gray-700"
            >
              <Home size={18} className="mr-2" />
              MFlix CRM Admin
            </Button>
            <div className="text-white">
              <span className="text-sm text-gray-300">Welcome, </span>
              <span className="font-medium">{adminEmail}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setActiveTab("sample-data")}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-700"
            >
              <Database size={18} className="mr-2" />
              Sample Data
            </Button>
            <Button
              onClick={logout}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-700 hover:text-red-400"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content with top padding to account for fixed header */}
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <AdminNavTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <div className="mt-6">
            {renderActiveTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMAdminDashboard;
