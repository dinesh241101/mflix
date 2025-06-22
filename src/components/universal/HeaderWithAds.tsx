
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, Film, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MFlixLogo from "@/components/MFlixLogo";
import { supabase } from "@/integrations/supabase/client";
import ResponsiveAdPlaceholder from "@/components/ResponsiveAdPlaceholder";

const HeaderWithAds = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [genres, setGenres] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [headerConfig, setHeaderConfig] = useState<any>({
    topButtons: [],
    categoryTags: []
  });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGenres();
    fetchCountries();
    generateYears();
    loadHeaderConfig();
  }, []);

  const loadHeaderConfig = () => {
    const savedConfig = localStorage.getItem('headerConfig');
    if (savedConfig) {
      setHeaderConfig(JSON.parse(savedConfig));
    } else {
      setHeaderConfig({
        topButtons: [
          { name: "BOLLYWOOD MOVIES", path: "/movies?category=bollywood", color: "green" },
          { name: "DUAL AUDIO CONTENT", path: "/movies?audio=dual", color: "red" },
          { name: "HOLLYWOOD MOVIES", path: "/movies?category=hollywood", color: "orange" },
          { name: "JOIN OUR TELEGRAM", path: "#", color: "blue" }
        ],
        categoryTags: [
          "Dual Audio [Hindi] 720p",
          "Hollywood Movies 1080p",
          "Telugu",
          "Action",
          "Adventure",
          "Animation"
        ]
      });
    }
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const yearsList = [];
    for (let year = currentYear; year >= 1980; year--) {
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
      // Get unique countries from movies table
      const { data: movieCountries, error: movieError } = await supabase
        .from('movies')
        .select('country')
        .not('country', 'is', null)
        .not('country', 'eq', '');

      if (!movieError && movieCountries) {
        const uniqueCountries = [...new Set(movieCountries.map(m => m.country))].filter(Boolean);
        const countryObjects = uniqueCountries.map(country => ({ name: country }));
        setCountries(countryObjects);
      }

      // Also fetch from countries table if it exists
      const { data: countriesData, error: countriesError } = await supabase
        .from('countries')
        .select('*')
        .order('name');
      
      if (!countriesError && countriesData) {
        // Merge with existing countries, avoiding duplicates
        const existingNames = countries.map(c => c.name);
        const newCountries = countriesData.filter(c => !existingNames.includes(c.name));
        setCountries(prev => [...prev, ...newCountries]);
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

  const handleTagClick = (tag: string) => {
    const searchTerm = tag.toLowerCase().replace(/\s+/g, '-');
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
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
        path: `/movies?genre=${encodeURIComponent(genre.name.toLowerCase())}`
      }))
    },
    { 
      name: "Country", 
      path: "#",
      hasDropdown: true,
      icon: "🌍",
      dropdownItems: countries.map(country => ({
        name: country.name,
        path: `/movies?country=${encodeURIComponent(country.name.toLowerCase())}`
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

  const getButtonColorClass = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-600 hover:bg-green-700';
      case 'red': return 'bg-red-600 hover:bg-red-700';
      case 'orange': return 'bg-orange-500 hover:bg-orange-600';
      case 'blue': return 'bg-blue-600 hover:bg-blue-700';
      case 'purple': return 'bg-purple-600 hover:bg-purple-700';
      default: return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  return (
    <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      {/* Top Ad */}
      <ResponsiveAdPlaceholder position="header-banner" />
      
      {/* Top colored buttons section */}
      <div className="bg-gray-800 py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {headerConfig.topButtons.map((button: any, index: number) => (
              <Button 
                key={index}
                onClick={() => navigate(button.path)}
                className={`${getButtonColorClass(button.color)} text-white text-xs px-4 py-1 rounded-full`}
              >
                {button.name}
              </Button>
            ))}
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
                  <div className="absolute top-full left-0 bg-gray-800 border border-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-48 z-50 max-h-64 overflow-y-auto">
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

          {/* Search Bar - Desktop */}
          <div className="hidden md:block">
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search movies, series, anime..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-400"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
              <Button 
                type="submit" 
                className="ml-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-full"
              >
                <Search size={18} />
              </Button>
            </form>
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

        {/* Search Bar - Mobile */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search movies, series, anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black">
              <Search size={18} />
            </Button>
          </form>
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
                      {item.dropdownItems.slice(0, 8).map((dropdownItem, index) => (
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
            {headerConfig.categoryTags.map((tag: string, index: number) => (
              <span 
                key={index}
                onClick={() => handleTagClick(tag)}
                className="text-gray-400 hover:text-yellow-400 cursor-pointer transition-colors"
              >
                {tag}
                {index < headerConfig.categoryTags.length - 1 && <span className="ml-2">•</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderWithAds;
