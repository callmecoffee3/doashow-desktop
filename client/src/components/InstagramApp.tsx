import { useState } from 'react';
import { Heart, MessageCircle, Send, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Post {
  id: string;
  author: string;
  avatar: string;
  image: string;
  caption: string;
  timestamp: string;
  likes: number;
  comments: number;
  liked: boolean;
}

export default function InstagramApp() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'travel_vibes',
      avatar: '✈️',
      image: '🏖️',
      caption: 'Paradise found! 🌴✨ #travel #beach #wanderlust',
      timestamp: '2 hours ago',
      likes: 1234,
      comments: 89,
      liked: false,
    },
    {
      id: '2',
      author: 'food_lover_daily',
      avatar: '👨‍🍳',
      image: '🍕',
      caption: 'Fresh homemade pizza night! 🍕😋 #foodie #homemade',
      timestamp: '4 hours ago',
      likes: 2456,
      comments: 234,
      liked: false,
    },
    {
      id: '3',
      author: 'fitness_journey',
      avatar: '💪',
      image: '🏋️',
      caption: 'Gym day! Crushing those goals 💯 #fitness #motivation',
      timestamp: '6 hours ago',
      likes: 3421,
      comments: 567,
      liked: false,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const handleLike = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const filteredPosts = posts.filter(post =>
    post.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-purple-900 via-pink-800 to-red-700">
      {/* Header */}
      <div className="border-b border-pink-500/30 p-4 bg-black/40 backdrop-blur space-y-3">
        <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
          📷 Instagram
        </h2>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-white/10 border border-white/20 rounded-md text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-white/60">
            <p>No posts found</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id} className="bg-black/40 border border-pink-500/30 rounded-lg overflow-hidden backdrop-blur">
              {/* Post Header */}
              <div className="p-3 flex items-center justify-between border-b border-pink-500/20">
                <div className="flex items-center gap-2">
                  <div className="text-2xl">{post.avatar}</div>
                  <div>
                    <p className="font-semibold text-sm text-white">{post.author}</p>
                    <p className="text-xs text-white/60">{post.timestamp}</p>
                  </div>
                </div>
                <button className="text-white/60 hover:text-white">⋯</button>
              </div>

              {/* Post Image */}
              <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-12 text-6xl flex items-center justify-center">
                {post.image}
              </div>

              {/* Post Actions */}
              <div className="p-3 space-y-3 border-b border-pink-500/20">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    className="text-white hover:text-pink-400"
                  >
                    <Heart className={`w-5 h-5 ${post.liked ? 'fill-pink-500 text-pink-500' : ''}`} />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white hover:text-pink-400">
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white hover:text-pink-400">
                    <Send className="w-5 h-5" />
                  </Button>
                </div>

                {/* Likes and Caption */}
                <div className="text-sm text-white">
                  <p className="font-semibold">{post.likes} likes</p>
                  <p className="text-white/80">
                    <span className="font-semibold">{post.author}</span> {post.caption}
                  </p>
                  <p className="text-white/60 text-xs mt-1">View all {post.comments} comments</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
