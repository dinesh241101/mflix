
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Loader2, CheckCircle, RotateCcw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { createComprehensiveSampleData } from '@/utils/createSampleData';
import { createRedirectSampleData } from '@/utils/createRedirectSampleData';

interface SampleDataInitializerProps {
  onDataCreated?: () => void;
}

const SampleDataInitializer = ({ onDataCreated }: SampleDataInitializerProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isCreatingRedirect, setIsCreatingRedirect] = useState(false);
  const [redirectCompleted, setRedirectCompleted] = useState(false);

  const handleCreateSampleData = async () => {
    setIsCreating(true);
    try {
      const result = await createComprehensiveSampleData();
      
      if (result.success) {
        setIsCompleted(true);
        toast({
          title: "Success!",
          description: result.message,
        });

        if (onDataCreated) {
          onDataCreated();
        }
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Error creating sample data:', error);
      toast({
        title: "Error",
        description: "Failed to create sample data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateRedirectData = async () => {
    setIsCreatingRedirect(true);
    try {
      const result = await createRedirectSampleData();
      
      if (result.success) {
        setRedirectCompleted(true);
        toast({
          title: "Success!",
          description: result.message,
        });

        if (onDataCreated) {
          onDataCreated();
        }
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Error creating redirect sample data:', error);
      toast({
        title: "Error",
        description: "Failed to create redirect sample data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingRedirect(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Database className="h-5 w-5" />
            Sample Data Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 mb-4">
            Create comprehensive sample data including movies, series, anime, shorts, genres, and ads to fully test the platform.
          </p>
          
          <div className="space-y-3">
            <div className="text-sm text-gray-300">
              <p className="font-medium mb-2">This will create:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li>10+ Movies with posters, trailers & download links</li>
                <li>5+ Web Series with multiple seasons</li>
                <li>3+ Anime shows with episodes</li>
                <li>4+ Short videos for mobile content</li>
                <li>10 Content genres with descriptions</li>
                <li>3+ Sample advertisements</li>
                <li>Admin user role for demo account</li>
              </ul>
            </div>
            
            <Button 
              onClick={handleCreateSampleData}
              disabled={isCreating || isCompleted}
              className={`w-full ${isCompleted ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Sample Data...
                </>
              ) : isCompleted ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Sample Data Created!
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Create Comprehensive Sample Data
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            Redirect Loop Test Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 mb-4">
            Create sample data specifically for testing redirection loops and download page features.
          </p>
          
          <div className="space-y-3">
            <div className="text-sm text-gray-300">
              <p className="font-medium mb-2">This will create:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li>5 Redirect links for download pages 1, 2, 3</li>
                <li>3 Test movies with download links</li>
                <li>Sample page switch redirects</li>
                <li>Same page click redirects</li>
                <li>Download verification test data</li>
              </ul>
            </div>
            
            <Button 
              onClick={handleCreateRedirectData}
              disabled={isCreatingRedirect || redirectCompleted}
              className={`w-full ${redirectCompleted ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'}`}
            >
              {isCreatingRedirect ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Redirect Test Data...
                </>
              ) : redirectCompleted ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Redirect Test Data Created!
                </>
              ) : (
                <>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Create Redirect Loop Test Data
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SampleDataInitializer;
