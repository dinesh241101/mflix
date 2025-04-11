
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Film, Video, Layers, Users, BarChart3, Settings 
} from "lucide-react";

interface AdminNavTabsProps {
  activeTab: string;
}

const AdminNavTabs = ({ activeTab }: AdminNavTabsProps) => {
  return (
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
  );
};

export default AdminNavTabs;
