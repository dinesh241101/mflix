import { useEffect, useState, useRef, useNavigate } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Film, Star, Calendar, Clock, Download, Globe, PlayCircle } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import MFlixLogo from "@/components/MFlixLogo";
import ShareLinks from "@/components/ShareLinks";
import AutoplayClip from "@/components/AutoplayClip";
import AdBanner from "@/components/ads/AdBanner";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<any | null>(null);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [screenshots, setScreenshots] = useState([]);
  const [downloadLinks, setDownloadLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cast, setCast] = useState<any[]>([]);
  const [relatedMovies, setRelatedMovies] = useState<any[]>([]);
  const videoRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Scroll to video section
  const scrollToVideo = () => {
    if (videoRef.current) {
      videoRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Update document title when movie data is loaded
  useEffect(() => {
    if (movie?.title) {
      document.title = `${movie.title} - MFlix`;
    } else {
      document.title = "Movie Details - MFlix";
    }
    
    // Reset title when component unmounts
    return () => {
      document.title = "MFlix";
    };
  }, [movie?.title]);

  // Fetch movie data
  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        
        // Get movie details
        const { data: movieData, error: movieError } = await supabase
          .from("movies")
          .select("*")
          .eq("movie_id", id)
          .maybeSingle();
        
        if (movieError) throw movieError;
        if (!movieData) throw new Error("Movie not found");
        
        setMovie(movieData);
        
        // Get trailer
        const { data: trailerData, error: trailerError } = await supabase
          .from("media_clips")
          .select("*")
          .eq("movie_id", id)
          .eq("clip_type", "trailer")
          .limit(1)
          .maybeSingle();
        
        if (trailerData && !trailerError) {
          setTrailerUrl(trailerData.video_url);
        }
        
        // Get cast
        const { data: castData, error: castError } = await supabase
          .from("movie_cast")
          .select("*")
          .eq("movie_id", id);
        
        if (!castError) {
          setCast(castData || []);
        }
        
        // Get download links
        const { data: downloadData, error: downloadError } = await supabase
          .from("download_links")
          .select("*")
          .eq("movie_id", id);
        
        if (!downloadError) {
          setDownloadLinks(downloadData || []);
        }
        
        // Get related movies by genre
        if (movieData.genre && movieData.genre.length > 0) {
          const { data: relatedData, error: relatedError } = await supabase
            .from("movies")
            .select("movie_id, title, poster_url, year, imdb_rating, genre, content_type")
            .contains("genre", [movieData.genre[0]])
            .neq("movie_id", id)
            .limit(4);
          
          if (!relatedError) {
            setRelatedMovies(relatedData || []);
          }
        }
        
        // Track view
        await supabase.from('analytics').insert({
          page_visited: `movie/${id}`,
          browser: navigator.userAgent,
          device: /Mobile|Android|iPhone/.test(navigator.userAgent) ? 'mobile' : 'desktop',
          operating_system: navigator.platform
        });
        
      } catch (error) {
        console.error("Error fetching movie data:", error);
        toast({
          title: "Error",
          description: "Failed to load movie details. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchMovieData();
    }
  }, [id]);

  // Handle download click - modified to navigate to the download page
  const handleDownloadClick = async (downloadLink: any) => {
    try {
      // Track analytics
      await supabase.from('analytics').insert({
        page_visited: `download/${id}`,
        browser: navigator.userAgent,
        device: /Mobile|Android|iPhone/.test(navigator.userAgent) ? 'mobile' : 'desktop',
        operating_system: navigator.platform
      });
      
      // Navigate to download page
      navigate(`/download/${id}/${downloadLink.link_id}`);
      
    } catch (error) {
      console.error("Error tracking download:", error);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <Film size={64} className="mx-auto mb-6 text-gray-600" />
          <h1 className="text-3xl font-bold mb-4">Movie Not Found</h1>
          <p className="mb-6 text-gray-400">The movie you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // Extract YouTube video ID from URL
  const getYoutubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : "";
  };
  
  const youtubeId = trailerUrl ? getYoutubeVideoId(trailerUrl) : "";

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <MFlixLogo />
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                <li><Link to="/" className="hover:text-blue-400">Home</Link></li>
                <li><Link to="/movies" className="hover:text-blue-400">Movies</Link></li>
                <li><Link to="/series" className="hover:text-blue-400">Web Series</Link></li>
                <li><Link to="/anime" className="hover:text-blue-400">Anime</Link></li>
              </ul>
            </nav>
            <button className="md:hidden text-white">
              <span className="sr-only">Open menu</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Ad banner top */}
      <div className="container mx-auto px-4 py-4">
        <AdBanner position="movie_detail_top" />
      </div>

      {/* Movie Hero Section */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Movie Poster */}
            <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                {movie.poster_url ? (
                  <img 
                    src={movie.poster_url} 
                    alt={movie.title} 
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <div className="aspect-[2/3] flex items-center justify-center bg-gray-700">
                    <Film size={64} className="text-gray-500" />
                  </div>
                )}
              </div>
              
              {/* Movie Ratings for Mobile */}
              <div className="md:hidden mt-4 flex items-center space-x-4">
                {movie.imdb_rating && (
                  <div className="flex items-center">
                    <Star className="text-yellow-500 mr-1" size={18} />
                    <span className="font-bold">{movie.imdb_rating}</span>
                    <span className="text-gray-400 text-sm ml-1">/10</span>
                  </div>
                )}
                {movie.downloads > 0 && (
                  <div className="text-gray-400">
                    <span>{movie.downloads.toLocaleString()}</span> downloads
                  </div>
                )}
              </div>
            </div>
            
            {/* Movie Details */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.year && (
                  <span className="bg-gray-700 px-2 py-1 rounded text-sm inline-flex items-center">
                    <Calendar size={14} className="mr-1" /> {movie.year}
                  </span>
                )}
                {movie.quality && (
                  <span className="bg-blue-600 px-2 py-1 rounded text-sm">{movie.quality}</span>
                )}
                {movie.content_type && (
                  <span className="bg-purple-600 px-2 py-1 rounded text-sm capitalize">{movie.content_type}</span>
                )}
              </div>
              
              {/* Movie Ratings for Desktop */}
              <div className="hidden md:flex items-center space-x-4 mb-6">
                {movie.imdb_rating && (
                  <div className="flex items-center">
                    <Star className="text-yellow-500 mr-1" size={20} />
                    <span className="font-bold text-lg">{movie.imdb_rating}</span>
                    <span className="text-gray-400 text-sm ml-1">/10</span>
                  </div>
                )}
                {movie.downloads > 0 && (
                  <div className="text-gray-400">
                    <Download className="inline mr-1" size={18} />
                    <span>{movie.downloads.toLocaleString()}</span> downloads
                  </div>
                )}
              </div>
              
              {/* Watch Trailer Button */}
              {youtubeId && (
                <Button 
                  className="mb-6 bg-red-600 hover:bg-red-700"
                  onClick={scrollToVideo}
                >
                  <PlayCircle className="mr-2" size={18} />
                  Watch Trailer
                </Button>
              )}
              
              {/* Movie Information */}
              <div className="space-y-4">
                {movie.genre && movie.genre.length > 0 && (
                  <div>
                    <h3 className="text-gray-400 text-sm">Genres</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {movie.genre.map((genre: string, index: number) => (
                        <Link 
                          key={index}
                          to={`/movies?genre=${genre}`}
                          className="bg-gray-700 px-2 py-1 rounded text-sm hover:bg-gray-600"
                        >
                          {genre}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                
                {movie.director && (
                  <div>
                    <h3 className="text-gray-400 text-sm">Director</h3>
                    <p>{movie.director}</p>
                  </div>
                )}
                
                {movie.country && (
                  <div className="flex items-start">
                    <h3 className="text-gray-400 text-sm mr-2">Country</h3>
                    <div className="flex items-center">
                      <Globe size={14} className="mr-1 mt-0.5" />
                      <span>{movie.country}</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Share Links */}
              <div className="mt-6">
                <h3 className="text-gray-400 text-sm mb-2">Share</h3>
                <ShareLinks url={window.location.href} title={movie.title} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ad banner before storyline */}
      <div className="container mx-auto px-4 mb-8">
        <AdBanner position="movie_detail_middle" />
      </div>

      {/* Storyline Section */}
      <section className="py-8 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Storyline</h2>
          <p className="whitespace-pre-line">{movie.storyline || "No storyline available for this title."}</p>
        </div>
      </section>

      {/* Trailer Section */}
      {youtubeId && (
        <section className="py-8" ref={videoRef}>
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Trailer</h2>
            <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title={`${movie.title} - Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>
      )}

      {/* Cast Section */}
      {cast.length > 0 && (
        <section className="py-8 bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {cast.map((person) => (
                <div key={person.cast_id} className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gray-600 flex items-center justify-center mb-2">
                    {person.profile_pic ? (
                      <img 
                        src={person.profile_pic}
                        alt={person.actor_name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  <h3 className="font-medium">{person.actor_name}</h3>
                  {person.actor_role && (
                    <p className="text-sm text-gray-400">{person.actor_role}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Download Section */}
      {downloadLinks.length > 0 && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Download Links</h2>
            <div className="space-y-4">
              {downloadLinks.map((link) => (
                <div 
                  key={link.link_id}
                  className="bg-gray-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-gray-750 transition-colors cursor-pointer"
                  onClick={() => handleDownloadClick(link)}
                >
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center mb-1">
                      <span className="font-bold mr-2">Quality:</span>
                      <span className="bg-blue-600 px-2 py-0.5 rounded text-sm">{link.quality}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-bold mr-2">Size:</span>
                      <span>{link.file_size}</span>
                    </div>
                  </div>
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadClick(link);
                    }}
                  >
                    <Download className="mr-2" size={16} />
                    Download
                  </Button>
                </div>
              ))}
            </div>
            
            {/* Download disclaimer */}
            <div className="mt-8 bg-gray-800 rounded-lg p-4 text-sm text-gray-400">
              <p>Disclaimer: MFlix does not host any files on its servers. All content is provided by non-affiliated third parties.</p>
            </div>
          </div>
        </section>
      )}

      {/* Ad banner before related movies */}
      <div className="container mx-auto px-4 mb-4">
        <AdBanner position="movie_detail_bottom" />
      </div>
      
      {/* Related Movies */}
      {relatedMovies.length > 0 && (
        <section className="py-8 bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Related {movie.content_type === 'movie' ? 'Movies' : movie.content_type === 'series' ? 'Series' : 'Content'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedMovies.map((relatedMovie) => (
                <Link key={relatedMovie.movie_id} to={`/movie/${relatedMovie.movie_id}`}>
                  <div className="bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-650 transition-colors">
                    <div className="h-56 bg-gray-600 relative">
                      {relatedMovie.poster_url ? (
                        <img 
                          src={relatedMovie.poster_url} 
                          alt={relatedMovie.title} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film size={32} className="text-gray-500" />
                        </div>
                      )}
                      {relatedMovie.imdb_rating && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                          IMDb {relatedMovie.imdb_rating}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-white truncate">{relatedMovie.title}</h3>
                      <div className="mt-2 text-sm text-gray-400">
                        {relatedMovie.year && <span>{relatedMovie.year}</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
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

export default MovieDetail;
