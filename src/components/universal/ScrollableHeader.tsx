
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MFlixLogo from "@/components/MFlixLogo";
import { supabase } from "@/integrations/supabase/client";
import GlobalSearchBar from "@/components/enhanced/GlobalSearchBar";
import AdBanner from "@/components/ads/AdBanner";

const ScrollableHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [genres, setGenres] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGenres();
    fetchCountries();
    generateYears();
  }, []);

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const yearsList = [];
    for (let year = currentYear; year >= 2000; year--) {
      yearsList.push(year);
    }
    setYears(yearsList);
  };

  const fetchGenres = async () => {
    try {
      const { data, error } = await supabase
        .from('genres')
        .select('*')
        .order('name');
      
      if (!error && data) {
        setGenres(data);
      }
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchCountries = async () => {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name');
      
      if (!error && data) {
        setCountries(data);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const navigationItems = [
    { 
      name: "HOME", 
      path: "/",
      hasDropdown: false
    },
    { 
      name: "Bollywood", 
      path: "/movies?category=bollywood",
      hasDropdown: true,
      dropdownItems: [
        { name: "Latest Movies", path: "/movies?category=bollywood&sort=latest" },
        { name: "Popular Movies", path: "/movies?category=bollywood&sort=popular" },
        { name: "Classic Movies", path: "/movies?category=bollywood&sort=classic" }
      ]
    },
    { 
      name: "Hollywood", 
      path: "/movies?category=hollywood",
      hasDropdown: true,
      dropdownItems: [
        { name: "1080p Hollywood Movies", path: "/movies?category=hollywood&quality=1080p" },
        { name: "720p Hollywood Movies", path: "/movies?category=hollywood&quality=720p" },
        { name: "Hollywood Movies 300MB", path: "/movies?category=hollywood&size=300mb" },
        { name: "Hollywood Movies (New)", path: "/movies?category=hollywood&sort=new" },
        { name: "Hollywood Movies (New) HD", path: "/movies?category=hollywood&sort=new&quality=hd" },
        { name: "Hollywood Latest Movies", path: "/movies?category=hollywood&sort=latest" }
      ]
    },
    { 
      name: "Dual Audio", 
      path: "/movies?audio=dual",
      hasDropdown: false,
      icon: "🎧"
    },
    { 
      name: "Telugu", 
      path: "/movies?language=telugu",
      hasDropdown: false
    },
    { 
      name: "Tamil", 
      path: "/movies?language=tamil",
      hasDropdown: false
    },
    { 
      name: "Tv Shows", 
      path: "/web-series",
      hasDropdown: false,
      icon: "📺"
    },
    { 
      name: "Genre", 
      path: "#",
      hasDropdown: true,
      icon: "🎭",
      dropdownItems: genres.map(genre => ({
        name: genre.name,
        path: `/movies?genre=${genre.name.toLowerCase()}`
      }))
    },
    { 
      name: "Country", 
      path: "#",
      hasDropdown: true,
      dropdownItems: countries.map(country => ({
        name: country.name,
        path: `/movies?country=${country.name.toLowerCase()}`
      }))
    },
    { 
      name: "By Year", 
      path: "#",
      hasDropdown: true,
      dropdownItems: years.map(year => ({
        name: year.toString(),
        path: `/movies?year=${year}`
      }))
    }
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path.split('?')[0]);
  };

  return (
    <header className="bg-gray-900 border-b border-gray-700 relative z-50">
      {/* Top Ad Banner */}
      <div className="bg-gray-800 py-1">
        <AdBanner position="header_top" />
      </div>

      {/* Top colored buttons section */}
      <div className="bg-gray-800 py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <Button 
              onClick={() => navigate('/movies?category=bollywood')}
              className="bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-1 rounded-full"
            >
              BOLLYWOOD MOVIES
            </Button>
            <Button 
              onClick={() => navigate('/movies?audio=dual')}
              className="bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-1 rounded-full"
            >
              DUAL AUDIO CONTENT
            </Button>
            <Button 
              onClick={() => navigate('/movies?category=hollywood')}
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-4 py-1 rounded-full"
            >
              HOLLYWOOD MOVIES
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-1 rounded-full flex items-center gap-1">
              📧 JOIN OUR TELEGRAM
            </Button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
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
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "text-yellow-400"
                      : "text-gray-300 hover:text-yellow-400"
                  }`}
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.name}
                  {item.hasDropdown && <ChevronDown size={14} className="ml-1" />}
                </Link>
                
                {/* Dropdown */}
                {item.hasDropdown && item.dropdownItems && (
                  <div className="absolute top-full left-0 bg-gray-800 border border-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-48 z-50">
                    {item.dropdownItems.map((dropdownItem, index) => (
                      <Link
                        key={index}
                        to={dropdownItem.path}
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-yellow-400 hover:bg-gray-700 transition-colors"
                      >
                        {dropdownItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Global Search Bar - Desktop */}
          <div className="hidden md:block">
            <GlobalSearchBar placeholder="Search movies, series, anime..." />
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Global Search Bar - Mobile */}
        <div className="md:hidden pb-4">
          <GlobalSearchBar placeholder="Search movies, series, anime..." />
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800 border-t border-gray-700 rounded-b-lg">
              {navigationItems.map((item) => (
                <div key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive(item.path)
                        ? "text-yellow-400 bg-gray-700"
                        : "text-gray-300 hover:text-yellow-400 hover:bg-gray-700"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.name}
                  </Link>
                  {/* Mobile dropdown items */}
                  {item.hasDropdown && item.dropdownItems && (
                    <div className="pl-6 space-y-1">
                      {item.dropdownItems.slice(0, 5).map((dropdownItem, index) => (
                        <Link
                          key={index}
                          to={dropdownItem.path}
                          className="block px-3 py-1 text-sm text-gray-400 hover:text-yellow-400 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Category tags section */}
      <div className="bg-gray-800 py-2 border-t border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 text-sm">
            <button 
              onClick={() => navigate('/movies?audio=dual&quality=720p')}
              className="text-gray-400 hover:text-yellow-400 transition-colors cursor-pointer"
            >
              Dual Audio [Hindi] 720p
            </button>
            <span className="text-gray-400">•</span>
            <button 
              onClick={() => navigate('/movies?category=hollywood&quality=1080p')}
              className="text-gray-400 hover:text-yellow-400 transition-colors cursor-pointer"
            >
              Hollywood Movies 1080p
            </button>
            <span className="text-gray-400">•</span>
            <button 
              onClick={() => navigate('/movies?language=telugu')}
              className="text-gray-400 hover:text-yellow-400 transition-colors cursor-pointer"
            >
              Telugu
            </button>
            <span className="text-gray-400">•</span>
            <button 
              onClick={() => navigate('/movies?genre=action')}
              className="text-gray-400 hover:text-yellow-400 transition-colors cursor-pointer"
            >
              Action
            </button>
            <span className="text-gray-400">•</span>
            <button 
              onClick={() => navigate('/movies?genre=adventure')}
              className="text-gray-400 hover:text-yellow-400 transition-colors cursor-pointer"
            >
              Adventure
            </button>
            <span className="text-gray-400">•</span>
            <button 
              onClick={() => navigate('/movies?genre=animation')}
              className="text-gray-400 hover:text-yellow-400 transition-colors cursor-pointer"
            >
              Animation
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ScrollableHeader;
