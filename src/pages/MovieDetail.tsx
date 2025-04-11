
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star, Download, Clock, Calendar, Film, Globe } from "lucide-react";

const MovieDetail = () => {
  const { id } = useParams();
  const [showAd, setShowAd] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  
  useEffect(() => {
    document.title = "Movie Detail - MFlix";
  }, []);

  // Handle click events to show ads on every 2nd click
  const handleClick = (e: React.MouseEvent) => {
    setClickCount(prev => prev + 1);
    if ((clickCount + 1) % 2 === 0) {
      e.preventDefault();
      setShowAd(true);
      setTimeout(() => {
        setShowAd(false);
      }, 5000); // Hide ad after 5 seconds
    }
  };

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
    downloadUrls: [
      { quality: "1080p", size: "2.1GB", url: "#download-1080" },
      { quality: "720p", size: "1.2GB", url: "#download-720" },
      { quality: "480p", size: "700MB", url: "#download-480" }
    ],
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    sampleClips: [
      { thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1", url: "#clip1" },
      { thumbnail: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9", url: "#clip2" }
    ],
    director: "John Director",
    productionHouse: "Sample Studios",
    quality: "1080p",
    country: "USA",
    contentType: "Movie",
    cast: ["Actor One", "Actor Two", "Actor Three"]
  };

  // Similar movies (placeholder) - would come from Supabase
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
    },
    {
      id: 4,
      title: "Similar Movie 3",
      poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      year: 2021,
      rating: 8.3,
      genre: "Action"
    },
    {
      id: 5,
      title: "Similar Movie 4",
      poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      year: 2023,
      rating: 7.5,
      genre: "Action"
    }
  ];

  // AD Shorts (placeholder) - would come from Supabase
  const adShorts = [
    { id: 1, thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7", title: "Short Clip 1" },
    { id: 2, thumbnail: "https://images.unsplash.com/photo-1611162616305-c69b3396f6d3", title: "Short Clip 2" },
    { id: 3, thumbnail: "https://images.unsplash.com/photo-1611162616475-b1a91bd5c0c9", title: "Short Clip 3" },
    { id: 4, thumbnail: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb", title: "Short Clip 4" }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Ad Popup - Only shows when triggered */}
      {showAd && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Advertisement</h3>
              <button 
                onClick={() => setShowAd(false)}
                className="text-gray-400 hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <p className="mb-4">Sponsored Content</p>
              <img 
                src="https://images.unsplash.com/photo-1611162616305-c69b3396f6d3" 
                alt="Ad" 
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <a 
                href="#ad-link" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      )}

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
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Movie Poster */}
          <div className="w-full lg:w-1/3">
            <img 
              src={movie.poster} 
              alt={movie.title} 
              className="w-full h-auto rounded-lg shadow-lg"
            />
            
            {/* Movie Ratings */}
            <div className="mt-6 bg-gray-800 p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-3">Ratings</h2>
              <div className="flex items-center mb-2">
                <Star className="text-yellow-500 mr-2" size={20} />
                <span className="font-semibold">IMDB:</span>
                <span className="ml-2">{movie.imdbRating}/10</span>
              </div>
              <div className="flex items-center">
                <Star className="text-blue-500 mr-2" size={20} />
                <span className="font-semibold">User Rating:</span>
                <span className="ml-2">{movie.userRating}/10</span>
              </div>
            </div>
            
            {/* Movie Info */}
            <div className="mt-6 bg-gray-800 p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-3">Movie Info</h2>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="text-gray-400 mr-2" size={16} />
                  <span className="font-semibold mr-2">Year:</span>
                  <span>{movie.year}</span>
                </div>
                <div className="flex items-center">
                  <Film className="text-gray-400 mr-2" size={16} />
                  <span className="font-semibold mr-2">Director:</span>
                  <span>{movie.director}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="text-gray-400 mr-2" size={16} />
                  <span className="font-semibold mr-2">Production:</span>
                  <span>{movie.productionHouse}</span>
                </div>
                <div className="flex items-center">
                  <Download className="text-gray-400 mr-2" size={16} />
                  <span className="font-semibold mr-2">Downloads:</span>
                  <span>{movie.downloads}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Movie Info */}
          <div className="w-full lg:w-2/3">
            <h1 className="text-3xl font-bold mb-2">{movie.title} ({movie.year})</h1>
            
            <div className="flex flex-wrap gap-2 mb-6">
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
              <div className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                {movie.contentType}
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Storyline</h2>
              <p className="text-gray-300">{movie.storyline}</p>
            </div>
            
            {/* Trailer and Clips */}
            <div className="mb-6">
              <Tabs defaultValue="trailer">
                <TabsList className="bg-gray-800">
                  <TabsTrigger value="trailer">Trailer</TabsTrigger>
                  <TabsTrigger value="clips">Sample Clips</TabsTrigger>
                </TabsList>
                <TabsContent value="trailer" className="mt-4">
                  <div className="bg-gray-800 rounded-lg overflow-hidden aspect-video">
                    <iframe 
                      src={movie.trailerUrl} 
                      title="Movie Trailer"
                      className="w-full h-full"
                      allowFullScreen
                    ></iframe>
                  </div>
                </TabsContent>
                <TabsContent value="clips" className="mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {movie.sampleClips.map((clip, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg overflow-hidden">
                        <img 
                          src={clip.thumbnail} 
                          alt={`Sample Clip ${index + 1}`} 
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-3">
                          <Button 
                            onClick={handleClick}
                            className="w-full"
                          >
                            Watch Clip {index + 1}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Download Section */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Download Links</h2>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="space-y-4">
                  {movie.downloadUrls.map((download, index) => (
                    <div key={index} className="bg-gray-700 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="font-semibold">{download.quality}</span>
                          <span className="text-gray-400 ml-2">({download.size})</span>
                        </div>
                      </div>
                      <a 
                        href={download.url} 
                        className="block w-full bg-green-600 hover:bg-green-700 text-center py-2 rounded-lg font-bold transition-colors"
                        onClick={handleClick}
                      >
                        Download {download.quality}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Ad Shorts Feature */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Quick Shorts</h2>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {adShorts.map(short => (
                    <div key={short.id} className="bg-gray-700 rounded-lg overflow-hidden">
                      <img 
                        src={short.thumbnail} 
                        alt={short.title} 
                        className="w-full h-24 object-cover"
                      />
                      <div className="p-2 text-center">
                        <button 
                          className="text-sm hover:text-blue-400"
                          onClick={handleClick}
                        >
                          {short.title}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-4 text-sm text-gray-400">
                  Watch 4 shorts to unlock premium content
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Similar Movies */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar Movies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similarMovies.map(movie => (
              <Link to={`/movie/${movie.id}`} key={movie.id} className="group">
                <Card className="bg-gray-800 border-gray-700 overflow-hidden transform transition-transform hover:scale-105">
                  <div className="relative">
                    <img 
                      src={movie.poster} 
                      alt={movie.title} 
                      className="w-full h-[200px] object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-sm font-bold">
                      {movie.rating}
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="text-center px-4">
                        <h3 className="font-bold text-lg mb-1">{movie.title}</h3>
                        <p className="text-sm">{movie.year} • {movie.genre}</p>
                        <p className="mt-2 text-blue-400">Click to view details</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-1">{movie.title}</h3>
                    <div className="text-sm text-gray-400">
                      <span>{movie.year} • {movie.genre}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
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
