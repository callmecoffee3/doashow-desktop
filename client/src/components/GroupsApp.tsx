import { useState, useEffect } from 'react';
import { Plus, Trash2, Users, Settings, MessageSquare, Edit2, Save, X, LogOut, UserPlus, Search } from 'lucide-react';
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
  owner: string;
}

export default function GroupsApp() {
  const [myGroups, setMyGroups] = useState<Group[]>([
    {
      id: '1',
      name: 'Tech Enthusiasts',
      description: 'A community for technology lovers and innovators',
      members: [
        { id: '1', name: 'You', role: 'admin', joinedDate: '2024-01-01' },
        { id: '2', name: 'Jane Smith', role: 'moderator', joinedDate: '2024-01-05' },
        { id: '3', name: 'Bob Wilson', role: 'member', joinedDate: '2024-01-10' },
      ],
      createdDate: '2024-01-01',
      privacy: 'public',
      memberCount: 3,
      owner: 'You',
    },
  ]);

  const [allGroups, setAllGroups] = useState<Group[]>([
    {
      id: '2',
      name: 'Fitness Buddies',
      description: 'Share fitness goals and workout routines',
      members: [
        { id: '1', name: 'Alice Johnson', role: 'admin', joinedDate: '2024-01-02' },
        { id: '2', name: 'Charlie Brown', role: 'member', joinedDate: '2024-01-08' },
      ],
      createdDate: '2024-01-02',
      privacy: 'public',
      memberCount: 2,
      owner: 'Alice Johnson',
    },
    {
      id: '3',
      name: 'Book Club',
      description: 'Discuss your favorite books and authors',
      members: [
        { id: '1', name: 'Diana Prince', role: 'admin', joinedDate: '2024-01-03' },
      ],
      createdDate: '2024-01-03',
      privacy: 'public',
      memberCount: 1,
      owner: 'Diana Prince',
    },
    {
      id: '4',
      name: 'Photography Enthusiasts',
      description: 'Share photos and photography tips',
      members: [
        { id: '1', name: 'Edward Norton', role: 'admin', joinedDate: '2024-01-04' },
      ],
      createdDate: '2024-01-04',
      privacy: 'public',
      memberCount: 1,
      owner: 'Edward Norton',
    },
  ]);

  const [selectedGroupId, setSelectedGroupId] = useState<string>('1');
  const [showNewGroupForm, setShowNewGroupForm] = useState(false);
  const [showGroupDiscovery, setShowGroupDiscovery] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newGroupData, setNewGroupData] = useState({
    name: '',
    description: '',
    privacy: 'public' as const,
  });
  const [newMemberName, setNewMemberName] = useState('');

  const selectedGroup = myGroups.find(g => g.id === selectedGroupId);

  useEffect(() => {
    localStorage.setItem('doashow_my_groups', JSON.stringify(myGroups));
    localStorage.setItem('doashow_all_groups', JSON.stringify(allGroups));
  }, [myGroups, allGroups]);

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
      owner: 'You',
    };

    setMyGroups([...myGroups, newGroup]);
    setSelectedGroupId(newGroup.id);
    setNewGroupData({ name: '', description: '', privacy: 'public' });
    setShowNewGroupForm(false);
  };

  const joinGroup = (groupId: string) => {
    const groupToJoin = allGroups.find(g => g.id === groupId);
    if (!groupToJoin) return;

    const newMember: Member = {
      id: Date.now().toString(),
      name: 'You',
      role: 'member',
      joinedDate: new Date().toISOString().split('T')[0],
    };

    const joinedGroup: Group = {
      ...groupToJoin,
      members: [...groupToJoin.members, newMember],
      memberCount: groupToJoin.memberCount + 1,
    };

    setMyGroups([...myGroups, joinedGroup]);
    setAllGroups(allGroups.filter(g => g.id !== groupId));
    setSelectedGroupId(joinedGroup.id);
    setShowGroupDiscovery(false);
  };

  const leaveGroup = (id: string) => {
    const updated = myGroups.filter(g => g.id !== id);
    setMyGroups(updated);
    if (selectedGroupId === id) {
      setSelectedGroupId(updated[0]?.id || '');
    }

    const leftGroup = myGroups.find(g => g.id === id);
    if (leftGroup && leftGroup.owner !== 'You') {
      setAllGroups([...allGroups, leftGroup]);
    }
  };

  const deleteGroup = (id: string) => {
    const updated = myGroups.filter(g => g.id !== id);
    setMyGroups(updated);
    if (selectedGroupId === id) {
      setSelectedGroupId(updated[0]?.id || '');
    }
  };

  const addMember = (groupId: string) => {
    if (!newMemberName.trim()) return;

    const updated = myGroups.map(g => {
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

    setMyGroups(updated);
    setNewMemberName('');
  };

  const removeMember = (groupId: string, memberId: string) => {
    const updated = myGroups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          members: g.members.filter(m => m.id !== memberId),
          memberCount: g.memberCount - 1,
        };
      }
      return g;
    });

    setMyGroups(updated);
  };

  const filteredGroups = allGroups.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full">
      {/* Groups Sidebar */}
      <div className="w-64 border-r border-border bg-secondary flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-bold mb-3">My Groups</h2>
          <div className="flex gap-2">
            <Button onClick={() => setShowNewGroupForm(true)} className="flex-1 gap-2" size="sm">
              <Plus className="w-4 h-4" />
              New
            </Button>
            <Button onClick={() => setShowGroupDiscovery(true)} variant="outline" className="flex-1 gap-2" size="sm">
              <Search className="w-4 h-4" />
              Browse
            </Button>
          </div>
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
          {myGroups.map(group => (
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
                {group.owner === 'You' ? (
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
                ) : (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      leaveGroup(group.id);
                    }}
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <LogOut className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Group Discovery Modal */}
      {showGroupDiscovery && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Discover Groups</h3>
              <Button onClick={() => setShowGroupDiscovery(false)} variant="ghost" size="icon">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <input
              type="text"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm mb-4"
            />

            <div className="space-y-2">
              {filteredGroups.length > 0 ? (
                filteredGroups.map(group => (
                  <div key={group.id} className="p-3 bg-background border border-border rounded-lg flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{group.name}</h4>
                      <p className="text-xs text-foreground/60 mt-1">{group.description}</p>
                      <p className="text-xs text-foreground/50 mt-1">
                        {group.memberCount} members • Owner: {group.owner}
                      </p>
                    </div>
                    <Button onClick={() => joinGroup(group.id)} className="gap-2">
                      <UserPlus className="w-4 h-4" />
                      Join
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center text-foreground/50 py-4">No groups found</p>
              )}
            </div>
          </div>
        </div>
      )}

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
                    <span>Owner: {selectedGroup.owner}</span>
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

                {/* Add Member Form (only if owner) */}
                {selectedGroup.owner === 'You' && (
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
                )}

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
                      {selectedGroup.owner === 'You' && member.name !== 'You' && (
                        <Button
                          onClick={() => removeMember(selectedGroup.id, member.id)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
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
