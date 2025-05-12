
import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { supabase } from "@/integrations/supabase/client";
import { Search, Home, Film, Tv, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingScreen from "@/components/LoadingScreen";
import { useToast } from "@/components/ui/use-toast";
import MFlixLogo from "@/components/MFlixLogo";
import MovieGrid from "@/components/MovieGrid";
import MovieCarousel from "@/components/MovieCarousel";
import ShortsPlayer from "@/components/ShortsPlayer";

const Index = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [featuredMovies, setFeaturedMovies] = useState<any[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<any[]>([]);
  const [webSeries, setWebSeries] = useState<any[]>([]);
  const [animeShows, setAnimeShows] = useState<any[]>([]);
  const [shorts, setShorts] = useState<any[]>([]);
  const [showShorts, setShowShorts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Progressive loading state
  const [visibleSections, setVisibleSections] = useState({
    featured: true,
    trending: false,
    series: false,
    anime: false
  });
  const trendingRef = useRef<HTMLDivElement>(null);
  const seriesRef = useRef<HTMLDivElement>(null);
  const animeRef = useRef<HTMLDivElement>(null);
  
  // Tracking analytics
  useEffect(() => {
    const trackVisit = async () => {
      try {
        await supabase.from('analytics').insert({
          page_visited: 'home',
          browser: navigator.userAgent,
          device: /Mobile|Android|iPhone/.test(navigator.userAgent) ? 'mobile' : 'desktop',
          os: navigator.platform
        });
      } catch (error) {
        console.error("Analytics error:", error);
      }
    };
    
    trackVisit();
  }, []);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured movies first to show content quickly
        const { data: featured, error: featuredError } = await supabase
          .from('movies')
          .select('id, title, year, genre, poster_url, imdb_rating, downloads, content_type')
          .eq('featured', true)
          .limit(5);
        
        if (featuredError) throw featuredError;
        
        setFeaturedMovies(featured || []);
        setLoading(false); // Stop loading after featured content is loaded
        
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load content. Please try again later.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  // Intersection observer for lazy loading sections
  useEffect(() => {
    const observerOptions = {
      rootMargin: '100px',
      threshold: 0.1
    };

    const observerCallback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          
          // Load content for the section that's coming into view
          if (sectionId === 'trending-section' && !visibleSections.trending) {
            loadTrendingMovies();
            setVisibleSections(prev => ({ ...prev, trending: true }));
          } 
          else if (sectionId === 'series-section' && !visibleSections.series) {
            loadWebSeries();
            setVisibleSections(prev => ({ ...prev, series: true }));
          }
          else if (sectionId === 'anime-section' && !visibleSections.anime) {
            loadAnimeShows();
            setVisibleSections(prev => ({ ...prev, anime: true }));
            // Also load shorts when we get to the bottom section
            loadShorts();
          }
          
          // Unobserve the element once it's been loaded
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe refs
    if (trendingRef.current) observer.observe(trendingRef.current);
    if (seriesRef.current) observer.observe(seriesRef.current);
    if (animeRef.current) observer.observe(animeRef.current);
    
    return () => observer.disconnect();
  }, []);

  // Load trending movies when section becomes visible
  const loadTrendingMovies = async () => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('id, title, year, genre, poster_url, imdb_rating, downloads, content_type')
        .eq('content_type', 'movie')
        .order('downloads', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      setTrendingMovies(data || []);
      
    } catch (error) {
      console.error("Error loading trending movies:", error);
    }
  };

  // Load web series when section becomes visible
  const loadWebSeries = async () => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('id, title, year, genre, poster_url, imdb_rating, downloads, content_type')
        .eq('content_type', 'series')
        .limit(8);
      
      if (error) throw error;
      setWebSeries(data || []);
      
    } catch (error) {
      console.error("Error loading web series:", error);
    }
  };

  // Load anime shows when section becomes visible
  const loadAnimeShows = async () => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('id, title, year, genre, poster_url, imdb_rating, downloads, content_type')
        .eq('content_type', 'anime')
        .limit(8);
      
      if (error) throw error;
      setAnimeShows(data || []);
      
    } catch (error) {
      console.error("Error loading anime shows:", error);
    }
  };

  // Load shorts
  const loadShorts = async () => {
    try {
      const { data, error } = await supabase
        .from('shorts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setShorts(data || []);
      
    } catch (error) {
      console.error("Error loading shorts:", error);
    }
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Search",
        description: `Searching for: ${searchQuery}`,
      });
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  // Handle empty state with dummy data
  if (featuredMovies.length === 0) {
    featuredMovies.push(
      {
        id: 1,
        title: "Sample Movie",
        poster_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
        year: 2025,
        rating: 8.5,
        genre: ["Action"],
        downloads: 1250
      }
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header/Navigation */}
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <MFlixLogo />
            <nav>
              <ul className="flex space-x-6">
                <li><Link to="/" className="hover:text-blue-400 flex items-center"><Home className="mr-1" size={16} /> Home</Link></li>
                <li><Link to="/movies" className="hover:text-blue-400 flex items-center"><Film className="mr-1" size={16} /> Movies</Link></li>
                <li><Link to="/series" className="hover:text-blue-400 flex items-center"><Tv className="mr-1" size={16} /> Web Series</Link></li>
                <li><Link to="/anime" className="hover:text-blue-400 flex items-center"><Tv className="mr-1" size={16} /> Anime</Link></li>
                <li>
                  <button 
                    onClick={() => setShowShorts(true)} 
                    className="hover:text-blue-400 flex items-center"
                  >
                    <Video className="mr-1" size={16} /> Shorts
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <section className="py-4 bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by movie title, director, production house, genre..." 
              className="w-full py-2 pl-10 pr-20 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded-md"
            >
              Search
            </Button>
          </form>
        </div>
      </section>

      {/* Hero Banner with Auto-Sliding Carousel */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Carousel className="w-full" opts={{ loop: true, duration: 5000 }}>
            <CarouselContent>
              {featuredMovies.map((movie, index) => (
                <CarouselItem key={movie.id || index} className="basis-full">
                  <Link to={`/movie/${movie.id}`}>
                    <div className="h-[400px] relative transform transition-all duration-300 hover:scale-[1.01] cursor-pointer">
                      <img 
                        src={movie.poster_url || "https://images.unsplash.com/photo-1500673922987-e212871fec22"} 
                        alt={movie.title} 
                        className="w-full h-full object-cover rounded-xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex flex-col justify-end p-8">
                        <h2 className="text-3xl font-bold mb-2">{movie.title}</h2>
                        <div className="flex items-center space-x-4 mb-2">
                          <span className="bg-blue-600 px-2 py-1 rounded text-sm">{movie.year}</span>
                          {movie.genre && movie.genre[0] && 
                            <span className="bg-gray-700 px-2 py-1 rounded text-sm">{movie.genre[0]}</span>
                          }
                          {movie.imdb_rating && 
                            <span className="bg-yellow-500 text-black px-2 py-1 rounded text-sm font-bold">IMDb {movie.imdb_rating}</span>
                          }
                        </div>
                        <p className="text-lg">Click to view details</p>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
          </Carousel>
        </div>
      </section>

      {/* Latest Uploads */}
      <MovieGrid 
        movies={featuredMovies} 
        title="Latest Uploads" 
      />

      {/* Trending Movies with Carousel - Lazy Loaded */}
      <div id="trending-section" ref={trendingRef}>
        {visibleSections.trending ? (
          <MovieCarousel 
            movies={trendingMovies.length ? trendingMovies : featuredMovies} 
            title="Trending Movies" 
            bgClass="bg-gray-800"
          />
        ) : (
          <div className="py-12 bg-gray-800">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-6">Trending Movies</h2>
              <div className="flex justify-center">
                <div className="animate-pulse w-full max-w-screen-xl">
                  <div className="flex space-x-4 overflow-x-auto pb-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex-none w-64">
                        <div className="h-40 bg-gray-700 rounded mb-2"></div>
                        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Web Series - Lazy Loaded */}
      <div id="series-section" ref={seriesRef}>
        {visibleSections.series ? (
          <MovieGrid 
            movies={webSeries.length ? webSeries : []} 
            title="Web Series" 
          />
        ) : (
          <div className="py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-6">Web Series</h2>
              <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-800 rounded-lg overflow-hidden">
                    <div className="h-56 bg-gray-700"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Anime Section - Lazy Loaded */}
      <div id="anime-section" ref={animeRef}>
        {visibleSections.anime ? (
          <MovieGrid 
            movies={animeShows.length ? animeShows : []} 
            title="Anime" 
            bgClass="bg-gray-800"
          />
        ) : (
          <div className="py-12 bg-gray-800">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-6">Anime</h2>
              <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-700 rounded-lg overflow-hidden">
                    <div className="h-56 bg-gray-600"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Shorts Player */}
      {showShorts && shorts.length > 0 && (
        <ShortsPlayer shorts={shorts} onClose={() => setShowShorts(false)} />
      )}

      {/* Footer */}
      <footer className="bg-gray-800 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-400">
            <p>© 2025 MFlix. All rights reserved.</p>
            <p className="mt-2">Disclaimer: This site does not store any files on its server. All contents are provided by non-affiliated third parties.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
