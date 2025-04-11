
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Facebook, Twitter, Linkedin, Instagram, 
  Link as LinkIcon, Copy, Check
} from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

interface ShareLinksProps {
  url: string;
  title: string;
  customLinks?: {
    text: string;
    url: string;
  }[];
}

const ShareLinks = ({ url, title, customLinks = [] }: ShareLinksProps) => {
  const [copied, setCopied] = useState(false);
  
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  
  const shareLinks = [
    {
      name: 'Facebook',
      icon: <Facebook size={16} />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: 'Twitter',
      icon: <Twitter size={16} />,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin size={16} />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: 'Instagram',
      icon: <Instagram size={16} />,
      url: `https://www.instagram.com/?url=${encodedUrl}`,
    },
  ];
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    
    toast({
      title: "Link copied!",
      description: "The link has been copied to your clipboard.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="flex flex-wrap gap-2">
      {shareLinks.map((link) => (
        <Button
          key={link.name}
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => window.open(link.url, '_blank')}
        >
          {link.icon}
          {link.name}
        </Button>
      ))}
      
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={handleCopyLink}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        Copy Link
      </Button>
      
      {customLinks.map((link, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => window.open(link.url, '_blank')}
        >
          <LinkIcon size={16} />
          {link.text}
        </Button>
      ))}
    </div>
  );
};

export default ShareLinks;
