
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import NewAdminHeader from "@/components/admin/NewAdminHeader";
import { useNewAdminAuth } from "@/hooks/useNewAdminAuth";
import MoviesTab from "@/components/admin/movies/MoviesTab";

const ContentUploadPage = () => {
  const { adminEmail, logout } = useNewAdminAuth();

  return (
    <div className="min-h-screen bg-gray-900">
      <NewAdminHeader adminEmail={adminEmail} onLogout={logout} />
      <div className="container mx-auto px-4 py-8">
        <MoviesTab />
      </div>
    </div>
  );
};

export default ContentUploadPage;
