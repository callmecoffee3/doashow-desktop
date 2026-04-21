import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SlideshowImage {
  id: string;
  url: string;
  title: string;
  description?: string;
}

interface SlideshowProps {
  images: SlideshowImage[];
  autoPlayInterval?: number;
}

export default function Slideshow({ images, autoPlayInterval = 5000 }: SlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
  }, [isPlaying]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) {
    return (
      <div className="w-full h-screen bg-background flex items-center justify-center">
        <p className="text-foreground/50 text-lg">No images to display</p>
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
