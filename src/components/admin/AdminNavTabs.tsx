
import { Link } from "react-router-dom";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Film, Video, Layers, Users, BarChart3, Settings, Tv, Radio
} from "lucide-react";

interface AdminNavTabsProps {
  activeTab: string;
}

const AdminNavTabs = ({ activeTab }: AdminNavTabsProps) => {
  return (
    <div className="flex flex-col space-y-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Admin Dashboard</h2>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link to="/admin/movies" className={`flex items-center p-3 rounded-md ${activeTab === "movies" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}>
            <Film className="mr-2" size={18} />
            Movies
          </Link>
          
          <Link to="/admin/web-series" className={`flex items-center p-3 rounded-md ${activeTab === "web-series" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}>
            <Tv className="mr-2" size={18} />
            Web Series
          </Link>
          
          <Link to="/admin/anime" className={`flex items-center p-3 rounded-md ${activeTab === "anime" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}>
            <Radio className="mr-2" size={18} />
            Anime
          </Link>
          
          <Link to="/admin/shorts" className={`flex items-center p-3 rounded-md ${activeTab === "shorts" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}>
            <Video className="mr-2" size={18} />
            Shorts
          </Link>
        </div>
      </div>
      
      <TabsList className="w-full bg-gray-800 p-0 rounded-lg mb-6">
        <TabsTrigger value="movies" className="flex-1 py-3">
          <Film className="mr-2" size={16} />
          Movies
        </TabsTrigger>
        <TabsTrigger value="shorts" className="flex-1 py-3">
          <Video className="mr-2" size={16} />
          Shorts
        </TabsTrigger>
        <TabsTrigger value="ads" className="flex-1 py-3">
          <Layers className="mr-2" size={16} />
          Ads & Affiliates
        </TabsTrigger>
        <TabsTrigger value="users" className="flex-1 py-3">
          <Users className="mr-2" size={16} />
          Users
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex-1 py-3">
          <BarChart3 className="mr-2" size={16} />
          Analytics
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex-1 py-3">
          <Settings className="mr-2" size={16} />
          Settings
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default AdminNavTabs;
