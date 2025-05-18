
import { useNavigate, useLocation } from 'react-router-dom';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Film, BarChart3, Settings, Users, Monitor, Tv2, VideoIcon, LibraryBig, BanknoteIcon } from 'lucide-react';

interface AdminNavTabsProps {
  activeTab?: string;
}

const AdminNavTabs = ({ activeTab }: AdminNavTabsProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const currentTabValue = activeTab || getTabValue(currentPath);
  
  // Handle navigation without page reloads
  const handleNavigation = (path: string) => {
    navigate(path, { replace: true }); // Use replace to avoid building up history stack
  };
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => handleNavigation('/admin/dashboard')} 
            className="text-sm text-gray-400 hover:text-white bg-transparent border-none cursor-pointer"
          >
            Dashboard
          </button>
          <span className="text-gray-600">/</span>
          <span className="text-sm">
            {currentTabValue.charAt(0).toUpperCase() + currentTabValue.slice(1)}
          </span>
        </div>
      </div>
      
      <TabsList className="w-full max-w-4xl overflow-x-auto">
        <TabsTrigger 
          value="analytics" 
          onClick={() => handleNavigation('/admin/dashboard')}
          className={currentTabValue === 'analytics' ? 'data-[state=active]:bg-blue-500' : ''}
        >
          <BarChart3 className="h-4 w-4 mr-2" /> Analytics
        </TabsTrigger>
        <TabsTrigger 
          value="movies" 
          onClick={() => handleNavigation('/admin/movies')}
          className={currentTabValue === 'movies' ? 'data-[state=active]:bg-blue-500' : ''}
        >
          <Film className="h-4 w-4 mr-2" /> Movies
        </TabsTrigger>
        <TabsTrigger 
          value="webseries" 
          onClick={() => handleNavigation('/admin/web-series')}
          className={currentTabValue === 'webseries' ? 'data-[state=active]:bg-blue-500' : ''}
        >
          <Tv2 className="h-4 w-4 mr-2" /> Web Series
        </TabsTrigger>
        <TabsTrigger 
          value="anime" 
          onClick={() => handleNavigation('/admin/anime')}
          className={currentTabValue === 'anime' ? 'data-[state=active]:bg-blue-500' : ''}
        >
          <Monitor className="h-4 w-4 mr-2" /> Anime
        </TabsTrigger>
        <TabsTrigger 
          value="shorts" 
          onClick={() => handleNavigation('/admin/shorts')}
          className={currentTabValue === 'shorts' ? 'data-[state=active]:bg-blue-500' : ''}
        >
          <VideoIcon className="h-4 w-4 mr-2" /> Shorts
        </TabsTrigger>
        <TabsTrigger 
          value="ads" 
          onClick={() => handleNavigation('/admin/ads')}
          className={currentTabValue === 'ads' ? 'data-[state=active]:bg-blue-500' : ''}
        >
          <BanknoteIcon className="h-4 w-4 mr-2" /> Ads
        </TabsTrigger>
        <TabsTrigger 
          value="content" 
          onClick={() => handleNavigation('/admin/content')}
          className={currentTabValue === 'content' ? 'data-[state=active]:bg-blue-500' : ''}
        >
          <LibraryBig className="h-4 w-4 mr-2" /> Content
        </TabsTrigger>
        <TabsTrigger 
          value="users" 
          onClick={() => handleNavigation('/admin/users')}
          className={currentTabValue === 'users' ? 'data-[state=active]:bg-blue-500' : ''}
        >
          <Users className="h-4 w-4 mr-2" /> Users
        </TabsTrigger>
        <TabsTrigger 
          value="settings" 
          onClick={() => handleNavigation('/admin/settings')}
          className={currentTabValue === 'settings' ? 'data-[state=active]:bg-blue-500' : ''}
        >
          <Settings className="h-4 w-4 mr-2" /> Settings
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

// Helper function to determine which tab is active based on the path
function getTabValue(path: string): string {
  if (path.includes('dashboard')) return 'analytics';
  if (path.includes('movies')) return 'movies';
  if (path.includes('web-series')) return 'webseries';
  if (path.includes('anime')) return 'anime';
  if (path.includes('shorts')) return 'shorts';
  if (path.includes('ads')) return 'ads';
  if (path.includes('content')) return 'content'; 
  if (path.includes('users')) return 'users';
  if (path.includes('settings')) return 'settings';
  return 'analytics';
}

export default AdminNavTabs;
