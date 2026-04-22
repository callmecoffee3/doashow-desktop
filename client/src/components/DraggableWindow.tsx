import { useState, useRef, ReactNode } from 'react';
import { X, Minus, Square, ChevronLeft, ChevronRight, RotateCcw, Search, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWindow } from '@/contexts/WindowContext';

interface DraggableWindowProps {
  id: string;
  title: string;
  icon: string;
  children: ReactNode;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  isMaximized?: boolean;
  showBrowserBar?: boolean;
}

export default function DraggableWindow({
  id,
  title,
  icon,
  children,
  width = 800,
  height = 600,
  x = 100,
  y = 100,
  isMaximized = false,
  showBrowserBar = true,
}: DraggableWindowProps) {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, updateWindow } = useWindow();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x, y });
  const [size, setSize] = useState({ width, height });
  const [searchQuery, setSearchQuery] = useState('');
  const [addressBar, setAddressBar] = useState('app://localhost');
  const [bookmarks, setBookmarks] = useState([
    { id: '1', name: 'Home', url: 'app://home', icon: '🏠' },
    { id: '2', name: 'Settings', url: 'app://settings', icon: '⚙️' },
    { id: '3', name: 'Help', url: 'app://help', icon: '❓' },
  ]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-no-drag]')) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    focusWindow(id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const handleMove = (moveEvent: MouseEvent) => {
      setSize({
        width: Math.max(300, startWidth + (moveEvent.clientX - startX)),
        height: Math.max(200, startHeight + (moveEvent.clientY - startY)),
      });
    };

    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  };

  if (isMaximized) {
    return (
      <div className="fixed inset-0 bg-card text-card-foreground rounded-none shadow-2xl flex flex-col z-50 border border-border">
        {/* Title Bar */}
        <div
          className="flex items-center justify-between px-4 py-3 bg-secondary border-b border-border cursor-move select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{icon}</span>
            <span className="font-semibold text-sm">{title}</span>
          </div>
          <div className="flex gap-1" data-no-drag>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => minimizeWindow(id)}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => maximizeWindow(id)}
            >
              <Square className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => closeWindow(id)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Browser Toolbar */}
        {showBrowserBar && (
          <>
            {/* Navigation & Address Bar */}
            <div className="px-3 py-2 border-b border-border bg-secondary/50 space-y-2 flex-shrink-0" data-no-drag>
              {/* Navigation Buttons & Address Bar */}
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" className="h-7 w-7">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7">
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7">
                  <RotateCcw className="w-3.5 h-3.5" />
                </Button>
                <div className="flex-1 flex items-center gap-1 bg-background border border-border rounded px-2 py-1">
                  <span className="text-xs text-foreground/50">📍</span>
                  <input
                    type="text"
                    value={addressBar}
                    onChange={(e) => setAddressBar(e.target.value)}
                    className="flex-1 bg-transparent text-xs focus:outline-none"
                    placeholder="Address bar"
                  />
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                >
                  <Star className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                </Button>
              </div>

              {/* Search Bar */}
              <div className="flex items-center gap-2 bg-background border border-border rounded px-2 py-1">
                <Search className="w-3.5 h-3.5 text-foreground/50 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-xs focus:outline-none placeholder-foreground/40"
                  placeholder="Search within app..."
                />
              </div>
            </div>

            {/* Bookmark Bar */}
            <div className="px-2 py-1 border-b border-border bg-secondary/30 flex items-center gap-1 overflow-x-auto flex-shrink-0" data-no-drag>
              {bookmarks.map(bookmark => (
                <Button
                  key={bookmark.id}
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs whitespace-nowrap flex-shrink-0"
                >
                  <span className="mr-1">{bookmark.icon}</span>
                  {bookmark.name}
                </Button>
              ))}
            </div>
          </>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto bg-background">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={windowRef}
      className="fixed bg-card text-card-foreground rounded-lg shadow-2xl flex flex-col border border-border"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex: 50,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Title Bar */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-secondary border-b border-border cursor-move select-none rounded-t-lg"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="font-semibold text-sm">{title}</span>
        </div>
        <div className="flex gap-1" data-no-drag>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => minimizeWindow(id)}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => maximizeWindow(id)}
          >
            <Square className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => closeWindow(id)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Browser Toolbar */}
      {showBrowserBar && (
        <>
          {/* Navigation & Address Bar */}
          <div className="px-3 py-2 border-b border-border bg-secondary/50 space-y-2 flex-shrink-0" data-no-drag>
            {/* Navigation Buttons & Address Bar */}
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" className="h-7 w-7">
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7">
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7">
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
              <div className="flex-1 flex items-center gap-1 bg-background border border-border rounded px-2 py-1">
                <span className="text-xs text-foreground/50">📍</span>
                <input
                  type="text"
                  value={addressBar}
                  onChange={(e) => setAddressBar(e.target.value)}
                  className="flex-1 bg-transparent text-xs focus:outline-none"
                  placeholder="Address bar"
                />
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Star className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-yellow-400 text-yellow-400' : ''}`} />
              </Button>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-2 bg-background border border-border rounded px-2 py-1">
              <Search className="w-3.5 h-3.5 text-foreground/50 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-xs focus:outline-none placeholder-foreground/40"
                placeholder="Search within app..."
              />
            </div>
          </div>

          {/* Bookmark Bar */}
          <div className="px-2 py-1 border-b border-border bg-secondary/30 flex items-center gap-1 overflow-x-auto flex-shrink-0" data-no-drag>
            {bookmarks.map(bookmark => (
              <Button
                key={bookmark.id}
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs whitespace-nowrap flex-shrink-0"
              >
                <span className="mr-1">{bookmark.icon}</span>
                {bookmark.name}
              </Button>
            ))}
          </div>
        </>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto bg-background">
        {children}
      </div>

      {/* Resize Handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 bg-accent cursor-se-resize rounded-bl-lg"
        onMouseDown={handleResize}
      />
    </div>
  );
}
