
import { useState } from "react";
import NewAdminHeader from "@/components/admin/NewAdminHeader";
import { useNewAdminAuth } from "@/hooks/useNewAdminAuth";
import MoviesTab from "@/components/admin/movies/MoviesTab";

const WebSeriesPage = () => {
  const { adminEmail, logout } = useNewAdminAuth();

  return (
    <div className="min-h-screen bg-gray-900">
      <NewAdminHeader adminEmail={adminEmail} onLogout={logout} />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Web Series Management</h1>
          <p className="text-gray-400">Manage web series content and download links</p>
        </div>
        <MoviesTab contentType="series" />
      </div>
    </div>
  );
};

export default WebSeriesPage;
