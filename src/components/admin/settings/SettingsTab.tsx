
import PasswordForm from "./PasswordForm";
import SiteSettingsForm from "./SiteSettingsForm";

interface SettingsTabProps {
  currentPassword: string;
  setCurrentPassword: (password: string) => void;
  newPassword: string;
  setNewPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  handlePasswordChange: (e: React.FormEvent) => void;
}

const SettingsTab = ({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  handlePasswordChange
}: SettingsTabProps) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-6">Account Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Change Password</h3>
          <PasswordForm 
            currentPassword={currentPassword}
            setCurrentPassword={setCurrentPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            handlePasswordChange={handlePasswordChange}
          />
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Site Settings</h3>
          <SiteSettingsForm />
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
