
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import AdBanner from "./ads/AdBanner";

interface MovieProps {
    movies: any[];
    title?: string;
    showFilters?: boolean;
    bgClass?: string;
}

const MovieGrid = ({ movies, title = "Movies", showFilters = false, bgClass }: MovieProps) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const containerClass = bgClass ? `py-6 ${bgClass}` : "py-6";

    return (
        <div className={containerClass}>
            <h2 className="text-2xl font-bold mb-6">{title}</h2>

            {movies.length === 0 ? (
                <div className="bg-gray-800 rounded-lg p-12 text-center">
                    <p className="text-gray-400 text-lg">No movies found.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Enhanced grid with ads after every 3 items */}
                    {Array.from({ length: Math.ceil(movies.length / 3) }, (_, groupIndex) => (
                        <div key={groupIndex}>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
                                {movies
                                    .slice(groupIndex * 3, (groupIndex + 1) * 3)
                                    .map((movie, movieIndex) => (
                                        <Link
                                            key={movie.movie_id || movie.id || movieIndex}
                                            to={`/movie/${movie.movie_id || movie.id}`}
                                            className="group"
                                        >
                                            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
                                                {/* Movie poster */}
                                                <div className="relative aspect-[2/3]">
                                                    <img
                                                        src={movie.poster_url || 'https://via.placeholder.com/300x450?text=No+Image'}
                                                        alt={movie.title}
                                                        className="w-full h-full object-cover"
                                                        loading="lazy"
                                                    />

                                                    {/* Quality badge */}
                                                    <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                                        {movie.quality || 'HD'}
                                                    </span>

                                                    {/* Rating */}
                                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                                                        <div className="flex items-center">
                                                            <Star size={14} className="text-yellow-500 mr-1"/>
                                                            <span className="text-white text-sm">
                                                                {movie.imdb_rating || '?'}/10
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Hover overlay */}
                                                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                        <div className="text-center p-4">
                                                            <span className="inline-block bg-blue-600 text-white text-sm px-2 py-1 rounded mb-2">
                                                                View Details
                                                            </span>
                                                            <p className="text-gray-200 text-sm hidden sm:block">
                                                                {movie.year ? `${movie.year} | ` : ''}{(movie.genre && movie.genre[0]) || ''}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Movie info */}
                                                <div className="p-3">
                                                    <h3 className="text-white text-sm sm:text-base font-semibold line-clamp-2 leading-tight">
                                                        {movie.title}
                                                    </h3>
                                                    <p className="text-gray-400 text-xs sm:text-sm mt-1">
                                                        {movie.year || ''} {movie.year && movie.content_type ? '•' : ''} {movie.content_type === 'movie' ? 'Movie' : movie.content_type === 'series' ? 'Series' : movie.content_type}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                            </div>
                            
                            {/* Ad after every 3 movies group, except the last one */}
                            {groupIndex < Math.ceil(movies.length / 3) - 1 && (
                                <div className="mt-6">
                                    <AdBanner 
                                        position={`${title.toLowerCase().replace(/\s+/g, '_')}_after_${groupIndex + 1}`} 
                                        className="w-full h-24"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MovieGrid;
