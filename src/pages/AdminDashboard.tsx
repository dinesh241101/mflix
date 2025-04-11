
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Search, Upload, ChevronDown, LogOut, Users, BarChart3, Settings, Film, Tv, Layers, PlusCircle, UserPlus, UserMinus, Edit, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [activeTab, setActiveTab] = useState("movies");
  
  // Form states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const email = localStorage.getItem("adminEmail");
    
    if (token) {
      setIsLoggedIn(true);
      setAdminEmail(email || "admin@example.com");
    } else {
      navigate("/admin/login");
    }
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    setIsLoggedIn(false);
    navigate("/admin/login");
  };

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

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Not Implemented",
      description: "Password change requires Supabase integration. Please connect to Supabase first.",
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

  // Mock users data for the UI
  const mockUsers = [
    { id: 1, email: "user1@example.com", role: "Admin", status: "Active" },
    { id: 2, email: "user2@example.com", role: "Editor", status: "Active" },
    { id: 3, email: "user3@example.com", role: "Viewer", status: "Inactive" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">MFlix Admin</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">Welcome, {adminEmail}</span>
              <button 
                className="text-red-400 hover:text-red-300 flex items-center"
                onClick={handleLogout}
              >
                <LogOut size={16} className="mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full bg-gray-800 p-0 rounded-lg mb-6">
            <TabsTrigger value="movies" className="flex-1 py-3">
              <Film className="mr-2" size={16} />
              Movies
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

          <TabsContent value="movies" className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Upload New Content</h2>
            <form onSubmit={handleUploadMovie} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                  <Input className="bg-gray-700 border-gray-600" placeholder="Movie or series title" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Year</label>
                  <Input type="number" className="bg-gray-700 border-gray-600" placeholder="2025" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Content Type</label>
                <Select>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="movie">Movie</SelectItem>
                    <SelectItem value="series">Web Series</SelectItem>
                    <SelectItem value="anime">Anime</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Genre</label>
                <Select>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="action">Action</SelectItem>
                    <SelectItem value="comedy">Comedy</SelectItem>
                    <SelectItem value="drama">Drama</SelectItem>
                    <SelectItem value="horror">Horror</SelectItem>
                    <SelectItem value="sci-fi">Sci-Fi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Quality</label>
                <Select>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1080p">1080p</SelectItem>
                    <SelectItem value="720p">720p</SelectItem>
                    <SelectItem value="480p">480p</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Country</label>
                <Input className="bg-gray-700 border-gray-600" placeholder="Country of origin" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Director</label>
                <Input className="bg-gray-700 border-gray-600" placeholder="Director name" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Production House</label>
                <Input className="bg-gray-700 border-gray-600" placeholder="Production company" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">IMDB Rating</label>
                <Input type="number" step="0.1" min="0" max="10" className="bg-gray-700 border-gray-600" placeholder="8.5" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Storyline</label>
                <Textarea 
                  className="w-full min-h-[100px] rounded-md bg-gray-700 border-gray-600 text-white p-3"
                  placeholder="Enter movie storyline..."
                ></Textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">SEO Tags (comma separated)</label>
                <Input className="bg-gray-700 border-gray-600" placeholder="action, thriller, 2025, new release" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Poster Image URL</label>
                <Input className="bg-gray-700 border-gray-600" placeholder="https://example.com/image.jpg" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Featured on Homepage</label>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="featured" className="rounded bg-gray-700 border-gray-600" />
                  <label htmlFor="featured">Show on homepage carousel</label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Download URLs (one per line)</label>
                <Textarea 
                  className="w-full min-h-[100px] rounded-md bg-gray-700 border-gray-600 text-white p-3"
                  placeholder="Quality: 1080p, Size: 2.1GB, URL: https://example.com/download1&#10;Quality: 720p, Size: 1.2GB, URL: https://example.com/download2"
                ></Textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">YouTube Trailer URL</label>
                <Input className="bg-gray-700 border-gray-600" placeholder="https://youtube.com/watch?v=xxxxx" />
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                <Upload className="mr-2" size={16} />
                Upload Content
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="ads" className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Ads & Affiliate Links</h2>
            <form onSubmit={handleUploadAd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Ad Type</label>
                <Select>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select ad type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="banner">Banner Image</SelectItem>
                    <SelectItem value="video">Video Ad</SelectItem>
                    <SelectItem value="affiliate">Affiliate Link</SelectItem>
                    <SelectItem value="popup">Popup Ad</SelectItem>
                    <SelectItem value="interstitial">Interstitial Ad</SelectItem>
                    <SelectItem value="clickAction">Click Action Ad</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Ad Name</label>
                <Input className="bg-gray-700 border-gray-600" placeholder="Ad campaign name" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Ad Position</label>
                <Select>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select ad position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home Page</SelectItem>
                    <SelectItem value="detail">Movie Detail Page</SelectItem>
                    <SelectItem value="click">After Click Action</SelectItem>
                    <SelectItem value="side">Side Panel</SelectItem>
                    <SelectItem value="shorts">After Video Shorts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Content URL (Image/Video)</label>
                <Input className="bg-gray-700 border-gray-600" placeholder="https://example.com/ad-image.jpg" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Target URL</label>
                <Input className="bg-gray-700 border-gray-600" placeholder="https://advertiser.com/landing-page" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Display Frequency</label>
                <div className="flex items-center">
                  <span className="mr-2">Show every</span>
                  <Input type="number" min="1" max="10" defaultValue="2" className="w-16 bg-gray-700 border-gray-600" />
                  <span className="ml-2">clicks</span>
                </div>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                <Upload className="mr-2" size={16} />
                Save Ad
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="users" className="bg-gray-800 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">User Management</h2>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <UserPlus className="mr-2" size={16} />
                Add New User
              </Button>
            </div>
            
            <div className="bg-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Role</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-right p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map(user => (
                    <tr key={user.id} className="border-t border-gray-600">
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.role}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'Active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <Button variant="ghost" size="sm" className="mr-2">
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500">
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 text-center text-gray-400">
              <p>Note: User management requires Supabase integration.</p>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-6">Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-gray-400 text-sm mb-1">Total Downloads</h3>
                <p className="text-2xl font-bold">12,345</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-gray-400 text-sm mb-1">Active Users</h3>
                <p className="text-2xl font-bold">5,678</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-gray-400 text-sm mb-1">Ad Clicks</h3>
                <p className="text-2xl font-bold">3,210</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-gray-400 text-sm mb-1">Ad Revenue</h3>
                <p className="text-2xl font-bold">$1,234</p>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">User Demographics</h3>
              <div className="bg-gray-700 p-4 rounded-lg h-64 flex items-center justify-center">
                <p className="text-gray-400">Analytics charts will appear here after Supabase integration.</p>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Top Countries</h3>
              <div className="bg-gray-700 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="text-left p-3">Country</th>
                      <th className="text-left p-3">Users</th>
                      <th className="text-left p-3">Downloads</th>
                      <th className="text-left p-3">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-600">
                      <td className="p-3">United States</td>
                      <td className="p-3">1,234</td>
                      <td className="p-3">3,456</td>
                      <td className="p-3">$567</td>
                    </tr>
                    <tr className="border-t border-gray-600">
                      <td className="p-3">India</td>
                      <td className="p-3">987</td>
                      <td className="p-3">2,345</td>
                      <td className="p-3">$345</td>
                    </tr>
                    <tr className="border-t border-gray-600">
                      <td className="p-3">United Kingdom</td>
                      <td className="p-3">876</td>
                      <td className="p-3">1,987</td>
                      <td className="p-3">$234</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="text-center text-gray-400">
              <p>Note: Analytics tracking requires Supabase integration.</p>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Admin Settings</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Change Password</h3>
                <form onSubmit={handlePasswordChange} className="space-y-3 bg-gray-700 p-4 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Current Password</label>
                    <Input 
                      type="password" 
                      className="bg-gray-600 border-gray-500" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                    <Input 
                      type="password" 
                      className="bg-gray-600 border-gray-500" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Confirm New Password</label>
                    <Input 
                      type="password" 
                      className="bg-gray-600 border-gray-500" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Update Password
                  </Button>
                </form>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Website Settings</h3>
                <div className="bg-gray-700 p-4 rounded-lg space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Website Title</label>
                    <Input className="bg-gray-600 border-gray-500" defaultValue="MFlix - Movie Download Hub" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Meta Description</label>
                    <Textarea className="bg-gray-600 border-gray-500" defaultValue="Download your favorite movies, web series and anime" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Favicon URL</label>
                    <Input className="bg-gray-600 border-gray-500" defaultValue="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=32&h=32&fit=crop&auto=format" />
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Save Settings
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
