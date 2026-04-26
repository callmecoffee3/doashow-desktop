import { useState } from 'react';
import { Download, Trash2, FolderOpen, Search, X, FileText, Image, Music, Video, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DownloadedFile {
  id: string;
  name: string;
  type: 'document' | 'image' | 'audio' | 'video' | 'archive' | 'other';
  size: string;
  downloadDate: string;
  downloadSpeed: string;
  status: 'completed' | 'downloading' | 'paused';
  progress?: number;
}

export default function DownloadsApp() {
  const [downloads, setDownloads] = useState<DownloadedFile[]>([
    {
      id: '1',
      name: 'Project_Report_2026.pdf',
      type: 'document',
      size: '2.4 MB',
      downloadDate: 'Apr 25, 2026 - 10:23 AM',
      downloadSpeed: '5.2 MB/s',
      status: 'completed',
    },
    {
      id: '2',
      name: 'vacation_photos.zip',
      type: 'archive',
      size: '156.8 MB',
      downloadDate: 'Apr 25, 2026 - 09:45 AM',
      downloadSpeed: '3.8 MB/s',
      status: 'completed',
    },
    {
      id: '3',
      name: 'presentation.pptx',
      type: 'document',
      size: '8.6 MB',
      downloadDate: 'Apr 24, 2026 - 03:12 PM',
      downloadSpeed: '4.1 MB/s',
      status: 'completed',
    },
    {
      id: '4',
      name: 'background_image.jpg',
      type: 'image',
      size: '3.2 MB',
      downloadDate: 'Apr 24, 2026 - 02:30 PM',
      downloadSpeed: '6.5 MB/s',
      status: 'completed',
    },
    {
      id: '5',
      name: 'podcast_episode_123.mp3',
      type: 'audio',
      size: '45.3 MB',
      downloadDate: 'Apr 24, 2026 - 01:15 PM',
      downloadSpeed: '2.9 MB/s',
      status: 'completed',
    },
    {
      id: '6',
      name: 'tutorial_video.mp4',
      type: 'video',
      size: '234.7 MB',
      downloadDate: 'Apr 23, 2026 - 11:00 AM',
      downloadSpeed: '4.3 MB/s',
      status: 'completed',
      progress: 100,
    },
    {
      id: '7',
      name: 'software_update.exe',
      type: 'other',
      size: '89.2 MB',
      downloadDate: 'Apr 23, 2026 - 08:45 AM',
      downloadSpeed: '5.7 MB/s',
      status: 'completed',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'size' | 'name'>('date');

  const getFileIcon = (type: DownloadedFile['type']) => {
    switch (type) {
      case 'document':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'image':
        return <Image className="w-5 h-5 text-purple-500" />;
      case 'audio':
        return <Music className="w-5 h-5 text-green-500" />;
      case 'video':
        return <Video className="w-5 h-5 text-red-500" />;
      case 'archive':
        return <Archive className="w-5 h-5 text-yellow-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const filteredDownloads = downloads
    .filter(file =>
      (filterType === 'all' || file.type === filterType) &&
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.downloadDate).getTime() - new Date(a.downloadDate).getTime();
      } else if (sortBy === 'size') {
        return parseFloat(b.size) - parseFloat(a.size);
      } else {
        return a.name.localeCompare(b.name);
      }
    });

  const handleDelete = (id: string) => {
    setDownloads(downloads.filter(d => d.id !== id));
  };

  const handleClearAll = () => {
    setDownloads([]);
  };

  const totalSize = downloads
    .reduce((sum, file) => sum + parseFloat(file.size), 0)
    .toFixed(1);

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 bg-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">📥 Downloads</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="text-red-500 hover:text-red-600"
          >
            Clear All
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
          <input
            type="text"
            placeholder="Search downloads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent"
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

        {/* Filters and Sort */}
        <div className="flex gap-2 overflow-x-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">All Files</option>
            <option value="document">Documents</option>
            <option value="image">Images</option>
            <option value="audio">Audio</option>
            <option value="video">Videos</option>
            <option value="archive">Archives</option>
            <option value="other">Other</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'size' | 'name')}
            className="px-3 py-1 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="date">Sort by Date</option>
            <option value="size">Sort by Size</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-sm text-foreground/60">
          <span>{downloads.length} files</span>
          <span>•</span>
          <span>{totalSize} MB total</span>
        </div>
      </div>

      {/* Downloads List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredDownloads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-foreground/60">
            <Download className="w-12 h-12 mb-3 opacity-50" />
            <p>No downloads found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredDownloads.map(file => (
              <div
                key={file.id}
                className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* File Icon */}
                  <div className="mt-1">
                    {getFileIcon(file.type)}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{file.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-foreground/60 mt-1">
                      <span>{file.size}</span>
                      <span>•</span>
                      <span>{file.downloadDate}</span>
                      <span>•</span>
                      <span>{file.downloadSpeed}</span>
                    </div>

                    {/* Progress Bar */}
                    {file.status === 'downloading' && (
                      <div className="mt-2 w-full bg-border rounded-full h-1.5">
                        <div
                          className="bg-accent h-1.5 rounded-full transition-all"
                          style={{ width: `${file.progress || 0}%` }}
                        />
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        file.status === 'completed'
                          ? 'bg-green-500/20 text-green-600'
                          : file.status === 'downloading'
                          ? 'bg-blue-500/20 text-blue-600'
                          : 'bg-yellow-500/20 text-yellow-600'
                      }`}>
                        {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-foreground/60 hover:text-foreground"
                    >
                      <FolderOpen className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(file.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
