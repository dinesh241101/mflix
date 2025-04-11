
import { Button } from "@/components/ui/button";
import { Edit, UserMinus } from "lucide-react";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";

interface UserListProps {
  users: any[];
  handleUpdateUserRole: (userId: string, newRole: string) => void;
  handleDeleteUser: (userId: string) => void;
}

const UserList = ({ users, handleUpdateUserRole, handleDeleteUser }: UserListProps) => {
  return (
    <div className="bg-gray-700 rounded-lg overflow-hidden">
      <div className="grid grid-cols-12 font-medium bg-gray-800 p-3">
        <div className="col-span-5">Email</div>
        <div className="col-span-2">Role</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-3 text-right">Actions</div>
      </div>
      
      {users.length === 0 ? (
        <div className="p-4 text-center text-gray-400">
          No users found. Add your first user using the button above.
        </div>
      ) : (
        <div className="divide-y divide-gray-600">
          {users.map(user => (
            <div key={user.id} className="grid grid-cols-12 p-3 items-center">
              <div className="col-span-5 truncate">{user.email}</div>
              <div className="col-span-2">
                <Select 
                  value={user.role}
                  onValueChange={(value) => handleUpdateUserRole(user.user_id, value)}
                  disabled={user.email === "dinesh001kaushik@gmail.com"}
                >
                  <SelectTrigger className="h-8 bg-gray-700 border-gray-600">
                    <SelectValue placeholder={user.role} />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  user.status === 'Active' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                }`}>
                  {user.status}
                </span>
              </div>
              <div className="col-span-3 text-right space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  disabled={user.email === "dinesh001kaushik@gmail.com"}
                >
                  <Edit size={16} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-400 hover:text-red-300"
                  onClick={() => handleDeleteUser(user.user_id)}
                  disabled={user.email === "dinesh001kaushik@gmail.com"}
                >
                  <UserMinus size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;
