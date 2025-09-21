
import { useState } from "react";
import NewAdminHeader from "@/components/admin/NewAdminHeader";
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
import QuizManagement from "@/components/admin/quiz/QuizManagement";
import QuizAssignment from "@/components/admin/quiz/QuizAssignment";
import LoadingScreen from "@/components/LoadingScreen";
import { useNewAdminAuth } from "@/hooks/useNewAdminAuth";

const NewAdminDashboard = () => {
  const { adminEmail, loading: authLoading, isAuthenticated, logout } = useNewAdminAuth();
  const [activeTab, setActiveTab] = useState("movies");

  if (authLoading) {
    return <LoadingScreen message="Loading Admin Dashboard" />;
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
      case "quiz":
        return <QuizManagement />;
      case "quiz-assignment":
        return <QuizAssignment />;
      default:
        return <MoviesTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NewAdminHeader adminEmail={adminEmail} onLogout={logout} />
      
      <div className="container mx-auto px-4 py-8">
        <AdminNavTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="mt-6">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
};

export default NewAdminDashboard;
