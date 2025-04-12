
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CopyCheck, Share2, Facebook, Twitter, Linkedin, Link, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ShareLinksProps {
  url: string;
  title: string;
}

const ShareLinks = ({ url, title }: ShareLinksProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast({
      title: "Link copied",
      description: "The link has been copied to your clipboard."
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`, '_blank');
  };
  
  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
  };
  
  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-3 flex items-center">
        <Share2 className="mr-2" size={18} />
        Share this content
      </h3>
      
      <div className="flex items-center mb-4">
        <div className="flex-1 bg-gray-700 p-2 rounded-l-lg text-sm text-gray-300 truncate">
          {url}
        </div>
        <Button 
          onClick={copyToClipboard}
          className={`rounded-l-none ${copied ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {copied ? <CheckCircle size={16} className="mr-1" /> : <Link size={16} className="mr-1" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      
      <div className="flex space-x-2">
        <Button 
          onClick={shareOnFacebook}
          variant="outline" 
          className="flex-1 flex items-center justify-center bg-gray-700 hover:bg-blue-800 border-none"
        >
          <Facebook size={18} className="mr-2" />
          Facebook
        </Button>
        
        <Button 
          onClick={shareOnTwitter}
          variant="outline" 
          className="flex-1 flex items-center justify-center bg-gray-700 hover:bg-blue-800 border-none"
        >
          <Twitter size={18} className="mr-2" />
          Twitter
        </Button>
        
        <Button 
          onClick={shareOnLinkedIn}
          variant="outline" 
          className="flex-1 flex items-center justify-center bg-gray-700 hover:bg-blue-800 border-none"
        >
          <Linkedin size={18} className="mr-2" />
          LinkedIn
        </Button>
      </div>
    </div>
  );
};

export default ShareLinks;
