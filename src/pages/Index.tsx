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
import AdBanner from "@/components/ads/AdBanner";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 8;

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
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryMovies, setCategoryMovies] = useState<Record<string, any[]>>({});
  const [showAllCategories, setShowAllCategories] = useState(false);
  
  // Auto-slide interval for featured carousel
  const autoSlideInterval = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  
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

  // Categories for the menu bar
  const categories = [
    "Action", "Adventure", "Animation", "Comedy", "Crime", 
    "Documentary", "Drama", "Family", "Fantasy", "Horror",
    "Mystery", "Romance", "Sci-Fi", "Thriller", "War"
  ];
  
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

  // Fetch category movies
  useEffect(() => {
    const fetchCategoryMovies = async () => {
      try {
        // Only fetch the first 6 categories initially
        const categoriesToFetch = showAllCategories ? categories : categories.slice(0, 6);
        
        for (const category of categoriesToFetch) {
          const { data, error } = await supabase
            .from('movies')
            .select('id, title, year, genre, poster_url, imdb_rating, downloads, content_type')
            .contains('genre', [category])
            .limit(4);
            
          if (error) throw error;
          
          setCategoryMovies(prev => ({
            ...prev,
            [category]: data || []
          }));
        }
      } catch (error) {
        console.error("Error fetching category movies:", error);
      }
    };
    
    fetchCategoryMovies();
  }, [showAllCategories]);

  // Auto-slide effect for featured carousel
  useEffect(() => {
    if (featuredMovies.length > 1 && carouselRef.current) {
      // Set up auto-sliding (right to left)
      const startAutoSlide = () => {
        autoSlideInterval.current = setInterval(() => {
          const nextBtn = carouselRef.current?.querySelector('.carousel-next') as HTMLButtonElement;
          if (nextBtn) nextBtn.click();
        }, 5000); // Change slide every 5 seconds
      };
      
      startAutoSlide();
      
      // Clean up interval on unmount
      return () => {
        if (autoSlideInterval.current) {
          clearInterval(autoSlideInterval.current);
        }
      };
    }
  }, [featuredMovies]);

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
  const loadWebSeries = async (page = 1) => {
    try {
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      
      // Get total count for pagination
      const { count, error: countError } = await supabase
        .from('movies')
        .select('id', { count: 'exact' })
        .eq('content_type', 'series');
        
      if (countError) throw countError;
      
      // Calculate total pages
      const totalPageCount = Math.ceil((count || 0) / ITEMS_PER_PAGE);
      setTotalPages(totalPageCount || 1);
      
      // Fetch paginated data
      const { data, error } = await supabase
        .from('movies')
        .select('id, title, year, genre, poster_url, imdb_rating, downloads, content_type')
        .eq('content_type', 'series')
        .range(from, to);
      
      if (error) throw error;
      setWebSeries(data || []);
      setCurrentPage(page);
      
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

  // Handle search suggestions
  const handleSearchInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length >= 2) {
      try {
        // Search for movies by title
        const { data: titleMatches, error: titleError } = await supabase
          .from('movies')
          .select('id, title, content_type, year, poster_url')
          .or(`title.ilike.%${query}%`)
          .limit(5);
          
        if (titleError) throw titleError;
        
        // Search for movies by genre
        const { data: genreMatches, error: genreError } = await supabase
          .from('movies')
          .select('id, title, content_type, year, poster_url, genre')
          .contains('genre', [query])
          .limit(3);
          
        if (genreError) throw genreError;
        
        // Search for movies by content_type
        const { data: typeMatches, error: typeError } = await supabase
          .from('movies')
          .select('id, title, content_type, year, poster_url')
          .eq('content_type', query.toLowerCase())
          .limit(3);
          
        if (typeError) throw typeError;
        
        // Search for movies by seo_tags
        const { data: tagMatches, error: tagError } = await supabase
          .from('movies')
          .select('id, title, content_type, year, poster_url, seo_tags')
          .contains('seo_tags', [query])
          .limit(3);
          
        if (tagError) throw tagError;
        
        // Combine results, remove duplicates by id
        const allMatches = [...(titleMatches || []), ...(genreMatches || []), ...(typeMatches || []), ...(tagMatches || [])];
        const uniqueMatches = Array.from(new Map(allMatches.map(item => [item.id, item])).values());
        
        setSearchSuggestions(uniqueMatches);
      } catch (error) {
        console.error("Error searching movies:", error);
      }
    } else {
      setSearchSuggestions([]);
    }
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Search",
        description: `Searching for: ${searchQuery}`,
      });
      
      // In a real app, you'd navigate to search results page
      // navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
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
              <ul className="hidden md:flex space-x-6">
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
              <button className="md:hidden text-white">
                <span className="sr-only">Open menu</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
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
              onChange={handleSearchInputChange}
            />
            <Button 
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded-md"
            >
              Search
            </Button>
            
            {/* Search Suggestions Dropdown */}
            {searchSuggestions.length > 0 && (
              <div className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg">
                {searchSuggestions.map((item) => (
                  <Link 
                    key={item.id}
                    to={`/movie/${item.id}`}
                    className="flex items-center p-3 hover:bg-gray-700 border-b border-gray-700 last:border-0"
                  >
                    <div className="w-12 h-16 bg-gray-700 rounded overflow-hidden mr-3">
                      {item.poster_url ? (
                        <img 
                          src={item.poster_url} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film size={16} className="text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{item.title}</h4>
                      <div className="text-xs text-gray-400">
                        {item.year && <span>{item.year} • </span>}
                        <span className="capitalize">{item.content_type}</span>
                      </div>
                    </div>
                  </Link>
                ))}
                
                <div className="p-2 text-center border-t border-gray-700">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      handleSearch(e as unknown as React.FormEvent);
                    }}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    See all results for "{searchQuery}"
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Categories Bar */}
      <section className="overflow-x-auto scrollbar-hide bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex py-2 space-x-2">
            {categories.slice(0, showAllCategories ? categories.length : 10).map((category) => (
              <Link
                key={category}
                to={`/movies?genre=${category}`}
                className="flex-none px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-md text-sm whitespace-nowrap"
              >
                {category}
              </Link>
            ))}
            {!showAllCategories && categories.length > 10 && (
              <button
                onClick={() => setShowAllCategories(true)}
                className="flex-none px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-md text-sm whitespace-nowrap"
              >
                More
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Hero Banner with Auto-Sliding Carousel */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="relative" ref={carouselRef}>
            {/* Ad banner above the carousel */}
            <AdBanner position="home_top" className="mb-4" />
            
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
              <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 carousel-prev" />
              <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 carousel-next" />
            </Carousel>
            
            {/* Ad banner below the carousel */}
            <AdBanner position="home_below_carousel" className="mt-4" />
          </div>
        </div>
      </section>

      {/* Featured Movies Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <MovieGrid 
            movies={featuredMovies} 
            title="Featured Movies" 
            showFilters={false} 
          />
        </div>
      </section>

      {/* Ad banner between sections */}
      <div className="container mx-auto px-4 my-4">
        <AdBanner position="home_middle" />
      </div>

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

      {/* Display categories */}
      {Object.entries(categoryMovies).map(([category, movies]) => (
        movies.length > 0 && (
          <section key={category} className={category === 'Action' ? 'bg-gray-800' : ''}>
            <div className="container mx-auto px-4 py-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{category} Movies</h2>
                <Link to={`/movies?genre=${category}`} className="text-blue-400 hover:underline">
                  See All
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {movies.map((movie) => (
                  <Link key={movie.id} to={`/movie/${movie.id}`}>
                    <div className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors">
                      <div className="h-56 bg-gray-700 relative">
                        {movie.poster_url ? (
                          <img 
                            src={movie.poster_url} 
                            alt={movie.title} 
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Film size={32} className="text-gray-500" />
                          </div>
                        )}
                        {movie.imdb_rating && (
                          <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                            IMDb {movie.imdb_rating}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-white truncate">{movie.title}</h3>
                        <div className="flex items-center justify-between mt-2 text-sm text-gray-400">
                          <div>
                            {movie.year && <span>{movie.year}</span>}
                          </div>
                          {movie.downloads > 0 && (
                            <div>{movie.downloads.toLocaleString()} downloads</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Ad banner within category section */}
              {category === 'Action' && (
                <div className="mt-8">
                  <AdBanner position="home_category" />
                </div>
              )}
            </div>
          </section>
        )
      ))}

      {/* Web Series - Lazy Loaded */}
      <div id="series-section" ref={seriesRef}>
        {visibleSections.series ? (
          <section>
            <div className="container mx-auto px-4 py-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Web Series</h2>
                <Link to="/series" className="text-blue-400 hover:underline">
                  See All
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {webSeries.map((series) => (
                  <Link key={series.id} to={`/movie/${series.id}`}>
                    <div className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors">
                      <div className="h-56 bg-gray-700 relative">
                        {series.poster_url ? (
                          <img 
                            src={series.poster_url} 
                            alt={series.title} 
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Tv size={32} className="text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-white truncate">{series.title}</h3>
                        <div className="flex items-center justify-between mt-2 text-sm text-gray-400">
                          <div>
                            {series.year && <span>{series.year}</span>}
                          </div>
                          {series.imdb_rating && (
                            <div>IMDb {series.imdb_rating}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* Pagination */}
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => loadWebSeries(Math.max(1, currentPage - 1))}
                      className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show pages around current page
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <PaginationItem key={i}>
                        <PaginationLink 
                          onClick={() => loadWebSeries(pageNum)}
                          isActive={currentPage === pageNum}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => loadWebSeries(Math.min(totalPages, currentPage + 1))}
                      className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              {/* Ad banner within web series section */}
              <div className="mt-8">
                <AdBanner position="home_series" />
              </div>
            </div>
          </section>
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

      {/* Bottom ad banner */}
      <div className="container mx-auto px-4 my-8">
        <AdBanner position="home_bottom" />
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
