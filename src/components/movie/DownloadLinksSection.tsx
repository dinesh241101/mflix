
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface DownloadLink {
  link_id: string;
  quality: string;
  file_size: string;
  download_url: string;
  resolution: string;
}

interface DownloadLinksSectionProps {
  movieId: string;
}

const DownloadLinksSection = ({ movieId }: DownloadLinksSectionProps) => {
  const navigate = useNavigate();
  const [downloadLinks, setDownloadLinks] = useState<DownloadLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDownloadLinks();
  }, [movieId]);

  const fetchDownloadLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('download_links')
        .select('*')
        .eq('movie_id', movieId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDownloadLinks(data || []);
    } catch (error) {
      console.error('Error fetching download links:', error);
    } finally {
      setLoading(false);
    }
  };

const handleDownload = (link: DownloadLink) => {
    // Open download page in new tab as requested
    window.open(`/download-sources/${movieId}/${link.link_id}`, '_blank');
  };

  const qualityOrder = ['4K', '1080p', '720p', '480p'];
  const sortedLinks = [...downloadLinks].sort((a, b) => {
    const aIndex = qualityOrder.indexOf(a.quality);
    const bIndex = qualityOrder.indexOf(b.quality);
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="text-center text-gray-400">Loading download links...</div>
        </CardContent>
      </Card>
    );
  }

  if (sortedLinks.length === 0) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Download size={20} />
            Download Links
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-gray-400 py-8">
          <p>No download links available for this content.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Download size={20} />
          Download Links
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quality buttons grid - matching image-1 reference */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Select Quality to Download</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {sortedLinks.map((link) => (
              <Button
                key={link.link_id}
                onClick={() => handleDownload(link)}
                className={`relative px-8 py-6 h-auto flex flex-col items-center gap-2 border-2 transition-all hover:scale-105 ${
                  link.quality === '4K' ? 'bg-red-600 border-red-500 hover:bg-red-700' :
                  link.quality === '1080p' ? 'bg-blue-600 border-blue-500 hover:bg-blue-700' :
                  link.quality === '720p' ? 'bg-green-600 border-green-500 hover:bg-green-700' :
                  'bg-gray-600 border-gray-500 hover:bg-gray-700'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{link.quality}</div>
                  {link.resolution && (
                    <div className="text-xs text-gray-200 opacity-80">{link.resolution}</div>
                  )}
                  <div className="text-sm text-gray-200 mt-1">{link.file_size}</div>
                </div>
                <Download size={20} className="text-white" />
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
          <h4 className="text-blue-400 font-semibold mb-2">Download Instructions:</h4>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• Choose your preferred quality and file size</li>
            <li>• Select from multiple download sources</li>
            <li>• Complete simple verification process</li>
            <li>• 1080p recommended for best quality</li>
            <li>• 720p recommended for mobile devices</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DownloadLinksSection;
