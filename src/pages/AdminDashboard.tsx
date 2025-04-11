
import { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const AdminDashboard = () => {
  // This is a placeholder for now - we'll integrate with Supabase later
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Placeholder functions - will be implemented with Supabase
  const handleUploadMovie = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Not Implemented",
      description: "Movie upload requires Supabase integration. Please connect to Supabase first.",
    });
  };

  const handleUploadAd = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Not Implemented",
      description: "Ad upload requires Supabase integration. Please connect to Supabase first.",
    });
  };

  // For unauthorized access
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">You need to log in to access the admin panel</p>
          <Link 
            to="/admin/login" 
            className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">MFlix Admin</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">Welcome, Admin</span>
              <button 
                className="text-red-400 hover:text-red-300"
                onClick={() => setIsLoggedIn(false)}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="movies">
          <TabsList className="w-full bg-gray-800 p-0 rounded-lg mb-6">
            <TabsTrigger value="movies" className="flex-1 py-3">Movies</TabsTrigger>
            <TabsTrigger value="ads" className="flex-1 py-3">Ads & Affiliates</TabsTrigger>
            <TabsTrigger value="users" className="flex-1 py-3">Users</TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1 py-3">Analytics</TabsTrigger>
            <TabsTrigger value="settings" className="flex-1 py-3">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="movies" className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Upload New Content</h2>
            <form onSubmit={handleUploadMovie} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                  <Input className="bg-gray-700 border-gray-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Year</label>
                  <Input type="number" className="bg-gray-700 border-gray-600" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Content Type</label>
                <select className="w-full h-10 rounded-md bg-gray-700 border-gray-600 text-white px-3">
                  <option>Movie</option>
                  <option>Web Series</option>
                  <option>Anime</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Genre</label>
                <select className="w-full h-10 rounded-md bg-gray-700 border-gray-600 text-white px-3">
                  <option>Action</option>
                  <option>Comedy</option>
                  <option>Drama</option>
                  <option>Horror</option>
                  <option>Sci-Fi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Quality</label>
                <select className="w-full h-10 rounded-md bg-gray-700 border-gray-600 text-white px-3">
                  <option>1080p</option>
                  <option>720p</option>
                  <option>480p</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Country</label>
                <Input className="bg-gray-700 border-gray-600" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">IMDB Rating</label>
                <Input type="number" step="0.1" min="0" max="10" className="bg-gray-700 border-gray-600" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Storyline</label>
                <textarea 
                  className="w-full min-h-[100px] rounded-md bg-gray-700 border-gray-600 text-white p-3"
                  placeholder="Enter movie storyline..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Poster Image URL</label>
                <Input className="bg-gray-700 border-gray-600" placeholder="https://example.com/image.jpg" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Download URL</label>
                <Input className="bg-gray-700 border-gray-600" placeholder="https://example.com/download" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">YouTube Trailer URL</label>
                <Input className="bg-gray-700 border-gray-600" placeholder="https://youtube.com/watch?v=xxxxx" />
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Upload Content
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="ads" className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Ads & Affiliate Links</h2>
            <form onSubmit={handleUploadAd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Ad Type</label>
                <select className="w-full h-10 rounded-md bg-gray-700 border-gray-600 text-white px-3">
                  <option>Banner Image</option>
                  <option>Video Ad</option>
                  <option>Affiliate Link</option>
                  <option>Popup Ad</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Ad Name</label>
                <Input className="bg-gray-700 border-gray-600" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Ad Position</label>
                <select className="w-full h-10 rounded-md bg-gray-700 border-gray-600 text-white px-3">
                  <option>Home Page</option>
                  <option>Movie Detail Page</option>
                  <option>After Click Action</option>
                  <option>Side Panel</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Content URL (Image/Video)</label>
                <Input className="bg-gray-700 border-gray-600" placeholder="https://example.com/ad-image.jpg" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Target URL</label>
                <Input className="bg-gray-700 border-gray-600" placeholder="https://advertiser.com/landing-page" />
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Save Ad
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="users" className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">User Management</h2>
            <p>User management requires Supabase integration. Please connect to Supabase first.</p>
          </TabsContent>

          <TabsContent value="analytics" className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Analytics</h2>
            <p>Analytics tracking requires Supabase integration. Please connect to Supabase first.</p>
          </TabsContent>

          <TabsContent value="settings" className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Admin Settings</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Change Password</h3>
                <form className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Current Password</label>
                    <Input type="password" className="bg-gray-700 border-gray-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                    <Input type="password" className="bg-gray-700 border-gray-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Confirm New Password</label>
                    <Input type="password" className="bg-gray-700 border-gray-600" />
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Update Password
                  </Button>
                </form>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
