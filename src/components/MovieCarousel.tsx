
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

interface Movie {
  id: string | number;
  title: string;
  poster_url?: string;
  year?: number;
  imdb_rating?: number;
  genre?: string[];
  downloads?: number;
}

interface MovieCarouselProps {
  movies: Movie[];
  title: string;
  bgClass?: string;
}

const MovieCarousel = ({ movies, title, bgClass = "" }: MovieCarouselProps) => {
  return (
    <section className={`py-8 ${bgClass}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <Carousel className="w-full" opts={{ align: "start" }}>
          <CarouselContent>
            {movies.map((movie, index) => (
              <CarouselItem key={movie.id || index} className="md:basis-1/3 lg:basis-1/4">
                <Link to={`/movie/${movie.id}`} className="group block">
                  <Card className="bg-gray-700 border-gray-600 overflow-hidden transform transition-all duration-300 hover:scale-105">
                    <div className="relative">
                      <img 
                        src={movie.poster_url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"} 
                        alt={movie.title} 
                        className="w-full h-[200px] object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-sm font-bold">
                        {movie.imdb_rating || "N/A"}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-1">{movie.title}</h3>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>{movie.year} • {movie.genre && movie.genre[0]}</span>
                        <span>{movie.downloads || 0} downloads</span>
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
  );
};

export default MovieCarousel;
