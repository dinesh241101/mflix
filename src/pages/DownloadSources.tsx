
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, ArrowLeft, ExternalLink } from "lucide-react";
import HeaderWithAds from "@/components/universal/HeaderWithAds";
import UniversalAdsWrapper from "@/components/ads/UniversalAdsWrapper";
import InterstitialAd from "@/components/ads/InterstitialAd";
import LoadingScreen from "@/components/LoadingScreen";

interface DownloadSource {
  id: string;
  name: string;
  url?: string;
  icon?: string;
}

const DownloadSources = () => {
  const { id, linkId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<any>(null);
  const [downloadLink, setDownloadLink] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showInterstitial, setShowInterstitial] = useState(false);
  
  // Download sources - in a real app, these would come from the database
  const downloadSources: DownloadSource[] = [
    { id: '1', name: 'Telegram Bot', url: 'https://t.me/moviebot', icon: '📱' },
    { id: '2', name: 'Google Drive', url: 'https://drive.google.com/file/123', icon: '💾' },
    { id: '3', name: 'TeraBox', url: 'https://terabox.com/file/456', icon: '📦' },
    { id: '4', name: 'MediaFire', url: 'https://mediafire.com/file/789', icon: '🔥' },
  ];

  useEffect(() => {
    if (id && linkId) {
      fetchMovieAndLink();
    }
  }, [id, linkId]);

  const fetchMovieAndLink = async () => {
    try {
      setLoading(true);
      
      const { data: movieData, error: movieError } = await supabase
        .from('movies')
        .select('*')
        .eq('movie_id', id)
        .single();
      
      if (movieError) throw movieError;
      setMovie(movieData);
      
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

  const handleSourceClick = (source: DownloadSource) => {
    setShowInterstitial(true);
    
    // After ad, navigate to the verification page
    setTimeout(() => {
      setShowInterstitial(false);
      navigate(`/download-verify/${id}/${linkId}/${source.id}`, {
        state: { source, movie, downloadLink }
      });
    }, 2000);
  };

  if (loading) {
    return <LoadingScreen message="Loading download sources..." />;
  }

  if (!movie || !downloadLink) {
    return (
      <UniversalAdsWrapper>
        <HeaderWithAds />
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
      <HeaderWithAds />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
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
            <div className="flex gap-4 flex-col md:flex-row">
              {movie.poster_url && (
                <img 
                  src={movie.poster_url} 
                  alt={movie.title}
                  className="w-full md:w-24 h-48 md:h-36 object-cover rounded mx-auto md:mx-0"
                />
              )}
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold text-white mb-2">{movie.title}</h1>
                <p className="text-gray-400 mb-2">Quality: {downloadLink.quality}</p>
                <p className="text-gray-400 mb-2">Size: {downloadLink.file_size}</p>
                <p className="text-sm text-gray-500">
                  Downloads: {movie.downloads || 0}
                </p>
              </div>
            </div>
          </div>
          
          {/* Download Sources */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6 text-center">
              Choose Download Source
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {downloadSources.map((source) => (
                <Card key={source.id} className="bg-gray-700 border-gray-600 hover:border-blue-500 transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white flex items-center gap-3 text-lg">
                      <span className="text-2xl">{source.icon}</span>
                      {source.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => handleSourceClick(source)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <ExternalLink className="mr-2" size={16} />
                      Download from {source.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
              <h4 className="text-blue-400 font-semibold mb-2">Download Instructions:</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Choose your preferred download source</li>
                <li>• Complete the verification process</li>
                <li>• Your download will start automatically</li>
                <li>• If one source doesn't work, try another</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Interstitial Ad */}
      <InterstitialAd
        isOpen={showInterstitial}
        onClose={() => setShowInterstitial(false)}
        onComplete={() => setShowInterstitial(false)}
        triggerEvent="download_source_click"
      />
    </UniversalAdsWrapper>
  );
};

export default DownloadSources;
