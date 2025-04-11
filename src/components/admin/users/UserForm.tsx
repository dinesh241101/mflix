
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";

interface UserFormProps {
  newUserForm: {
    email: string;
    password: string;
    role: string;
  };
  setNewUserForm: (form: any) => void;
  handleAddUser: (e: React.FormEvent) => void;
}

const UserForm = ({ newUserForm, setNewUserForm, handleAddUser }: UserFormProps) => {
  return (
    <form onSubmit={handleAddUser} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
        <Input 
          type="email"
          value={newUserForm.email}
          onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
          className="bg-gray-700 border-gray-600"
          placeholder="user@example.com"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
        <Input 
          type="password"
          value={newUserForm.password}
          onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
          className="bg-gray-700 border-gray-600"
          placeholder="Create a strong password"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
        <Select 
          value={newUserForm.role}
          onValueChange={(value) => setNewUserForm({ ...newUserForm, role: value })}
        >
          <SelectTrigger className="bg-gray-700 border-gray-600">
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600">
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
        Create User
      </Button>
    </form>
  );
};

export default UserForm;
