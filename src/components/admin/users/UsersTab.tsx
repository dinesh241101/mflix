
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import UserForm from "./UserForm";
import UserList from "./UserList";

interface UsersTabProps {
  users: any[];
  newUserForm: {
    email: string;
    password: string;
    role: string;
  };
  setNewUserForm: (form: any) => void;
  handleAddUser: (e: React.FormEvent) => void;
  handleUpdateUserRole: (userId: string, newRole: string) => void;
  handleDeleteUser: (userId: string) => void;
}

const UsersTab = ({
  users,
  newUserForm,
  setNewUserForm,
  handleAddUser,
  handleUpdateUserRole,
  handleDeleteUser
}: UsersTabProps) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">User Management</h2>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2" size={16} />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 text-white border-gray-700">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <UserForm
                newUserForm={newUserForm}
                setNewUserForm={setNewUserForm}
                handleAddUser={handleAddUser}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <UserList 
        users={users} 
        handleUpdateUserRole={handleUpdateUserRole}
        handleDeleteUser={handleDeleteUser}
      />
    </div>
  );
};

export default UsersTab;
