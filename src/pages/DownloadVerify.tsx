
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, ArrowLeft, Shield, Clock, AlertCircle } from "lucide-react";
import HeaderWithAds from "@/components/universal/HeaderWithAds";
import UniversalAdsWrapper from "@/components/ads/UniversalAdsWrapper";
import InterstitialAd from "@/components/ads/InterstitialAd";
import { toast } from "@/components/ui/use-toast";

type VerificationStep = 'captcha' | 'loading' | 'activate' | 'countdown' | 'download' | 'error';

const DownloadVerify = () => {
  const { id, linkId, sourceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { source, movie, downloadLink } = location.state || {};
  
  const [currentStep, setCurrentStep] = useState<VerificationStep>('captcha');
  const [countdown, setCountdown] = useState(5);
  const [showInterstitial, setShowInterstitial] = useState(false);

  useEffect(() => {
    if (!source || !movie || !downloadLink) {
      navigate('/');
      return;
    }
  }, [source, movie, downloadLink, navigate]);

  const handleCaptchaClick = () => {
    setShowInterstitial(true);
    setTimeout(() => {
      setShowInterstitial(false);
      setCurrentStep('loading');
      
      // Show loading for 3 seconds
      setTimeout(() => {
        setCurrentStep('activate');
      }, 3000);
    }, 1000);
  };

  const handleActivateClick = () => {
    setShowInterstitial(true);
    setTimeout(() => {
      setShowInterstitial(false);
      setCurrentStep('countdown');
      setCountdown(5); // Set to 5 seconds as requested
      
      // Start countdown
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            // Check if source has URL, if not show error
            if (source?.url) {
              setCurrentStep('download');
            } else {
              setCurrentStep('error');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1000);
  };

  const handleDownloadClick = () => {
    if (source?.url) {
      // Scroll to bottom of page first
      const scrollToBottom = () => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      };
      
      scrollToBottom();
      
      // Wait for scroll animation, then show interstitial and redirect
      setTimeout(() => {
        setShowInterstitial(true);
        setTimeout(() => {
          setShowInterstitial(false);
          window.open(source.url, '_blank');
          toast({
            title: "Download Started",
            description: `Redirecting to ${source.name}`,
          });
        }, 1000);
      }, 1000);
    } else {
      setCurrentStep('error');
    }
  };

  const otherSources = [
    { name: 'Google Drive', available: true },
    { name: 'TeraBox', available: true },
    { name: 'MediaFire', available: false },
  ].filter(s => s.name !== source?.name);

  if (!source || !movie || !downloadLink) {
    return null;
  }

  return (
    <UniversalAdsWrapper>
      <HeaderWithAds />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Back button */}
          <Button 
            onClick={() => navigate(`/download-sources/${id}/${linkId}`)} 
            variant="outline" 
            className="mb-6"
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to Sources
          </Button>
          
          {/* Movie info */}
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <div className="flex gap-4 items-center flex-col sm:flex-row text-center sm:text-left">
              {movie.poster_url && (
                <img 
                  src={movie.poster_url} 
                  alt={movie.title}
                  className="w-16 h-24 object-cover rounded"
                />
              )}
              <div>
                <h2 className="text-lg font-bold text-white">{movie.title}</h2>
                <p className="text-gray-400 text-sm">via {source.name}</p>
              </div>
            </div>
          </div>
          
          {/* Verification Process */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="text-center">
              <CardTitle className="text-white flex items-center justify-center gap-2">
                <Shield size={20} />
                Download Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 'captcha' && (
                <div className="text-center space-y-4">
                  <p className="text-gray-300">Please verify that you are not a robot</p>
                  <Button 
                    onClick={handleCaptchaClick}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                    size="lg"
                  >
                    <CheckCircle className="mr-2" size={18} />
                    I am not a robot
                  </Button>
                </div>
              )}

              {currentStep === 'loading' && (
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-300">Verifying your request...</p>
                </div>
              )}

              {currentStep === 'activate' && (
                <div className="text-center space-y-4">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                  <p className="text-green-400">✓ Verification completed!</p>
                  <Button 
                    onClick={handleActivateClick}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                    size="lg"
                  >
                    Activate Download Link
                  </Button>
                </div>
              )}

              {currentStep === 'countdown' && (
                <div className="text-center space-y-4">
                  <Clock className="h-12 w-12 text-yellow-500 mx-auto" />
                  <p className="text-gray-300">Preparing your download...</p>
                  <div className="text-3xl font-bold text-yellow-500">{countdown}</div>
                </div>
              )}

              {currentStep === 'download' && (
                <div className="text-center space-y-4">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                  <p className="text-green-400">✓ Download link is ready!</p>
                  <Button 
                    onClick={handleDownloadClick}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                    size="lg"
                  >
                    <Download className="mr-2" size={18} />
                    Download Now
                  </Button>
                </div>
              )}

              {currentStep === 'error' && (
                <div className="text-center space-y-6">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                  <div>
                    <p className="text-red-400 font-semibold mb-2">Link not found</p>
                    <p className="text-gray-400 text-sm">This download source is currently unavailable</p>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-gray-300 font-medium">Try other sources:</p>
                    {otherSources.map((altSource, index) => (
                      <Button
                        key={index}
                        onClick={() => navigate(`/download-sources/${id}/${linkId}`)}
                        variant={altSource.available ? "default" : "secondary"}
                        className={`w-full ${altSource.available 
                          ? "bg-blue-600 hover:bg-blue-700" 
                          : "bg-gray-600 cursor-not-allowed"
                        }`}
                        disabled={!altSource.available}
                      >
                        {altSource.name} {!altSource.available && "(Coming Soon)"}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Interstitial Ad */}
      <InterstitialAd
        isOpen={showInterstitial}
        onClose={() => setShowInterstitial(false)}
        onComplete={() => setShowInterstitial(false)}
        triggerEvent="download_verification"
      />
    </UniversalAdsWrapper>
  );
};

export default DownloadVerify;
