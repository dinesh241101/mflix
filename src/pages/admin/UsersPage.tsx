
import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import LoadingScreen from "@/components/LoadingScreen";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

const UsersPage = () => {
  const { adminEmail, loading, isAuthenticated, handleLogout } = useAdminAuth();

  if (loading) {
    return <LoadingScreen message="Loading Users Management" />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminHeader adminEmail={adminEmail} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-gray-400">Manage user accounts and permissions</p>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="mr-2" />
              Users Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Users size={64} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">User management features coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UsersPage;
