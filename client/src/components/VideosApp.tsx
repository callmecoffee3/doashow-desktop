import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Play, Pause, Volume2, VolumeX, Maximize, Download, Heart, Upload, X } from 'lucide-react';
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
  uploader: string;
}

export default function VideosApp() {
  const [myVideos, setMyVideos] = useState<Video[]>([
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
      uploader: 'You',
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
      uploader: 'You',
    },
  ]);

  const [allVideos, setAllVideos] = useState<Video[]>([
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
      uploader: 'John Doe',
    },
    {
      id: '4',
      title: 'Community Highlights',
      description: 'Best moments from our community',
      duration: '8:15',
      uploadedDate: '2024-01-12',
      views: 721,
      likes: 156,
      thumbnail: '🎞️',
      url: 'https://example.com/video4.mp4',
      liked: false,
      uploader: 'Admin',
    },
  ]);

  const [selectedVideoId, setSelectedVideoId] = useState<string>('1');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newVideoData, setNewVideoData] = useState({
    title: '',
    description: '',
    duration: '0:00',
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedVideo = myVideos.find(v => v.id === selectedVideoId) || allVideos.find(v => v.id === selectedVideoId);
  const allVideosList = [...myVideos, ...allVideos];

  useEffect(() => {
    localStorage.setItem('doashow_my_videos', JSON.stringify(myVideos));
    localStorage.setItem('doashow_all_videos', JSON.stringify(allVideos));
  }, [myVideos, allVideos]);

  const uploadVideo = () => {
    if (!newVideoData.title.trim()) return;

    const newVideo: Video = {
      id: Date.now().toString(),
      title: newVideoData.title,
      description: newVideoData.description,
      duration: newVideoData.duration,
      uploadedDate: new Date().toISOString().split('T')[0],
      views: 0,
      likes: 0,
      thumbnail: '🎬',
      url: 'https://example.com/video-' + Date.now() + '.mp4',
      liked: false,
      uploader: 'You',
    };

    setMyVideos([...myVideos, newVideo]);
    setSelectedVideoId(newVideo.id);
    setNewVideoData({ title: '', description: '', duration: '0:00' });
    setShowUploadForm(false);
  };

  const deleteVideo = (id: string) => {
    const updated = myVideos.filter(v => v.id !== id);
    setMyVideos(updated);
    if (selectedVideoId === id) {
      setSelectedVideoId(updated[0]?.id || allVideos[0]?.id || '');
    }
  };

  const toggleLike = (id: string) => {
    const updateVideos = (videos: Video[]) =>
      videos.map(v => {
        if (v.id === id) {
          return {
            ...v,
            liked: !v.liked,
            likes: v.liked ? v.likes - 1 : v.likes + 1,
          };
        }
        return v;
      });

    const myVideoIndex = myVideos.findIndex(v => v.id === id);
    if (myVideoIndex !== -1) {
      setMyVideos(updateVideos(myVideos));
    } else {
      setAllVideos(updateVideos(allVideos));
    }
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const duration = '0:00';
      setNewVideoData({ ...newVideoData, duration });
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
                <span>By {selectedVideo.uploader}</span>
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
              {selectedVideo.uploader === 'You' && (
                <Button
                  onClick={() => deleteVideo(selectedVideo.id)}
                  variant="destructive"
                  className="gap-2 ml-auto"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-foreground/50">
            <p>Select a video to play</p>
          </div>
        )}
      </div>

      {/* Playlist Sidebar */}
      <div className="w-96 border-l border-border bg-secondary flex flex-col">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-bold mb-3">Videos</h3>
          <Button onClick={() => setShowUploadForm(true)} className="w-full gap-2">
            <Upload className="w-4 h-4" />
            Upload Video
          </Button>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <div className="p-4 border-b border-border space-y-2">
            <input
              type="text"
              placeholder="Video title"
              value={newVideoData.title}
              onChange={(e) => setNewVideoData({ ...newVideoData, title: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
            />
            <textarea
              placeholder="Video description"
              value={newVideoData.description}
              onChange={(e) => setNewVideoData({ ...newVideoData, description: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm h-16 resize-none"
            />
            <input
              type="text"
              placeholder="Duration (e.g., 5:32)"
              value={newVideoData.duration}
              onChange={(e) => setNewVideoData({ ...newVideoData, duration: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
            />
            <div className="flex gap-2">
              <Button onClick={uploadVideo} size="sm" className="flex-1">
                Upload
              </Button>
              <Button onClick={() => setShowUploadForm(false)} variant="outline" size="sm" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Videos List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <p className="text-xs font-semibold text-foreground/60 px-2 py-1">My Videos</p>
            {myVideos.map(video => (
              <button
                key={video.id}
                onClick={() => setSelectedVideoId(video.id)}
                className={`w-full text-left px-3 py-2 rounded transition-colors hover:bg-accent/10 ${
                  selectedVideoId === video.id ? 'bg-accent/20' : ''
                }`}
              >
                <div className="flex gap-3">
                  <div className="text-2xl flex-shrink-0">{video.thumbnail}</div>
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
                  {video.uploader === 'You' && (
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
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="p-2 border-t border-border">
            <p className="text-xs font-semibold text-foreground/60 px-2 py-1">Other Videos</p>
            {allVideos.map(video => (
              <button
                key={video.id}
                onClick={() => setSelectedVideoId(video.id)}
                className={`w-full text-left px-3 py-2 rounded transition-colors hover:bg-accent/10 ${
                  selectedVideoId === video.id ? 'bg-accent/20' : ''
                }`}
              >
                <div className="flex gap-3">
                  <div className="text-2xl flex-shrink-0">{video.thumbnail}</div>
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
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
