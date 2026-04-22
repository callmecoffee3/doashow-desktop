import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Play, Pause, Volume2, VolumeX, Maximize, Download, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  uploadedDate: string;
  views: number;
  likes: number;
  thumbnail: string;
  url: string;
  liked: boolean;
}

export default function VideosApp() {
  const [videos, setVideos] = useState<Video[]>([
    {
      id: '1',
      title: 'Welcome to DoaShow',
      description: 'Introduction to DoaShow and its features',
      duration: '5:32',
      uploadedDate: '2024-01-15',
      views: 1250,
      likes: 89,
      thumbnail: '🎬',
      url: 'https://example.com/video1.mp4',
      liked: false,
    },
    {
      id: '2',
      title: 'Getting Started Tutorial',
      description: 'Learn how to use DoaShow step by step',
      duration: '12:45',
      uploadedDate: '2024-01-14',
      views: 856,
      likes: 62,
      thumbnail: '🎥',
      url: 'https://example.com/video2.mp4',
      liked: false,
    },
    {
      id: '3',
      title: 'Advanced Features Guide',
      description: 'Explore advanced features and tips',
      duration: '18:20',
      uploadedDate: '2024-01-13',
      views: 543,
      likes: 41,
      thumbnail: '📹',
      url: 'https://example.com/video3.mp4',
      liked: false,
    },
  ]);

  const [selectedVideoId, setSelectedVideoId] = useState<string>('1');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const videoRef = useRef<HTMLVideoElement>(null);

  const selectedVideo = videos.find(v => v.id === selectedVideoId);

  useEffect(() => {
    localStorage.setItem('doashow_videos', JSON.stringify(videos));
  }, [videos]);

  const deleteVideo = (id: string) => {
    const updated = videos.filter(v => v.id !== id);
    setVideos(updated);
    if (selectedVideoId === id) {
      setSelectedVideoId(updated[0]?.id || '');
    }
  };

  const toggleLike = (id: string) => {
    const updated = videos.map(v => {
      if (v.id === id) {
        return {
          ...v,
          liked: !v.liked,
          likes: v.liked ? v.likes - 1 : v.likes + 1,
        };
      }
      return v;
    });
    setVideos(updated);
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
    }
  };

  return (
    <div className="flex h-full bg-background">
      {/* Video Player */}
      <div className="flex-1 flex flex-col">
        {selectedVideo ? (
          <>
            {/* Player Area */}
            <div className="bg-black flex-1 flex items-center justify-center relative group">
              <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center relative">
                {/* Thumbnail Placeholder */}
                <div className="text-6xl">{selectedVideo.thumbnail}</div>

                {/* Player Controls */}
                <div className="absolute inset-0 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <div className="p-4">
                    <h2 className="text-xl font-bold text-white">{selectedVideo.title}</h2>
                  </div>

                  <div className="p-4 space-y-3">
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-600 h-1 rounded-full cursor-pointer hover:h-2 transition-all">
                      <div className="bg-accent h-full rounded-full" style={{ width: '35%' }}></div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={togglePlayPause}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-white/20"
                        >
                          {isPlaying ? (
                            <Pause className="w-4 h-4 text-white" />
                          ) : (
                            <Play className="w-4 h-4 text-white" />
                          )}
                        </Button>

                        <Button
                          onClick={toggleMute}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-white/20"
                        >
                          {isMuted ? (
                            <VolumeX className="w-4 h-4 text-white" />
                          ) : (
                            <Volume2 className="w-4 h-4 text-white" />
                          )}
                        </Button>

                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="w-20 h-1 bg-gray-600 rounded-full cursor-pointer"
                        />

                        <span className="text-xs text-white">{selectedVideo.duration}</span>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-white/20"
                      >
                        <Maximize className="w-4 h-4 text-white" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="border-b border-border p-4 bg-card">
              <h2 className="text-2xl font-bold">{selectedVideo.title}</h2>
              <p className="text-sm text-foreground/60 mt-2">{selectedVideo.description}</p>
              <div className="flex items-center gap-6 mt-3 text-sm text-foreground/60">
                <span>{selectedVideo.views.toLocaleString()} views</span>
                <span>Uploaded {selectedVideo.uploadedDate}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-b border-border p-4 bg-secondary flex gap-2">
              <Button
                onClick={() => toggleLike(selectedVideo.id)}
                variant={selectedVideo.liked ? 'default' : 'outline'}
                className="gap-2"
              >
                <Heart className={`w-4 h-4 ${selectedVideo.liked ? 'fill-current' : ''}`} />
                {selectedVideo.likes}
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button
                onClick={() => deleteVideo(selectedVideo.id)}
                variant="destructive"
                className="gap-2 ml-auto"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-foreground/50">
            <p>Select a video to play</p>
          </div>
        )}
      </div>

      {/* Playlist Sidebar */}
      <div className="w-80 border-l border-border bg-secondary flex flex-col">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-bold">Playlist</h3>
          <p className="text-xs text-foreground/60 mt-1">{videos.length} videos</p>
        </div>

        {/* Videos List */}
        <div className="flex-1 overflow-y-auto">
          {videos.map(video => (
            <button
              key={video.id}
              onClick={() => setSelectedVideoId(video.id)}
              className={`w-full text-left px-3 py-2 border-b border-border transition-colors hover:bg-accent/10 ${
                selectedVideoId === video.id ? 'bg-accent/20' : ''
              }`}
            >
              <div className="flex gap-3">
                <div className="text-3xl flex-shrink-0">{video.thumbnail}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">{video.title}</h4>
                  <p className="text-xs text-foreground/60 mt-1">{video.duration}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-foreground/50">
                    <span>{video.views.toLocaleString()} views</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {video.likes}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteVideo(video.id);
                  }}
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 hover:opacity-100 transition-opacity flex-shrink-0"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
