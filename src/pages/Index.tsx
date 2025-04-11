
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  useEffect(() => {
    document.title = "MFlix - Movie Download Hub";
  }, []);

  // Placeholder data until we connect to Supabase
  const featuredMovies = [
    {
      id: 1,
      title: "Sample Movie 1",
      poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      year: 2023,
      rating: 8.5,
      genre: "Action",
      downloads: 1250
    },
    {
      id: 2,
      title: "Sample Movie 2",
      poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      year: 2023,
      rating: 7.8,
      genre: "Comedy",
      downloads: 980
    },
    {
      id: 3,
      title: "Sample Movie 3",
      poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      year: 2022,
      rating: 9.0,
      genre: "Drama",
      downloads: 2150
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
                <li><Link to="/admin" className="hover:text-blue-400">Admin</Link></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Carousel className="w-full">
            <CarouselContent>
              <CarouselItem className="basis-full">
                <div className="h-[400px] relative">
                  <img 
                    src="https://images.unsplash.com/photo-1500673922987-e212871fec22" 
                    alt="Featured Banner" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex flex-col justify-end p-8">
                    <h2 className="text-3xl font-bold mb-2">Featured Movies</h2>
                    <p className="text-lg">Discover the latest and greatest films to download</p>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      {/* Latest Uploads */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Latest Uploads</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredMovies.map(movie => (
              <Card key={movie.id} className="bg-gray-800 border-gray-700 overflow-hidden">
                <div className="relative">
                  <img 
                    src={movie.poster} 
                    alt={movie.title} 
                    className="w-full h-[250px] object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-sm font-bold">
                    {movie.rating}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1">{movie.title}</h3>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{movie.year} • {movie.genre}</span>
                    <span>{movie.downloads} downloads</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Movies */}
      <section className="py-8 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Trending Movies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredMovies.map(movie => (
              <Card key={movie.id} className="bg-gray-700 border-gray-600 overflow-hidden">
                <div className="relative">
                  <img 
                    src={movie.poster} 
                    alt={movie.title} 
                    className="w-full h-[250px] object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-sm font-bold">
                    {movie.rating}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1">{movie.title}</h3>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{movie.year} • {movie.genre}</span>
                    <span>{movie.downloads} downloads</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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

export default Index;
