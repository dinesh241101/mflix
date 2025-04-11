
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-bold text-blue-500">404</h1>
        
        <div className="relative h-40 my-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-8 bg-gray-900 rounded-full">
              <svg className="w-24 h-24 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold mb-4">Oops! Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            onClick={() => navigate(-1)} 
            variant="outline" 
            className="px-6 py-3 text-white border-blue-500 hover:bg-blue-600 transition-all"
          >
            Go Back
          </Button>
          <Button 
            onClick={() => navigate('/')} 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 transition-all flex items-center"
          >
            <Home className="mr-2" size={16} />
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
