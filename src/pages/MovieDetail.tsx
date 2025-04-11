
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const MovieDetail = () => {
  const { id } = useParams();
  
  useEffect(() => {
    document.title = "Movie Detail - MFlix";
  }, []);

  // Placeholder data - would come from Supabase
  const movie = {
    id: 1,
    title: "Sample Movie",
    poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    year: 2023,
    imdbRating: 8.5,
    userRating: 8.2,
    genre: "Action",
    downloads: 1250,
    storyline: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus.",
    downloadUrl: "#",
    quality: "1080p",
    country: "USA",
    contentType: "Movie"
  };

  // Similar movies (placeholder)
  const similarMovies = [
    {
      id: 2,
      title: "Similar Movie 1",
      poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      year: 2023,
      rating: 7.8,
      genre: "Action"
    },
    {
      id: 3,
      title: "Similar Movie 2",
      poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      year: 2022,
      rating: 9.0,
      genre: "Action"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header/Navigation */}
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">MFlix</h1>
            <nav>
              <ul className="flex space-x-6">
                <li><Link to="/" className="hover:text-blue-400">Home</Link></li>
                <li><Link to="/movies" className="hover:text-blue-400">Movies</Link></li>
                <li><Link to="/series" className="hover:text-blue-400">Web Series</Link></li>
                <li><Link to="/anime" className="hover:text-blue-400">Anime</Link></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Movie Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Movie Poster */}
          <div className="w-full md:w-1/3">
            <img 
              src={movie.poster} 
              alt={movie.title} 
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          
          {/* Movie Info */}
          <div className="w-full md:w-2/3">
            <h1 className="text-3xl font-bold mb-4">{movie.title} ({movie.year})</h1>
            
            <div className="flex gap-4 mb-6">
              <div className="bg-yellow-600 px-3 py-1 rounded-full text-sm font-semibold">
                IMDB: {movie.imdbRating}
              </div>
              <div className="bg-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                User: {movie.userRating}
              </div>
              <div className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                {movie.genre}
              </div>
              <div className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                {movie.quality}
              </div>
              <div className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                {movie.country}
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Storyline</h2>
              <p className="text-gray-300">{movie.storyline}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Download</h2>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <span>Quality: {movie.quality}</span>
                  <span>Downloads: {movie.downloads}</span>
                </div>
                <a 
                  href={movie.downloadUrl} 
                  className="block w-full bg-green-600 hover:bg-green-700 text-center py-3 rounded-lg font-bold transition-colors"
                >
                  Download Now
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Similar Movies */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar Movies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similarMovies.map(movie => (
              <Card key={movie.id} className="bg-gray-800 border-gray-700 overflow-hidden">
                <div className="relative">
                  <img 
                    src={movie.poster} 
                    alt={movie.title} 
                    className="w-full h-[200px] object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-sm font-bold">
                    {movie.rating}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1">{movie.title}</h3>
                  <div className="text-sm text-gray-400">
                    <span>{movie.year} • {movie.genre}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-800 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-400">
            <p>© 2025 MFlix. All rights reserved.</p>
            <p className="mt-2">Disclaimer: This site does not store any files on its server. All contents are provided by non-affiliated third parties.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MovieDetail;
