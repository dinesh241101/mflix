import {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Upload} from "lucide-react";
import {Switch} from "@/components/ui/switch";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import * as React from "react";

interface MovieFormProps {
    onSubmit: (e: React.FormEvent) => void,
    movieForm: any,
    setMovieForm: (form: any) => void,
    isEditing?: boolean
}

const MovieForm = ({onSubmit, movieForm, setMovieForm, isEditing}: MovieFormProps) => {
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
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Poster URL</label>
                    <Input
                        value={movieForm.posterUrl}
                        onChange={(e) => setMovieForm({...movieForm, posterUrl: e.target.value})}
                        className="bg-gray-700 border-gray-600"
                        placeholder="https://example.com/poster.jpg"
                    />
                </div>

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

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Download Links (one per
                        line)</label>
                    <Textarea
                        value={movieForm.downloadLinks}
                        onChange={(e) => setMovieForm({...movieForm, downloadLinks: e.target.value})}
                        className="bg-gray-700 border-gray-600 min-h-[100px]"
                        placeholder="Quality: 1080p, Size: 2.1GB, URL: https://example.com/download
Quality: 720p, Size: 1.3GB, URL: https://example.com/download-720"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <Switch
                        id="featured"
                        checked={movieForm.featured}
                        onCheckedChange={(checked) => setMovieForm({...movieForm, featured: checked})}
                    />
                    <label htmlFor="featured">Featured Content</label>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    <Upload className="mr-2" size={16}/>
                    Add Movie
                </Button>
            </div>
        </form>
    );
};

export default MovieForm;
