
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search, Film, Tv, Play, Video, Home } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import MFlixLogo from "@/components/MFlixLogo";
import { Input } from "@/components/ui/input";

const UniversalHeader = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navigationItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Movies", href: "/movies", icon: Film },
    { label: "Web Series", href: "/web-series", icon: Tv },
    { label: "Anime", href: "/anime", icon: Play },
    { label: "Shorts", href: "/shorts", icon: Video },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-800/50' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <MFlixLogo />
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList className="space-x-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <NavigationMenuItem key={item.label}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={item.href}
                        className="flex items-center space-x-2 px-4 py-2 text-white hover:text-blue-400 hover:bg-gray-800/50 rounded-md transition-colors"
                      >
                        <IconComponent size={18} />
                        <span>{item.label}</span>
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2 flex-1 max-w-md mx-4">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search movies, series, anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 pr-10"
              />
              <Button
                type="submit"
                size="sm"
                variant="ghost"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <Search size={16} />
              </Button>
            </div>
          </form>

          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Mobile Search Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white">
                  <Search size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="bg-gray-900 border-gray-800 h-32">
                <form onSubmit={handleSearch} className="mt-4">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search movies, series, anime..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 pr-10"
                      autoFocus
                    />
                    <Button
                      type="submit"
                      size="sm"
                      variant="ghost"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <Search size={16} />
                    </Button>
                  </div>
                </form>
              </SheetContent>
            </Sheet>

            {/* Mobile Navigation Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-gray-900 border-gray-800 w-80">
                <div className="flex flex-col space-y-4 mt-6">
                  {navigationItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={item.label}
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-white hover:text-blue-400 hover:bg-gray-800/50 rounded-md transition-colors"
                      >
                        <IconComponent size={20} />
                        <span className="text-lg">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UniversalHeader;
