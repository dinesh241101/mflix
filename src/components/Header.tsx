import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMenuOpen(false);
    }
  };

  return (
    <header className="bg-gray-800 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold text-red-500">
        Mflix
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center space-x-6">
        <Link to="/movies" className="hover:text-red-400">
          Movies
        </Link>
        <Link to="/anime" className="hover:text-red-400">
          Anime
        </Link>
        <Link to="/web-series" className="hover:text-red-400">
          Web Series
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="px-3 py-1 rounded bg-gray-700 text-white focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <Search size={16} />
          </button>
        </form>
      </nav>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-gray-300 hover:text-white"
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-14 left-0 w-full bg-gray-900 flex flex-col items-center space-y-4 py-4 md:hidden">
          <form onSubmit={handleSearch} className="flex w-11/12">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="flex-grow px-3 py-2 rounded-l bg-gray-700 text-white focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 bg-red-500 text-white rounded-r"
            >
              <Search size={16} />
            </button>
          </form>
          <Link
            to="/movies"
            onClick={() => setMenuOpen(false)}
            className="hover:text-red-400"
          >
            Movies
          </Link>
          <Link
            to="/anime"
            onClick={() => setMenuOpen(false)}
            className="hover:text-red-400"
          >
            Anime
          </Link>
          <Link
            to="/web-series"
            onClick={() => setMenuOpen(false)}
            className="hover:text-red-400"
          >
            Web Series
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;
