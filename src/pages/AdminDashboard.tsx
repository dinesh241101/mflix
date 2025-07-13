
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Film, 
  Tv, 
  Play, 
  Video, 
  Settings, 
  BarChart3, 
  Users, 
  Upload,
  Tag,
  Header as HeaderIcon,
  Palette
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import LoadingScreen from "@/components/LoadingScreen";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { adminEmail, loading, isAuthenticated, handleLogout, updateActivity } = useAdminAuth();

  if (loading) {
    return <LoadingScreen message="Loading Admin Dashboard" />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const dashboardCards = [
    {
      title: "Upload Content",
      description: "Add new movies, series, anime, and shorts",
      icon: Upload,
      color: "bg-blue-600 hover:bg-blue-700",
      action: () => {
        updateActivity();
        navigate("/admin/content-management");
      }
    },
    {
      title: "Movies",
      description: "Manage movie collection",
      icon: Film,
      color: "bg-purple-600 hover:bg-purple-700",
      action: () => {
        updateActivity();
        navigate("/admin/movies");
      }
    },
    {
      title: "Web Series",
      description: "Manage web series collection",
      icon: Tv,
      color: "bg-green-600 hover:bg-green-700",
      action: () => {
        updateActivity();
        navigate("/admin/web-series");
      }
    },
    {
      title: "Anime",
      description: "Manage anime collection",
      icon: Play,
      color: "bg-pink-600 hover:bg-pink-700",
      action: () => {
        updateActivity();
        navigate("/admin/anime");
      }
    },
    {
      title: "Shorts",
      description: "Manage short videos",
      icon: Video,
      color: "bg-orange-600 hover:bg-orange-700",
      action: () => {
        updateActivity();
        navigate("/admin/shorts");
      }
    },
    {
      title: "Ads Management",
      description: "Configure advertisements",
      icon: BarChart3,
      color: "bg-yellow-600 hover:bg-yellow-700",
      action: () => {
        updateActivity();
        navigate("/admin/ads-management");
      }
    },
    {
      title: "Genres",
      description: "Manage content genres",
      icon: Tag,
      color: "bg-indigo-600 hover:bg-indigo-700",
      action: () => {
        updateActivity();
        navigate("/admin/genres");
      }
    },
    {
      title: "Header Config",
      description: "Configure website header",
      icon: HeaderIcon,
      color: "bg-teal-600 hover:bg-teal-700",
      action: () => {
        updateActivity();
        navigate("/admin/header-config");
      }
    },
    {
      title: "Users",
      description: "Manage user accounts",
      icon: Users,
      color: "bg-red-600 hover:bg-red-700",
      action: () => {
        updateActivity();
        navigate("/admin/users");
      }
    },
    {
      title: "Settings",
      description: "System configuration",
      icon: Settings,
      color: "bg-gray-600 hover:bg-gray-700",
      action: () => {
        updateActivity();
        navigate("/admin/settings");
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminHeader adminEmail={adminEmail} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage your content and website settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dashboardCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer" onClick={card.action}>
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
                    <IconComponent size={24} className="text-white" />
                  </div>
                  <CardTitle className="text-white text-lg">{card.title}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {card.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className={`w-full ${card.color} text-white`}
                    onClick={(e) => {
                      e.stopPropagation();
                      card.action();
                    }}
                  >
                    Open
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-300">
                <div className="flex justify-between">
                  <span>Total Movies:</span>
                  <span className="font-semibold">Loading...</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Series:</span>
                  <span className="font-semibold">Loading...</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Anime:</span>
                  <span className="font-semibold">Loading...</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Shorts:</span>
                  <span className="font-semibold">Loading...</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-400">
                <p>No recent activity to display</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
