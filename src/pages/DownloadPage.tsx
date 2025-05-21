
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Film, ArrowLeft, ExternalLink, Download } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import MFlixLogo from "@/components/MFlixLogo";
import AdBanner from "@/components/ads/AdBanner";

const DownloadPage = () => {
  const { id, linkId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState<any | null>(null);
  const [downloadLink, setDownloadLink] = useState<any | null>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [mirrors, setMirrors] = useState<any[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<string | null>(null);
  
  // Fetch movie and download data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get movie details
        const { data: movieData, error: movieError } = await supabase
          .from("movies")
          .select("*")
          .eq("movie_id", id)
          .single();
        
        if (movieError) throw movieError;
        if (!movieData) throw new Error("Movie not found");
        
        setMovie(movieData);
        
        // Get download link
        const { data: linkData, error: linkError } = await supabase
          .from("download_links")
          .select("*")
          .eq("link_id", linkId)
          .single();
        
        if (linkError) throw linkError;
        if (!linkData) throw new Error("Download link not found");
        
        setDownloadLink(linkData);
        
        // Check if this is a series with episodes
        if (movieData.content_type === 'series') {
          const { data: episodesData, error: episodesError } = await supabase
            .from("download_episodes")
            .select("*")
            .eq("link_id", linkId)
            .order("episode_number", { ascending: true });
          
          if (!episodesError && episodesData && episodesData.length > 0) {
            setEpisodes(episodesData);
            setSelectedEpisode(episodesData[0].episode_id);
            
            // Get mirrors for first episode
            const { data: mirrorsData } = await supabase
              .from("download_mirrors")
              .select(`
                mirror_id,
                mirror_url,
                source_name,
                display_order,
                source_id,
                download_sources (
                  name,
                  icon_url
                )
              `)
              .eq("episode_id", episodesData[0].episode_id)
              .order("display_order", { ascending: true });
            
            if (mirrorsData) {
              setMirrors(mirrorsData);
            }
          } else {
            // If no episodes, get mirrors directly for the link
            const { data: mirrorsData } = await supabase
              .from("download_mirrors")
              .select(`
                mirror_id,
                mirror_url,
                source_name,
                display_order,
                source_id,
                download_sources (
                  name,
                  icon_url
                )
              `)
              .eq("link_id", linkId)
              .is("episode_id", null)
              .order("display_order", { ascending: true });
            
            if (mirrorsData) {
              setMirrors(mirrorsData);
            }
          }
        } else {
          // For movies, get mirrors directly
          const { data: mirrorsData } = await supabase
            .from("download_mirrors")
            .select(`
              mirror_id,
              mirror_url,
              source_name,
              display_order,
              source_id,
              download_sources (
                name,
                icon_url
              )
            `)
            .eq("link_id", linkId)
            .is("episode_id", null)
            .order("display_order", { ascending: true });
          
          if (mirrorsData) {
            setMirrors(mirrorsData);
          }
        }
        
        // Track analytics
        await supabase.from('analytics').insert({
          page_visited: `download/${id}/${linkId}`,
          browser: navigator.userAgent,
          device: /Mobile|Android|iPhone/.test(navigator.userAgent) ? 'mobile' : 'desktop',
          operating_system: navigator.platform
        });
        
      } catch (error) {
        console.error("Error fetching download data:", error);
        toast({
          title: "Error",
          description: "Failed to load download information.",
          variant: "destructive"
        });
        navigate(`/movie/${id}`);
      } finally {
        setLoading(false);
      }
    };
    
    if (id && linkId) {
      fetchData();
    }
  }, [id, linkId, navigate]);
  
  // Handle episode selection
  const handleEpisodeSelect = async (episodeId: string) => {
    setSelectedEpisode(episodeId);
    
    try {
      // Get mirrors for selected episode
      const { data: mirrorsData } = await supabase
        .from("download_mirrors")
        .select(`
          mirror_id,
          mirror_url,
          source_name,
          display_order,
          source_id,
          download_sources (
            name,
            icon_url
          )
        `)
        .eq("episode_id", episodeId)
        .order("display_order", { ascending: true });
      
      if (mirrorsData) {
        setMirrors(mirrorsData);
      }
    } catch (error) {
      console.error("Error fetching mirrors for episode:", error);
    }
  };
  
  // Handle mirror click
  const handleMirrorClick = async (mirror: any) => {
    try {
      // Track download analytics
      await supabase.from('analytics').insert({
        page_visited: `mirror_click/${id}/${mirror.mirror_id}`,
        browser: navigator.userAgent,
        device: /Mobile|Android|iPhone/.test(navigator.userAgent) ? 'mobile' : 'desktop',
        operating_system: navigator.platform
      });
      
      // Update download count
      await supabase
        .from("movies")
        .update({ downloads: (movie.downloads || 0) + 1 })
        .eq("movie_id", id);
      
      // Show ad before redirect
      toast({
        title: "Download Starting",
        description: "You will be redirected to the download source in a moment.",
      });
      
      // Open link in new tab
      window.open(mirror.mirror_url, "_blank");
      
    } catch (error) {
      console.error("Error tracking download:", error);
    }
  };
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!movie || !downloadLink) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <Film size={64} className="mx-auto mb-6 text-gray-600" />
          <h1 className="text-3xl font-bold mb-4">Download Not Found</h1>
          <p className="mb-6 text-gray-400">The download you're looking for is not available.</p>
          <Link to="/" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

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
          </div>
        </div>
      </header>

      {/* Ad banner top */}
      <div className="container mx-auto px-4 py-4">
        <AdBanner position="download_page_top" />
      </div>

      {/* Back button */}
      <div className="container mx-auto px-4 py-2">
        <Link 
          to={`/movie/${id}`}
          className="inline-flex items-center text-blue-400 hover:text-blue-300"
        >
          <ArrowLeft className="mr-1" size={16} />
          Back to {movie.title}
        </Link>
      </div>

      {/* Download Page Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{movie.title}</h1>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.year && (
                <span className="bg-gray-700 px-2 py-1 rounded text-sm">{movie.year}</span>
              )}
              {downloadLink.quality && (
                <span className="bg-blue-600 px-2 py-1 rounded text-sm">{downloadLink.quality}</span>
              )}
              {downloadLink.file_size && (
                <span className="bg-green-600 px-2 py-1 rounded text-sm">{downloadLink.file_size}</span>
              )}
            </div>
            
            {/* Ad banner between title and content */}
            <div className="my-4">
              <AdBanner position="download_page_middle" />
            </div>
            
            {/* Series Episodes */}
            {episodes.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3">Episodes</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {episodes.map((episode) => (
                    <button
                      key={episode.episode_id}
                      onClick={() => handleEpisodeSelect(episode.episode_id)}
                      className={`p-2 rounded text-center text-sm ${
                        selectedEpisode === episode.episode_id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      {episode.episode_title || `Episode ${episode.episode_number}`}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Side Ads */}
            <div className="flex flex-col md:flex-row gap-4 relative">
              {/* Left Side Ad */}
              <div className="hidden md:block md:w-1/6">
                <div className="sticky top-4">
                  <AdBanner position="download_page_left" />
                </div>
              </div>
              
              {/* Download Mirrors */}
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-3">Download Links</h2>
                
                {mirrors.length === 0 ? (
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <p>No download links available. Please check back later.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mirrors.map((mirror) => (
                      <div 
                        key={mirror.mirror_id}
                        className="bg-gray-700 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-650 transition-colors"
                      >
                        <div className="flex items-center mb-3 sm:mb-0">
                          {mirror.download_sources?.icon_url ? (
                            <img 
                              src={mirror.download_sources.icon_url}
                              alt={mirror.download_sources.name || mirror.source_name}
                              className="w-6 h-6 mr-3"
                            />
                          ) : (
                            <ExternalLink className="w-6 h-6 mr-3 text-gray-400" />
                          )}
                          <div>
                            <h3 className="font-medium">
                              {mirror.download_sources?.name || mirror.source_name}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {downloadLink.quality} • {downloadLink.file_size}
                            </p>
                          </div>
                        </div>
                        <Button 
                          onClick={() => handleMirrorClick(mirror)}
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
              
              {/* Right Side Ad */}
              <div className="hidden md:block md:w-1/6">
                <div className="sticky top-4">
                  <AdBanner position="download_page_right" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ad banner bottom */}
      <div className="container mx-auto px-4 py-4">
        <AdBanner position="download_page_bottom" />
      </div>
      
      {/* Disclaimer */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="font-bold mb-2">Disclaimer</h3>
          <p className="text-sm text-gray-400">
            MFlix does not host any files on its servers. All content is provided by non-affiliated third parties. 
            We are not responsible for the content of any linked external websites.
          </p>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-800 py-8 mt-6">
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

export default DownloadPage;
