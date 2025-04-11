
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
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
                {/* Admin link removed from public navigation */}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <section className="py-4 bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search by movie title, director, production house, genre..." 
              className="w-full py-2 px-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-md">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Hero Banner with Auto-Sliding Carousel */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Carousel className="w-full" opts={{ loop: true }}>
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
              <CarouselItem className="basis-full">
                <div className="h-[400px] relative">
                  <img 
                    src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba" 
                    alt="Featured Banner 2" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex flex-col justify-end p-8">
                    <h2 className="text-3xl font-bold mb-2">Popular Series</h2>
                    <p className="text-lg">Binge-worthy shows ready to download</p>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem className="basis-full">
                <div className="h-[400px] relative">
                  <img 
                    src="https://images.unsplash.com/photo-1535016120720-40c646be5580" 
                    alt="Featured Banner 3" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex flex-col justify-end p-8">
                    <h2 className="text-3xl font-bold mb-2">Anime Collection</h2>
                    <p className="text-lg">Explore our extensive anime library</p>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
          </Carousel>
        </div>
      </section>

      {/* Latest Uploads */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Latest Uploads</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredMovies.map(movie => (
              <Link to={`/movie/${movie.id}`} key={movie.id} className="group">
                <Card className="bg-gray-800 border-gray-700 overflow-hidden transform transition-transform hover:scale-105 hover:shadow-xl">
                  <div className="relative">
                    <img 
                      src={movie.poster} 
                      alt={movie.title} 
                      className="w-full h-[250px] object-cover"
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
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{movie.year} • {movie.genre}</span>
                      <span>{movie.downloads} downloads</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Movies with Carousel */}
      <section className="py-8 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Trending Movies</h2>
          <Carousel className="w-full" opts={{ align: "start" }}>
            <CarouselContent>
              {featuredMovies.map(movie => (
                <CarouselItem key={movie.id} className="md:basis-1/3 lg:basis-1/4">
                  <Link to={`/movie/${movie.id}`} className="group block">
                    <Card className="bg-gray-700 border-gray-600 overflow-hidden transform transition-transform hover:scale-105">
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
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>{movie.year} • {movie.genre}</span>
                          <span>{movie.downloads} downloads</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2" />
          </Carousel>
        </div>
      </section>

      {/* Categorized Content Sections */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Web Series</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredMovies.map(movie => (
              <Link to={`/movie/${movie.id}`} key={movie.id} className="group">
                <Card className="bg-gray-800 border-gray-700 overflow-hidden transform transition-transform hover:scale-105">
                  <div className="relative">
                    <img 
                      src={movie.poster} 
                      alt={movie.title} 
                      className="w-full h-[250px] object-cover"
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
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{movie.year} • {movie.genre}</span>
                      <span>{movie.downloads} downloads</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Anime Section */}
      <section className="py-8 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Anime</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredMovies.map(movie => (
              <Link to={`/movie/${movie.id}`} key={movie.id} className="group">
                <Card className="bg-gray-700 border-gray-600 overflow-hidden transform transition-transform hover:scale-105">
                  <div className="relative">
                    <img 
                      src={movie.poster} 
                      alt={movie.title} 
                      className="w-full h-[250px] object-cover"
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
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{movie.year} • {movie.genre}</span>
                      <span>{movie.downloads} downloads</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
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
