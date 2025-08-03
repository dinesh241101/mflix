
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
        
        {/* Logout button removed - admin cannot logout once logged in */}
        <div className="text-sm text-green-400 bg-green-900/20 px-3 py-1 rounded">
          🔒 Secure Session Active
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
