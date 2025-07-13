
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Menu, X, Film, Tv, Gamepad2, Video, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MFlixLogo from "@/components/MFlixLogo";
import UniversalSearchBar from "./UniversalSearchBar";

const UniversalHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Movies", path: "/movies", icon: Film },
    { name: "Web Series", path: "/web-series", icon: Tv },
    { name: "Anime", path: "/anime", icon: Gamepad2 },
    { name: "Shorts", path: "/shorts", icon: Video },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <MFlixLogo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActivePath(item.path)
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <UniversalSearchBar />
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center space-x-2 lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSearch}
              className="text-gray-300 hover:text-white md:hidden"
            >
              <Search size={20} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showSearch && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <UniversalSearchBar />
          </div>
        )}

        {/* Tablet Search Bar */}
        <div className="hidden md:block lg:hidden py-4 border-t border-gray-700">
          <UniversalSearchBar />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800 border-t border-gray-700">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={closeMenu}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors ${
                    isActivePath(item.path)
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default UniversalHeader;
