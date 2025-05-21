
import {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Upload} from "lucide-react";
import {Switch} from "@/components/ui/switch";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import ImageUploader from "./ImageUploader";
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Trash } from "lucide-react";

interface MovieFormProps {
    onSubmit: (e: React.FormEvent) => void,
    movieForm: any,
    setMovieForm: (form: any) => void,
    isEditing?: boolean
}

const MovieForm = ({onSubmit, movieForm, setMovieForm, isEditing}: MovieFormProps) => {
    const [isAddingLink, setIsAddingLink] = useState(false);
    const [currentLink, setCurrentLink] = useState({
        quality: "1080p",
        fileSize: "",
        url: "",
        sources: [{ name: "", url: "" }]
    });

    // Handle adding a new download link
    const handleAddDownloadLink = () => {
        if (!currentLink.quality || !currentLink.fileSize) {
            return; // Don't add if missing required fields
        }

        const newLinks = movieForm.downloadLinks 
            ? [...movieForm.downloadLinks] 
            : [];
        
        newLinks.push({
            quality: currentLink.quality,
            fileSize: currentLink.fileSize,
            url: currentLink.url,
            sources: currentLink.sources.filter(source => source.name && source.url)
        });
        
        setMovieForm({...movieForm, downloadLinks: newLinks});
        
        // Reset current link
        setCurrentLink({
            quality: "1080p",
            fileSize: "",
            url: "",
            sources: [{ name: "", url: "" }]
        });
        
        setIsAddingLink(false);
    };

    // Handle removing a download link
    const handleRemoveDownloadLink = (index: number) => {
        const newLinks = [...movieForm.downloadLinks];
        newLinks.splice(index, 1);
        setMovieForm({...movieForm, downloadLinks: newLinks});
    };

    // Add a source field to the current link
    const handleAddSource = () => {
        setCurrentLink({
            ...currentLink,
            sources: [...currentLink.sources, { name: "", url: "" }]
        });
    };

    // Remove a source from the current link
    const handleRemoveSource = (index: number) => {
        const newSources = [...currentLink.sources];
        newSources.splice(index, 1);
        setCurrentLink({
            ...currentLink,
            sources: newSources
        });
    };

    // Update a source field
    const handleSourceChange = (index: number, field: 'name' | 'url', value: string) => {
        const newSources = [...currentLink.sources];
        newSources[index][field] = value;
        setCurrentLink({
            ...currentLink,
            sources: newSources
        });
    };

    return (
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                    <Input
                        value={movieForm.title}
                        onChange={(e) => setMovieForm({...movieForm, title: e.target.value})}
                        className="bg-gray-700 border-gray-600"
                        placeholder="Movie Title"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Content Type</label>
                        <Select
                            value={movieForm.contentType}
                            onValueChange={(value) => setMovieForm({...movieForm, contentType: value})}
                        >
                            <SelectTrigger className="bg-gray-700 border-gray-600">
                                <SelectValue placeholder="Select Type"/>
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600">
                                <SelectItem value="movie">Movie</SelectItem>
                                <SelectItem value="series">Series</SelectItem>
                                <SelectItem value="anime">Anime</SelectItem>
                                <SelectItem value="documentary">Documentary</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Year</label>
                        <Input
                            type="number"
                            value={movieForm.year}
                            onChange={(e) => setMovieForm({...movieForm, year: e.target.value})}
                            className="bg-gray-700 border-gray-600"
                            placeholder="Release Year"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Release Month</label>
                        <Select
                            value={movieForm.releaseMonth}
                            onValueChange={(value) => setMovieForm({...movieForm, releaseMonth: value})}
                        >
                            <SelectTrigger className="bg-gray-700 border-gray-600">
                                <SelectValue placeholder="Select Month"/>
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600">
                                <SelectItem value="01">January</SelectItem>
                                <SelectItem value="02">February</SelectItem>
                                <SelectItem value="03">March</SelectItem>
                                <SelectItem value="04">April</SelectItem>
                                <SelectItem value="05">May</SelectItem>
                                <SelectItem value="06">June</SelectItem>
                                <SelectItem value="07">July</SelectItem>
                                <SelectItem value="08">August</SelectItem>
                                <SelectItem value="09">September</SelectItem>
                                <SelectItem value="10">October</SelectItem>
                                <SelectItem value="11">November</SelectItem>
                                <SelectItem value="12">December</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Release Year</label>
                        <Input
                            type="number"
                            value={movieForm.releaseYear}
                            onChange={(e) => setMovieForm({...movieForm, releaseYear: e.target.value})}
                            className="bg-gray-700 border-gray-600"
                            placeholder="Release Year"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Genres (comma separated)</label>
                    <Input
                        value={movieForm.genre}
                        onChange={(e) => setMovieForm({...movieForm, genre: e.target.value})}
                        className="bg-gray-700 border-gray-600"
                        placeholder="Action, Adventure, Comedy"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Country</label>
                    <Input
                        value={movieForm.country}
                        onChange={(e) => setMovieForm({...movieForm, country: e.target.value})}
                        className="bg-gray-700 border-gray-600"
                        placeholder="Country of Origin"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Director</label>
                        <Input
                            value={movieForm.director}
                            onChange={(e) => setMovieForm({...movieForm, director: e.target.value})}
                            className="bg-gray-700 border-gray-600"
                            placeholder="Director Name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Production House</label>
                        <Input
                            value={movieForm.productionHouse}
                            onChange={(e) => setMovieForm({...movieForm, productionHouse: e.target.value})}
                            className="bg-gray-700 border-gray-600"
                            placeholder="Production Studio"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">IMDB Rating</label>
                        <Input
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            value={movieForm.imdbRating}
                            onChange={(e) => setMovieForm({...movieForm, imdbRating: e.target.value})}
                            className="bg-gray-700 border-gray-600"
                            placeholder="Rating out of 10"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Quality</label>
                        <Select
                            value={movieForm.quality}
                            onValueChange={(value) => setMovieForm({...movieForm, quality: value})}
                        >
                            <SelectTrigger className="bg-gray-700 border-gray-600">
                                <SelectValue placeholder="Select Quality"/>
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600">
                                <SelectItem value="1080p">1080p Full HD</SelectItem>
                                <SelectItem value="720p">720p HD</SelectItem>
                                <SelectItem value="4K">4K Ultra HD</SelectItem>
                                <SelectItem value="480p">480p SD</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <ImageUploader 
                  currentImageUrl={movieForm.posterUrl}
                  onImageUrlChange={(url) => setMovieForm({...movieForm, posterUrl: url})}
                  label="Poster Image"
                />

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">YouTube Trailer URL</label>
                    <Input
                        value={movieForm.youtubeTrailer}
                        onChange={(e) => setMovieForm({...movieForm, youtubeTrailer: e.target.value})}
                        className="bg-gray-700 border-gray-600"
                        placeholder="https://www.youtube.com/watch?v=..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Storyline</label>
                    <Textarea
                        value={movieForm.storyline}
                        onChange={(e) => setMovieForm({...movieForm, storyline: e.target.value})}
                        className="bg-gray-700 border-gray-600 min-h-[100px]"
                        placeholder="Movie plot and storyline..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">SEO Tags (comma separated)</label>
                    <Input
                        value={movieForm.seoTags}
                        onChange={(e) => setMovieForm({...movieForm, seoTags: e.target.value})}
                        className="bg-gray-700 border-gray-600"
                        placeholder="action movie, hollywood, thriller, download"
                    />
                </div>

                {/* Enhanced Download Links Management */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-400">Download Links</label>
                        <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setIsAddingLink(true)}
                            className="text-xs"
                        >
                            Add Link
                        </Button>
                    </div>
                    
                    {/* Display existing links */}
                    {movieForm.downloadLinks && movieForm.downloadLinks.length > 0 && (
                        <div className="space-y-3 mb-4">
                            {movieForm.downloadLinks.map((link: any, index: number) => (
                                <Card key={index} className="bg-gray-700 border-gray-600">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="flex items-center">
                                                    <span className="font-bold mr-2">Quality:</span>
                                                    <span className="bg-blue-600 px-2 py-0.5 rounded text-xs">
                                                        {link.quality}
                                                    </span>
                                                </div>
                                                <div className="flex items-center mt-1">
                                                    <span className="font-bold mr-2">Size:</span>
                                                    <span className="text-sm">{link.fileSize}</span>
                                                </div>
                                            </div>
                                            <Button 
                                                type="button" 
                                                variant="ghost" 
                                                size="sm" 
                                                onClick={() => handleRemoveDownloadLink(index)}
                                                className="text-red-500 hover:text-red-400 p-0 h-auto"
                                            >
                                                <Trash size={16} />
                                            </Button>
                                        </div>
                                        
                                        {link.sources && link.sources.length > 0 && (
                                            <div className="mt-2">
                                                <div className="text-xs font-medium text-gray-400 mb-1">Download Sources:</div>
                                                <div className="space-y-1">
                                                    {link.sources.map((source: any, sIndex: number) => (
                                                        <div key={sIndex} className="flex items-center text-xs">
                                                            <span className="font-medium">{source.name}:</span>
                                                            <span className="ml-1 text-blue-400 truncate">{source.url}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                    
                    {/* Add new link form */}
                    {isAddingLink && (
                        <Card className="bg-gray-700 border-gray-600 mb-4">
                            <CardContent className="p-4">
                                <h4 className="font-bold mb-3">Add Download Link</h4>
                                
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1">Quality</label>
                                        <Select
                                            value={currentLink.quality}
                                            onValueChange={(value) => setCurrentLink({...currentLink, quality: value})}
                                        >
                                            <SelectTrigger className="bg-gray-600 border-gray-500 h-8 text-sm">
                                                <SelectValue placeholder="Select Quality"/>
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-700 border-gray-600">
                                                <SelectItem value="1080p">1080p Full HD</SelectItem>
                                                <SelectItem value="720p">720p HD</SelectItem>
                                                <SelectItem value="4K">4K Ultra HD</SelectItem>
                                                <SelectItem value="480p">480p SD</SelectItem>
                                                <SelectItem value="360p">360p</SelectItem>
                                                <SelectItem value="240p">240p</SelectItem>
                                                <SelectItem value="2160p">2160p (4K)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1">File Size</label>
                                        <Input
                                            value={currentLink.fileSize}
                                            onChange={(e) => setCurrentLink({...currentLink, fileSize: e.target.value})}
                                            className="bg-gray-600 border-gray-500 h-8 text-sm"
                                            placeholder="e.g. 2.1 GB"
                                        />
                                    </div>
                                </div>
                                
                                <div className="mb-3">
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Default URL (optional)</label>
                                    <Input
                                        value={currentLink.url}
                                        onChange={(e) => setCurrentLink({...currentLink, url: e.target.value})}
                                        className="bg-gray-600 border-gray-500 h-8 text-sm"
                                        placeholder="https://example.com/download"
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-xs font-medium text-gray-400">Download Sources</label>
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={handleAddSource}
                                            className="text-xs h-6 px-2"
                                        >
                                            Add Source
                                        </Button>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        {currentLink.sources.map((source, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <Input
                                                    value={source.name}
                                                    onChange={(e) => handleSourceChange(index, 'name', e.target.value)}
                                                    className="bg-gray-600 border-gray-500 h-8 text-sm"
                                                    placeholder="Source name (e.g. Google Drive)"
                                                />
                                                <Input
                                                    value={source.url}
                                                    onChange={(e) => handleSourceChange(index, 'url', e.target.value)}
                                                    className="bg-gray-600 border-gray-500 h-8 text-sm"
                                                    placeholder="URL"
                                                />
                                                <Button 
                                                    type="button" 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    onClick={() => handleRemoveSource(index)}
                                                    className="text-red-500 hover:text-red-400 p-0 h-auto"
                                                    disabled={currentLink.sources.length <= 1}
                                                >
                                                    <Trash size={14} />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="flex justify-end gap-2 mt-4">
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => setIsAddingLink(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        type="button" 
                                        size="sm" 
                                        onClick={handleAddDownloadLink}
                                    >
                                        Add Link
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="featured"
                            checked={movieForm.featured}
                            onCheckedChange={(checked) => setMovieForm({...movieForm, featured: checked})}
                        />
                        <label htmlFor="featured">Featured Content</label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="latest"
                            checked={movieForm.isLatest}
                            onCheckedChange={(checked) => setMovieForm({...movieForm, isLatest: checked})}
                        />
                        <label htmlFor="latest">Latest Upload (Show in Latest section)</label>
                    </div>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    <Upload className="mr-2" size={16}/>
                    {isEditing ? "Update Movie" : "Add Movie"}
                </Button>
            </div>
        </form>
    );
};

export default MovieForm;
