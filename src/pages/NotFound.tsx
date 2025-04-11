
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-8">Page not found</p>
      <Link to="/" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
