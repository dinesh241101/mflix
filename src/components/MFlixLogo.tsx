
import { Film } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const MFlixLogo = () => {
  const navigate = useNavigate();
  
  const handleLogoClick = () => {
    // Always navigate to home page when logo is clicked
    navigate("/");
  };

  return (
    <div 
      onClick={handleLogoClick}
      className="text-2xl font-bold flex items-center hover:text-blue-400 transition-colors cursor-pointer"
    >
      <Film className="mr-2" />
      MFlix
    </div>
  );
};

export default MFlixLogo;
