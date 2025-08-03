
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface UniversalSearchBarProps {
  placeholder?: string;
  className?: string;
}

const UniversalSearchBar = ({ 
  placeholder = "Search movies, series, anime...", 
  className = "" 
}: UniversalSearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.trim();
      // Enhanced search - pass to improved search results
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchQuery("");
    }
  };

  return (
    <form onSubmit={handleSearch} className={`flex gap-2 w-full ${className}`}>
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      </div>
      <Button type="submit" variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600">
        Search
      </Button>
    </form>
  );
};

export default UniversalSearchBar;
