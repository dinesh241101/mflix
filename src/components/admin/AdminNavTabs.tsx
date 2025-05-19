
import { useNavigate } from "react-router-dom";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdminNavTabsProps {
  activeTab: string;
}

const AdminNavTabs = ({ activeTab }: AdminNavTabsProps) => {
  const navigate = useNavigate();
  
  // Handle tab change with proper navigation
  const handleTabChange = (value: string) => {
    navigate(`/admin/dashboard/${value}`);
  };

  return (
    <TabsList className="grid grid-cols-3 md:grid-cols-6 bg-gray-800 border border-gray-700 rounded-lg p-1 mb-6">
      <TabsTrigger 
        value="movies" 
        onClick={() => handleTabChange("movies")}
        className={activeTab === 'movies' ? 'data-[state=active]:bg-gray-700' : ''}
      >
        Movies
      </TabsTrigger>
      <TabsTrigger 
        value="shorts"
        onClick={() => handleTabChange("shorts")}
        className={activeTab === 'shorts' ? 'data-[state=active]:bg-gray-700' : ''}
      >
        Shorts
      </TabsTrigger>
      <TabsTrigger 
        value="ads"
        onClick={() => handleTabChange("ads")}
        className={activeTab === 'ads' ? 'data-[state=active]:bg-gray-700' : ''}
      >
        Ads
      </TabsTrigger>
      <TabsTrigger 
        value="users"
        onClick={() => handleTabChange("users")}
        className={activeTab === 'users' ? 'data-[state=active]:bg-gray-700' : ''}
      >
        Users
      </TabsTrigger>
      <TabsTrigger 
        value="analytics"
        onClick={() => handleTabChange("analytics")}
        className={activeTab === 'analytics' ? 'data-[state=active]:bg-gray-700' : ''}
      >
        Analytics
      </TabsTrigger>
      <TabsTrigger 
        value="settings"
        onClick={() => handleTabChange("settings")}
        className={activeTab === 'settings' ? 'data-[state=active]:bg-gray-700' : ''}
      >
        Settings
      </TabsTrigger>
    </TabsList>
  );
};

export default AdminNavTabs;
