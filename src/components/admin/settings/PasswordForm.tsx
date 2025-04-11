
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PasswordFormProps {
  currentPassword: string;
  setCurrentPassword: (password: string) => void;
  newPassword: string;
  setNewPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  handlePasswordChange: (e: React.FormEvent) => void;
}

const PasswordForm = ({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  handlePasswordChange
}: PasswordFormProps) => {
  return (
    <form onSubmit={handlePasswordChange} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Current Password</label>
        <Input 
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="bg-gray-700 border-gray-600"
          placeholder="Current password"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
        <Input 
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="bg-gray-700 border-gray-600"
          placeholder="New password"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Confirm Password</label>
        <Input 
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="bg-gray-700 border-gray-600"
          placeholder="Confirm new password"
        />
      </div>
      
      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
        Change Password
      </Button>
    </form>
  );
};

export default PasswordForm;
