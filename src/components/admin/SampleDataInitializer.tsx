
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { createSampleData } from "@/utils/sampleData";
import { Database, Loader } from "lucide-react";

const SampleDataInitializer = () => {
  const [loading, setLoading] = useState(false);

  const handleCreateSampleData = async () => {
    setLoading(true);
    try {
      const success = await createSampleData();
      if (success) {
        toast({
          title: "Success",
          description: "Sample data created successfully! You can now browse movies, series, anime, and shorts.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create sample data. Check console for details.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error creating sample data:", error);
      toast({
        title: "Error",
        description: "An error occurred while creating sample data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Database className="mr-2" />
          Sample Data Setup
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 mb-4">
          Initialize your MFlix website with sample movies, series, anime, shorts, and genres to get started quickly.
        </p>
        <Button 
          onClick={handleCreateSampleData}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Creating Sample Data...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Create Sample Data
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SampleDataInitializer;
