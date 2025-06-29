
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Facebook, Twitter, MessageCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ShareLinksProps {
  title?: string;
}

const ShareLinks = ({ title = "Share this content" }: ShareLinksProps) => {
  const [showShare, setShowShare] = useState(false);
  const currentUrl = window.location.href;
  const shareText = `Check out this amazing content: ${title}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast({
        title: "Link copied!",
        description: "The URL has been copied to your clipboard.",
      });
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = currentUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast({
        title: "Link copied!",
        description: "The URL has been copied to your clipboard.",
      });
    }
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <Share2 size={20} />
        Share This Content
      </h3>
      
      <div className="flex flex-wrap gap-3">
        <Button onClick={copyToClipboard} variant="outline" size="sm" className="flex-1 sm:flex-none">
          <Copy size={16} className="mr-2" />
          Copy Link
        </Button>
        
        <Button onClick={shareToFacebook} variant="outline" size="sm" className="text-blue-500 border-blue-500 flex-1 sm:flex-none">
          <Facebook size={16} className="mr-2" />
          <span className="hidden sm:inline">Facebook</span>
        </Button>
        
        <Button onClick={shareToTwitter} variant="outline" size="sm" className="text-blue-400 border-blue-400 flex-1 sm:flex-none">
          <Twitter size={16} className="mr-2" />
          <span className="hidden sm:inline">Twitter</span>
        </Button>
        
        <Button onClick={shareToWhatsApp} variant="outline" size="sm" className="text-green-500 border-green-500 flex-1 sm:flex-none">
          <MessageCircle size={16} className="mr-2" />
          <span className="hidden sm:inline">WhatsApp</span>
        </Button>
      </div>
    </div>
  );
};

export default ShareLinks;
