
import { Button } from "@/components/ui/button";
import { LogOut, Home } from "lucide-react";

interface NewAdminHeaderProps {
  adminEmail: string;
  onLogout: () => void;
}

const NewAdminHeader = ({ adminEmail, onLogout }: NewAdminHeaderProps) => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Home size={20} className="text-blue-400" />
            <span className="text-xl font-bold text-white">MFlix Admin</span>
          </div>
          <div className="text-white">
            <span className="text-sm text-gray-300">Welcome, </span>
            <span className="font-medium">{adminEmail}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-sm text-green-400 bg-green-900/20 px-3 py-1 rounded">
            🔒 Admin Panel Active
          </div>
          <Button
            onClick={onLogout}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gray-700 hover:text-red-400"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default NewAdminHeader;
