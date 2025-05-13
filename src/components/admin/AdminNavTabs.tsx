
import { Link, useLocation } from 'react-router-dom';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Film, BarChart3, Settings, Users, Monitor, Tv2, VideoIcon, LibraryBig, BanknoteIcon } from 'lucide-react';

interface AdminNavTabsProps {
  activeTab?: string;
}

const AdminNavTabs = ({ activeTab }: AdminNavTabsProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const currentTabValue = activeTab || getTabValue(currentPath);
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/dashboard" className="text-sm text-gray-400 hover:text-white">
            Dashboard
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-sm">
            {currentTabValue.charAt(0).toUpperCase() + currentTabValue.slice(1)}
          </span>
        </div>
      </div>
      
      <TabsList className="w-full max-w-4xl">
        <TabsTrigger value="analytics" asChild className={currentTabValue === 'analytics' ? 'data-[state=active]:bg-blue-500' : ''}>
          <Link to="/admin/dashboard" className="w-full">
            <BarChart3 className="h-4 w-4 mr-2" /> Analytics
          </Link>
        </TabsTrigger>
        <TabsTrigger value="movies" asChild className={currentTabValue === 'movies' ? 'data-[state=active]:bg-blue-500' : ''}>
          <Link to="/admin/movies" className="w-full">
            <Film className="h-4 w-4 mr-2" /> Movies
          </Link>
        </TabsTrigger>
        <TabsTrigger value="webseries" asChild className={currentTabValue === 'webseries' ? 'data-[state=active]:bg-blue-500' : ''}>
          <Link to="/admin/web-series" className="w-full">
            <Tv2 className="h-4 w-4 mr-2" /> Web Series
          </Link>
        </TabsTrigger>
        <TabsTrigger value="anime" asChild className={currentTabValue === 'anime' ? 'data-[state=active]:bg-blue-500' : ''}>
          <Link to="/admin/anime" className="w-full">
            <Monitor className="h-4 w-4 mr-2" /> Anime
          </Link>
        </TabsTrigger>
        <TabsTrigger value="shorts" asChild className={currentTabValue === 'shorts' ? 'data-[state=active]:bg-blue-500' : ''}>
          <Link to="/admin/shorts" className="w-full">
            <VideoIcon className="h-4 w-4 mr-2" /> Shorts
          </Link>
        </TabsTrigger>
        <TabsTrigger value="ads" asChild className={currentTabValue === 'ads' ? 'data-[state=active]:bg-blue-500' : ''}>
          <Link to="/admin/ads" className="w-full">
            <BanknoteIcon className="h-4 w-4 mr-2" /> Ads
          </Link>
        </TabsTrigger>
        <TabsTrigger value="content" asChild className={currentTabValue === 'content' ? 'data-[state=active]:bg-blue-500' : ''}>
          <Link to="/admin/content" className="w-full">
            <LibraryBig className="h-4 w-4 mr-2" /> Content
          </Link>
        </TabsTrigger>
        <TabsTrigger value="users" asChild className={currentTabValue === 'users' ? 'data-[state=active]:bg-blue-500' : ''}>
          <Link to="/admin/users" className="w-full">
            <Users className="h-4 w-4 mr-2" /> Users
          </Link>
        </TabsTrigger>
        <TabsTrigger value="settings" asChild className={currentTabValue === 'settings' ? 'data-[state=active]:bg-blue-500' : ''}>
          <Link to="/admin/settings" className="w-full">
            <Settings className="h-4 w-4 mr-2" /> Settings
          </Link>
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
