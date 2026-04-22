import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Folder, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SlideshowImage {
  id: string;
  url: string;
  title: string;
  description?: string;
}

interface SlideshowProps {
  images?: SlideshowImage[];
  autoPlayInterval?: number;
}

const STORAGE_KEY = 'doashow_slideshow_photos';

export default function Slideshow({ images: defaultImages = [], autoPlayInterval = 5000 }: SlideshowProps) {
  const [images, setImages] = useState<SlideshowImage[]>(defaultImages);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [showPhotoSelector, setShowPhotoSelector] = useState(images.length === 0);
  const [desktopPhotos, setDesktopPhotos] = useState<SlideshowImage[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved photos from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const savedImages = JSON.parse(saved);
      setImages(savedImages);
      if (savedImages.length > 0) {
        setShowPhotoSelector(false);
      }
    }
  }, []);

  // Handle auto-play
  useEffect(() => {
    if (!isPlaying || images.length === 0) return;

    autoPlayTimeoutRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, autoPlayInterval);

    return () => {
      if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
    };
  }, [isPlaying, currentIndex, images.length, autoPlayInterval]);

  // Handle controls auto-hide
  useEffect(() => {
    const resetControlsTimeout = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    window.addEventListener('mousemove', resetControlsTimeout);
    window.addEventListener('keydown', resetControlsTimeout);

    return () => {
      window.removeEventListener('mousemove', resetControlsTimeout);
      window.removeEventListener('keydown', resetControlsTimeout);
    };
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (showPhotoSelector) return;
      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case ' ':
          e.preventDefault();
          setIsPlaying(!isPlaying);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, showPhotoSelector]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPhotos: SlideshowImage[] = files
      .filter(file => file.type.startsWith('image/'))
      .map(file => ({
        id: Date.now().toString() + Math.random(),
        url: URL.createObjectURL(file),
        title: file.name.replace(/\.[^/.]+$/, ''),
        description: `Added on ${new Date().toLocaleDateString()}`,
      }));

    setDesktopPhotos([...desktopPhotos, ...newPhotos]);
  };

  const togglePhotoSelection = (photoId: string) => {
    const newSelected = new Set(selectedPhotos);
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId);
    } else {
      newSelected.add(photoId);
    }
    setSelectedPhotos(newSelected);
  };

  const startSlideshow = () => {
    const selected = desktopPhotos.filter(p => selectedPhotos.has(p.id));
    if (selected.length > 0) {
      setImages(selected);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
      setShowPhotoSelector(false);
      setCurrentIndex(0);
      setIsPlaying(true);
    }
  };

  const clearPhotos = () => {
    setDesktopPhotos([]);
    setSelectedPhotos(new Set());
  };

  const removePhoto = (photoId: string) => {
    setDesktopPhotos(desktopPhotos.filter(p => p.id !== photoId));
    const newSelected = new Set(selectedPhotos);
    newSelected.delete(photoId);
    setSelectedPhotos(newSelected);
  };

  const selectAll = () => {
    if (selectedPhotos.size === desktopPhotos.length) {
      setSelectedPhotos(new Set());
    } else {
      setSelectedPhotos(new Set(desktopPhotos.map(p => p.id)));
    }
  };

  // Photo Selector View
  if (showPhotoSelector) {
    return (
      <div className="w-full h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white flex flex-col">
        {/* Header */}
        <div className="border-b border-yellow-600/30 p-6 bg-gradient-to-r from-slate-900 to-slate-800">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500 mb-2">
            📸 Create Slideshow
          </h1>
          <p className="text-gray-400">Select photos from your desktop to create a custom slideshow</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Upload Section */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-dashed border-yellow-600/30 rounded-lg p-8 text-center hover:border-yellow-400/50 transition-all cursor-pointer"
            onClick={() => fileInputRef.current?.click()}>
            <Folder className="w-16 h-16 mx-auto mb-4 text-yellow-400 opacity-50" />
            <h3 className="text-xl font-bold mb-2">Upload Photos</h3>
            <p className="text-gray-400 mb-4">Click to browse and select photos from your desktop</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold">
              <Plus className="w-4 h-4 mr-2" />
              Choose Photos
            </Button>
          </div>

          {/* Photos Grid */}
          {desktopPhotos.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-yellow-400">
                  Selected Photos ({selectedPhotos.size} / {desktopPhotos.length})
                </h3>
                <Button
                  onClick={selectAll}
                  variant="outline"
                  size="sm"
                  className="text-yellow-400 border-yellow-600/30 hover:bg-yellow-600/10"
                >
                  {selectedPhotos.size === desktopPhotos.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {desktopPhotos.map(photo => (
                  <div
                    key={photo.id}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedPhotos.has(photo.id)
                        ? 'border-yellow-400 ring-2 ring-yellow-400/50'
                        : 'border-yellow-600/30 hover:border-yellow-400/50'
                    }`}
                    onClick={() => togglePhotoSelection(photo.id)}
                  >
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-32 object-cover"
                    />
                    {selectedPhotos.has(photo.id) && (
                      <div className="absolute inset-0 bg-yellow-400/20 flex items-center justify-center">
                        <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                          <span className="text-black font-bold text-sm">✓</span>
                        </div>
                      </div>
                    )}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        removePhoto(photo.id);
                      }}
                      variant="ghost"
                      size="icon"
                      className="absolute top-1 right-1 bg-black/50 hover:bg-black/80 text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={startSlideshow}
                  disabled={selectedPhotos.size === 0}
                  className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold disabled:opacity-50"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Slideshow ({selectedPhotos.size})
                </Button>
                <Button
                  onClick={clearPhotos}
                  variant="outline"
                  className="border-red-600/30 text-red-400 hover:bg-red-600/10"
                >
                  Clear All
                </Button>
              </div>
            </div>
          )}

          {desktopPhotos.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg">No photos selected yet</p>
              <p className="text-sm">Click above to upload photos from your desktop</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Slideshow View
  if (images.length === 0) {
    return (
      <div className="w-full h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-foreground/50 text-lg">No images to display</p>
        <Button
          onClick={() => setShowPhotoSelector(true)}
          className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Photos
        </Button>
      </div>
    );
  }

  const currentImage = images[currentIndex];
  const progress = ((currentIndex + 1) / images.length) * 100;

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden grain">
      {/* Main Image */}
      <div className="absolute inset-0">
        <img
          key={currentImage.id}
          src={currentImage.url}
          alt={currentImage.title}
          className="w-full h-full object-cover animate-in fade-in duration-800"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Center Play/Pause Button - visible on hover */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <Button
          onClick={() => setIsPlaying(!isPlaying)}
          className="rounded-full w-16 h-16 bg-accent/80 hover:bg-accent text-accent-foreground shadow-lg backdrop-blur-sm"
          size="icon"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8 ml-1" />
          )}
        </Button>
      </div>

      {/* Bottom Control Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-12 pb-6 px-6 transition-all duration-300 ${
          showControls ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        {/* Metadata */}
        <div className="mb-6 max-w-2xl">
          <h2 className="text-3xl font-bold text-foreground mb-2 animate-in fade-in slide-in-from-bottom-2 duration-600">
            {currentImage.title}
          </h2>
          {currentImage.description && (
            <p className="text-foreground/70 text-sm animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
              {currentImage.description}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-foreground/20 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Button
              onClick={goToPrevious}
              variant="ghost"
              size="icon"
              className="text-foreground hover:bg-foreground/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              onClick={goToNext}
              variant="ghost"
              size="icon"
              className="text-foreground hover:bg-foreground/10"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => setShowPhotoSelector(true)}
              variant="ghost"
              size="icon"
              className="text-foreground hover:bg-foreground/10"
              title="Edit slideshow"
            >
              <Folder className="w-5 h-5" />
            </Button>
          </div>

          {/* Image Counter */}
          <span className="text-foreground/60 text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      </div>

      {/* Side Navigation Arrows - visible on hover */}
      {showControls && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground transition-colors duration-200 z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground transition-colors duration-200 z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}
    </div>
  );
}
