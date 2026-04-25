import { useState } from 'react';
import { Play, ThumbsUp, MessageCircle, Share2, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Video {
  id: string;
  title: string;
  channel: string;
  avatar: string;
  thumbnail: string;
  views: string;
  likes: number;
  comments: number;
  duration: string;
  timestamp: string;
}

export default function YouTubeApp() {
  const [videos, setVideos] = useState<Video[]>([
    {
      id: '1',
      title: 'Building Amazing React Apps - Full Tutorial',
      channel: 'Code Academy',
      avatar: '👨‍🏫',
      thumbnail: '🎬',
      views: '234K',
      likes: 5234,
      comments: 456,
      duration: '45:32',
      timestamp: '2 days ago',
    },
    {
      id: '2',
      title: 'Web Design Trends 2026',
      channel: 'Design Masters',
      avatar: '🎨',
      thumbnail: '🖌️',
      views: '567K',
      likes: 12340,
      comments: 1203,
      duration: '28:15',
      timestamp: '1 week ago',
    },
    {
      id: '3',
      title: 'AI and Machine Learning Explained',
      channel: 'Tech Explained',
      avatar: '🤖',
      thumbnail: '🧠',
      views: '1.2M',
      likes: 34567,
      comments: 3421,
      duration: '52:44',
      timestamp: '3 days ago',
    },
    {
      id: '4',
      title: 'Productivity Tips for Developers',
      channel: 'Dev Life',
      avatar: '👨‍💻',
      thumbnail: '⚡',
      views: '89K',
      likes: 2345,
      comments: 234,
      duration: '18:30',
      timestamp: '5 days ago',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.channel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 bg-card space-y-3">
        <h2 className="text-lg font-bold text-red-600">▶ YouTube</h2>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
          <input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
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

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {selectedVideo ? (
          // Video Player View
          <div className="space-y-4">
            {/* Video Player */}
            <div className="bg-black rounded-lg p-12 text-6xl flex items-center justify-center aspect-video">
              {selectedVideo.thumbnail}
            </div>

            {/* Video Info */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold">{selectedVideo.title}</h2>

              {/* Channel Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{selectedVideo.avatar}</div>
                  <div>
                    <p className="font-semibold">{selectedVideo.channel}</p>
                    <p className="text-sm text-foreground/60">{selectedVideo.views} views</p>
                  </div>
                </div>
                <Button className="bg-red-600 hover:bg-red-700 rounded-full">
                  Subscribe
                </Button>
              </div>

              {/* Stats */}
              <div className="flex gap-4 text-sm border-b border-border pb-4">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{selectedVideo.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{selectedVideo.comments}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-sm text-foreground/80">
                  This is an amazing video about {selectedVideo.title.toLowerCase()}. Watch till the end for the bonus content!
                </p>
              </div>

              {/* Back Button */}
              <Button
                variant="outline"
                onClick={() => setSelectedVideo(null)}
              >
                ← Back to Videos
              </Button>
            </div>
          </div>
        ) : (
          // Videos Grid
          <>
            {filteredVideos.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-foreground/60">
                <p>No videos found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVideos.map(video => (
                  <div
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    className="cursor-pointer group space-y-2"
                  >
                    {/* Thumbnail */}
                    <div className="bg-black rounded-lg p-12 text-5xl flex items-center justify-center aspect-video group-hover:opacity-80 transition-opacity relative">
                      {video.thumbnail}
                      <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
                        {video.duration}
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="space-y-1">
                      <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-accent">
                        {video.title}
                      </h3>
                      <p className="text-xs text-foreground/60">{video.channel}</p>
                      <p className="text-xs text-foreground/60">
                        {video.views} views · {video.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
