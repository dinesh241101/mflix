
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Download, Upload, FileSpreadsheet, CheckCircle, XCircle } from "lucide-react";

interface UploadResult {
  row: number;
  status: 'success' | 'error';
  message: string;
  data?: any;
}

const BulkUploadTab = () => {
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<UploadResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadSampleSheet = () => {
    const headers = [
      'title',
      'year',
      'content_type',
      'genre',
      'quality',
      'country',
      'director',
      'production_house',
      'imdb_rating',
      'storyline',
      'seo_tags',
      'poster_url',
      'featured',
      'trailer_url',
      'download_links',
      'screenshots'
    ];

    const sampleData = [
      [
        'Sample Movie',
        '2023',
        'movie',
        'Action,Adventure',
        '1080p',
        'USA',
        'John Director',
        'Studio Productions',
        '8.5',
        'An amazing story about...',
        'action,adventure,sample',
        'https://example.com/poster.jpg',
        'false',
        'https://youtube.com/watch?v=sample',
        'Quality: 720p, Size: 1.2GB, URL: https://drive.google.com/sample1\nQuality: 1080p, Size: 2.5GB, URL: https://drive.google.com/sample2',
        'https://example.com/screenshot1.jpg,https://example.com/screenshot2.jpg'
      ]
    ];

    const csvContent = [headers, ...sampleData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mflix_bulk_upload_sample.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Sample sheet downloaded successfully"
    });
  };

  const downloadResultSheet = () => {
    if (results.length === 0) {
      toast({
        title: "Error",
        description: "No results to download",
        variant: "destructive"
      });
      return;
    }

    const headers = ['Row', 'Status', 'Message', 'Title'];
    const csvContent = [headers, ...results.map(result => [
      result.row.toString(),
      result.status,
      result.message,
      result.data?.title || 'N/A'
    ])]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mflix_upload_results_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Results sheet downloaded successfully"
    });
  };

  const parseCSV = (text: string): string[][] => {
    const lines = text.split('\n');
    const result: string[][] = [];
    
    for (const line of lines) {
      if (line.trim()) {
        const row: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            row.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        row.push(current.trim());
        result.push(row);
      }
    }
    
    return result;
  };

  const processMovieData = (rowData: string[], headers: string[]) => {
    const movieData: any = {};
    
    headers.forEach((header, index) => {
      const value = rowData[index]?.replace(/^"|"$/g, '') || '';
      
      switch (header.toLowerCase()) {
        case 'title':
          movieData.title = value;
          break;
        case 'year':
          movieData.year = value ? parseInt(value) : null;
          break;
        case 'content_type':
          movieData.content_type = value || 'movie';
          break;
        case 'genre':
          movieData.genre = value ? value.split(',').map(g => g.trim()) : [];
          break;
        case 'quality':
          movieData.quality = value || '1080p';
          break;
        case 'country':
          movieData.country = value;
          break;
        case 'director':
          movieData.director = value;
          break;
        case 'production_house':
          movieData.production_house = value;
          break;
        case 'imdb_rating':
          movieData.imdb_rating = value ? parseFloat(value) : null;
          break;
        case 'storyline':
          movieData.storyline = value;
          break;
        case 'seo_tags':
          movieData.seo_tags = value ? value.split(',').map(t => t.trim()) : [];
          break;
        case 'poster_url':
          movieData.poster_url = value;
          break;
        case 'featured':
          movieData.featured = value.toLowerCase() === 'true';
          break;
        case 'trailer_url':
          movieData.trailer_url = value;
          break;
        case 'screenshots':
          movieData.screenshots = value ? value.split(',').map(s => s.trim()) : [];
          break;
        case 'download_links':
          movieData.download_links = value;
          break;
      }
    });

    movieData.is_visible = true;
    movieData.downloads = 0;
    
    return movieData;
  };

  const uploadMovieWithLinks = async (movieData: any, downloadLinksText: string) => {
    // Insert movie
    const { data: movie, error: movieError } = await supabase
      .from('movies')
      .insert(movieData)
      .select('movie_id')
      .single();

    if (movieError) throw movieError;

    // Process download links
    if (downloadLinksText && movie) {
      const links = downloadLinksText.split('\n').filter(link => link.trim());
      
      for (const link of links) {
        const match = link.match(/Quality:\s*(.*),\s*Size:\s*(.*),\s*URL:\s*(.*)/i);
        
        if (match && match.length >= 4) {
          const [_, quality, size, url] = match;
          
          const { error: linkError } = await supabase
            .from('download_links')
            .insert({
              movie_id: movie.movie_id,
              quality: quality.trim(),
              file_size: size.trim(),
              download_url: url.trim()
            });
          
          if (linkError) {
            console.warn('Failed to add download link:', linkError);
          }
        }
      }
    }

    return movie;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Error",
        description: "Please upload a CSV file",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setResults([]);

    try {
      const text = await file.text();
      const rows = parseCSV(text);
      
      if (rows.length < 2) {
        throw new Error('CSV file must contain at least a header row and one data row');
      }

      const headers = rows[0].map(h => h.replace(/^"|"$/g, '').toLowerCase());
      const dataRows = rows.slice(1);
      
      const uploadResults: UploadResult[] = [];
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < dataRows.length; i++) {
        const rowIndex = i + 2; // +2 because of header and 0-based index
        
        try {
          const movieData = processMovieData(dataRows[i], headers);
          
          if (!movieData.title) {
            throw new Error('Title is required');
          }

          const downloadLinksText = movieData.download_links;
          delete movieData.download_links;

          const movie = await uploadMovieWithLinks(movieData, downloadLinksText);
          
          uploadResults.push({
            row: rowIndex,
            status: 'success',
            message: 'Successfully uploaded',
            data: { title: movieData.title }
          });
          
          successCount++;
        } catch (error: any) {
          uploadResults.push({
            row: rowIndex,
            status: 'error',
            message: error.message || 'Unknown error',
            data: { title: dataRows[i][0]?.replace(/^"|"$/g, '') || 'Unknown' }
          });
          
          errorCount++;
        }
      }

      setResults(uploadResults);

      // Save bulk upload record
      await supabase
        .from('bulk_uploads')
        .insert({
          filename: file.name,
          total_rows: dataRows.length,
          successful_rows: successCount,
          failed_rows: errorCount,
          status: 'completed',
          completed_at: new Date().toISOString()
        });

      toast({
        title: "Upload Complete",
        description: `Processed ${dataRows.length} rows. ${successCount} successful, ${errorCount} failed.`,
        variant: successCount > 0 ? "default" : "destructive"
      });

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to process CSV file",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const successfulUploads = results.filter(r => r.status === 'success').length;
  const failedUploads = results.filter(r => r.status === 'error').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Bulk Upload</h2>
      </div>

      {/* Instructions and Sample Download */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Upload Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-gray-300 space-y-2">
            <p>1. Download the sample CSV file to see the required format</p>
            <p>2. Fill in your movie data following the sample format</p>
            <p>3. Upload your completed CSV file</p>
            <p>4. Review the results and download the status report</p>
          </div>
          
          <Button
            onClick={downloadSampleSheet}
            className="bg-green-600 hover:bg-green-700"
          >
            <Download size={16} className="mr-2" />
            Download Sample Sheet
          </Button>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Upload CSV File</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
            <FileSpreadsheet size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-300 mb-4">
              Choose a CSV file to upload movie data
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Upload size={16} className="mr-2" />
              {uploading ? 'Uploading...' : 'Choose CSV File'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Results */}
      {results.length > 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex justify-between items-center">
              Upload Results
              <Button
                onClick={downloadResultSheet}
                variant="outline"
                size="sm"
              >
                <Download size={14} className="mr-2" />
                Download Results
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-900/20 border border-green-600 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-400" size={20} />
                  <span className="text-green-400 font-medium">Successful</span>
                </div>
                <p className="text-2xl font-bold text-green-400 mt-2">{successfulUploads}</p>
              </div>
              
              <div className="bg-red-900/20 border border-red-600 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <XCircle className="text-red-400" size={20} />
                  <span className="text-red-400 font-medium">Failed</span>
                </div>
                <p className="text-2xl font-bold text-red-400 mt-2">{failedUploads}</p>
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {results.map((result, index) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  result.status === 'success' 
                    ? 'bg-green-900/10 border-green-600' 
                    : 'bg-red-900/10 border-red-600'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">
                      Row {result.row}: {result.data?.title}
                    </span>
                    <span className={`text-sm ${
                      result.status === 'success' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {result.status.toUpperCase()}
                    </span>
                  </div>
                  {result.status === 'error' && (
                    <p className="text-red-300 text-sm mt-1">{result.message}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BulkUploadTab;
