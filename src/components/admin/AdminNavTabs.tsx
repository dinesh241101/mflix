
import { Link, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Film, BarChart3, Settings, Users, Monitor, Tv2, VideoIcon, LibraryBig } from 'lucide-react';

const AdminNavTabs = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
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
      
      <Tabs defaultValue="analytics" value={getTabValue(currentPath)}>
        <TabsList className="w-full max-w-4xl">
          <TabsTrigger value="analytics" asChild>
            <Link to="/admin/dashboard" className="w-full">
              <BarChart3 className="h-4 w-4 mr-2" /> Analytics
            </Link>
          </TabsTrigger>
          <TabsTrigger value="movies" asChild>
            <Link to="/admin/movies" className="w-full">
              <Film className="h-4 w-4 mr-2" /> Movies
            </Link>
          </TabsTrigger>
          <TabsTrigger value="webseries" asChild>
            <Link to="/admin/web-series" className="w-full">
              <Tv2 className="h-4 w-4 mr-2" /> Web Series
            </Link>
          </TabsTrigger>
          <TabsTrigger value="anime" asChild>
            <Link to="/admin/anime" className="w-full">
              <Monitor className="h-4 w-4 mr-2" /> Anime
            </Link>
          </TabsTrigger>
          <TabsTrigger value="shorts" asChild>
            <Link to="/admin/shorts" className="w-full">
              <VideoIcon className="h-4 w-4 mr-2" /> Shorts
            </Link>
          </TabsTrigger>
          <TabsTrigger value="users" asChild>
            <Link to="/admin/users" className="w-full">
              <Users className="h-4 w-4 mr-2" /> Users
            </Link>
          </TabsTrigger>
          <TabsTrigger value="settings" asChild>
            <Link to="/admin/settings" className="w-full">
              <Settings className="h-4 w-4 mr-2" /> Settings
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
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
