
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
    // Navigate to the new download sources page
    navigate(`/download-sources/${movieId}/${link.link_id}`);
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
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {sortedLinks.map((link) => (
            <div
              key={link.link_id}
              className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-blue-500 transition-colors flex-col sm:flex-row gap-4"
            >
              <div className="flex items-center space-x-4 w-full sm:w-auto">
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
                
                <div className="text-center sm:text-left">
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
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 w-full sm:w-auto"
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
