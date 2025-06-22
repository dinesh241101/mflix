
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import UniversalSearchBar from "./UniversalSearchBar";
import MFlixLogo from "@/components/MFlixLogo";

const UniversalHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: "Home", path: "/" },
    { name: "Movies", path: "/movies" },
    { name: "Web Series", path: "/web-series" },
    { name: "Anime", path: "/anime" },
    { name: "Shorts", path: "/shorts" }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8">
              <MFlixLogo />
            </div>
            <span className="text-xl font-bold text-white">MFlix</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <UniversalSearchBar />
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Search Bar - Mobile (below header) */}
        <div className="lg:hidden pb-4">
          <UniversalSearchBar />
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800 border-t border-gray-700">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.path)
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-700"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default UniversalHeader;
