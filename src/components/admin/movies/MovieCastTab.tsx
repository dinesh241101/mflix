
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Trash2 } from "lucide-react";

interface MovieCastTabProps {
  castForm: {
    name: string;
    role: string;
  };
  setCastForm: (form: any) => void;
  movieCast: any[];
  handleAddCastMember: (e: React.FormEvent) => void;
  handleDeleteCastMember: (id: string) => void;
  castSearchQuery: string;
  handleCastSearch: (query: string) => void;
  castSearchResults: any[];
  selectCastFromSearch: (result: any) => void;
}

const MovieCastTab = ({
  castForm,
  setCastForm,
  movieCast,
  handleAddCastMember,
  handleDeleteCastMember,
  castSearchQuery,
  handleCastSearch,
  castSearchResults,
  selectCastFromSearch
}: MovieCastTabProps) => {
  return (
    <div>
      {/* Cast Search */}
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Search Cast Members</h3>
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          <Input 
            value={castSearchQuery}
            onChange={(e) => handleCastSearch(e.target.value)}
            className="pl-10 bg-gray-700 border-gray-600"
            placeholder="Search for actors/actresses..."
          />
        </div>
        
        {castSearchResults.length > 0 && (
          <div className="mt-2 bg-gray-700 rounded-lg p-2 border border-gray-600">
            {castSearchResults.map((result: any, index) => (
              <div 
                key={index}
                className="py-2 px-3 hover:bg-gray-600 rounded cursor-pointer flex justify-between"
                onClick={() => selectCastFromSearch(result)}
              >
                <span>{result.name}</span>
                <span className="text-gray-400">{result.role}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Cast Form */}
      <form onSubmit={handleAddCastMember} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Cast Name</label>
            <Input 
              value={castForm.name}
              onChange={(e) => setCastForm({ ...castForm, name: e.target.value })}
              className="bg-gray-700 border-gray-600"
              placeholder="Actor/Actress Name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
            <Input 
              value={castForm.role}
              onChange={(e) => setCastForm({ ...castForm, role: e.target.value })}
              className="bg-gray-700 border-gray-600"
              placeholder="Character Name"
              required
            />
          </div>
        </div>
        <Button type="submit" className="bg-green-600 hover:bg-green-700">
          <UserPlus size={16} className="mr-2" />
          Add Cast Member
        </Button>
      </form>
      
      {/* Cast List */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Current Cast</h3>
        {movieCast.length === 0 ? (
          <p className="text-gray-400">No cast members added yet.</p>
        ) : (
          <div className="bg-gray-700 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800">
                  <th className="text-left p-3">Actor/Actress</th>
                  <th className="text-left p-3">Role</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {movieCast.map(member => (
                  <tr key={member.id} className="border-t border-gray-600">
                    <td className="p-3">{member.name}</td>
                    <td className="p-3">{member.role}</td>
                    <td className="p-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500"
                        onClick={() => handleDeleteCastMember(member.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCastTab;
