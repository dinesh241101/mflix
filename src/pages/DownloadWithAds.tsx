
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";
import UniversalHeader from "@/components/universal/UniversalHeader";
import UniversalAdsWrapper from "@/components/ads/UniversalAdsWrapper";
import InterstitialAd from "@/components/ads/InterstitialAd";
import LoadingScreen from "@/components/LoadingScreen";

const DownloadWithAds = () => {
  const { id, linkId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<any>(null);
  const [downloadLink, setDownloadLink] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [downloadEnabled, setDownloadEnabled] = useState(false);

  useEffect(() => {
    if (id && linkId) {
      fetchMovieAndLink();
    }
  }, [id, linkId]);

  const fetchMovieAndLink = async () => {
    try {
      setLoading(true);
      
      // Fetch movie details
      const { data: movieData, error: movieError } = await supabase
        .from('movies')
        .select('*')
        .eq('movie_id', id)
        .single();
      
      if (movieError) throw movieError;
      setMovie(movieData);
      
      // Fetch download link
      const { data: linkData, error: linkError } = await supabase
        .from('download_links')
        .select('*')
        .eq('link_id', linkId)
        .eq('movie_id', id)
        .single();
      
      if (linkError) throw linkError;
      setDownloadLink(linkData);
      
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load download page",
        variant: "destructive"
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleWatchAd = () => {
    setShowInterstitial(true);
  };

  const handleAdComplete = () => {
    setShowInterstitial(false);
    setDownloadEnabled(true);
    
    toast({
      title: "Success",
      description: "You can now download the file!",
    });
  };

  const handleDownload = async () => {
    if (!downloadEnabled || !downloadLink) return;
    
    try {
      // Update download count
      await supabase
        .from('movies')
        .update({ downloads: (movie.downloads || 0) + 1 })
        .eq('movie_id', id);
      
      // Open download link
      window.open(downloadLink.download_url, '_blank');
      
      toast({
        title: "Download Started",
        description: "Your download should begin shortly",
      });
      
    } catch (error) {
      console.error("Error starting download:", error);
      toast({
        title: "Error",
        description: "Failed to start download",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading download page..." />;
  }

  if (!movie || !downloadLink) {
    return (
      <UniversalAdsWrapper>
        <UniversalHeader />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Download Not Found</h1>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="mr-2" size={16} />
            Go Home
          </Button>
        </div>
      </UniversalAdsWrapper>
    );
  }

  return (
    <UniversalAdsWrapper>
      <UniversalHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Back button */}
          <Button 
            onClick={() => navigate(`/movie/${id}`)} 
            variant="outline" 
            className="mb-6"
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to Movie
          </Button>
          
          {/* Movie info */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex gap-4">
              {movie.poster_url && (
                <img 
                  src={movie.poster_url} 
                  alt={movie.title}
                  className="w-24 h-36 object-cover rounded"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">{movie.title}</h1>
                <p className="text-gray-400 mb-2">Quality: {downloadLink.quality}</p>
                <p className="text-gray-400 mb-2">Size: {downloadLink.file_size}</p>
                <p className="text-sm text-gray-500">
                  Downloads: {movie.downloads || 0}
                </p>
              </div>
            </div>
          </div>
          
          {/* Download section */}
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-white mb-4">
              Ready to Download?
            </h2>
            
            {!downloadEnabled ? (
              <div>
                <p className="text-gray-400 mb-6">
                  Please watch a short advertisement to unlock your download
                </p>
                <Button 
                  onClick={handleWatchAd}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                >
                  Watch Ad & Continue
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-green-400 mb-6">
                  ✓ Advertisement completed! You can now download.
                </p>
                <Button 
                  onClick={handleDownload}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                >
                  <Download className="mr-2" size={18} />
                  Download Now
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Interstitial Ad */}
      <InterstitialAd
        isOpen={showInterstitial}
        onClose={() => setShowInterstitial(false)}
        onComplete={handleAdComplete}
        triggerEvent="download_click"
      />
    </UniversalAdsWrapper>
  );
};

export default DownloadWithAds;
