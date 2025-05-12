
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star, Download, Clock, Calendar, Film, Globe } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MFlixLogo from "@/components/MFlixLogo";

const MovieDetail = () => {
  const { id } = useParams();
  const [showAd, setShowAd] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [similarMovies, setSimilarMovies] = useState<any[]>([]);
  const [mediaClips, setMediaClips] = useState<any[]>([]);
  const [downloadLinks, setDownloadLinks] = useState<any[]>([]);
  
  useEffect(() => {
    document.title = "Movie Detail - MFlix";
    
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch movie details
        const { data: movieData, error: movieError } = await supabase
          .from('movies')
          .select('*')
          .eq('id', id)
          .single();
          
        if (movieError) throw movieError;
        
        if (movieData) {
          setMovie(movieData);
          document.title = `${movieData.title} - MFlix`;
          
          // Track view
          await supabase.from('analytics').insert({
            page_visited: `movie/${id}`,
            browser: navigator.userAgent,
            device: /Mobile|Android|iPhone/.test(navigator.userAgent) ? 'mobile' : 'desktop',
            os: navigator.platform
          });
          
          // Fetch similar movies based on genre
          if (movieData.genre && movieData.genre.length > 0) {
            const { data: similarData } = await supabase
              .from('movies')
              .select('*')
              .neq('id', id)
              .contains('genre', movieData.genre)
              .limit(4);
              
            setSimilarMovies(similarData || []);
          }
          
          // Fetch download links
          const { data: linksData } = await supabase
            .from('download_links')
            .select('*')
            .eq('movie_id', id);
            
          setDownloadLinks(linksData || []);
          
          // Fetch media clips
          const { data: clipsData } = await supabase
            .from('media_clips')
            .select('*')
            .eq('movie_id', id);
            
          setMediaClips(clipsData || []);
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
        toast({
          title: "Error",
          description: "Failed to load movie details. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovieDetails();
  }, [id]);

  // Handle click events to show ads on every odd number click
  const handleClick = (e: React.MouseEvent) => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    
    // Show ad on odd-numbered clicks
    if (newClickCount % 2 === 1) {
      e.preventDefault();
      setShowAd(true);
      
      // Record ad impression
      supabase.from('analytics').insert({
        page_visited: `ad_impression_movie_${id}`,
        browser: navigator.userAgent,
        device: /Mobile|Android|iPhone/.test(navigator.userAgent) ? 'mobile' : 'desktop',
        os: navigator.platform
      }).then(() => {
        console.log("Ad impression recorded");
      });
      
      setTimeout(() => {
        setShowAd(false);
      }, 5000); // Hide ad after 5 seconds
    }
  };

  // Placeholder data if not loaded yet
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading movie details...</div>
      </div>
    );
  }

  // Use movie data or fallbacks
  const movieData = movie || {
    id: 1,
    title: "Sample Movie",
    poster_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    year: 2023,
    imdb_rating: 8.5,
    user_rating: 8.2,
    genre: ["Action"],
    downloads: 1250,
    storyline: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    director: "John Director",
    production_house: "Sample Studios",
    quality: "1080p",
    country: "USA",
    content_type: "Movie",
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Ad Popup - Only shows when triggered */}
      {showAd && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Advertisement</h3>
              <button 
                onClick={() => setShowAd(false)}
                className="text-gray-400 hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <p className="mb-4">Sponsored Content</p>
              <img 
                src="https://images.unsplash.com/photo-1611162616305-c69b3396f6d3" 
                alt="Ad" 
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <a 
                href="#ad-link" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Header/Navigation */}
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <MFlixLogo />
            <nav>
              <ul className="flex space-x-6">
                <li><Link to="/" className="hover:text-blue-400">Home</Link></li>
                <li><Link to="/movies" className="hover:text-blue-400">Movies</Link></li>
                <li><Link to="/series" className="hover:text-blue-400">Web Series</Link></li>
                <li><Link to="/anime" className="hover:text-blue-400">Anime</Link></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Movie Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Movie Poster */}
          <div className="w-full lg:w-1/3">
            <img 
              src={movieData.poster_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"} 
              alt={movieData.title} 
              className="w-full h-auto rounded-lg shadow-lg"
            />
            
            {/* Movie Ratings */}
            <div className="mt-6 bg-gray-800 p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-3">Ratings</h2>
              <div className="flex items-center mb-2">
                <Star className="text-yellow-500 mr-2" size={20} />
                <span className="font-semibold">IMDB:</span>
                <span className="ml-2">{movieData.imdb_rating || "N/A"}/10</span>
              </div>
              <div className="flex items-center">
                <Star className="text-blue-500 mr-2" size={20} />
                <span className="font-semibold">User Rating:</span>
                <span className="ml-2">{movieData.user_rating || "N/A"}/10</span>
              </div>
            </div>
            
            {/* Movie Info */}
            <div className="mt-6 bg-gray-800 p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-3">Movie Info</h2>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="text-gray-400 mr-2" size={16} />
                  <span className="font-semibold mr-2">Year:</span>
                  <span>{movieData.year || "Unknown"}</span>
                </div>
                <div className="flex items-center">
                  <Film className="text-gray-400 mr-2" size={16} />
                  <span className="font-semibold mr-2">Director:</span>
                  <span>{movieData.director || "Unknown"}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="text-gray-400 mr-2" size={16} />
                  <span className="font-semibold mr-2">Production:</span>
                  <span>{movieData.production_house || "Unknown"}</span>
                </div>
                <div className="flex items-center">
                  <Download className="text-gray-400 mr-2" size={16} />
                  <span className="font-semibold mr-2">Downloads:</span>
                  <span>{movieData.downloads || 0}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Movie Info */}
          <div className="w-full lg:w-2/3">
            <h1 className="text-3xl font-bold mb-2">{movieData.title} ({movieData.year || "N/A"})</h1>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {movieData.imdb_rating && (
                <div className="bg-yellow-600 px-3 py-1 rounded-full text-sm font-semibold">
                  IMDB: {movieData.imdb_rating}
                </div>
              )}
              {movieData.user_rating && (
                <div className="bg-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                  User: {movieData.user_rating}
                </div>
              )}
              {movieData.genre && movieData.genre.map((genre: string, index: number) => (
                <div key={index} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                  {genre}
                </div>
              ))}
              {movieData.quality && (
                <div className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                  {movieData.quality}
                </div>
              )}
              {movieData.country && (
                <div className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                  {movieData.country}
                </div>
              )}
              {movieData.content_type && (
                <div className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                  {movieData.content_type}
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Storyline</h2>
              <p className="text-gray-300">{movieData.storyline || "No storyline available."}</p>
            </div>
            
            {/* Trailer and Clips */}
            <div className="mb-6">
              <Tabs defaultValue="trailer">
                <TabsList className="bg-gray-800">
                  <TabsTrigger value="trailer">Trailer</TabsTrigger>
                  <TabsTrigger value="clips">Sample Clips</TabsTrigger>
                </TabsList>
                <TabsContent value="trailer" className="mt-4">
                  {mediaClips.find(clip => clip.type === 'trailer') ? (
                    <div className="bg-gray-800 rounded-lg overflow-hidden aspect-video">
                      <iframe 
                        src={mediaClips.find(clip => clip.type === 'trailer')?.video_url || ""} 
                        title="Movie Trailer"
                        className="w-full h-full"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : (
                    <div className="bg-gray-800 p-6 rounded-lg text-center text-gray-400">
                      No trailer available for this movie.
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="clips" className="mt-4">
                  {mediaClips.filter(clip => clip.type === 'clip').length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {mediaClips.filter(clip => clip.type === 'clip').map((clip, index) => (
                        <div key={clip.id} className="bg-gray-800 rounded-lg overflow-hidden">
                          {clip.thumbnail_url ? (
                            <img 
                              src={clip.thumbnail_url} 
                              alt={`Sample Clip ${index + 1}`} 
                              className="w-full h-48 object-cover"
                            />
                          ) : (
                            <video 
                              src={clip.video_url} 
                              className="w-full h-48 object-cover"
                              autoPlay
                              loop
                              muted
                              playsInline
                            />
                          )}
                          <div className="p-3">
                            <Button 
                              onClick={handleClick}
                              className="w-full"
                            >
                              Watch Clip {index + 1}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-800 p-6 rounded-lg text-center text-gray-400">
                      No sample clips available for this movie.
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Download Section */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Download Links</h2>
              <div className="bg-gray-800 p-4 rounded-lg">
                {downloadLinks.length > 0 ? (
                  <div className="space-y-4">
                    {downloadLinks.map((download, index) => (
                      <div key={download.id} className="bg-gray-700 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <span className="font-semibold">{download.quality}</span>
                            <span className="text-gray-400 ml-2">({download.size})</span>
                          </div>
                        </div>
                        <a 
                          href={download.url} 
                          className="block w-full bg-green-600 hover:bg-green-700 text-center py-2 rounded-lg font-bold transition-colors"
                          onClick={handleClick}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download {download.quality}
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-400">
                    No download links available for this movie yet.
                  </div>
                )}
              </div>
            </div>
            
            {/* Auto-playing clips feature */}
            {mediaClips.filter(clip => clip.type === 'autoplay').length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">Previews</h2>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {mediaClips.filter(clip => clip.type === 'autoplay').map((clip) => (
                      <div key={clip.id} className="bg-gray-700 rounded-lg overflow-hidden h-40">
                        {clip.video_url ? (
                          <video 
                            src={clip.video_url} 
                            className="w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                          />
                        ) : (
                          <img 
                            src={clip.thumbnail_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"} 
                            alt={clip.title || "Preview clip"} 
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Similar Movies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarMovies.map(movie => (
                <Link to={`/movie/${movie.id}`} key={movie.id} className="group">
                  <Card className="bg-gray-800 border-gray-700 overflow-hidden transform transition-transform hover:scale-105">
                    <div className="relative">
                      <img 
                        src={movie.poster_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"} 
                        alt={movie.title} 
                        className="w-full h-[200px] object-cover"
                        loading="lazy"
                      />
                      <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-sm font-bold">
                        {movie.imdb_rating || "N/A"}
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="text-center px-4">
                          <h3 className="font-bold text-lg mb-1">{movie.title}</h3>
                          <p className="text-sm">{movie.year} • {movie.genre && movie.genre[0]}</p>
                          <p className="mt-2 text-blue-400">Click to view details</p>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-1">{movie.title}</h3>
                      <div className="text-sm text-gray-400">
                        <span>{movie.year} • {movie.genre && movie.genre[0]}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
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
