import { useState } from 'react';
import { Heart, MessageCircle, Share2, Music, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Video {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  content: string;
  music: string;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
}

export default function TikTokApp() {
  const [videos, setVideos] = useState<Video[]>([
    {
      id: '1',
      author: 'Dance Master',
      handle: '@dancemaster',
      avatar: '💃',
      content: '🎵 New choreography',
      music: 'Trending Song #1',
      likes: 234567,
      comments: 12345,
      shares: 5678,
      liked: false,
    },
    {
      id: '2',
      author: 'Comedy King',
      handle: '@comedyking',
      avatar: '🤣',
      content: '😂 Funny moments',
      music: 'Funny Sound',
      likes: 567890,
      comments: 34567,
      shares: 12345,
      liked: false,
    },
    {
      id: '3',
      author: 'Fitness Pro',
      handle: '@fitnessguru',
      avatar: '💪',
      content: '🏋️ Workout challenge',
      music: 'Motivation Song',
      likes: 345678,
      comments: 23456,
      shares: 8901,
      liked: false,
    },
    {
      id: '4',
      author: 'Food Vlogger',
      handle: '@foodvlog',
      avatar: '🍕',
      content: '🍔 Food review',
      music: 'Tasty Sound',
      likes: 456789,
      comments: 34567,
      shares: 9012,
      liked: false,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handleLike = (videoId: string) => {
    setVideos(videos.map(video =>
      video.id === videoId
        ? { ...video, liked: !video.liked, likes: video.liked ? video.likes - 1 : video.likes + 1 }
        : video
    ));
  };

  const handleNextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
  };

  const handlePrevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const filteredVideos = videos.filter(video =>
    video.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayVideos = searchQuery ? filteredVideos : videos;
  const currentVideo = displayVideos[currentVideoIndex] || displayVideos[0];

  return (
    <div className="w-full h-full flex flex-col bg-black">
      {/* Header */}
      <div className="border-b border-white/10 p-4 bg-black space-y-3">
        <h2 className="text-lg font-bold text-white">♪ TikTok</h2>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            placeholder="Search creators..."
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

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex items-center justify-center p-4">
        {displayVideos.length === 0 ? (
          <div className="text-center text-white/60">
            <p>No videos found</p>
          </div>
        ) : (
          <div className="w-full max-w-sm h-full flex flex-col">
            {/* Video Container */}
            <div className="flex-1 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl overflow-hidden relative flex flex-col justify-between p-6">
              {/* Video Content */}
              <div className="text-center">
                <div className="text-7xl mb-4">{currentVideo.content.split(' ')[0]}</div>
                <p className="text-white text-2xl font-bold">{currentVideo.content}</p>
              </div>

              {/* Music Info */}
              <div className="flex items-center gap-2 bg-black/40 rounded-lg p-3 backdrop-blur">
                <Music className="w-4 h-4 text-white" />
                <p className="text-sm text-white truncate">{currentVideo.music}</p>
              </div>

              {/* Right Side Actions */}
              <div className="absolute right-4 bottom-20 flex flex-col gap-4">
                {/* Like Button */}
                <button
                  onClick={() => handleLike(currentVideo.id)}
                  className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform"
                >
                  <Heart
                    className={`w-6 h-6 ${currentVideo.liked ? 'fill-red-500 text-red-500' : ''}`}
                  />
                  <span className="text-xs">{currentVideo.likes}</span>
                </button>

                {/* Comment Button */}
                <button className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6" />
                  <span className="text-xs">{currentVideo.comments}</span>
                </button>

                {/* Share Button */}
                <button className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform">
                  <Share2 className="w-6 h-6" />
                  <span className="text-xs">{currentVideo.shares}</span>
                </button>
              </div>

              {/* Bottom - Creator Info */}
              <div className="flex items-center gap-3 bg-black/40 rounded-lg p-3 backdrop-blur">
                <div className="text-2xl">{currentVideo.avatar}</div>
                <div>
                  <p className="text-white font-semibold text-sm">{currentVideo.author}</p>
                  <p className="text-white/60 text-xs">{currentVideo.handle}</p>
                </div>
                <Button size="sm" className="ml-auto bg-pink-600 hover:bg-pink-700 rounded-full">
                  Follow
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-2 mt-4 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevVideo}
                className="text-white border-white/20"
              >
                ← Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextVideo}
                className="text-white border-white/20"
              >
                Next →
              </Button>
            </div>

            {/* Video Counter */}
            <p className="text-center text-white/60 text-sm mt-2">
              {currentVideoIndex + 1} / {displayVideos.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
