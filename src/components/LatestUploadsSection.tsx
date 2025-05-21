
import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Star } from 'lucide-react';

interface Movie {
  movie_id: string;
  title: string;
  year?: number;
  poster_url?: string | null;
  imdb_rating?: number | null;
  genre?: string[];
  downloads?: number;
  content_type: string;
}

interface LatestUploadsSectionProps {
  movies: Movie[];
  title?: string;
}

const LatestUploadsSection = ({ movies, title = "Latest Uploads" }: LatestUploadsSectionProps) => {
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <Link to="/movies?latest=true" className="text-blue-400 hover:text-blue-300">
          View All
        </Link>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <Link key={movie.movie_id} to={`/movie/${movie.movie_id}`}>
            <div className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition duration-300">
              <div className="h-48 bg-gray-700 relative">
                {movie.poster_url ? (
                  <img 
                    src={movie.poster_url} 
                    alt={movie.title} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Film size={32} className="text-gray-500" />
                  </div>
                )}
                
                {/* Latest Tag */}
                <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-0.5 rounded text-xs font-medium">
                  NEW
                </div>
                
                {movie.imdb_rating && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-0.5 rounded text-xs font-bold">
                    {movie.imdb_rating}
                  </div>
                )}
              </div>
              
              <div className="p-3">
                <h3 className="font-bold text-white text-sm truncate">{movie.title}</h3>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {movie.year} {movie.content_type === 'series' ? '• Series' : ''}
                  </span>
                  {movie.genre && movie.genre[0] && (
                    <span className="bg-gray-700 text-gray-300 text-xs px-1.5 py-0.5 rounded">
                      {movie.genre[0]}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LatestUploadsSection;
