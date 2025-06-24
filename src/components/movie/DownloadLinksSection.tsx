
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ExternalLink, Star, Zap, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DownloadLink {
  link_id: string;
  quality: string;
  file_size: string;
  file_size_gb?: number;
  resolution?: string;
  download_url: string;
}

interface DownloadLinksSectionProps {
  downloadLinks: DownloadLink[];
  movieId: string;
}

const DownloadLinksSection = ({ downloadLinks, movieId }: DownloadLinksSectionProps) => {
  const navigate = useNavigate();
  const [selectedQuality, setSelectedQuality] = useState<string | null>(null);
  const [showSources, setShowSources] = useState(false);

  // Mock download sources for demonstration
  const downloadSources = [
    { id: '1', name: 'Download Free', type: 'free', icon: '📥', color: 'bg-green-600' },
    { id: '2', name: 'High-Speed Download', type: 'premium', icon: '⚡', color: 'bg-amber-600' },
    { id: '3', name: 'Mirror 1 - FileCrypt', type: 'external', icon: '🔗', color: 'bg-blue-600' },
    { id: '4', name: 'Mirror 2 - UploadHaven', type: 'external', icon: '🌐', color: 'bg-purple-600' },
    { id: '5', name: 'Mirror 3 - MegaShare', type: 'external', icon: '📤', color: 'bg-indigo-600' },
    { id: '6', name: 'Torrent Download', type: 'torrent', icon: '🧲', color: 'bg-red-600' },
  ];

  const handleQualitySelect = (quality: string) => {
    setSelectedQuality(quality);
    setShowSources(true);
  };

  const handleDownloadClick = (source: any, linkId?: string) => {
    if (source.type === 'free') {
      // Navigate to ads page for free downloads
      navigate(`/download-ads/${movieId}/${linkId || 'default'}`);
    } else {
      // For premium or external links, open directly
      window.open('#', '_blank');
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality.toLowerCase()) {
      case '4k':
      case '2160p':
        return 'bg-purple-600';
      case '1080p':
      case 'full hd':
        return 'bg-blue-600';
      case '720p':
      case 'hd':
        return 'bg-green-600';
      case '480p':
        return 'bg-yellow-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getSizeColor = (sizeGB: number) => {
    if (sizeGB > 4) return 'text-red-400';
    if (sizeGB > 2) return 'text-yellow-400';
    return 'text-green-400';
  };

  // Group links by quality
  const groupedLinks = downloadLinks.reduce((acc, link) => {
    const key = link.quality;
    if (!acc[key]) acc[key] = [];
    acc[key].push(link);
    return acc;
  }, {} as Record<string, DownloadLink[]>);

  if (downloadLinks.length === 0) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6 text-center">
          <Download className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No Download Links Available</h3>
          <p className="text-gray-500">Download links will be added soon.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Download className="text-green-500" />
          Download Links
        </h2>
        <p className="text-gray-400">Choose your preferred quality and download source</p>
      </div>

      {!showSources ? (
        // Step 1: Quality Selection
        <div className="grid gap-4">
          <h3 className="text-lg font-semibold text-white mb-4">📱 Step 1: Select Quality & Size</h3>
          {Object.entries(groupedLinks).map(([quality, links]) => (
            <Card key={quality} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
              <CardContent className="p-4">
                {links.map((link, index) => (
                  <div
                    key={link.link_id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-700 hover:bg-gray-600 cursor-pointer transition-colors"
                    onClick={() => handleQualitySelect(quality)}
                  >
                    <div className="flex items-center gap-4">
                      <Badge className={`${getQualityColor(quality)} text-white`}>
                        {quality}
                      </Badge>
                      {link.resolution && (
                        <Badge variant="outline" className="text-gray-300 border-gray-500">
                          {link.resolution}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium text-white">{link.file_size}</div>
                        {link.file_size_gb && (
                          <div className={`text-sm ${getSizeColor(link.file_size_gb)}`}>
                            {link.file_size_gb.toFixed(1)} GB
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Select
                        <ExternalLink size={16} className="ml-2" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Step 2: Source Selection
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              🔗 Step 2: Choose Download Source ({selectedQuality})
            </h3>
            <Button
              onClick={() => setShowSources(false)}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300"
            >
              ← Back to Quality Selection
            </Button>
          </div>

          <div className="grid gap-3">
            {downloadSources.map((source, index) => (
              <Card key={source.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`${source.color} w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold`}>
                        {source.icon}
                      </div>
                      <div>
                        <div className="font-medium text-white">{source.name}</div>
                        <div className="text-sm text-gray-400 capitalize">
                          {source.type === 'free' && '🆓 Free Download (with ads)'}
                          {source.type === 'premium' && '⚡ High-Speed Download'}
                          {source.type === 'external' && '🔗 External Mirror'}
                          {source.type === 'torrent' && '🧲 Torrent Download'}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleDownloadClick(source, groupedLinks[selectedQuality!]?.[0]?.link_id)}
                      className={`${source.color} hover:opacity-90 text-white`}
                    >
                      {source.type === 'free' ? (
                        <>
                          <Download size={16} className="mr-2" />
                          Download Free
                        </>
                      ) : source.type === 'premium' ? (
                        <>
                          <Zap size={16} className="mr-2" />
                          Premium Download
                        </>
                      ) : (
                        <>
                          <ExternalLink size={16} className="mr-2" />
                          Download
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h4 className="font-semibold text-white mb-2">📋 Download Instructions:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• 🆓 <strong>Free Download:</strong> Watch a short ad to access the download link</li>
              <li>• ⚡ <strong>Premium:</strong> Instant high-speed download without ads</li>
              <li>• 🔗 <strong>External Mirrors:</strong> Alternative download sources</li>
              <li>• 🧲 <strong>Torrent:</strong> P2P download using torrent client</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadLinksSection;
