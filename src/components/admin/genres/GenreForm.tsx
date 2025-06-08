
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

interface GenreFormProps {
  genreForm: {
    name: string;
    description: string;
    color: string;
  };
  setGenreForm: (form: any) => void;
  handleAddGenre: (e: React.FormEvent) => void;
}

const GenreForm = ({ genreForm, setGenreForm, handleAddGenre }: GenreFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Genre</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddGenre} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Genre Name</label>
            <Input
              value={genreForm.name}
              onChange={(e) => setGenreForm({ ...genreForm, name: e.target.value })}
              className="bg-gray-700 border-gray-600"
              placeholder="Action, Comedy, Drama..."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
            <Textarea
              value={genreForm.description}
              onChange={(e) => setGenreForm({ ...genreForm, description: e.target.value })}
              className="bg-gray-700 border-gray-600"
              placeholder="Brief description of the genre..."
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Color (for UI)</label>
            <Input
              type="color"
              value={genreForm.color}
              onChange={(e) => setGenreForm({ ...genreForm, color: e.target.value })}
              className="bg-gray-700 border-gray-600 h-10 w-20"
            />
          </div>
          
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2" size={16} />
            Add Genre
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GenreForm;
