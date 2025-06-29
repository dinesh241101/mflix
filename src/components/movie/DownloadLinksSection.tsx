
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface DownloadLink {
  link_id: string;
  quality: string;
  file_size: string;
  download_url: string;
  resolution: string;
}

interface DownloadLinksSectionProps {
  movieId: string;
  downloadLinks: DownloadLink[];
}

const DownloadLinksSection = ({ movieId, downloadLinks }: DownloadLinksSectionProps) => {
  const [selectedQuality, setSelectedQuality] = useState<string>("");
  const [isActivated, setIsActivated] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isCountdownActive, setIsCountdownActive] = useState(false);

  const handleActivate = () => {
    setIsCountdownActive(true);
    setCountdown(5);
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsActivated(true);
          setIsCountdownActive(false);
          toast({
            title: "Download links activated!",
            description: "You can now download the movie.",
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleDownload = (link: DownloadLink) => {
    if (!isActivated) {
      toast({
        title: "Please wait",
        description: "Download links are not activated yet.",
        variant: "destructive"
      });
      return;
    }

    // Track download
    console.log(`Starting download for ${link.quality} - ${link.file_size}`);
    
    // Open download link
    window.open(link.download_url, '_blank');
    
    toast({
      title: "Download started",
      description: `Downloading ${link.quality} version (${link.file_size})`,
    });
  };

  const qualityOrder = ['4K', '1080p', '720p', '480p'];
  const sortedLinks = [...downloadLinks].sort((a, b) => {
    const aIndex = qualityOrder.indexOf(a.quality);
    const bIndex = qualityOrder.indexOf(b.quality);
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Download size={20} />
          Download Links
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isActivated && !isCountdownActive && (
          <div className="text-center py-6">
            <AlertCircle className="mx-auto mb-4 text-yellow-500" size={48} />
            <h3 className="text-lg font-semibold text-white mb-2">Activate Download Links</h3>
            <p className="text-gray-400 mb-4">Click the button below to activate download links</p>
            <Button 
              onClick={handleActivate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              Click to Activate
            </Button>
          </div>
        )}

        {isCountdownActive && (
          <div className="text-center py-6">
            <Clock className="mx-auto mb-4 text-blue-500 animate-pulse" size={48} />
            <h3 className="text-lg font-semibold text-white mb-2">Preparing Download Links</h3>
            <p className="text-gray-400 mb-4">Please wait while we prepare your downloads</p>
            <div className="text-3xl font-bold text-blue-500 mb-2">{countdown}</div>
            <p className="text-sm text-gray-500">seconds remaining</p>
          </div>
        )}

        {isActivated && (
          <>
            <div className="text-center py-4">
              <CheckCircle className="mx-auto mb-2 text-green-500" size={32} />
              <p className="text-green-400 font-medium">Download links are now active!</p>
            </div>

            <div className="grid gap-4">
              {sortedLinks.map((link) => (
                <div
                  key={link.link_id}
                  className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <Badge 
                        className={`text-sm font-semibold ${
                          link.quality === '4K' ? 'bg-red-600' :
                          link.quality === '1080p' ? 'bg-blue-600' :
                          link.quality === '720p' ? 'bg-green-600' :
                          'bg-gray-600'
                        }`}
                      >
                        {link.quality}
                      </Badge>
                      <p className="text-xs text-gray-400 mt-1">{link.resolution}</p>
                    </div>
                    
                    <div>
                      <p className="text-white font-medium">
                        {link.quality} Quality
                      </p>
                      <p className="text-gray-400 text-sm">
                        File Size: {link.file_size}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleDownload(link)}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                  >
                    <Download size={16} className="mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
              <h4 className="text-blue-400 font-semibold mb-2">Download Instructions:</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Choose your preferred quality and file size</li>
                <li>• Higher quality = larger file size</li>
                <li>• 1080p recommended for best quality</li>
                <li>• 720p recommended for mobile devices</li>
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DownloadLinksSection;
