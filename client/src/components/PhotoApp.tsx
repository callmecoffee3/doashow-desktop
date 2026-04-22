import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Heart, MessageCircle, Share2, Download, X, Grid, List, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Photo {
  id: string;
  title: string;
  description: string;
  url: string;
  uploadedDate: string;
  likes: number;
  comments: number;
  liked: boolean;
  albumId: string;
}

interface Album {
  id: string;
  name: string;
  description: string;
  coverPhoto: string;
  photoCount: number;
  createdDate: string;
}

export default function PhotoApp() {
  const [albums, setAlbums] = useState<Album[]>([
    {
      id: '1',
      name: 'Summer Vacation',
      description: 'Amazing summer memories',
      coverPhoto: '🏖️',
      photoCount: 3,
      createdDate: '2024-01-01',
    },
    {
      id: '2',
      name: 'Travel',
      description: 'Around the world',
      coverPhoto: '✈️',
      photoCount: 2,
      createdDate: '2024-01-05',
    },
  ]);

  const [photos, setPhotos] = useState<Photo[]>([
    {
      id: '1',
      title: 'Beach Sunset',
      description: 'Beautiful sunset at the beach',
      url: '🌅',
      uploadedDate: '2024-01-01',
      likes: 245,
      comments: 12,
      liked: false,
      albumId: '1',
    },
    {
      id: '2',
      title: 'Mountain View',
      description: 'Stunning mountain landscape',
      url: '⛰️',
      uploadedDate: '2024-01-02',
      likes: 189,
      comments: 8,
      liked: false,
      albumId: '1',
    },
    {
      id: '3',
      title: 'City Lights',
      description: 'Night city photography',
      url: '🌃',
      uploadedDate: '2024-01-03',
      likes: 312,
      comments: 15,
      liked: false,
      albumId: '1',
    },
    {
      id: '4',
      title: 'Eiffel Tower',
      description: 'Paris memories',
      url: '🗼',
      uploadedDate: '2024-01-05',
      likes: 456,
      comments: 22,
      liked: false,
      albumId: '2',
    },
    {
      id: '5',
      title: 'Tokyo Street',
      description: 'Urban exploration',
      url: '🏙️',
      uploadedDate: '2024-01-06',
      likes: 378,
      comments: 18,
      liked: false,
      albumId: '2',
    },
  ]);

  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'albums' | 'feed'>('feed');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showNewAlbumForm, setShowNewAlbumForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newPhotoData, setNewPhotoData] = useState({
    title: '',
    description: '',
    albumId: '1',
  });
  const [newAlbumData, setNewAlbumData] = useState({
    name: '',
    description: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('doashow_albums', JSON.stringify(albums));
    localStorage.setItem('doashow_photos', JSON.stringify(photos));
  }, [albums, photos]);

  const albumPhotos = selectedAlbumId
    ? photos.filter(p => p.albumId === selectedAlbumId)
    : photos;

  const filteredPhotos = albumPhotos.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const createAlbum = () => {
    if (!newAlbumData.name.trim()) return;

    const newAlbum: Album = {
      id: Date.now().toString(),
      name: newAlbumData.name,
      description: newAlbumData.description,
      coverPhoto: '📷',
      photoCount: 0,
      createdDate: new Date().toISOString().split('T')[0],
    };

    setAlbums([...albums, newAlbum]);
    setNewAlbumData({ name: '', description: '' });
    setShowNewAlbumForm(false);
  };

  const uploadPhoto = () => {
    if (!newPhotoData.title.trim()) return;

    const newPhoto: Photo = {
      id: Date.now().toString(),
      title: newPhotoData.title,
      description: newPhotoData.description,
      url: '📸',
      uploadedDate: new Date().toISOString().split('T')[0],
      likes: 0,
      comments: 0,
      liked: false,
      albumId: newPhotoData.albumId,
    };

    setPhotos([...photos, newPhoto]);

    // Update album photo count
    const updated = albums.map(a =>
      a.id === newPhotoData.albumId
        ? { ...a, photoCount: a.photoCount + 1 }
        : a
    );
    setAlbums(updated);

    setNewPhotoData({ title: '', description: '', albumId: '1' });
    setShowUploadForm(false);
  };

  const deletePhoto = (id: string) => {
    const photo = photos.find(p => p.id === id);
    const updated = photos.filter(p => p.id !== id);
    setPhotos(updated);

    // Update album photo count
    if (photo) {
      const albumUpdated = albums.map(a =>
        a.id === photo.albumId
          ? { ...a, photoCount: Math.max(0, a.photoCount - 1) }
          : a
      );
      setAlbums(albumUpdated);
    }
  };

  const deleteAlbum = (id: string) => {
    const albumPhotos = photos.filter(p => p.albumId === id);
    const updated = photos.filter(p => p.albumId !== id);
    setPhotos(updated);
    setAlbums(albums.filter(a => a.id !== id));
    if (selectedAlbumId === id) {
      setSelectedAlbumId(null);
    }
  };

  const toggleLike = (id: string) => {
    const updated = photos.map(p => {
      if (p.id === id) {
        return {
          ...p,
          liked: !p.liked,
          likes: p.liked ? p.likes - 1 : p.likes + 1,
        };
      }
      return p;
    });
    setPhotos(updated);
  };

  if (viewMode === 'albums') {
    return (
      <div className="flex h-full bg-background">
        {/* Albums Sidebar */}
        <div className="w-80 border-r border-border bg-secondary flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-bold mb-3">Albums</h2>
            <Button onClick={() => setShowNewAlbumForm(true)} className="w-full gap-2">
              <Plus className="w-4 h-4" />
              New Album
            </Button>
          </div>

          {showNewAlbumForm && (
            <div className="p-4 border-b border-border space-y-2">
              <input
                type="text"
                placeholder="Album name"
                value={newAlbumData.name}
                onChange={(e) => setNewAlbumData({ ...newAlbumData, name: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
              />
              <textarea
                placeholder="Description"
                value={newAlbumData.description}
                onChange={(e) => setNewAlbumData({ ...newAlbumData, description: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded text-sm h-12 resize-none"
              />
              <div className="flex gap-2">
                <Button onClick={createAlbum} size="sm" className="flex-1">
                  Create
                </Button>
                <Button onClick={() => setShowNewAlbumForm(false)} variant="outline" size="sm" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-2">
            {albums.map(album => (
              <button
                key={album.id}
                onClick={() => setSelectedAlbumId(album.id)}
                className={`w-full text-left p-3 rounded transition-colors hover:bg-accent/10 mb-2 ${
                  selectedAlbumId === album.id ? 'bg-accent/20' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl flex-shrink-0">{album.coverPhoto}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{album.name}</h3>
                    <p className="text-xs text-foreground/60 mt-1">{album.photoCount} photos</p>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAlbum(album.id);
                    }}
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Album Photos */}
        <div className="flex-1 flex flex-col">
          {selectedAlbumId ? (
            <>
              <div className="border-b border-border p-6 bg-card">
                <h2 className="text-3xl font-bold">{albums.find(a => a.id === selectedAlbumId)?.name}</h2>
                <p className="text-sm text-foreground/60 mt-2">
                  {albums.find(a => a.id === selectedAlbumId)?.description}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredPhotos.map(photo => (
                    <div
                      key={photo.id}
                      className="group relative bg-card border border-border rounded-lg overflow-hidden hover:border-accent transition-colors"
                    >
                      <div className="aspect-square bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-5xl">
                        {photo.url}
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-end opacity-0 group-hover:opacity-100">
                        <div className="w-full p-3 text-white">
                          <h4 className="font-semibold text-sm truncate">{photo.title}</h4>
                          <div className="flex items-center gap-2 mt-2 text-xs">
                            <Heart className="w-3 h-3" />
                            <span>{photo.likes}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => deletePhoto(photo.id)}
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-foreground/50">
              <p>Select an album to view photos</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-background">
      {/* Feed */}
      <div className="flex-1 flex flex-col max-w-2xl mx-auto">
        {/* Header */}
        <div className="border-b border-border p-4 bg-card sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">📸 Photos</h1>
            <div className="flex gap-2">
              <Button
                onClick={() => setViewMode('albums')}
                variant="outline"
                size="icon"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button onClick={() => setShowUploadForm(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Upload
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground/50" />
            <input
              type="text"
              placeholder="Search photos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-full text-sm"
            />
          </div>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <div className="border-b border-border p-4 bg-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">Upload Photo</h3>
              <Button
                onClick={() => setShowUploadForm(false)}
                variant="ghost"
                size="icon"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <input
              type="text"
              placeholder="Photo title"
              value={newPhotoData.title}
              onChange={(e) => setNewPhotoData({ ...newPhotoData, title: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
            />
            <textarea
              placeholder="Photo description"
              value={newPhotoData.description}
              onChange={(e) => setNewPhotoData({ ...newPhotoData, description: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm h-12 resize-none"
            />
            <select
              value={newPhotoData.albumId}
              onChange={(e) => setNewPhotoData({ ...newPhotoData, albumId: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
            >
              {albums.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
            />
            <div className="flex gap-2">
              <Button onClick={uploadPhoto} className="flex-1">
                Upload
              </Button>
              <Button onClick={() => setShowUploadForm(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Photos Feed */}
        <div className="flex-1 overflow-y-auto">
          {filteredPhotos.length > 0 ? (
            <div className="space-y-4 p-4">
              {filteredPhotos.map(photo => (
                <div key={photo.id} className="bg-card border border-border rounded-lg overflow-hidden">
                  {/* Photo Header */}
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{photo.title}</h3>
                      <p className="text-xs text-foreground/60 mt-1">{photo.uploadedDate}</p>
                    </div>
                    <Button
                      onClick={() => deletePhoto(photo.id)}
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Photo Image */}
                  <div className="aspect-square bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-8xl">
                    {photo.url}
                  </div>

                  {/* Photo Description */}
                  <div className="p-4 border-b border-border">
                    <p className="text-sm text-foreground/80">{photo.description}</p>
                  </div>

                  {/* Photo Actions */}
                  <div className="p-4 border-b border-border flex gap-4">
                    <Button
                      onClick={() => toggleLike(photo.id)}
                      variant={photo.liked ? 'default' : 'outline'}
                      className="gap-2 flex-1"
                    >
                      <Heart className={`w-4 h-4 ${photo.liked ? 'fill-current' : ''}`} />
                      {photo.likes}
                    </Button>
                    <Button variant="outline" className="gap-2 flex-1">
                      <MessageCircle className="w-4 h-4" />
                      {photo.comments}
                    </Button>
                    <Button variant="outline" className="gap-2 flex-1">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-foreground/50">
              <p>No photos found</p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar - Albums */}
      <div className="w-80 border-l border-border bg-secondary hidden lg:flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-bold mb-3">Albums</h2>
          <Button onClick={() => setShowNewAlbumForm(true)} className="w-full gap-2" size="sm">
            <Plus className="w-4 h-4" />
            New Album
          </Button>
        </div>

        {showNewAlbumForm && (
          <div className="p-4 border-b border-border space-y-2">
            <input
              type="text"
              placeholder="Album name"
              value={newAlbumData.name}
              onChange={(e) => setNewAlbumData({ ...newAlbumData, name: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
            />
            <textarea
              placeholder="Description"
              value={newAlbumData.description}
              onChange={(e) => setNewAlbumData({ ...newAlbumData, description: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm h-12 resize-none"
            />
            <div className="flex gap-2">
              <Button onClick={createAlbum} size="sm" className="flex-1">
                Create
              </Button>
              <Button onClick={() => setShowNewAlbumForm(false)} variant="outline" size="sm" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-2">
          <button
            onClick={() => setSelectedAlbumId(null)}
            className={`w-full text-left p-3 rounded transition-colors hover:bg-accent/10 mb-2 font-semibold text-sm ${
              !selectedAlbumId ? 'bg-accent/20' : ''
            }`}
          >
            All Photos
          </button>
          {albums.map(album => (
            <button
              key={album.id}
              onClick={() => setSelectedAlbumId(album.id)}
              className={`w-full text-left p-3 rounded transition-colors hover:bg-accent/10 mb-2 ${
                selectedAlbumId === album.id ? 'bg-accent/20' : ''
              }`}
            >
              <div className="flex items-start gap-2">
                <div className="text-2xl flex-shrink-0">{album.coverPhoto}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">{album.name}</h4>
                  <p className="text-xs text-foreground/60">{album.photoCount} photos</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
