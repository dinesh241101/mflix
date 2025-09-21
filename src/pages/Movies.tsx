
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import UniversalHeader from "@/components/universal/UniversalHeader";
import MovieGrid from "@/components/MovieGrid";
import Pagination from "@/components/Pagination";
import LoadingScreen from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const moviesPerPage = 20;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);
  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Adventure'];
  const countries = ['USA', 'India', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'South Korea'];

  useEffect(() => {
    const genre = searchParams.get('genre') || 'all';
    const year = searchParams.get('year') || 'all';
    const country = searchParams.get('country') || 'all';
    const page = parseInt(searchParams.get('page') || '1');

    setSelectedGenre(genre);
    setSelectedYear(year);
    setSelectedCountry(country);
    setCurrentPage(page);

    fetchMovies(page, genre, year, country);
  }, [searchParams]);

  const fetchMovies = async (page: number, genre: string, year: string, country: string) => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('movies')
        .select('*', { count: 'exact' })
        .eq('content_type', 'movie_id' )
        .eq('is_visible', true);

      // Apply filters
      if (genre !== 'all') {
        query = query.contains('genre', [genre]);
      }
      if (year !== 'all') {
        query = query.eq('year', parseInt(year));
      }
      if (country !== 'all') {
        query = query.eq('country', country);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range((page - 1) * moviesPerPage, page * moviesPerPage - 1);

      if (error) throw error;

      setMovies(data || []);
      setTotalPages(Math.ceil((count || 0) / moviesPerPage));
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newGenre?: string, newYear?: string, newCountry?: string) => {
    const params = new URLSearchParams();
    
    const genre = newGenre ?? selectedGenre;
    const year = newYear ?? selectedYear;
    const country = newCountry ?? selectedCountry;

    if (genre !== 'all') params.set('genre', genre);
    if (year !== 'all') params.set('year', year);
    if (country !== 'all') params.set('country', country);
    params.set('page', '1');

    navigate(`/movies?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    navigate(`/movies?${params.toString()}`);
  };

  const clearFilters = () => {
    navigate('/movies');
  };

  if (loading) {
    return <LoadingScreen message="Loading Movies..." />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <UniversalHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Movies</h1>
          <Button 
            onClick={clearFilters}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:text-white"
          >
            Clear Filters
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
            <Select value={selectedGenre} onValueChange={(value) => updateFilters(value)}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
            <Select value={selectedYear} onValueChange={(value) => updateFilters(undefined, value)}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
            <Select value={selectedCountry} onValueChange={(value) => updateFilters(undefined, undefined, value)}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Movies Grid */}
        {movies.length > 0 ? (
          <>
            <MovieGrid movies={movies} />
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No movies found with the selected filters.</p>
            <Button 
              onClick={clearFilters}
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;
