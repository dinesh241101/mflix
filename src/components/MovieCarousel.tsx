
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Film } from "lucide-react";

export interface MovieProps {
  movies: any[];
  title: string;
  bgClass?: string; // Make bgClass optional
}

const MovieCarousel = ({ movies, title, bgClass = "" }: MovieProps) => {
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <section className={`py-12 ${bgClass}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <Carousel 
          opts={{
            align: "start",
            loop: true,
            duration: 10,
          }}
          className="w-full"
        >
          <CarouselContent>
            {movies.map((movie, index) => (
              <CarouselItem key={movie.id || index} className="basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <Link to={`/movie/${movie.id}`}>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <div className="h-64 bg-gray-800 rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 cursor-pointer">
                        {movie.poster_url ? (
                          <img 
                            src={movie.poster_url} 
                            alt={movie.title} 
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Film className="text-gray-500" size={48} />
                          </div>
                        )}
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent side="top" className="w-64 bg-gray-800 border-gray-700">
                      <div className="space-y-2">
                        <h3 className="font-bold">{movie.title}</h3>
                        <div className="flex items-center text-xs gap-2">
                          {movie.year && <span className="bg-blue-600 px-2 py-1 rounded">{movie.year}</span>}
                          {movie.genre && movie.genre[0] && (
                            <span className="bg-gray-700 px-2 py-1 rounded">{movie.genre[0]}</span>
                          )}
                          {movie.imdb_rating && (
                            <span className="bg-yellow-500 text-black px-2 py-1 rounded font-bold">
                              IMDb {movie.imdb_rating}
                            </span>
                          )}
                        </div>
                        {movie.downloads > 0 && (
                          <p className="text-sm text-gray-300">{movie.downloads.toLocaleString()} downloads</p>
                        )}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
};

export default MovieCarousel;
