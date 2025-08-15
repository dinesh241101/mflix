
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, ArrowLeft, Play, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import FixedGlobalHeader from "@/components/enhanced/FixedGlobalHeader";
import QuizModal from "@/components/quiz/QuizModal";
import DownloadPageAds from "@/components/ads/DownloadPageAds";
import ResponsiveAdPlaceholder from "@/components/ResponsiveAdPlaceholder";

const DownloadPage = () => {
  const { movieId = "" } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [downloadLinks, setDownloadLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState("");
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    if (movieId) {
      fetchMovieData();
      fetchDownloadLinks();
      loadUserPoints();
    }
  }, [movieId]);

  const fetchMovieData = async () => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('movie_id', movieId)
        .single();

      if (error) throw error;
      setMovie(data);
    } catch (error) {
      console.error('Error fetching movie:', error);
      toast({
        title: "Error",
        description: "Failed to load movie details",
        variant: "destructive"
      });
    }
  };

  const fetchDownloadLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('download_links')
        .select('*')
        .eq('movie_id', movieId)
        .order('quality', { ascending: true });

      if (error) throw error;
      setDownloadLinks(data || []);
    } catch (error) {
      console.error('Error fetching download links:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserPoints = () => {
    const points = localStorage.getItem('user_points');
    setUserPoints(points ? parseInt(points) : 0);
  };

  const handleDownloadClick = (resolution: string, hasQuiz: boolean = false) => {
    setSelectedResolution(resolution);
    
    if (hasQuiz && resolution === '1080p') {
      setShowQuiz(true);
    } else {
      // Direct download or redirect to download source
      toast({
        title: "Download Started",
        description: `Starting ${resolution} download...`,
      });
      
      // In a real app, this would redirect to the actual download
      window.open('/download-sources/' + movieId, '_blank');
    }
  };

  const handleQuizComplete = (earnedPoints: number) => {
    const newPoints = userPoints + earnedPoints;
    setUserPoints(newPoints);
    localStorage.setItem('user_points', newPoints.toString());
    
    toast({
      title: "Quiz Completed!",
      description: `You earned ${earnedPoints} points! Starting download...`,
    });
    
    // Start download after quiz completion
    setTimeout(() => {
      window.open('/download-sources/' + movieId, '_blank');
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <FixedGlobalHeader />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900">
        <FixedGlobalHeader />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Movie Not Found</h2>
            <Link to="/">
              <Button>Go Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <FixedGlobalHeader />
      
      <div className="pt-20 px-4 max-w-6xl mx-auto">
        {/* Top Ad Banner */}
        <ResponsiveAdPlaceholder 
          position="top-banner" 
          title="Download Page Advertisement"
          className="mb-6"
        />

        {/* Back Button */}
        <div className="mb-6">
          <Link to={`/movie/${movieId}`}>
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              <ArrowLeft size={16} className="mr-2" />
              Back to Movie Details
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Movie Info Card */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Download className="text-blue-400" size={24} />
                    Download: {movie.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Award className="text-yellow-500" size={20} />
                    <span className="text-yellow-500 font-semibold">{userPoints} Points</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {movie.genre?.map((g: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {g}
                    </Badge>
                  ))}
                  <Badge className="bg-blue-600 text-xs">
                    {movie.year}
                  </Badge>
                  <Badge className="bg-green-600 text-xs">
                    {movie.country}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {movie.storyline}
                </p>
              </CardContent>
            </Card>

            {/* Ad Space */}
            <ResponsiveAdPlaceholder 
              position="content-middle" 
              title="Special Offers"
              className="my-6"
            />

            {/* Download Links */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Available Downloads</CardTitle>
                <p className="text-gray-400 text-sm">
                  Choose your preferred quality and format
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {downloadLinks.map((link) => {
                    const hasQuiz = link.quality === '1080p'; // Example: 1080p has quiz
                    
                    return (
                      <div
                        key={link.link_id}
                        className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-white">
                              {link.quality}
                            </span>
                            <span className="text-sm text-gray-400">
                              Size: {link.file_size}
                            </span>
                          </div>
                          {hasQuiz && (
                            <div className="flex items-center gap-1">
                              <Play className="text-blue-400" size={16} />
                              <span className="text-xs text-blue-400">Quiz Required</span>
                            </div>
                          )}
                        </div>
                        
                        <Button
                          onClick={() => handleDownloadClick(link.quality, hasQuiz)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Download size={16} className="mr-2" />
                          {hasQuiz ? 'Play Quiz & Download' : 'Download'}
                        </Button>
                      </div>
                    );
                  })}
                </div>
                
                {downloadLinks.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <Download size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No download links available for this movie.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Ad Space */}
            <DownloadPageAds page="download-1" />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Movie Poster */}
            {movie.poster_url && (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                    className="w-full rounded-lg"
                  />
                </CardContent>
              </Card>
            )}

            {/* Sidebar Ads */}
            <ResponsiveAdPlaceholder 
              position="sidebar" 
              title="Recommended for You"
            />
            
            <ResponsiveAdPlaceholder 
              position="sidebar" 
              title="Premium Downloads"
            />
          </div>
        </div>

        {/* Bottom Ad */}
        <ResponsiveAdPlaceholder 
          position="bottom-banner" 
          title="Download Page Footer Advertisement"
          className="mt-8 mb-6"
        />
      </div>

      {/* Quiz Modal */}
      <QuizModal
        isOpen={showQuiz}
        onClose={() => setShowQuiz(false)}
        onComplete={handleQuizComplete}
        movieTitle={movie.title}
        resolution={selectedResolution}
      />
    </div>
  );
};

export default DownloadPage;
