
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Volume2, VolumeX, Heart } from 'lucide-react';
import LoadingScreen from '@/components/LoadingScreen';
import MFlixLogo from '@/components/MFlixLogo';
import AdBanner from '@/components/ads/AdBanner';

const MobileShortsPage = () => {
  const { toast } = useToast();
  const [shorts, setShorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement }>({});
  const [liked, setLiked] = useState<{[key: string]: boolean}>({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
  
  // Check screen orientation and size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch shorts data
  useEffect(() => {
    const fetchShorts = async () => {
      try {
        const { data, error } = await supabase
          .from('shorts')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setShorts(data || []);
      } catch (error) {
        console.error('Error fetching shorts:', error);
        toast({
          title: 'Error',
          description: 'Failed to load shorts. Please try again later.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchShorts();
  }, [toast]);
  
  // Handle video playback when active index changes
  useEffect(() => {
    if (shorts.length > 0) {
      // Pause all videos
      Object.values(videoRefs.current).forEach(videoEl => {
        if (videoEl) videoEl.pause();
      });
      
      // Play the current video
      const currentVideo = videoRefs.current[activeIndex];
      if (currentVideo) {
        currentVideo.currentTime = 0;
        const playPromise = currentVideo.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Error playing video:', error);
          });
        }
      }
    }
  }, [activeIndex, shorts]);
  
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (loading || shorts.length === 0) return;
    
    const container = e.currentTarget;
    const scrollPosition = container.scrollTop;
    const itemHeight = container.clientHeight;
    
    // Calculate which short should be active
    const newIndex = Math.round(scrollPosition / itemHeight);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < shorts.length) {
      setActiveIndex(newIndex);
    }
  };
  
  const toggleMute = () => {
    setMuted(!muted);
    
    // Apply mute state to all videos
    Object.values(videoRefs.current).forEach(videoEl => {
      if (videoEl) videoEl.muted = !muted;
    });
  };
  
  const toggleLike = (shortId: string) => {
    setLiked(prev => ({ 
      ...prev, 
      [shortId]: !prev[shortId] 
    }));
  };

  if (loading) {
    return <LoadingScreen />;
  }
  
  // Show message for desktop users
  if (!isMobile && !isPortrait) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-bold mb-6">Mobile Shorts</h1>
          <p className="text-lg mb-8">This feature is optimized for mobile devices in portrait mode.</p>
          <div className="mb-8">
            <img 
              src="https://via.placeholder.com/300x600?text=Mobile+Preview"
              alt="Mobile Preview"
              className="mx-auto rounded-3xl border-4 border-gray-700 shadow-lg"
            />
          </div>
          <p className="text-gray-400 mb-6">For the best experience, please visit this page on your mobile device or resize your browser window to portrait orientation.</p>
          <div className="flex justify-center">
            <Link to="/">
              <Button>
                <ChevronLeft className="mr-2" size={16} />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-black min-h-screen text-white">
      {/* Top navigation bar */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-gradient-to-b from-black via-black/80 to-transparent p-4 flex justify-between items-center">
        <Link to="/" className="text-white flex items-center">
          <ChevronLeft className="mr-1" size={20} />
          Back
        </Link>
        <div>
          <MFlixLogo />
        </div>
        <div className="w-8">
          {/* Empty div for flex spacing */}
        </div>
      </div>
      
      {/* Shorts content */}
      <div 
        className="h-screen overflow-y-scroll snap-y snap-mandatory" 
        onScroll={handleScroll}
      >
        {shorts.length === 0 ? (
          <div className="h-screen flex items-center justify-center">
            <p className="text-center text-gray-400">No shorts available</p>
          </div>
        ) : (
          shorts.map((short, index) => (
            <div key={short.id} className="h-screen w-full snap-start snap-always relative">
              {/* Video container */}
              <div className="absolute inset-0 bg-black">
                <video
                  ref={el => el && (videoRefs.current[index] = el)}
                  src={short.video_url}
                  poster={short.thumbnail_url}
                  className="h-full w-full object-contain"
                  playsInline
                  loop
                  muted={muted}
                  controls={false}
                />
              </div>
              
              {/* Video info overlay */}
              <div className="absolute bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                <h3 className="text-xl font-bold mb-2">{short.title}</h3>
              </div>
              
              {/* Side controls */}
              <div className="absolute right-4 bottom-32 flex flex-col gap-6">
                <button 
                  className="h-10 w-10 rounded-full bg-gray-800/60 flex items-center justify-center"
                  onClick={() => toggleLike(short.id)}
                >
                  <Heart 
                    size={24} 
                    className={liked[short.id] ? "fill-red-500 text-red-500" : "text-white"} 
                  />
                </button>
                
                <button 
                  className="h-10 w-10 rounded-full bg-gray-800/60 flex items-center justify-center"
                  onClick={toggleMute}
                >
                  {muted ? (
                    <VolumeX size={24} className="text-white" />
                  ) : (
                    <Volume2 size={24} className="text-white" />
                  )}
                </button>
              </div>
            </div>
          ))
        )}
        
        {/* Ad banner at end */}
        <div className="h-20 w-full">
          <AdBanner position="shorts" className="h-full w-full" />
        </div>
      </div>
    </div>
  );
};

export default MobileShortsPage;
