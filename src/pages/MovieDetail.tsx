
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import LoadingScreen from "@/components/LoadingScreen";
import MFlixLogo from "@/components/MFlixLogo";
import { Download, Home, Star, Film, Tv, Video, Calendar, Flag, Trophy, Info, UserCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdBanner from "@/components/ads/AdBanner";

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [movie, setMovie] = useState<any>(null);
  const [cast, setCast] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadLinks, setDownloadLinks] = useState<any[]>([]);
  const [trailers, setTrailers] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Check screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Set document title based on movie title
  useEffect(() => {
    if (movie) {
      document.title = `${movie.title} - MFlix`;
    } else {
      document.title = "Movie Details - MFlix";
    }
    
    // Restore original title when component unmounts
    return () => {
      document.title = "MFlix";
    };
  }, [movie]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch movie
        const { data: movieData, error: movieError } = await supabase
          .from('movies')
          .select('*')
          .eq('id', id)
          .single();
        
        if (movieError) throw movieError;
        setMovie(movieData);
        
        // Fetch cast
        const { data: castData, error: castError } = await supabase
          .from('movie_cast')
          .select('*')
          .eq('movie_id', id);
        
        if (castError) throw castError;
        setCast(castData || []);
        
        // Fetch download links
        const { data: linksData, error: linksError } = await supabase
          .from('download_links')
          .select('*')
          .eq('movie_id', id);
        
        if (linksError) throw linksError;
        setDownloadLinks(linksData || []);
        
        // Fetch trailers
        const { data: trailerData, error: trailerError } = await supabase
          .from('media_clips')
          .select('*')
          .eq('movie_id', id)
          .eq('type', 'trailer');
        
        if (trailerError) throw trailerError;
        setTrailers(trailerData || []);
        
        // Track analytics
        await supabase.from('analytics').insert({
          page_visited: 'movie-detail',
          browser: navigator.userAgent,
          device: /Mobile|Android|iPhone/.test(navigator.userAgent) ? 'mobile' : 'desktop',
          os: navigator.platform
        });
        
        // Update downloads counter (just for analytics, not affecting DB)
        if (movieData) {
          await supabase
            .from('movies')
            .update({ downloads: (movieData.downloads || 0) + 1 })
            .eq('id', id);
        }
        
      } catch (error) {
        console.error("Error fetching movie details:", error);
        toast({
          title: "Error",
          description: "Failed to load movie details. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMovieDetails();
  }, [id, toast]);
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl font-bold mb-4">Movie Not Found</h1>
        <p className="text-gray-400 mb-8">Sorry, the movie you're looking for doesn't exist.</p>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }
  
  // Format YouTube URL
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    
    return url;
  };
  
  const handleDownload = (downloadLink: any) => {
    // In a real app, you'd track this download
    window.open(downloadLink.url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className={`flex ${isMobile ? 'flex-col gap-4' : 'justify-between items-center'}`}>
            <Link to="/" className="flex justify-center">
              <MFlixLogo />
            </Link>
            <nav className={isMobile ? "overflow-x-auto" : ""}>
              <ul className={`flex ${isMobile ? 'justify-between space-x-4' : 'space-x-6'}`}>
                <li><Link to="/" className="hover:text-blue-400 flex items-center whitespace-nowrap"><Home className="mr-1" size={16} /> Home</Link></li>
                <li><Link to="/movies" className="hover:text-blue-400 flex items-center whitespace-nowrap"><Film className="mr-1" size={16} /> Movies</Link></li>
                <li><Link to="/web-series" className="hover:text-blue-400 flex items-center whitespace-nowrap"><Tv className="mr-1" size={16} /> Web Series</Link></li>
                <li><Link to="/anime" className="hover:text-blue-400 flex items-center whitespace-nowrap"><Tv className="mr-1" size={16} /> Anime</Link></li>
                <li><Link to="/shorts" className="hover:text-blue-400 flex items-center whitespace-nowrap"><Video className="mr-1" size={16} /> Shorts</Link></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Movie Hero Section */}
      <div 
        className="bg-cover bg-center pt-12 pb-6 relative"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(17, 24, 39, 0.7), rgba(17, 24, 39, 1)), url(${movie.poster_url || 'https://via.placeholder.com/1200x600?text=No+Image'})`
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={movie.poster_url || 'https://via.placeholder.com/500x750?text=No+Poster'} 
                  alt={movie.title}
                  className="w-full h-auto"
                />
              </div>
            </div>
            
            {/* Details */}
            <div className="w-full md:w-2/3 lg:w-3/4">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genre?.map((g: string) => (
                  <span key={g} className="px-2 py-1 bg-blue-900/50 rounded-md text-sm">
                    {g}
                  </span>
                ))}
              </div>
              
              {/* Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center">
                  <Calendar className="mr-2 text-gray-400" size={16} />
                  <span>{movie.year || 'Unknown'}</span>
                </div>
                <div className="flex items-center">
                  <Star className="mr-2 text-yellow-500" size={16} />
                  <span>{movie.imdb_rating || '?'}/10 IMDb</span>
                </div>
                <div className="flex items-center">
                  <Flag className="mr-2 text-gray-400" size={16} />
                  <span>{movie.country || 'Unknown'}</span>
                </div>
                <div className="flex items-center">
                  <Trophy className="mr-2 text-gray-400" size={16} />
                  <span>{movie.quality || 'HD'}</span>
                </div>
                <div className="flex items-center">
                  <UserCheck className="mr-2 text-gray-400" size={16} />
                  <span>{movie.director || 'Unknown Director'}</span>
                </div>
                <div className="flex items-center">
                  <Info className="mr-2 text-gray-400" size={16} />
                  <span>{movie.production_house || 'Unknown Studio'}</span>
                </div>
              </div>
              
              {/* Storyline */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Storyline</h3>
                <p className="text-gray-300 leading-relaxed">
                  {movie.storyline || 'No storyline available.'}
                </p>
              </div>
              
              {/* Cast */}
              {cast.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Cast</h3>
                  <div className="flex flex-wrap gap-4">
                    {cast.map((member) => (
                      <div key={member.id} className="flex items-center bg-gray-800 rounded-full px-3 py-1">
                        <span className="font-medium">{member.name}</span>
                        {member.role && (
                          <span className="text-gray-400 text-sm ml-2">as {member.role}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Ad Banner */}
      <div className="container mx-auto px-4 my-4">
        <AdBanner 
          position="details"
          className="h-24 md:h-28"
        />
      </div>
      
      {/* Download and Trailer Section */}
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="download">
          <TabsList className="w-full max-w-md mx-auto">
            <TabsTrigger value="download" className="flex-1">Downloads</TabsTrigger>
            <TabsTrigger value="trailer" className="flex-1">Trailer</TabsTrigger>
            <TabsTrigger value="screenshots" className="flex-1">Screenshots</TabsTrigger>
          </TabsList>
          
          {/* Download Links */}
          <TabsContent value="download">
            <div className="bg-gray-800 rounded-lg p-6 mt-4">
              <h3 className="text-xl font-bold mb-4">Download {movie.title}</h3>
              
              {downloadLinks.length === 0 ? (
                <p className="text-gray-400">No download links available right now.</p>
              ) : (
                <div className="space-y-4">
                  {downloadLinks.map((link) => (
                    <div 
                      key={link.id} 
                      className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-gray-700 rounded-lg"
                    >
                      <div className="mb-2 md:mb-0">
                        <div className="font-medium">{movie.title} - {link.quality}</div>
                        <div className="text-sm text-gray-400">Size: {link.size}</div>
                      </div>
                      <Button 
                        onClick={() => handleDownload(link)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Download className="mr-2" size={16} />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Trailer */}
          <TabsContent value="trailer">
            <div className="bg-gray-800 rounded-lg p-6 mt-4">
              <h3 className="text-xl font-bold mb-4">{movie.title} - Trailer</h3>
              
              {trailers.length === 0 ? (
                <p className="text-gray-400">No trailer available.</p>
              ) : (
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={getEmbedUrl(trailers[0].video_url)}
                    className="w-full h-96"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`${movie.title} Trailer`}
                  ></iframe>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Screenshots */}
          <TabsContent value="screenshots">
            <div className="bg-gray-800 rounded-lg p-6 mt-4">
              <h3 className="text-xl font-bold mb-4">{movie.title} - Screenshots</h3>
              <p className="text-gray-400">No screenshots available.</p>
              {/* You could add screenshots here if available in your database */}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
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

export default MovieDetail;
