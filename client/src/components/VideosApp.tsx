import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Play, Pause, Volume2, VolumeX, Maximize, Download, Heart, Upload, X, Edit2, Save, Users, Settings, ChevronDown, ChevronRight, Folder } from 'lucide-react';
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
  channelId: string;
  subChannelId?: string;
}

interface SubChannel {
  id: string;
  name: string;
  description: string;
  createdDate: string;
  videoCount: number;
}

interface Channel {
  id: string;
  name: string;
  description: string;
  subscribers: number;
  createdDate: string;
  owner: string;
  banner: string;
  subChannels: SubChannel[];
}

export default function VideosApp() {
  const [myChannels, setMyChannels] = useState<Channel[]>([
    {
      id: '1',
      name: 'My Channel',
      description: 'Welcome to my channel! Here I share tutorials and guides.',
      subscribers: 1250,
      createdDate: '2024-01-01',
      owner: 'You',
      banner: '🎬',
      subChannels: [
        {
          id: 'sub1',
          name: 'Tutorials',
          description: 'Step-by-step tutorials',
          createdDate: '2024-01-05',
          videoCount: 2,
        },
        {
          id: 'sub2',
          name: 'Reviews',
          description: 'Product and service reviews',
          createdDate: '2024-01-10',
          videoCount: 0,
        },
      ],
    },
  ]);

  const [allChannels, setAllChannels] = useState<Channel[]>([
    {
      id: '2',
      name: 'Tech Tips & Tricks',
      description: 'Daily tech tips and productivity hacks',
      subscribers: 5420,
      createdDate: '2024-01-05',
      owner: 'John Doe',
      banner: '💻',
      subChannels: [
        {
          id: 'sub3',
          name: 'Software',
          description: 'Software tips and tricks',
          createdDate: '2024-01-06',
          videoCount: 1,
        },
      ],
    },
  ]);

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
      channelId: '1',
      subChannelId: 'sub1',
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
      channelId: '1',
      subChannelId: 'sub1',
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
      channelId: '2',
      subChannelId: 'sub3',
    },
  ]);

  const [selectedVideoId, setSelectedVideoId] = useState<string>('1');
  const [selectedChannelId, setSelectedChannelId] = useState<string>('1');
  const [selectedSubChannelId, setSelectedSubChannelId] = useState<string | null>('sub1');
  const [viewMode, setViewMode] = useState<string>('videos');
  const [expandedChannels, setExpandedChannels] = useState<Set<string>>(new Set(['1']));
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showChannelForm, setShowChannelForm] = useState(false);
  const [showSubChannelForm, setShowSubChannelForm] = useState(false);
  const [newVideoData, setNewVideoData] = useState({
    title: '',
    description: '',
    duration: '0:00',
  });
  const [newChannelData, setNewChannelData] = useState({
    name: '',
    description: '',
  });
  const [newSubChannelData, setNewSubChannelData] = useState({
    name: '',
    description: '',
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedVideo = myVideos.find(v => v.id === selectedVideoId) || allVideos.find(v => v.id === selectedVideoId);
  const selectedChannel = myChannels.find(c => c.id === selectedChannelId) || allChannels.find(c => c.id === selectedChannelId);
  const selectedSubChannel = selectedChannel?.subChannels.find(sc => sc.id === selectedSubChannelId);
  
  const channelVideos = [...myVideos, ...allVideos].filter(v => 
    v.channelId === selectedChannelId && 
    (selectedSubChannelId ? v.subChannelId === selectedSubChannelId : !v.subChannelId)
  );

  useEffect(() => {
    localStorage.setItem('doashow_my_videos', JSON.stringify(myVideos));
    localStorage.setItem('doashow_all_videos', JSON.stringify(allVideos));
    localStorage.setItem('doashow_my_channels', JSON.stringify(myChannels));
    localStorage.setItem('doashow_all_channels', JSON.stringify(allChannels));
  }, [myVideos, allVideos, myChannels, allChannels]);

  const toggleChannelExpand = (channelId: string) => {
    const newExpanded = new Set(expandedChannels);
    if (newExpanded.has(channelId)) {
      newExpanded.delete(channelId);
    } else {
      newExpanded.add(channelId);
    }
    setExpandedChannels(newExpanded);
  };

  const createChannel = () => {
    if (!newChannelData.name.trim()) return;

    const newChannel: Channel = {
      id: Date.now().toString(),
      name: newChannelData.name,
      description: newChannelData.description,
      subscribers: 0,
      createdDate: new Date().toISOString().split('T')[0],
      owner: 'You',
      banner: '🎬',
      subChannels: [],
    };

    setMyChannels([...myChannels, newChannel]);
    setSelectedChannelId(newChannel.id);
    setSelectedSubChannelId(null);
    setNewChannelData({ name: '', description: '' });
    setShowChannelForm(false);
  };

  const createSubChannel = () => {
    if (!newSubChannelData.name.trim() || !selectedChannelId) return;

    const updated = myChannels.map(c => {
      if (c.id === selectedChannelId) {
        const newSubChannel: SubChannel = {
          id: Date.now().toString(),
          name: newSubChannelData.name,
          description: newSubChannelData.description,
          createdDate: new Date().toISOString().split('T')[0],
          videoCount: 0,
        };
        return {
          ...c,
          subChannels: [...c.subChannels, newSubChannel],
        };
      }
      return c;
    });

    setMyChannels(updated);
    const newSubChannel = updated.find(c => c.id === selectedChannelId)?.subChannels.at(-1);
    if (newSubChannel) {
      setSelectedSubChannelId(newSubChannel.id);
    }
    setNewSubChannelData({ name: '', description: '' });
    setShowSubChannelForm(false);
  };

  const deleteChannel = (id: string) => {
    const updated = myChannels.filter(c => c.id !== id);
    setMyChannels(updated);
    if (selectedChannelId === id) {
      setSelectedChannelId(updated[0]?.id || '');
      setSelectedSubChannelId(null);
    }
  };

  const deleteSubChannel = (channelId: string, subChannelId: string) => {
    const updated = myChannels.map(c => {
      if (c.id === channelId) {
        return {
          ...c,
          subChannels: c.subChannels.filter(sc => sc.id !== subChannelId),
        };
      }
      return c;
    });

    setMyChannels(updated);
    if (selectedSubChannelId === subChannelId) {
      setSelectedSubChannelId(null);
    }
  };

  const subscribeToChannel = (channelId: string) => {
    const channelToSubscribe = allChannels.find(c => c.id === channelId);
    if (!channelToSubscribe) return;

    const subscribedChannel: Channel = {
      ...channelToSubscribe,
      subscribers: channelToSubscribe.subscribers + 1,
    };

    setMyChannels([...myChannels, subscribedChannel]);
    setAllChannels(allChannels.filter(c => c.id !== channelId));
    setSelectedChannelId(subscribedChannel.id);
    setSelectedSubChannelId(null);
  };

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
      channelId: selectedChannelId,
      subChannelId: selectedSubChannelId || undefined,
    };

    setMyVideos([...myVideos, newVideo]);
    
    // Update sub-channel video count
    if (selectedSubChannelId) {
      const updated = myChannels.map(c => {
        if (c.id === selectedChannelId) {
          return {
            ...c,
            subChannels: c.subChannels.map(sc => 
              sc.id === selectedSubChannelId 
                ? { ...sc, videoCount: sc.videoCount + 1 }
                : sc
            ),
          };
        }
        return c;
      });
      setMyChannels(updated);
    }

    setSelectedVideoId(newVideo.id);
    setNewVideoData({ title: '', description: '', duration: '0:00' });
    setShowUploadForm(false);
  };

  const deleteVideo = (id: string) => {
    const video = myVideos.find(v => v.id === id);
    const updated = myVideos.filter(v => v.id !== id);
    setMyVideos(updated);
    
    // Update sub-channel video count
    if (video?.subChannelId) {
      const channelUpdated = myChannels.map(c => {
        if (c.id === video.channelId) {
          return {
            ...c,
            subChannels: c.subChannels.map(sc => 
              sc.id === video.subChannelId 
                ? { ...sc, videoCount: Math.max(0, sc.videoCount - 1) }
                : sc
            ),
          };
        }
        return c;
      });
      setMyChannels(channelUpdated);
    }

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

  if (viewMode === ('channels' as const)) {
    return (
      <div className="flex h-full bg-background">
        {/* Channels Sidebar */}
        <div className="w-80 border-r border-border bg-secondary flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-bold mb-3">My Channels</h2>
            <Button onClick={() => setShowChannelForm(true)} className="w-full gap-2">
              <Plus className="w-4 h-4" />
              New Channel
            </Button>
          </div>

          {/* New Channel Form */}
          {showChannelForm && (
            <div className="p-4 border-b border-border space-y-2">
              <input
                type="text"
                placeholder="Channel name"
                value={newChannelData.name}
                onChange={(e) => setNewChannelData({ ...newChannelData, name: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
              />
              <textarea
                placeholder="Channel description"
                value={newChannelData.description}
                onChange={(e) => setNewChannelData({ ...newChannelData, description: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded text-sm h-16 resize-none"
              />
              <div className="flex gap-2">
                <Button onClick={createChannel} size="sm" className="flex-1">
                  Create
                </Button>
                <Button onClick={() => setShowChannelForm(false)} variant="outline" size="sm" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* My Channels List with Sub-channels */}
          <div className="flex-1 overflow-y-auto p-2">
            <p className="text-xs font-semibold text-foreground/60 px-2 py-1">My Channels</p>
            {myChannels.map(channel => (
              <div key={channel.id}>
                <button
                  onClick={() => {
                    setSelectedChannelId(channel.id);
                    setSelectedSubChannelId(null);
                    setViewMode('videos');
                  }}
                  className={`w-full text-left px-3 py-2 rounded transition-colors hover:bg-accent/10 flex items-center justify-between ${
                    selectedChannelId === channel.id && !selectedSubChannelId ? 'bg-accent/20' : ''
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{channel.name}</h4>
                    <p className="text-xs text-foreground/60 mt-1">{channel.subscribers.toLocaleString()} subscribers</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {channel.owner === 'You' && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChannel(channel.id);
                        }}
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                    {channel.subChannels.length > 0 && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleChannelExpand(channel.id);
                        }}
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                      >
                        {expandedChannels.has(channel.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </button>

                {/* Sub-channels */}
                {expandedChannels.has(channel.id) && channel.owner === 'You' && (
                  <div className="ml-4 border-l border-border/50">
                    {channel.subChannels.map(subChannel => (
                      <button
                        key={subChannel.id}
                        onClick={() => {
                          setSelectedChannelId(channel.id);
                          setSelectedSubChannelId(subChannel.id);
                          setViewMode('videos');
                        }}
                        className={`w-full text-left px-3 py-2 rounded transition-colors hover:bg-accent/10 flex items-center justify-between text-sm ${
                          selectedSubChannelId === subChannel.id ? 'bg-accent/20' : ''
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium truncate flex items-center gap-2">
                            <Folder className="w-3 h-3" />
                            {subChannel.name}
                          </h5>
                          <p className="text-xs text-foreground/60 mt-1">{subChannel.videoCount} videos</p>
                        </div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSubChannel(channel.id, subChannel.id);
                          }}
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </button>
                    ))}

                    {/* Add Sub-channel Button */}
                    {channel.owner === 'You' && (
                      <button
                        onClick={() => {
                          setSelectedChannelId(channel.id);
                          setShowSubChannelForm(true);
                        }}
                        className="w-full text-left px-3 py-2 rounded transition-colors hover:bg-accent/10 text-sm text-accent flex items-center gap-2"
                      >
                        <Plus className="w-3 h-3" />
                        Add Sub-channel
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* New Sub-channel Form */}
          {showSubChannelForm && (
            <div className="p-4 border-t border-border space-y-2">
              <h4 className="font-semibold text-sm">New Sub-channel</h4>
              <input
                type="text"
                placeholder="Sub-channel name"
                value={newSubChannelData.name}
                onChange={(e) => setNewSubChannelData({ ...newSubChannelData, name: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
              />
              <textarea
                placeholder="Description"
                value={newSubChannelData.description}
                onChange={(e) => setNewSubChannelData({ ...newSubChannelData, description: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded text-sm h-12 resize-none"
              />
              <div className="flex gap-2">
                <Button onClick={createSubChannel} size="sm" className="flex-1">
                  Create
                </Button>
                <Button onClick={() => setShowSubChannelForm(false)} variant="outline" size="sm" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* All Channels List */}
          <div className="border-t border-border p-2">
            <p className="text-xs font-semibold text-foreground/60 px-2 py-1">Discover Channels</p>
            {allChannels.map(channel => (
              <button
                key={channel.id}
                onClick={() => subscribeToChannel(channel.id)}
                className="w-full text-left px-3 py-2 rounded transition-colors hover:bg-accent/10"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{channel.name}</h4>
                    <p className="text-xs text-foreground/60 mt-1">{channel.subscribers.toLocaleString()} subscribers</p>
                  </div>
                  <Button size="sm" className="flex-shrink-0">
                    Subscribe
                  </Button>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Channel Details */}
        <div className="flex-1 flex flex-col">
          {selectedChannel ? (
            <>
              {/* Channel Header */}
              <div className="border-b border-border p-6 bg-card">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-6xl">{selectedChannel.banner}</div>
                    <div>
                      <h2 className="text-3xl font-bold">
                        {selectedChannel.name}
                        {selectedSubChannel && ` / ${selectedSubChannel.name}`}
                      </h2>
                      <p className="text-sm text-foreground/60 mt-1">
                        {selectedSubChannel?.description || selectedChannel.description}
                      </p>
                      <div className="flex gap-4 mt-3 text-sm text-foreground/60">
                        <span>{selectedChannel.subscribers.toLocaleString()} subscribers</span>
                        <span>Created {selectedChannel.createdDate}</span>
                      </div>
                    </div>
                  </div>
                  {selectedChannel.owner === 'You' && (
                    <Button variant="outline" size="icon">
                      <Settings className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Channel Videos */}
              <div className="flex-1 overflow-y-auto p-6">
                <h3 className="text-xl font-bold mb-4">Videos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {channelVideos.length > 0 ? (
                    channelVideos.map(video => (
                      <button
                        key={video.id}
                        onClick={() => {
                          setSelectedVideoId(video.id);
                          setViewMode('videos');
                        }}
                        className="group text-left"
                      >
                        <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-accent transition-colors">
                          <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform">
                            {video.thumbnail}
                          </div>
                          <div className="p-3">
                            <h4 className="font-semibold text-sm truncate">{video.title}</h4>
                            <p className="text-xs text-foreground/60 mt-1">{video.duration}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-foreground/50">
                              <span>{video.views.toLocaleString()} views</span>
                              <span>•</span>
                              <span>{video.uploadedDate}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-foreground/50 col-span-full text-center py-8">No videos yet</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-foreground/50">
              <p>Select a channel to view details</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-background">
      {/* Video Player */}
      <div className="flex-1 flex flex-col">
        {selectedVideo ? (
          <>
            {/* Player Area */}
            <div className="bg-black flex-1 flex items-center justify-center relative group">
              <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center relative">
                <div className="text-6xl">{selectedVideo.thumbnail}</div>

                {/* Player Controls */}
                <div className="absolute inset-0 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <div className="p-4">
                    <h2 className="text-xl font-bold text-white">{selectedVideo.title}</h2>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="w-full bg-gray-600 h-1 rounded-full cursor-pointer hover:h-2 transition-all">
                      <div className="bg-accent h-full rounded-full" style={{ width: '35%' }}></div>
                    </div>

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
        <div className="p-4 border-b border-border flex gap-2">
          <Button
            onClick={() => setViewMode('videos' as const)}
            variant={viewMode === ('videos' as const) ? 'default' : 'outline'}
            className="flex-1 gap-2"
          >
            Videos
          </Button>
          <Button
            onClick={() => setViewMode('channels' as const)}
            variant={viewMode === ('channels' as const) ? 'default' : 'outline'}
            className="flex-1 gap-2"
          >
            <Users className="w-4 h-4" />
            Channels
          </Button>
        </div>

        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-bold mb-3">Upload Video</h3>
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
            <select
              value={selectedChannelId}
              onChange={(e) => setSelectedChannelId(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
            >
              <option value="">Select channel...</option>
              {myChannels.map(channel => (
                <option key={channel.id} value={channel.id}>
                  {channel.name}
                </option>
              ))}
            </select>
            <select
              value={selectedSubChannelId || ''}
              onChange={(e) => setSelectedSubChannelId(e.target.value || null)}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
            >
              <option value="">Main channel</option>
              {selectedChannel?.subChannels.map(sc => (
                <option key={sc.id} value={sc.id}>
                  {sc.name}
                </option>
              ))}
            </select>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
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
