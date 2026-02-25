import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/pages/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/pages/components/ui/table';
import { Badge } from '@/pages/components/ui/badge';
import { Edit2, Trash2, Plus, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/pages/components/ui/dialog';

export interface User {
  ClientId: number;
  Name: string;
  Email: string;
  Contact: string;
  role: 'admin' | 'warehouse' | 'client' | 'driver';
  status: 'active' | 'inactive';
  joinDate: string;
}

const initialUsers: User[] = [
//   {
//     id: 1,
//     name: 'John Doe',
//     email: 'john@example.com',
//     phone: '+1 (555) 123-4567',
//     role: 'admin',
//     status: 'active',
//     joinDate: '2024-01-15',
//   },
//   {
//     id: 2,
//     name: 'Jane Smith',
//     email: 'jane@example.com',
//     phone: '+1 (555) 234-5678',
//     role: 'warehouse',
//     status: 'active',
//     joinDate: '2024-02-20',
//   },
//   {
//     id: 3,
//     name: 'Bob Johnson',
//     email: 'bob@example.com',
//     phone: '+1 (555) 345-6789',
//     role: 'client',
//     status: 'active',
//     joinDate: '2024-03-10',
//   },
//   {
//     id: 4,
//     name: 'Alice Williams',
//     email: 'alice@example.com',
//     phone: '+1 (555) 456-7890',
//     role: 'driver',
//     status: 'inactive',
//     joinDate: '2024-01-05',
//   },
];





async function loadInitialUsers(){
    try{

        const user = await fetch("http://10.23.1.254:3000/api/users");
        if(user.ok){
            const data = await user.json();
            console.log(data)
            return data as User[];
        }else{
            throw new Error("Failed to fetch users: " + user.statusText);
        }               
    }catch(error){
        console.error("Error fetching users:", error);
        return [];
    }
}



export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<User, 'id'>>({
    name: '',
    email: '',
    phone: '',
    role: 'client',
    status: 'active',
    joinDate: new Date().toISOString().split('T')[0],
  });

  const filteredUsers = users?.filter(user =>
    user?.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.Email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'client',
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
    });
    setShowForm(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      joinDate: user.joinDate,
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (editingUser) {
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? { ...u, ...formData }
          : u
      ));
    } else {
      const newUser: User = {
        ...formData,
        id: Math.max(...users.map(u => u.id), 0) + 1,
      };
      setUsers([...users, newUser]);
    }
    setShowForm(false);
  };

  const handleDelete = (userId: number) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'warehouse':
        return 'bg-blue-100 text-blue-800';
      case 'client':
        return 'bg-green-100 text-green-800';
      case 'driver':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };



  useEffect(() => {
    const fetchUsers = async () => {
      const loadedUsers = await loadInitialUsers();
      setUsers(loadedUsers);
      console.log("Users loaded:", loadedUsers);
    };

    fetchUsers();
  }, []);



  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage all system users and their roles</CardDescription>
            </div>
            <Button onClick={handleCreate} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Search Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map(user => (
                  <TableRow key={user.ClientId}>
                    <TableCell className="font-medium">{user.Name}</TableCell>
                    <TableCell>{user.Email }</TableCell>
                    <TableCell>{user.Contact}</TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.joinDate}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(user)}
                          className="flex items-center gap-1"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(user.id)}
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* User Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
            <DialogDescription>
              {editingUser ? 'Update user information' : 'Create a new user account'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full Name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="client">Client</option>
                <option value="driver">Driver</option>
                <option value="warehouse">Warehouse</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} className="flex-1">
                {editingUser ? 'Update User' : 'Create User'}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
