
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import NewAdminHeader from "@/components/admin/NewAdminHeader";
import { useNewAdminAuth } from "@/hooks/useNewAdminAuth";

const HeaderConfigPage = () => {
  const { adminEmail, logout } = useNewAdminAuth();

  return (
    <div className="min-h-screen bg-gray-900">
      <NewAdminHeader adminEmail={adminEmail} onLogout={logout} />
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Header Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">Header configuration features will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HeaderConfigPage;
