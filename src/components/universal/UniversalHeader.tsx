
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Film, Tv, Gamepad2, Video, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import GlobalSearchBar from "@/components/enhanced/GlobalSearchBar";

interface UniversalHeaderProps {
  title?: string;
  showBackButton?: boolean;
}

const UniversalHeader = ({ title = "MFlix", showBackButton = false }: UniversalHeaderProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Button variant="ghost" onClick={() => navigate(-1)}>
                ←
              </Button>
            )}
            <h1 className="text-2xl font-bold text-blue-400">{title}</h1>
            
            {!isMobile && (
              <nav className="flex space-x-6">
                <Button variant="ghost" onClick={() => navigate('/movies')}>
                  <Film className="mr-2" size={16} />
                  Movies
                </Button>
                <Button variant="ghost" onClick={() => navigate('/web-series')}>
                  <Tv className="mr-2" size={16} />
                  Series
                </Button>
                <Button variant="ghost" onClick={() => navigate('/anime')}>
                  <Gamepad2 className="mr-2" size={16} />
                  Anime
                </Button>
                <Button variant="ghost" onClick={() => navigate('/shorts')}>
                  <Video className="mr-2" size={16} />
                  Shorts
                </Button>
              </nav>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {!isMobile && <GlobalSearchBar />}
            
            {isMobile && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobile && mobileMenuOpen && (
          <div className="mt-4 pb-4 border-t border-gray-700 pt-4">
            <div className="mb-4">
              <GlobalSearchBar />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  navigate('/movies');
                  setMobileMenuOpen(false);
                }}
                className="flex flex-col items-center p-4 h-auto"
              >
                <Film size={24} className="mb-2" />
                <span className="text-sm">Movies</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  navigate('/web-series');
                  setMobileMenuOpen(false);
                }}
                className="flex flex-col items-center p-4 h-auto"
              >
                <Tv size={24} className="mb-2" />
                <span className="text-sm">Series</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  navigate('/anime');
                  setMobileMenuOpen(false);
                }}
                className="flex flex-col items-center p-4 h-auto"
              >
                <Gamepad2 size={24} className="mb-2" />
                <span className="text-sm">Anime</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  navigate('/shorts');
                  setMobileMenuOpen(false);
                }}
                className="flex flex-col items-center p-4 h-auto"
              >
                <Video size={24} className="mb-2" />
                <span className="text-sm">Shorts</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default UniversalHeader;
