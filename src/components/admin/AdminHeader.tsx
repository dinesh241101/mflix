
import { Button } from "@/components/ui/button";
import { LogOut, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AdminHeaderProps {
  adminEmail: string;
  onLogout: () => void;
}

const AdminHeader = ({ adminEmail, onLogout }: AdminHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin")}
            className="text-white hover:bg-gray-700"
          >
            <Home size={18} className="mr-2" />
            Admin Dashboard
          </Button>
          <div className="text-white">
            <span className="text-sm text-gray-300">Welcome, </span>
            <span className="font-medium">{adminEmail}</span>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
        >
          <LogOut size={18} className="mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
