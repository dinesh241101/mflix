import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Database, Loader2, CheckCircle, Play, Download } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const SampleDataForm = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const createTestMovieData = async () => {
    setIsCreating(true);
    try {
      // Create sample genres first
      const genres = [
        { name: "Action", description: "High-energy movies", color: "#ef4444" },
        { name: "Comedy", description: "Funny content", color: "#f59e0b" },
        { name: "Drama", description: "Emotional stories", color: "#3b82f6" },
        { name: "Sci-Fi", description: "Science fiction", color: "#06b6d4" },
        { name: "Thriller", description: "Suspenseful content", color: "#dc2626" }
      ];

      await supabase.from('genres').upsert(genres, { onConflict: 'name' });

      // Create sample movies with all necessary data for testing
      const testMovies = [
        {
          title: "Avengers: Endgame",
          content_type: "movie",
          genre: ["Action", "Sci-Fi"],
          year: 2019,
          imdb_rating: 8.4,
          poster_url: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop",
          storyline: "The Avengers assemble once more to reverse the damage caused by Thanos.",
          director: "Anthony Russo, Joe Russo",
          production_house: "Marvel Studios",
          quality: "4K BluRay",
          country: "USA",
          featured: true,
          is_visible: true,
          downloads: 15420,
          screenshots: [
            "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&h=450&fit=crop",
            "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=450&fit=crop"
          ],
          seo_tags: ["marvel", "avengers", "superhero", "action", "thanos"]
        },
        {
          title: "The Dark Knight",
          content_type: "movie",
          genre: ["Action", "Drama", "Thriller"],
          year: 2008,
          imdb_rating: 9.0,
          poster_url: "https://images.unsplash.com/photo-1489599856247-ce2ed3d2e0b1?w=400&h=600&fit=crop",
          storyline: "Batman faces the Joker, a criminal mastermind who plunges Gotham into anarchy.",
          director: "Christopher Nolan",
          production_house: "Warner Bros",
          quality: "4K BluRay", 
          country: "USA",
          featured: true,
          is_visible: true,
          downloads: 28340,
          screenshots: [
            "https://images.unsplash.com/photo-1489599856247-ce2ed3d2e0b1?w=800&h=450&fit=crop"
          ],
          seo_tags: ["batman", "joker", "dark knight", "christopher nolan", "dc"]
        },
        {
          title: "Inception",
          content_type: "movie",
          genre: ["Sci-Fi", "Thriller"],
          year: 2010,
          imdb_rating: 8.8,
          poster_url: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
          storyline: "A thief who enters people's dreams to steal secrets gets the chance to have his crime record erased.",
          director: "Christopher Nolan",
          production_house: "Warner Bros",
          quality: "4K BluRay",
          country: "USA", 
          featured: false,
          is_visible: true,
          downloads: 19850,
          screenshots: [
            "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=450&fit=crop"
          ],
          seo_tags: ["inception", "dreams", "leonardo dicaprio", "nolan", "thriller"]
        },
        {
          title: "Parasite",
          content_type: "movie",
          genre: ["Drama", "Thriller"],
          year: 2019,
          imdb_rating: 8.6,
          poster_url: "https://images.unsplash.com/photo-1594736797933-d0edd6a8b3b8?w=400&h=600&fit=crop",
          storyline: "A poor family schemes to become employed by a wealthy family by infiltrating their household.",
          director: "Bong Joon-ho",
          production_house: "CJ Entertainment",
          quality: "1080p BluRay",
          country: "South Korea",
          featured: true,
          is_visible: true,
          downloads: 12430,
          screenshots: [
            "https://images.unsplash.com/photo-1594736797933-d0edd6a8b3b8?w=800&h=450&fit=crop"
          ],
          seo_tags: ["parasite", "korean", "oscar", "bong joon-ho", "drama"]
        },
        {
          title: "Stranger Things",
          content_type: "series",
          genre: ["Sci-Fi", "Drama", "Thriller"],
          year: 2016,
          imdb_rating: 8.7,
          poster_url: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=600&fit=crop",
          storyline: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments.",
          director: "The Duffer Brothers",
          production_house: "Netflix",
          quality: "4K UHD",
          country: "USA",
          featured: true,
          is_visible: true,
          downloads: 35670,
          screenshots: [
            "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&h=450&fit=crop"
          ],
          seo_tags: ["stranger things", "netflix", "sci-fi", "upside down", "eleven"]
        },
        {
          title: "Attack on Titan",
          content_type: "anime",
          genre: ["Action", "Drama"],
          year: 2013,
          imdb_rating: 9.0,
          poster_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
          storyline: "Humanity fights for survival against giant humanoid Titans.",
          director: "Tetsuro Araki",
          production_house: "Wit Studio",
          quality: "1080p",
          country: "Japan",
          featured: true,
          is_visible: true,
          downloads: 24890,
          screenshots: [
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=450&fit=crop"
          ],
          seo_tags: ["attack on titan", "anime", "titans", "eren", "manga"]
        }
      ];

      // Insert movies and get their IDs
      const { data: insertedMovies, error: moviesError } = await supabase
        .from('movies')
        .insert(testMovies)
        .select('movie_id, title');

      if (moviesError) throw moviesError;

      // Create download links for each movie
      for (const movie of insertedMovies || []) {
        const downloadLinks = [
          {
            movie_id: movie.movie_id,
            quality: "4K BluRay",
            file_size: "8.5 GB",
            download_url: `https://example.com/download/${movie.title.replace(/\s+/g, '_')}_4K.mkv`,
            resolution: "3840x2160"
          },
          {
            movie_id: movie.movie_id,
            quality: "1080p BluRay", 
            file_size: "4.2 GB",
            download_url: `https://example.com/download/${movie.title.replace(/\s+/g, '_')}_1080p.mkv`,
            resolution: "1920x1080"
          },
          {
            movie_id: movie.movie_id,
            quality: "720p BluRay",
            file_size: "2.1 GB", 
            download_url: `https://example.com/download/${movie.title.replace(/\s+/g, '_')}_720p.mkv`,
            resolution: "1280x720"
          }
        ];

        await supabase.from('download_links').insert(downloadLinks);

        // Add trailer for each movie
        const trailer = {
          movie_id: movie.movie_id,
          clip_type: "trailer",
          clip_title: `${movie.title} - Official Trailer`,
          video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          thumbnail_url: "https://images.unsplash.com/photo-1489599856247-ce2ed3d2e0b1?w=400&h=225&fit=crop"
        };

        await supabase.from('media_clips').insert(trailer);
      }

      setIsCompleted(true);
      toast({
        title: "Success!",
        description: `Created ${testMovies.length} sample movies with download links and trailers. Refresh the page to see them!`,
      });

    } catch (error: any) {
      console.error('Error creating test data:', error);
      toast({
        title: "Error",
        description: "Failed to create test data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="fixed bottom-4 right-4 z-50">
          <Database className="mr-2 h-4 w-4" />
          Add Test Movies
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Create Test Movie Data
          </DialogTitle>
        </DialogHeader>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-4">
              Create sample movies to test the homepage and download functionality.
            </p>
            
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-medium mb-2">This will create:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>6 Sample movies (including series & anime)</li>
                  <li>Multiple download links per movie</li>
                  <li>Trailers and screenshots</li>
                  <li>Featured movies for homepage slider</li>
                  <li>Sample genres and ratings</li>
                </ul>
              </div>
              
              <Button 
                onClick={createTestMovieData}
                disabled={isCreating || isCompleted}
                className={`w-full ${isCompleted ? 'bg-green-600 hover:bg-green-700' : ''}`}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Test Data...
                  </>
                ) : isCompleted ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Test Data Created!
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Create Test Movies
                  </>
                )}
              </Button>

              {isCompleted && (
                <p className="text-xs text-green-600 text-center">
                  Refresh the page to see your test movies!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default SampleDataForm;