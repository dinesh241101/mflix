
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import UserForm from "./UserForm";
import UserList from "./UserList";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UsersTabProps {
  users?: any[];
  newUserForm?: {
    email: string;
    password: string;
    role: string;
  };
  setNewUserForm?: (form: any) => void;
  handleAddUser?: (e: React.FormEvent) => void;
  handleUpdateUserRole?: (userId: string, newRole: string) => void;
  handleDeleteUser?: (userId: string) => void;
}

const UsersTab = (props: UsersTabProps = {}) => {
  const [users, setUsers] = useState(props.users || []);
  const [newUserForm, setNewUserForm] = useState(props.newUserForm || {
    email: '',
    password: '',
    role: 'viewer'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (props.handleAddUser) {
      props.handleAddUser(e);
      return;
    }

    try {
      setLoading(true);
      
      // In a real implementation, you would create the user in auth.users
      // For now, we'll just add to user_roles
      const { error } = await supabase
        .from('user_roles')
        .insert([{
          auth_user_id: crypto.randomUUID(), // Temporary placeholder
          role_name: newUserForm.role
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User added successfully"
      });

      setNewUserForm({
        email: '',
        password: '',
        role: 'viewer'
      });

      fetchUsers();
    } catch (error: any) {
      console.error('Error adding user:', error);
      toast({
        title: "Error",
        description: "Failed to add user",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    if (props.handleUpdateUserRole) {
      props.handleUpdateUserRole(userId, newRole);
      return;
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role_name: newRole })
        .eq('role_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User role updated successfully"
      });

      fetchUsers();
    } catch (error: any) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (props.handleDeleteUser) {
      props.handleDeleteUser(userId);
      return;
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('role_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User deleted successfully"
      });

      fetchUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive"
      });
    }
  };

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
                setNewUserForm={props.setNewUserForm || setNewUserForm}
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
