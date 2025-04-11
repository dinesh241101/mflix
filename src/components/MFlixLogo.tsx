
import { Film } from "lucide-react";
import { Link } from "react-router-dom";

const MFlixLogo = () => {
  return (
    <Link to="/" className="text-2xl font-bold flex items-center hover:text-blue-400 transition-colors">
      <Film className="mr-2" />
      MFlix
    </Link>
  );
};

export default MFlixLogo;
