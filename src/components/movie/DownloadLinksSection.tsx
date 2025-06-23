
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface DownloadLink {
  link_id: string;
  quality: string;
  file_size: string;
  download_url: string;
  resolution?: string;
}

interface DownloadLinksSectionProps {
  downloadLinks: DownloadLink[];
  movieId: string;
}

const DownloadLinksSection = ({ downloadLinks, movieId }: DownloadLinksSectionProps) => {
  const [selectedQuality, setSelectedQuality] = useState<string | null>(null);

  // Group download links by quality
  const linksByQuality = downloadLinks.reduce((acc, link) => {
    if (!acc[link.quality]) {
      acc[link.quality] = [];
    }
    acc[link.quality].push(link);
    return acc;
  }, {} as Record<string, DownloadLink[]>);

  const handleQualitySelect = (quality: string) => {
    setSelectedQuality(quality);
  };

  const handleBackToQualities = () => {
    setSelectedQuality(null);
  };

  const downloadSources = [
    { name: "1FICHIER", color: "bg-blue-500" },
    { name: "DESIUPLOAD", color: "bg-green-500" },
    { name: "DOODRIVE", color: "bg-purple-500" },
    { name: "FIKPER", color: "bg-red-500" },
    { name: "MEGAUP", color: "bg-yellow-500" },
    { name: "NITROFLARE", color: "bg-indigo-500" },
    { name: "RAPIDGATOR", color: "bg-pink-500" },
    { name: "TURBOBIT", color: "bg-gray-500" },
  ];

  const watchOnlineSources = [
    { name: "DOODSTREAM", color: "bg-teal-500" },
    { name: "MEDIA", color: "bg-orange-500" },
    { name: "MIXDROP", color: "bg-cyan-500" },
    { name: "WAAW", color: "bg-lime-500" },
    { name: "STREAMTAPE", color: "bg-amber-500" },
    { name: "LISTEAMED", color: "bg-emerald-500" },
  ];

  if (!downloadLinks.length) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6 text-center">
          <Download size={48} className="mx-auto mb-4 text-gray-500" />
          <p className="text-gray-400">Download links will be available soon!</p>
        </CardContent>
      </Card>
    );
  }

  if (!selectedQuality) {
    // Show quality selection
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">
          <span className="text-cyan-400">Download Links</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(linksByQuality).map(([quality, links]) => (
            <Card key={quality} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2">{quality}</h3>
                  <p className="text-gray-400 mb-4">
                    Size: {links[0]?.file_size || "Unknown"}
                  </p>
                  <Button 
                    onClick={() => handleQualitySelect(quality)}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold"
                  >
                    <Download className="mr-2" size={18} />
                    Download {quality}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Show download sources for selected quality
  const selectedLinks = linksByQuality[selectedQuality];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          onClick={handleBackToQualities}
          variant="outline"
          className="text-white border-gray-600 hover:bg-gray-700"
        >
          <ArrowLeft className="mr-2" size={16} />
          Back to Qualities
        </Button>
        <h2 className="text-2xl font-bold">
          <span className="text-cyan-400">Download {selectedQuality}</span>
        </h2>
      </div>

      {/* Main Download Links */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-center text-red-500">
          Direct Download Links
        </h3>
        {selectedLinks.map((link, index) => (
          <Link 
            key={link.link_id} 
            to={`/download-ads/${movieId}/${link.link_id}`}
            className="block"
          >
            <Button className="w-full max-w-md mx-auto bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-6">
              ⚡ CLICK HERE TO DOWNLOAD [{link.file_size}] ⚡
            </Button>
          </Link>
        ))}
      </div>

      {/* High Speed Links */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-center text-red-500">
          Free, High-quality Download From Other Sites #
        </h3>
        
        <div className="space-y-2">
          <h4 className="text-red-500 font-bold">High Speed Links#</h4>
          {downloadSources.map((source, index) => (
            <Button 
              key={index} 
              className={`w-full ${source.color} hover:opacity-90 text-white`}
            >
              ⚡ {source.name} ⚡
            </Button>
          ))}
        </div>

        {/* Watch Online Links */}
        <div className="space-y-2 mt-6">
          <h4 className="text-red-500 font-bold">Watch Online Links#</h4>
          {watchOnlineSources.map((source, index) => (
            <Button 
              key={index} 
              className={`w-full ${source.color} hover:opacity-90 text-white`}
            >
              ⚡ {source.name} ⚡
            </Button>
          ))}
        </div>

        {/* Cloud Storage Links */}
        <div className="space-y-2 mt-6">
          {[
            { name: 'V-Cloud [Resumable]', color: 'bg-red-500' },
            { name: 'Filepress [G-Drive]', color: 'bg-yellow-500' },
            { name: 'GDToT [G-Drive]', color: 'bg-purple-500' },
            { name: 'DropGalaxy', color: 'bg-gray-500' }
          ].map((link, index) => (
            <Button 
              key={index} 
              className={`w-full ${link.color} hover:opacity-90 text-white`}
            >
              ⚡ {link.name} ⚡
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DownloadLinksSection;
