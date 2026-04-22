import { useState, useEffect } from 'react';
import { Plus, Trash2, Users, Settings, MessageSquare, Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Member {
  id: string;
  name: string;
  role: 'admin' | 'moderator' | 'member';
  joinedDate: string;
}

interface Group {
  id: string;
  name: string;
  description: string;
  members: Member[];
  createdDate: string;
  privacy: 'public' | 'private';
  memberCount: number;
}

export default function GroupsApp() {
  const [groups, setGroups] = useState<Group[]>([
    {
      id: '1',
      name: 'Tech Enthusiasts',
      description: 'A community for technology lovers and innovators',
      members: [
        { id: '1', name: 'John Doe', role: 'admin', joinedDate: '2024-01-01' },
        { id: '2', name: 'Jane Smith', role: 'moderator', joinedDate: '2024-01-05' },
        { id: '3', name: 'Bob Wilson', role: 'member', joinedDate: '2024-01-10' },
      ],
      createdDate: '2024-01-01',
      privacy: 'public',
      memberCount: 3,
    },
    {
      id: '2',
      name: 'Fitness Buddies',
      description: 'Share fitness goals and workout routines',
      members: [
        { id: '1', name: 'Alice Johnson', role: 'admin', joinedDate: '2024-01-02' },
        { id: '2', name: 'Charlie Brown', role: 'member', joinedDate: '2024-01-08' },
      ],
      createdDate: '2024-01-02',
      privacy: 'private',
      memberCount: 2,
    },
  ]);

  const [selectedGroupId, setSelectedGroupId] = useState<string>('1');
  const [showNewGroupForm, setShowNewGroupForm] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [newGroupData, setNewGroupData] = useState({
    name: '',
    description: '',
    privacy: 'public' as const,
  });
  const [newMemberName, setNewMemberName] = useState('');

  const selectedGroup = groups.find(g => g.id === selectedGroupId);

  useEffect(() => {
    localStorage.setItem('doashow_groups', JSON.stringify(groups));
  }, [groups]);

  const createGroup = () => {
    if (!newGroupData.name.trim()) return;

    const newGroup: Group = {
      id: Date.now().toString(),
      name: newGroupData.name,
      description: newGroupData.description,
      privacy: newGroupData.privacy,
      members: [{ id: '1', name: 'You', role: 'admin', joinedDate: new Date().toISOString().split('T')[0] }],
      createdDate: new Date().toISOString().split('T')[0],
      memberCount: 1,
    };

    setGroups([...groups, newGroup]);
    setSelectedGroupId(newGroup.id);
    setNewGroupData({ name: '', description: '', privacy: 'public' });
    setShowNewGroupForm(false);
  };

  const deleteGroup = (id: string) => {
    const updated = groups.filter(g => g.id !== id);
    setGroups(updated);
    if (selectedGroupId === id) {
      setSelectedGroupId(updated[0]?.id || '');
    }
  };

  const addMember = (groupId: string) => {
    if (!newMemberName.trim()) return;

    const updated = groups.map(g => {
      if (g.id === groupId) {
        const newMember: Member = {
          id: Date.now().toString(),
          name: newMemberName,
          role: 'member',
          joinedDate: new Date().toISOString().split('T')[0],
        };
        return {
          ...g,
          members: [...g.members, newMember],
          memberCount: g.memberCount + 1,
        };
      }
      return g;
    });

    setGroups(updated);
    setNewMemberName('');
  };

  const removeMember = (groupId: string, memberId: string) => {
    const updated = groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          members: g.members.filter(m => m.id !== memberId),
          memberCount: g.memberCount - 1,
        };
      }
      return g;
    });

    setGroups(updated);
  };

  const updateGroup = (id: string, updates: Partial<Group>) => {
    const updated = groups.map(g => (g.id === id ? { ...g, ...updates } : g));
    setGroups(updated);
    setEditingGroupId(null);
  };

  return (
    <div className="flex h-full">
      {/* Groups Sidebar */}
      <div className="w-64 border-r border-border bg-secondary flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-bold mb-3">Groups</h2>
          <Button onClick={() => setShowNewGroupForm(true)} className="w-full gap-2">
            <Plus className="w-4 h-4" />
            New Group
          </Button>
        </div>

        {/* New Group Form */}
        {showNewGroupForm && (
          <div className="p-4 border-b border-border space-y-2">
            <input
              type="text"
              placeholder="Group name"
              value={newGroupData.name}
              onChange={(e) => setNewGroupData({ ...newGroupData, name: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
            />
            <textarea
              placeholder="Description"
              value={newGroupData.description}
              onChange={(e) => setNewGroupData({ ...newGroupData, description: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm h-16 resize-none"
            />
            <select
              value={newGroupData.privacy}
              onChange={(e) => setNewGroupData({ ...newGroupData, privacy: e.target.value as any })}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
            <div className="flex gap-2">
              <Button onClick={createGroup} size="sm" className="flex-1">
                Create
              </Button>
              <Button onClick={() => setShowNewGroupForm(false)} variant="outline" size="sm" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Groups List */}
        <div className="flex-1 overflow-y-auto">
          {groups.map(group => (
            <button
              key={group.id}
              onClick={() => setSelectedGroupId(group.id)}
              className={`w-full text-left px-4 py-3 border-b border-border transition-colors hover:bg-accent/10 ${
                selectedGroupId === group.id ? 'bg-accent/20' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{group.name}</h3>
                  <p className="text-xs text-foreground/60 flex items-center gap-1 mt-1">
                    <Users className="w-3 h-3" />
                    {group.memberCount} members
                  </p>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteGroup(group.id);
                  }}
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Group Details */}
      <div className="flex-1 flex flex-col">
        {selectedGroup ? (
          <>
            {/* Group Header */}
            <div className="border-b border-border p-4 bg-card">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedGroup.name}</h2>
                  <p className="text-sm text-foreground/60 mt-1">{selectedGroup.description}</p>
                  <div className="flex gap-4 mt-2 text-xs text-foreground/60">
                    <span>Created: {selectedGroup.createdDate}</span>
                  <span className={`px-2 py-1 rounded ${selectedGroup.privacy === 'public' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                    {selectedGroup.privacy === 'public' ? 'PUBLIC' : 'PRIVATE'}
                  </span>
                  </div>
                </div>
                <Button variant="outline" size="icon">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Members Section */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Members ({selectedGroup.memberCount})
                </h3>

                {/* Add Member Form */}
                <div className="mb-4 p-3 bg-card border border-border rounded-lg">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add member name..."
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addMember(selectedGroup.id)}
                      className="flex-1 px-3 py-2 bg-background border border-border rounded text-sm"
                    />
                    <Button onClick={() => addMember(selectedGroup.id)} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Members List */}
                <div className="space-y-2">
                  {selectedGroup.members.map(member => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold">{member.name}</p>
                        <p className="text-xs text-foreground/60">
                          {member.role.charAt(0).toUpperCase() + member.role.slice(1)} • Joined {member.joinedDate}
                        </p>
                      </div>
                      <Button
                        onClick={() => removeMember(selectedGroup.id, member.id)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Group Chat Preview */}
              <div className="p-4 bg-card border border-border rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Recent Activity
                </h4>
                <p className="text-sm text-foreground/60 italic">No messages yet. Start the conversation!</p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-foreground/50">
            <p>Select a group to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
