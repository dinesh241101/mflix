
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import MFlixLogo from "@/components/MFlixLogo";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <MFlixLogo />
        </div>
        
        <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600">
          404
        </h1>
        
        <div className="relative h-40 my-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-8 bg-gray-900 rounded-full">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full animate-spin"></div>
                <div className="absolute inset-1 bg-gray-900 rounded-full flex items-center justify-center">
                  <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold mb-4">Oops! Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          Looks like you've ventured into the unknown! The page you're looking for has either been moved, deleted, or never existed in the first place.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            onClick={() => navigate(-1)} 
            variant="outline" 
            className="px-6 py-3 text-white border-blue-500 hover:bg-blue-600 transition-all group"
          >
            <span className="relative inline-flex overflow-hidden group-hover:-translate-x-1 transition-transform">
              <span className="absolute left-0 opacity-0 -translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all">←</span>
              <span className="relative ml-4 group-hover:ml-0">Go Back</span>
            </span>
          </Button>
          <Button 
            onClick={() => navigate('/')} 
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all flex items-center"
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
