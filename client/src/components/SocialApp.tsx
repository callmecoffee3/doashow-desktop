import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Trash2, Plus, X, Search, UserPlus, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface User {
  id: string;
  name: string;
  avatar: string;
  username: string;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
}

interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
}

interface Friend {
  id: string;
  name: string;
  avatar: string;
  username: string;
  status: 'online' | 'offline';
}

const STORAGE_KEY = 'doashow_social_app';

const SAMPLE_USERS: User[] = [
  { id: '1', name: 'Alex Chen', avatar: '👨‍💼', username: '@alexchen' },
  { id: '2', name: 'Sarah Miller', avatar: '👩‍💻', username: '@sarahmiller' },
  { id: '3', name: 'Jordan Lee', avatar: '👨‍🎨', username: '@jordanlee' },
  { id: '4', name: 'Emma Wilson', avatar: '👩‍🔬', username: '@emmawilson' },
  { id: '5', name: 'Marcus Brown', avatar: '👨‍🚀', username: '@marcusbrown' },
];

export default function SocialApp() {
  const [currentUser] = useState<User>(SAMPLE_USERS[0]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [activeTab, setActiveTab] = useState<'feed' | 'friends'>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setPosts(data.posts || []);
      setFriends(data.friends || []);
    } else {
      // Initialize with sample data
      const samplePosts: Post[] = [
        {
          id: '1',
          userId: '2',
          userName: 'Sarah Miller',
          userAvatar: '👩‍💻',
          content: 'Just launched my new project! Really excited about this one 🚀',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          likes: 42,
          liked: false,
          comments: [
            {
              id: 'c1',
              userId: '1',
              userName: 'Alex Chen',
              userAvatar: '👨‍💼',
              text: 'Looks amazing! Congrats! 🎉',
              timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            },
          ],
        },
        {
          id: '2',
          userId: '3',
          userName: 'Jordan Lee',
          userAvatar: '👨‍🎨',
          content: 'Beautiful sunset at the beach today 🌅',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          likes: 128,
          liked: true,
          comments: [],
        },
        {
          id: '3',
          userId: '4',
          userName: 'Emma Wilson',
          userAvatar: '👩‍🔬',
          content: 'Coffee and code - the perfect combination ☕💻',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          likes: 67,
          liked: false,
          comments: [],
        },
      ];

      const sampleFriends: Friend[] = [
        { id: '2', name: 'Sarah Miller', avatar: '👩‍💻', username: '@sarahmiller', status: 'online' },
        { id: '3', name: 'Jordan Lee', avatar: '👨‍🎨', username: '@jordanlee', status: 'online' },
        { id: '4', name: 'Emma Wilson', avatar: '👩‍🔬', username: '@emmawilson', status: 'offline' },
        { id: '5', name: 'Marcus Brown', avatar: '👨‍🚀', username: '@marcusbrown', status: 'online' },
      ];

      setPosts(samplePosts);
      setFriends(sampleFriends);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ posts, friends }));
  }, [posts, friends]);

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content: newPostContent,
      timestamp: new Date().toISOString(),
      likes: 0,
      liked: false,
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setShowPostForm(false);
  };

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
          }
        : post
    ));
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleAddComment = (postId: string) => {
    if (!commentText.trim()) return;

    setPosts(posts.map(post =>
      post.id === postId
        ? {
            ...post,
            comments: [
              ...post.comments,
              {
                id: Date.now().toString(),
                userId: currentUser.id,
                userName: currentUser.name,
                userAvatar: currentUser.avatar,
                text: commentText,
                timestamp: new Date().toISOString(),
              },
            ],
          }
        : post
    ));

    setCommentText('');
    setCommentingOn(null);
  };

  const handleAddFriend = (userId: string) => {
    const user = SAMPLE_USERS.find(u => u.id === userId);
    if (user && !friends.find(f => f.id === userId)) {
      setFriends([
        ...friends,
        {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          username: user.username,
          status: Math.random() > 0.5 ? 'online' : 'offline',
        },
      ]);
    }
  };

  const handleRemoveFriend = (friendId: string) => {
    setFriends(friends.filter(f => f.id !== friendId));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const suggestedUsers = SAMPLE_USERS.filter(
    u => u.id !== currentUser.id && !friends.find(f => f.id === u.id)
  );

  // Search results
  const searchResults = {
    posts: posts.filter(post =>
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.userName.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    people: SAMPLE_USERS.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  };

  const isSearchActive = searchQuery.trim().length > 0;

  return (
    <div className="flex h-full bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Sidebar */}
      <div className="w-64 border-r border-purple-500/30 bg-slate-900/50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-purple-500/30">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            SocialHub
          </h1>
          <p className="text-xs text-gray-400">Connect & Share</p>
        </div>

        {/* Current User */}
        <div className="p-4 border-b border-purple-500/30">
          <div className="flex items-center gap-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <span className="text-3xl">{currentUser.avatar}</span>
            <div>
              <p className="font-semibold text-sm text-white">{currentUser.name}</p>
              <p className="text-xs text-gray-400">{currentUser.username}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-3 border-b border-purple-500/30">
          <Button
            onClick={() => setActiveTab('feed')}
            variant={activeTab === 'feed' ? 'default' : 'outline'}
            className="flex-1 text-xs"
          >
            Feed
          </Button>
          <Button
            onClick={() => setActiveTab('friends')}
            variant={activeTab === 'friends' ? 'default' : 'outline'}
            className="flex-1 text-xs"
          >
            Friends
          </Button>
        </div>

        {/* Friends List */}
        {activeTab === 'friends' && !isSearchActive && (
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {friends.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">No friends yet</p>
            ) : (
              friends.map(friend => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between p-2 bg-purple-500/10 rounded border border-purple-500/20 hover:border-purple-400/50 transition-colors"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-xl flex-shrink-0">{friend.avatar}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{friend.name}</p>
                      <div className="flex items-center gap-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            friend.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                          }`}
                        />
                        <p className="text-xs text-gray-400">{friend.status}</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-gray-400 hover:text-red-400 flex-shrink-0"
                    onClick={() => handleRemoveFriend(friend.id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Suggested Users */}
        {activeTab === 'friends' && !isSearchActive && (
          <div className="border-t border-purple-500/30 p-3 space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase">Suggested</p>
            {suggestedUsers.length === 0 ? (
              <p className="text-xs text-gray-400">All users are friends!</p>
            ) : (
              suggestedUsers.map(user => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-2 bg-purple-500/10 rounded border border-purple-500/20"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-lg flex-shrink-0">{user.avatar}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.username}</p>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-gray-400 hover:text-green-400 flex-shrink-0"
                    onClick={() => handleAddFriend(user.id)}
                  >
                    <UserPlus className="w-3 h-3" />
                  </Button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Main Feed */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Search Bar */}
        <div className="border-b border-purple-500/30 p-4 bg-slate-900/50">
          <div className="flex items-center gap-2 bg-slate-800 border border-purple-500/30 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts or people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm focus:outline-none placeholder-gray-500"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        {isSearchActive ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* People Results */}
            {searchResults.people.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-purple-300 mb-3 uppercase">People</h2>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {searchResults.people.map(person => (
                    <div
                      key={person.id}
                      className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-lg p-4 hover:border-purple-400/50 transition-colors"
                    >
                      <div className="flex flex-col items-center text-center">
                        <span className="text-4xl mb-2">{person.avatar}</span>
                        <p className="font-semibold text-sm text-white mb-1">{person.name}</p>
                        <p className="text-xs text-gray-400 mb-3">{person.username}</p>
                        {!friends.find(f => f.id === person.id) && person.id !== currentUser.id ? (
                          <Button
                            size="sm"
                            className="w-full bg-purple-600 hover:bg-purple-500 text-white text-xs"
                            onClick={() => handleAddFriend(person.id)}
                          >
                            <UserPlus className="w-3 h-3 mr-1" />
                            Add Friend
                          </Button>
                        ) : friends.find(f => f.id === person.id) ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full text-xs"
                            disabled
                          >
                            <UserCheck className="w-3 h-3 mr-1" />
                            Friends
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" className="w-full text-xs" disabled>
                            You
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Posts Results */}
            {searchResults.posts.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-purple-300 mb-3 uppercase">Posts</h2>
                <div className="space-y-4">
                  {searchResults.posts.map(post => (
                    <div
                      key={post.id}
                      className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-lg p-4 hover:border-purple-400/50 transition-colors"
                    >
                      {/* Post Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{post.userAvatar}</span>
                          <div>
                            <p className="font-semibold text-sm text-white">{post.userName}</p>
                            <p className="text-xs text-gray-400">{formatTime(post.timestamp)}</p>
                          </div>
                        </div>
                        {post.userId === currentUser.id && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-gray-400 hover:text-red-400"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>

                      {/* Post Content */}
                      <p className="text-sm text-gray-100 mb-4">{post.content}</p>

                      {/* Post Actions */}
                      <div className="flex gap-4 text-xs text-gray-400 border-t border-purple-500/20 pt-3">
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className="flex items-center gap-1 hover:text-pink-400 transition-colors"
                        >
                          <Heart
                            className={`w-4 h-4 ${post.liked ? 'fill-pink-500 text-pink-500' : ''}`}
                          />
                          {post.likes}
                        </button>
                        <button
                          onClick={() => setCommentingOn(post.id)}
                          className="flex items-center gap-1 hover:text-blue-400 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          {post.comments.length}
                        </button>
                        <button className="flex items-center gap-1 hover:text-green-400 transition-colors">
                          <Share2 className="w-4 h-4" />
                          Share
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {searchResults.people.length === 0 && searchResults.posts.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg">No results found</p>
                <p className="text-sm">Try searching for different keywords</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Create Post Form */}
            {showPostForm && (
              <div className="border-b border-purple-500/30 p-4 bg-slate-900/50 space-y-3">
                <textarea
                  placeholder="What's on your mind?"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-purple-500/30 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={4}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleCreatePost}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold"
                  >
                    Post
                  </Button>
                  <Button
                    onClick={() => {
                      setShowPostForm(false);
                      setNewPostContent('');
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Create Post Button */}
            {!showPostForm && (
              <div className="border-b border-purple-500/30 p-4 bg-slate-900/50">
                <Button
                  onClick={() => setShowPostForm(true)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
              </div>
            )}

            {/* Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {posts.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-lg">No posts yet</p>
                  <p className="text-sm">Be the first to share something!</p>
                </div>
              ) : (
                posts.map(post => (
                  <div
                    key={post.id}
                    className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-lg p-4 hover:border-purple-400/50 transition-colors"
                  >
                    {/* Post Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{post.userAvatar}</span>
                        <div>
                          <p className="font-semibold text-sm text-white">{post.userName}</p>
                          <p className="text-xs text-gray-400">{formatTime(post.timestamp)}</p>
                        </div>
                      </div>
                      {post.userId === currentUser.id && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-gray-400 hover:text-red-400"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>

                    {/* Post Content */}
                    <p className="text-sm text-gray-100 mb-4">{post.content}</p>

                    {/* Post Actions */}
                    <div className="flex gap-4 mb-4 text-xs text-gray-400 border-t border-purple-500/20 pt-3">
                      <button
                        onClick={() => handleLikePost(post.id)}
                        className="flex items-center gap-1 hover:text-pink-400 transition-colors"
                      >
                        <Heart
                          className={`w-4 h-4 ${post.liked ? 'fill-pink-500 text-pink-500' : ''}`}
                        />
                        {post.likes}
                      </button>
                      <button
                        onClick={() => setCommentingOn(post.id)}
                        className="flex items-center gap-1 hover:text-blue-400 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        {post.comments.length}
                      </button>
                      <button className="flex items-center gap-1 hover:text-green-400 transition-colors">
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                    </div>

                    {/* Comments */}
                    {post.comments.length > 0 && (
                      <div className="space-y-2 mb-3 border-t border-purple-500/20 pt-3">
                        {post.comments.map(comment => (
                          <div key={comment.id} className="flex gap-2 text-xs">
                            <span className="text-lg flex-shrink-0">{comment.userAvatar}</span>
                            <div className="flex-1 bg-slate-700/50 rounded p-2">
                              <p className="font-semibold text-white">{comment.userName}</p>
                              <p className="text-gray-300">{comment.text}</p>
                              <p className="text-gray-500 text-xs mt-1">{formatTime(comment.timestamp)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Comment Form */}
                    {commentingOn === post.id && (
                      <div className="flex gap-2 border-t border-purple-500/20 pt-3">
                        <span className="text-xl flex-shrink-0">{currentUser.avatar}</span>
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                            className="flex-1 px-3 py-1 bg-slate-700 border border-purple-500/30 rounded text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            autoFocus
                          />
                          <Button
                            onClick={() => handleAddComment(post.id)}
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-500 text-white text-xs"
                          >
                            Post
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
