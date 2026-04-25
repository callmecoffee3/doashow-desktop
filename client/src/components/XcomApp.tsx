import { useState } from 'react';
import { Heart, MessageCircle, Repeat2, Share, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Tweet {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  retweets: number;
  replies: number;
  liked: boolean;
}

export default function XcomApp() {
  const [tweets, setTweets] = useState<Tweet[]>([
    {
      id: '1',
      author: 'Tech News',
      handle: '@technewsdaily',
      avatar: '📱',
      content: 'Breaking: New AI model shows promising results in medical diagnosis. This could revolutionize healthcare! 🔬',
      timestamp: '2h',
      likes: 5234,
      retweets: 1203,
      replies: 456,
      liked: false,
    },
    {
      id: '2',
      author: 'Code Master',
      handle: '@codemaster',
      avatar: '👨‍💻',
      content: 'Just deployed a new feature that took 3 weeks to build. Feels good! 🚀',
      timestamp: '4h',
      likes: 234,
      retweets: 89,
      replies: 34,
      liked: false,
    },
    {
      id: '3',
      author: 'Design Daily',
      handle: '@designdaily',
      avatar: '🎨',
      content: 'Design tip: Always test your UI with real users. You\'ll be surprised what you learn! 💡',
      timestamp: '6h',
      likes: 1203,
      retweets: 567,
      replies: 234,
      liked: false,
    },
  ]);

  const [newTweet, setNewTweet] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLike = (tweetId: string) => {
    setTweets(tweets.map(tweet =>
      tweet.id === tweetId
        ? { ...tweet, liked: !tweet.liked, likes: tweet.liked ? tweet.likes - 1 : tweet.likes + 1 }
        : tweet
    ));
  };

  const handleTweetSubmit = () => {
    if (newTweet.trim()) {
      const tweet: Tweet = {
        id: Date.now().toString(),
        author: 'You',
        handle: '@yourhandle',
        avatar: '🧑',
        content: newTweet,
        timestamp: 'now',
        likes: 0,
        retweets: 0,
        replies: 0,
        liked: false,
      };
      setTweets([tweet, ...tweets]);
      setNewTweet('');
    }
  };

  const filteredTweets = tweets.filter(tweet =>
    tweet.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tweet.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 bg-card space-y-3">
        <h2 className="text-lg font-bold">𝕏 X</h2>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-accent"
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
      <div className="flex-1 overflow-y-auto">
        {/* Compose Tweet */}
        <div className="border-b border-border p-4 space-y-3">
          <div className="flex gap-4">
            <div className="text-2xl">🧑</div>
            <div className="flex-1">
              <textarea
                placeholder="What's happening?!"
                value={newTweet}
                onChange={(e) => setNewTweet(e.target.value)}
                className="w-full bg-transparent text-xl focus:outline-none resize-none"
                rows={3}
              />
              <div className="flex justify-end mt-4">
                <Button
                  onClick={handleTweetSubmit}
                  disabled={!newTweet.trim()}
                  className="rounded-full px-6 bg-accent hover:bg-accent/90"
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tweets Feed */}
        {filteredTweets.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-foreground/60">
            <p>No posts found</p>
          </div>
        ) : (
          filteredTweets.map(tweet => (
            <div
              key={tweet.id}
              className="border-b border-border p-4 hover:bg-foreground/5 transition-colors cursor-pointer space-y-3"
            >
              {/* Tweet Header */}
              <div className="flex gap-3">
                <div className="text-2xl">{tweet.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <p className="font-bold">{tweet.author}</p>
                    <p className="text-foreground/60">{tweet.handle}</p>
                    <p className="text-foreground/60">·</p>
                    <p className="text-foreground/60">{tweet.timestamp}</p>
                  </div>

                  {/* Tweet Content */}
                  <p className="mt-2 text-base">{tweet.content}</p>

                  {/* Tweet Actions */}
                  <div className="flex justify-between mt-3 text-foreground/60 max-w-xs text-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:text-blue-500"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {tweet.replies}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:text-green-500"
                    >
                      <Repeat2 className="w-4 h-4 mr-2" />
                      {tweet.retweets}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(tweet.id)}
                      className={`${tweet.liked ? 'text-red-500' : 'hover:text-red-500'}`}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${tweet.liked ? 'fill-current' : ''}`} />
                      {tweet.likes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:text-blue-500"
                    >
                      <Share className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
