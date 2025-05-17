
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import ShortsPlayer from "@/components/ShortsPlayer";
import MFlixLogo from "@/components/MFlixLogo";
import LoadingScreen from "@/components/LoadingScreen";
import { VideoIcon } from "lucide-react";

const MobileShortsPage = () => {
  const [shorts, setShorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentShortId, setCurrentShortId] = useState<string | number | null>(null);
  const isMobile = useIsMobile();
  
  // Fetch shorts from Supabase
  useEffect(() => {
    document.title = "Shorts - MFlix";
    
    const fetchShorts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('shorts')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setShorts(data || []);
      } catch (err: any) {
        console.error("Error fetching shorts:", err);
        setError(err.message || "Error fetching shorts");
      } finally {
        setLoading(false);
      }
    };
    
    fetchShorts();
    
    // Track page view
    supabase.from('analytics').insert({
      page_visited: 'shorts',
      browser: navigator.userAgent,
      device: 'mobile',
      os: navigator.platform
    }).then(() => console.log("Analytics tracked"));
    
  }, []);
  
  // Redirect desktop users to the home page
  useEffect(() => {
    if (isMobile === false) {
      window.location.href = "/";
    }
  }, [isMobile]);
  
  if (loading) {
    return <LoadingScreen message="Loading Shorts" />;
  }
  
  if (!isMobile) {
    return null; // Will redirect in useEffect
  }

  // Handle short click to open player
  const handleShortClick = (shortId: string | number) => {
    setCurrentShortId(shortId);
    setShowPlayer(true);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/">
              <MFlixLogo />
            </Link>
            <nav>
              <ul className="flex space-x-4">
                <li><Link to="/" className="hover:text-blue-400">Home</Link></li>
                <li><Link to="/shorts" className="text-blue-400">Shorts</Link></li>
                <li><Link to="/movies" className="hover:text-blue-400">Movies</Link></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Trending Shorts</h1>
        
        {error ? (
          <div className="bg-red-900/30 border border-red-500 p-4 rounded-lg text-center">
            <p>{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-2">
              Try Again
            </Button>
          </div>
        ) : shorts.length === 0 ? (
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <p>No shorts available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {shorts.map((short) => (
              <div 
                key={short.id} 
                className="bg-gray-800 rounded-lg overflow-hidden"
                onClick={() => handleShortClick(short.id)}
              >
                <div className="relative aspect-[9/16] bg-gray-700">
                  {short.thumbnail_url ? (
                    <img 
                      src={short.thumbnail_url} 
                      alt={short.title} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <VideoIcon size={48} className="text-gray-500" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                      <VideoIcon size={24} className="text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <h3 className="font-medium text-sm truncate">{short.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Shorts Player */}
      {showPlayer && (
        <ShortsPlayer 
          shorts={currentShortId ? shorts.filter(s => s.id === currentShortId) : shorts} 
          onClose={() => setShowPlayer(false)} 
        />
      )}
    </div>
  );
};

export default MobileShortsPage;
