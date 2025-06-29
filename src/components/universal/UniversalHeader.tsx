
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MFlixLogo from "../MFlixLogo";
import { useGenreFiltering } from "@/hooks/useGenreFiltering";

const UniversalHeader = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navigate = useNavigate();
  const { genres } = useGenreFiltering();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  const handleGenreClick = (genreName: string) => {
    navigate(`/search?genre=${encodeURIComponent(genreName)}`);
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  };

  // Filter genres by category
  const languageGenres = genres.filter(g => 
    ['Bollywood', 'Hollywood', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Punjabi', 'Bengali', 'Korean', 'Japanese'].includes(g.name)
  );

  const qualityGenres = genres.filter(g => 
    ['720p', '1080p', '480p', '4K', 'BluRay', 'HDRip', 'DVDRip', 'WEBRip'].includes(g.name)
  );

  const categoryGenres = genres.filter(g => 
    ['Latest Movies', 'Popular Movies', 'Classic Movies', 'Dual Audio', 'Hindi Dubbed', 'Web Series', 'TV Shows'].includes(g.name)
  );

  const sizeGenres = genres.filter(g => 
    ['300MB', '500MB', '700MB', '1GB', '2GB'].includes(g.name)
  );

  const yearGenres = genres.filter(g => 
    ['2024 Movies', '2023 Movies', '2022 Movies', '2021 Movies'].includes(g.name)
  );

  const countryGenres = genres.filter(g => 
    ['America', 'India', 'UK', 'Japan', 'Korea'].includes(g.name)
  );

  const DropdownMenu = ({ title, items }: { title: string; items: any[] }) => (
    <div className="relative">
      <button
        onClick={() => setActiveDropdown(activeDropdown === title ? null : title)}
        className="flex items-center gap-1 text-white hover:text-blue-400 transition-colors whitespace-nowrap"
      >
        {title}
        <ChevronDown size={16} />
      </button>
      {activeDropdown === title && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-[60] max-h-80 overflow-y-auto">
          <div className="p-2">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleGenreClick(item.name)}
                className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <MFlixLogo />
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <Input
                type="text"
                placeholder="Search movies, series, anime..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400 pr-10"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 bg-transparent hover:bg-gray-700"
              >
                <Search size={18} />
              </Button>
            </form>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white flex-shrink-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>

          {/* Admin Link */}
          <div className="hidden md:block flex-shrink-0">
            <Link
              to="/admin/login"
              className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
            >
              Admin
            </Link>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 pb-3 overflow-x-auto scrollbar-thin">
          <Link to="/" className="text-white hover:text-blue-400 transition-colors whitespace-nowrap">
            Home
          </Link>
          <Link to="/movies" className="text-white hover:text-blue-400 transition-colors whitespace-nowrap">
            Movies
          </Link>
          <Link to="/web-series" className="text-white hover:text-blue-400 transition-colors whitespace-nowrap">
            Web Series
          </Link>
          
          {languageGenres.length > 0 && (
            <DropdownMenu title="Languages" items={languageGenres} />
          )}
          
          {qualityGenres.length > 0 && (
            <DropdownMenu title="Quality" items={qualityGenres} />
          )}
          
          {categoryGenres.length > 0 && (
            <DropdownMenu title="Categories" items={categoryGenres} />
          )}
          
          {sizeGenres.length > 0 && (
            <DropdownMenu title="Size" items={sizeGenres} />
          )}
          
          {yearGenres.length > 0 && (
            <DropdownMenu title="Year" items={yearGenres} />
          )}
          
          {countryGenres.length > 0 && (
            <DropdownMenu title="Country" items={countryGenres} />
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 rounded-lg mt-2 p-4 space-y-4 relative z-[60]">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="w-full relative">
              <Input
                type="text"
                placeholder="Search movies, series, anime..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 pr-10"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 bg-transparent hover:bg-gray-600"
              >
                <Search size={18} />
              </Button>
            </form>

            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              <Link
                to="/"
                className="block text-white hover:text-blue-400 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/movies"
                className="block text-white hover:text-blue-400 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Movies
              </Link>
              <Link
                to="/web-series"
                className="block text-white hover:text-blue-400 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Web Series
              </Link>
              
              {/* Mobile Genre Categories */}
              {languageGenres.length > 0 && (
                <div className="py-2">
                  <h4 className="text-gray-400 text-sm font-semibold mb-2">Languages</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {languageGenres.map((genre) => (
                      <button
                        key={genre.id}
                        onClick={() => handleGenreClick(genre.name)}
                        className="text-left text-white hover:text-blue-400 transition-colors text-sm py-1"
                      >
                        {genre.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Link
                to="/admin/login"
                className="block text-blue-400 hover:text-blue-300 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin Panel
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Close dropdown when clicking outside - with higher z-index */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-[55]"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </header>
  );
};

export default UniversalHeader;
