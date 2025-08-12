
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Download, Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";

interface BulkUploadResult {
  total: number;
  successful: number;
  failed: number;
  errors: string[];
}

const BulkUploadTab = () => {
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState<BulkUploadResult | null>(null);
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
      'poster_url',
      'trailer_url',
      'download_url_480p',
      'download_url_720p',
      'download_url_1080p',
      'file_size_480p',
      'file_size_720p',
      'file_size_1080p'
    ];

    const sampleData = [
      [
        'Sample Movie Title',
        '2023',
        'movie',
        'Action,Adventure',
        '1080p',
        'USA',
        'John Director',
        'Sample Studios',
        '7.5',
        'A sample movie storyline for bulk upload demonstration.',
        'https://example.com/poster.jpg',
        'https://youtube.com/watch?v=sample',
        'https://drive.google.com/sample480p',
        'https://drive.google.com/sample720p',
        'https://drive.google.com/sample1080p',
        '800MB',
        '1.2GB',
        '2.5GB'
      ]
    ];

    const csvContent = [headers, ...sampleData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bulk_upload_sample.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Sample sheet downloaded successfully"
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast({
        title: "Error",
        description: "Please upload a CSV file",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setUploadResult(null);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('CSV file must contain headers and at least one data row');
      }

      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
      const dataLines = lines.slice(1);

      let successful = 0;
      let failed = 0;
      const errors: string[] = [];

      for (let i = 0; i < dataLines.length; i++) {
        const values = dataLines[i].split(',').map(v => v.replace(/"/g, '').trim());
        const rowData: any = {};

        headers.forEach((header, index) => {
          rowData[header] = values[index] || '';
        });

        try {
          // Validate required fields
          if (!rowData.title || !rowData.content_type) {
            throw new Error('Title and content_type are required');
          }

          // Insert movie data
          const movieData = {
            title: rowData.title,
            year: parseInt(rowData.year) || null,
            content_type: rowData.content_type,
            genre: rowData.genre ? rowData.genre.split(',').map((g: string) => g.trim()) : [],
            quality: rowData.quality || null,
            country: rowData.country || null,
            director: rowData.director || null,
            production_house: rowData.production_house || null,
            imdb_rating: parseFloat(rowData.imdb_rating) || null,
            storyline: rowData.storyline || null,
            poster_url: rowData.poster_url || null,
            trailer_url: rowData.trailer_url || null,
            is_visible: true,
            featured: false
          };

          const { data: movieResult, error: movieError } = await supabase
            .from('movies')
            .insert([movieData])
            .select('movie_id')
            .single();

          if (movieError) throw movieError;

          // Insert download links if provided
          const downloadLinks = [];
          if (rowData.download_url_480p) {
            downloadLinks.push({
              movie_id: movieResult.movie_id,
              quality: '480p',
              file_size: rowData.file_size_480p || 'Unknown',
              download_url: rowData.download_url_480p
            });
          }
          if (rowData.download_url_720p) {
            downloadLinks.push({
              movie_id: movieResult.movie_id,
              quality: '720p',
              file_size: rowData.file_size_720p || 'Unknown',
              download_url: rowData.download_url_720p
            });
          }
          if (rowData.download_url_1080p) {
            downloadLinks.push({
              movie_id: movieResult.movie_id,
              quality: '1080p',
              file_size: rowData.file_size_1080p || 'Unknown',
              download_url: rowData.download_url_1080p
            });
          }

          if (downloadLinks.length > 0) {
            const { error: linksError } = await supabase
              .from('download_links')
              .insert(downloadLinks);

            if (linksError) throw linksError;
          }

          successful++;
        } catch (error: any) {
          failed++;
          errors.push(`Row ${i + 2}: ${error.message}`);
        }
      }

      // Store upload result temporarily in ads table for tracking
      await supabase
        .from('ads')
        .insert([{
          ad_name: `Bulk Upload - ${file.name}`,
          ad_type: 'bulk_upload_log',
          description: JSON.stringify({
            filename: file.name,
            total_rows: dataLines.length,
            successful_rows: successful,
            failed_rows: failed,
            error_details: errors
          }),
          is_active: false
        }]);

      setUploadResult({
        total: dataLines.length,
        successful,
        failed,
        errors
      });

      toast({
        title: "Upload Complete",
        description: `${successful} movies uploaded successfully, ${failed} failed`
      });

    } catch (error: any) {
      console.error('Error processing file:', error);
      toast({
        title: "Error",
        description: `Failed to process file: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const downloadResultSheet = () => {
    if (!uploadResult) return;

    const headers = ['Row', 'Status', 'Error'];
    const resultData = [];

    for (let i = 0; i < uploadResult.total; i++) {
      const rowNum = i + 2; // Start from row 2 (accounting for header)
      const error = uploadResult.errors.find(e => e.startsWith(`Row ${rowNum}:`));
      
      resultData.push([
        rowNum.toString(),
        error ? 'FAILED' : 'SUCCESS',
        error ? error.replace(`Row ${rowNum}: `, '') : ''
      ]);
    }

    const csvContent = [headers, ...resultData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bulk_upload_results.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Bulk Upload</h2>
      </div>

      {/* Instructions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText size={20} />
            Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-2">
          <p>1. Download the sample CSV template below</p>
          <p>2. Fill in your movie data following the template format</p>
          <p>3. Upload the completed CSV file</p>
          <p>4. Review the results and download the verdict sheet</p>
          <p className="text-yellow-400 text-sm">
            ⚠️ Required fields: title, content_type. Genre should be comma-separated.
          </p>
        </CardContent>
      </Card>

      {/* Download Sample Sheet */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Step 1: Download Sample Sheet</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={downloadSampleSheet}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download size={16} className="mr-2" />
            Download Sample CSV
          </Button>
        </CardContent>
      </Card>

      {/* Upload CSV File */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Step 2: Upload CSV File</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              <Upload size={16} className="mr-2" />
              {loading ? 'Processing...' : 'Upload CSV File'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {uploadResult && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Upload Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <p className="text-gray-400 text-sm">Total Rows</p>
                <p className="text-white text-2xl font-bold">{uploadResult.total}</p>
              </div>
              <div className="bg-green-900 p-4 rounded-lg text-center">
                <CheckCircle className="mx-auto mb-2 text-green-400" size={24} />
                <p className="text-green-400 text-sm">Successful</p>
                <p className="text-white text-2xl font-bold">{uploadResult.successful}</p>
              </div>
              <div className="bg-red-900 p-4 rounded-lg text-center">
                <AlertCircle className="mx-auto mb-2 text-red-400" size={24} />
                <p className="text-red-400 text-sm">Failed</p>
                <p className="text-white text-2xl font-bold">{uploadResult.failed}</p>
              </div>
            </div>

            {uploadResult.failed > 0 && (
              <div className="bg-red-900/20 p-4 rounded-lg">
                <h4 className="text-red-400 font-medium mb-2">Errors ({uploadResult.errors.length})</h4>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {uploadResult.errors.slice(0, 10).map((error, index) => (
                    <p key={index} className="text-red-300 text-sm">{error}</p>
                  ))}
                  {uploadResult.errors.length > 10 && (
                    <p className="text-red-400 text-sm">... and {uploadResult.errors.length - 10} more errors</p>
                  )}
                </div>
              </div>
            )}

            <Button
              onClick={downloadResultSheet}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Download size={16} className="mr-2" />
              Download Result Sheet
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BulkUploadTab;
