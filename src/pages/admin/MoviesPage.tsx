
import { useState } from "react";
import NewAdminHeader from "@/components/admin/NewAdminHeader";
import { useNewAdminAuth } from "@/hooks/useNewAdminAuth";
import MoviesTab from "@/components/admin/movies/MoviesTab";

const MoviesPage = () => {
  const { adminEmail, logout } = useNewAdminAuth();

  return (
    <div className="min-h-screen bg-gray-900">
      <NewAdminHeader adminEmail={adminEmail} onLogout={logout} />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Movies Management</h1>
          <p className="text-gray-400">Manage movie content and download links</p>
        </div>
        <MoviesTab contentType="movie" />
      </div>
    </div>
  );
};

export default MoviesPage;
