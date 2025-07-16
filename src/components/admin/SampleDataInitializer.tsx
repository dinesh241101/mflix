
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface SampleDataInitializerProps {
  onDataCreated?: () => void;
}

const SampleDataInitializer = ({ onDataCreated }: SampleDataInitializerProps) => {
  const [isCreating, setIsCreating] = useState(false);

  const createSampleData = async () => {
    setIsCreating(true);
    try {
      // Sample genres
      const genres = [
        { name: 'Action', color: '#ef4444', description: 'High-energy movies with exciting sequences' },
        { name: 'Comedy', color: '#f59e0b', description: 'Funny and entertaining content' },
        { name: 'Drama', color: '#8b5cf6', description: 'Emotional and character-driven stories' },
        { name: 'Horror', color: '#1f2937', description: 'Scary and suspenseful content' },
        { name: 'Romance', color: '#ec4899', description: 'Love stories and romantic content' },
        { name: 'Sci-Fi', color: '#06b6d4', description: 'Science fiction and futuristic themes' }
      ];

      // Insert sample genres
      const { error: genresError } = await supabase
        .from('genres')
        .upsert(genres, { onConflict: 'name' });

      if (genresError) throw genresError;

      // Sample movies
      const movies = [
        {
          title: 'The Matrix',
          content_type: 'movie',
          genre: ['Action', 'Sci-Fi'],
          year: 1999,
          imdb_rating: 8.7,
          poster_url: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400',
          storyline: 'A computer programmer discovers reality is actually a simulation.',
          director: 'The Wachowskis',
          country: 'USA',
          featured: true,
          is_visible: true
        },
        {
          title: 'Inception',
          content_type: 'movie',
          genre: ['Action', 'Sci-Fi'],
          year: 2010,
          imdb_rating: 8.8,
          poster_url: 'https://images.unsplash.com/photo-1489599142344-0e5c9ce30c57?w=400',
          storyline: 'A thief enters people\'s dreams to steal secrets.',
          director: 'Christopher Nolan',
          country: 'USA',
          featured: true,
          is_visible: true
        },
        {
          title: 'Breaking Bad',
          content_type: 'series',
          genre: ['Drama'],
          year: 2008,
          imdb_rating: 9.5,
          poster_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400',
          storyline: 'A chemistry teacher turns to manufacturing drugs.',
          director: 'Vince Gilligan',
          country: 'USA',
          featured: false,
          is_visible: true
        },
        {
          title: 'Attack on Titan',
          content_type: 'anime',
          genre: ['Action', 'Drama'],
          year: 2013,
          imdb_rating: 9.0,
          poster_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
          storyline: 'Humanity fights against giant humanoid creatures.',
          director: 'Tetsuro Araki',
          country: 'Japan',
          featured: false,
          is_visible: true
        }
      ];

      // Insert sample movies
      const { error: moviesError } = await supabase
        .from('movies')
        .upsert(movies, { onConflict: 'title' });

      if (moviesError) throw moviesError;

      // Sample shorts
      const shorts = [
        {
          title: 'Fun Comedy Short',
          video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail_url: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400',
          duration: 120,
          is_visible: true
        },
        {
          title: 'Action Packed Short',
          video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail_url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400',
          duration: 90,
          is_visible: true
        }
      ];

      // Insert sample shorts
      const { error: shortsError } = await supabase
        .from('shorts')
        .upsert(shorts, { onConflict: 'title' });

      if (shortsError) throw shortsError;

      // Sample ads
      const ads = [
        {
          ad_name: 'Header Banner Ad',
          ad_type: 'banner',
          position: 'header',
          content_url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800',
          target_url: 'https://example.com',
          is_active: true
        },
        {
          ad_name: 'Footer Banner Ad',
          ad_type: 'banner',
          position: 'footer',
          content_url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
          target_url: 'https://example.com',
          is_active: true
        }
      ];

      // Insert sample ads
      const { error: adsError } = await supabase
        .from('ads')
        .upsert(ads, { onConflict: 'ad_name' });

      if (adsError) throw adsError;

      toast({
        title: "Success!",
        description: "Sample data has been created successfully.",
      });

      if (onDataCreated) {
        onDataCreated();
      }
    } catch (error: any) {
      console.error('Error creating sample data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create sample data.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Database className="h-5 w-5" />
          Sample Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400 mb-4">
          Create sample movies, series, anime, shorts, and ads to test the platform.
        </p>
        <Button 
          onClick={createSampleData}
          disabled={isCreating}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Sample Data...
            </>
          ) : (
            'Create Sample Data'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SampleDataInitializer;
