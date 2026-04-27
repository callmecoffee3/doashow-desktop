import { useState } from 'react';
import { Users, Edit2, Trash2, Plus, Mail, Phone, MapPin, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  avatar: string;
  bio: string;
}

export default function UsersApp() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      phone: '+1 (555) 123-4567',
      role: 'admin',
      status: 'active',
      joinDate: '2025-01-15',
      avatar: '👨‍💼',
      bio: 'System Administrator',
    },
    {
      id: '2',
      name: 'Sarah Smith',
      email: 'sarah@example.com',
      phone: '+1 (555) 234-5678',
      role: 'moderator',
      status: 'active',
      joinDate: '2025-02-20',
      avatar: '👩‍💻',
      bio: 'Community Moderator',
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@example.com',
      phone: '+1 (555) 345-6789',
      role: 'user',
      status: 'active',
      joinDate: '2025-03-10',
      avatar: '👨‍🎨',
      bio: 'Content Creator',
    },
    {
      id: '4',
      name: 'Emma Wilson',
      email: 'emma@example.com',
      phone: '+1 (555) 456-7890',
      role: 'user',
      status: 'pending',
      joinDate: '2025-04-01',
      avatar: '👩‍🔬',
      bio: 'New Member',
    },
  ]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user' as const,
    bio: '',
  });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;

    setUsers([
      ...users,
      {
        id: Date.now().toString(),
        ...newUser,
        status: 'pending',
        joinDate: new Date().toISOString().split('T')[0],
        avatar: '👤',
      },
    ]);

    setNewUser({ name: '', email: '', phone: '', role: 'user', bio: '' });
    setShowForm(false);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/20 text-red-600 border-red-500/30';
      case 'moderator':
        return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      default:
        return 'bg-green-500/20 text-green-600 border-green-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-gray-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 bg-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-bold">User Management</h2>
          </div>
          <Button
            size="sm"
            onClick={() => setShowForm(true)}
            className="bg-accent hover:bg-accent/90"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add User
          </Button>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map(user => (
              <div
                key={user.id}
                className="bg-card border border-border rounded-lg p-4 hover:border-accent transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="text-4xl">{user.avatar}</div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedUser(user)}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-sm">{user.name}</h3>
                  <p className="text-xs text-foreground/60">{user.bio}</p>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2 text-foreground/70">
                    <Mail className="w-3 h-3" />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-2 text-foreground/70">
                    <Phone className="w-3 h-3" />
                    {user.phone}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <div className={`px-2 py-1 rounded border text-xs font-semibold ${getRoleColor(user.role)}`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(user.status)}`} />
                    <span className="text-xs text-foreground/60">{user.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {users.map(user => (
              <div
                key={user.id}
                className="bg-card border border-border rounded-lg p-4 flex items-center justify-between hover:border-accent transition-all"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-3xl">{user.avatar}</div>
                  <div className="flex-1">
                    <h3 className="font-bold">{user.name}</h3>
                    <p className="text-sm text-foreground/60">{user.bio}</p>
                    <div className="flex gap-4 text-xs text-foreground/60 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {user.phone}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded border text-xs font-semibold ${getRoleColor(user.role)}`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(user.status)}`} />
                    <span className="text-xs text-foreground/60">{user.status}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedUser(user)}
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add User Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-6 space-y-4 w-96">
              <h3 className="font-bold text-lg">Add New User</h3>
              <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <input
                type="text"
                placeholder="Bio"
                value={newUser.bio}
                onChange={(e) => setNewUser({ ...newUser, bio: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                className="w-full px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex gap-2">
                <Button
                  onClick={handleAddUser}
                  className="flex-1 bg-accent hover:bg-accent/90"
                >
                  Add User
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
