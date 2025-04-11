
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import MFlixLogo from "@/components/MFlixLogo";

interface AdminHeaderProps {
  adminEmail: string;
  onLogout: () => void;
}

const AdminHeader = ({ adminEmail, onLogout }: AdminHeaderProps) => {
  return (
    <header className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <MFlixLogo />
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">Welcome, {adminEmail}</span>
            <button 
              className="text-red-400 hover:text-red-300 flex items-center"
              onClick={onLogout}
            >
              <LogOut size={16} className="mr-1" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
