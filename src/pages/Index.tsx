
import { useEffect, useState } from "react";
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

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured movies
        const { data: featured, error: featuredError } = await supabase
          .from('movies')
          .select('id, title, year, genre, poster_url, imdb_rating, downloads, content_type')
          .eq('featured', true)
          .limit(5);
        
        if (featuredError) throw featuredError;
        
        // Fetch trending movies (by downloads)
        const { data: trending, error: trendingError } = await supabase
          .from('movies')
          .select('id, title, year, genre, poster_url, imdb_rating, downloads, content_type')
          .eq('content_type', 'movie')
          .order('downloads', { ascending: false })
          .limit(10);
        
        if (trendingError) throw trendingError;
        
        // Fetch web series
        const { data: series, error: seriesError } = await supabase
          .from('movies')
          .select('id, title, year, genre, poster_url, imdb_rating, downloads, content_type')
          .eq('content_type', 'series')
          .limit(8);
        
        if (seriesError) throw seriesError;
        
        // Fetch anime
        const { data: anime, error: animeError } = await supabase
          .from('movies')
          .select('id, title, year, genre, poster_url, imdb_rating, downloads, content_type')
          .eq('content_type', 'anime')
          .limit(8);
        
        if (animeError) throw animeError;
        
        // Fetch shorts
        const { data: shortsData, error: shortsError } = await supabase
          .from('shorts')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (shortsError) throw shortsError;
        
        setFeaturedMovies(featured || []);
        setTrendingMovies(trending || []);
        setWebSeries(series || []);
        setAnimeShows(anime || []);
        setShorts(shortsData || []);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load content. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

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

      {/* Trending Movies with Carousel */}
      <MovieCarousel 
        movies={trendingMovies.length ? trendingMovies : featuredMovies} 
        title="Trending Movies" 
        bgClass="bg-gray-800"
      />

      {/* Web Series */}
      <MovieGrid 
        movies={webSeries.length ? webSeries : featuredMovies} 
        title="Web Series" 
      />

      {/* Anime Section */}
      <MovieGrid 
        movies={animeShows.length ? animeShows : featuredMovies} 
        title="Anime" 
        bgClass="bg-gray-800"
      />

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
