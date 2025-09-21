
import { useState } from "react";
import NewAdminHeader from "@/components/admin/NewAdminHeader";
import { useNewAdminAuth } from "@/hooks/useNewAdminAuth";
import SettingsTab from "@/components/admin/settings/SettingsTab";

const SettingsPage = () => {
  const { adminEmail, logout } = useNewAdminAuth();

  return (
    <div className="min-h-screen bg-gray-900">
      <NewAdminHeader adminEmail={adminEmail} onLogout={logout} />
      <div className="container mx-auto px-4 py-8">
        <SettingsTab />
      </div>
    </div>
  );
};

export default SettingsPage;
