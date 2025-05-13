
import { Link, useLocation } from 'react-router-dom';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Film, BarChart3, Settings, Users, Monitor, Tv2, VideoIcon, LibraryBig } from 'lucide-react';

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
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex space-x-2">
          {currentPath !== '/admin/content' && (
            <Link to="/admin/content">
              <Button variant="outline" size="sm">
                <LibraryBig className="h-4 w-4 mr-1" /> Content Management
              </Button>
            </Link>
          )}
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

// Helper function to determine active tab
const getTabValue = (path: string) => {
  if (path.includes('dashboard')) return 'analytics';
  if (path.includes('movies')) return 'movies';
  if (path.includes('web-series')) return 'webseries';
  if (path.includes('anime')) return 'anime';
  if (path.includes('shorts')) return 'shorts';
  if (path.includes('users')) return 'users';
  if (path.includes('settings')) return 'settings';
  return 'analytics';
};

export default AdminNavTabs;
