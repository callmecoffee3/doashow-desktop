import { useState } from 'react';
import { Heart, MessageCircle, Share2, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  liked: boolean;
}

export default function FacebookApp() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'Sarah Johnson',
      avatar: '👩',
      content: 'Just finished an amazing project! Feeling accomplished 🎉',
      timestamp: '2 hours ago',
      likes: 234,
      comments: 45,
      liked: false,
    },
    {
      id: '2',
      author: 'Tech News Daily',
      avatar: '📱',
      content: 'Breaking: New AI breakthrough announced today. Read more in our article...',
      timestamp: '4 hours ago',
      likes: 1203,
      comments: 287,
      liked: false,
    },
    {
      id: '3',
      author: 'John Smith',
      avatar: '👨',
      content: 'Beautiful sunset at the beach today! Nature is amazing ✨',
      timestamp: '6 hours ago',
      likes: 567,
      comments: 89,
      liked: false,
    },
  ]);

  const [newPost, setNewPost] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLike = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      const post: Post = {
        id: Date.now().toString(),
        author: 'You',
        avatar: '🧑',
        content: newPost,
        timestamp: 'now',
        likes: 0,
        comments: 0,
        liked: false,
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  const filteredPosts = posts.filter(post =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 bg-card space-y-3">
        <h2 className="text-lg font-bold text-blue-600">f Facebook</h2>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
          <input
            type="text"
            placeholder="Search posts and people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Create Post */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex gap-3 mb-3">
            <div className="text-2xl">🧑</div>
            <input
              type="text"
              placeholder="What's on your mind?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="flex-1 bg-background border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm">
              📷 Photo
            </Button>
            <Button
              onClick={handlePostSubmit}
              disabled={!newPost.trim()}
              className="bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              Post
            </Button>
          </div>
        </div>

        {/* Posts Feed */}
        {filteredPosts.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-foreground/60">
            <p>No posts found</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id} className="bg-card border border-border rounded-lg p-4 space-y-3">
              {/* Post Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-2xl">{post.avatar}</div>
                  <div>
                    <p className="font-semibold text-sm">{post.author}</p>
                    <p className="text-xs text-foreground/60">{post.timestamp}</p>
                  </div>
                </div>
                <button className="text-foreground/60 hover:text-foreground">⋯</button>
              </div>

              {/* Post Content */}
              <p className="text-sm">{post.content}</p>

              {/* Post Stats */}
              <div className="flex justify-between text-xs text-foreground/60 border-y border-border py-2">
                <span>👍 {post.likes} Likes</span>
                <span>💬 {post.comments} Comments</span>
              </div>

              {/* Post Actions */}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(post.id)}
                  className={`flex-1 ${post.liked ? 'text-blue-600' : ''}`}
                >
                  <Heart className={`w-4 h-4 mr-2 ${post.liked ? 'fill-current' : ''}`} />
                  Like
                </Button>
                <Button variant="ghost" size="sm" className="flex-1">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Comment
                </Button>
                <Button variant="ghost" size="sm" className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
