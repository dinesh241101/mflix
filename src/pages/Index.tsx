
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { supabase } from "@/integrations/supabase/client";
import { Search, Film, Tv, Home, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingScreen from "@/components/LoadingScreen";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [featuredMovies, setFeaturedMovies] = useState<any[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<any[]>([]);
  const [webSeries, setWebSeries] = useState<any[]>([]);
  const [animeShows, setAnimeShows] = useState<any[]>([]);
  const [shorts, setShorts] = useState<any[]>([]);
  const [showShorts, setShowShorts] = useState(false);
  const [currentShortIndex, setCurrentShortIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Tracking analytics - simplified version
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
      // In a real implementation, this would navigate to a search results page
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
            <Link to="/" className="text-2xl font-bold flex items-center hover:text-blue-400 transition-colors">
              <Film className="mr-2" />
              MFlix
            </Link>
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
          <Carousel className="w-full" opts={{ loop: true, duration: 5000 }} autoPlay interval={5000}>
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
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Latest Uploads</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredMovies.map((movie, index) => (
              <Link to={`/movie/${movie.id}`} key={movie.id || index} className="group">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Card className="bg-gray-800 border-gray-700 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                      <div className="relative">
                        <img 
                          src={movie.poster_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"} 
                          alt={movie.title} 
                          className="w-full h-[250px] object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-sm font-bold">
                          {movie.imdb_rating || "N/A"}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg mb-1">{movie.title}</h3>
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>{movie.year} • {movie.genre && movie.genre[0]}</span>
                          <span>{movie.downloads || 0} downloads</span>
                        </div>
                      </CardContent>
                    </Card>
                  </HoverCardTrigger>
                  <HoverCardContent className="bg-gray-800 border-gray-700 text-white">
                    <div className="flex flex-col">
                      <h4 className="font-bold">{movie.title}</h4>
                      <p className="text-sm text-gray-400 mb-1">{movie.year} • {movie.content_type}</p>
                      <div className="flex gap-1 flex-wrap mb-2">
                        {movie.genre && movie.genre.map((g: string, i: number) => (
                          <span key={i} className="text-xs bg-gray-700 px-1.5 py-0.5 rounded">{g}</span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-yellow-500">★ {movie.imdb_rating || "N/A"}</span>
                        <span className="text-xs">{movie.downloads || 0} downloads</span>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Movies with Carousel */}
      <section className="py-8 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Trending Movies</h2>
          <Carousel className="w-full" opts={{ align: "start" }}>
            <CarouselContent>
              {(trendingMovies.length ? trendingMovies : featuredMovies).map((movie, index) => (
                <CarouselItem key={movie.id || index} className="md:basis-1/3 lg:basis-1/4">
                  <Link to={`/movie/${movie.id}`} className="group block">
                    <Card className="bg-gray-700 border-gray-600 overflow-hidden transform transition-all duration-300 hover:scale-105">
                      <div className="relative">
                        <img 
                          src={movie.poster_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"} 
                          alt={movie.title} 
                          className="w-full h-[200px] object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-sm font-bold">
                          {movie.imdb_rating || "N/A"}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg mb-1">{movie.title}</h3>
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>{movie.year} • {movie.genre && movie.genre[0]}</span>
                          <span>{movie.downloads || 0} downloads</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2" />
          </Carousel>
        </div>
      </section>

      {/* Categorized Content Sections */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Web Series</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {(webSeries.length ? webSeries : featuredMovies).map((movie, index) => (
              <Link to={`/movie/${movie.id}`} key={movie.id || index} className="group">
                <Card className="bg-gray-800 border-gray-700 overflow-hidden transform transition-all duration-300 hover:scale-105">
                  <div className="relative">
                    <img 
                      src={movie.poster_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"} 
                      alt={movie.title} 
                      className="w-full h-[250px] object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-sm font-bold">
                      {movie.imdb_rating || "N/A"}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-1">{movie.title}</h3>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{movie.year} • {movie.genre && movie.genre[0]}</span>
                      <span>{movie.downloads || 0} downloads</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Anime Section */}
      <section className="py-8 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Anime</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {(animeShows.length ? animeShows : featuredMovies).map((movie, index) => (
              <Link to={`/movie/${movie.id}`} key={movie.id || index} className="group">
                <Card className="bg-gray-700 border-gray-600 overflow-hidden transform transition-all duration-300 hover:scale-105">
                  <div className="relative">
                    <img 
                      src={movie.poster_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"} 
                      alt={movie.title} 
                      className="w-full h-[250px] object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-sm font-bold">
                      {movie.imdb_rating || "N/A"}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-1">{movie.title}</h3>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{movie.year} • {movie.genre && movie.genre[0]}</span>
                      <span>{movie.downloads || 0} downloads</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Shorts Player */}
      {showShorts && shorts.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative w-full max-w-3xl h-[80vh]">
            <button 
              onClick={() => setShowShorts(false)}
              className="absolute -top-10 right-0 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full z-10"
            >
              <X size={24} />
            </button>
            
            <div className="relative h-full bg-black rounded-lg overflow-hidden">
              <iframe
                src={shorts[currentShortIndex]?.video_url + "?autoplay=1"}
                allow="autoplay; encrypted-media"
                allowFullScreen
                title={shorts[currentShortIndex]?.title}
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>
            
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {shorts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentShortIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentShortIndex ? "bg-blue-500" : "bg-gray-500"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
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
