import { useRef, useState } from 'react';
import { useDesktopShortcuts } from '@/contexts/DesktopShortcutsContext';
import { useWindow } from '@/contexts/WindowContext';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DesktopShortcuts() {
  const { shortcuts, removeShortcut, updateShortcutPosition } = useDesktopShortcuts();
  const { windows, openWindow } = useWindow();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent, shortcutId: string) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }

    setDraggedId(shortcutId);
    const shortcut = shortcuts.find(s => s.id === shortcutId);
    if (shortcut && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left - (shortcut.x * rect.width) / 100,
        y: e.clientY - rect.top - (shortcut.y * rect.height) / 100,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedId && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left - dragOffset.x) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((e.clientY - rect.top - dragOffset.y) / rect.height) * 100));
      updateShortcutPosition(draggedId, x, y);
    }
  };

  const handleMouseUp = () => {
    setDraggedId(null);
  };

  const handleShortcutClick = (appId: string) => {
    // Find the app from the windows context
    const appNames: { [key: string]: string } = {
      slideshow: 'Slideshow',
      fileexplorer: 'File Explorer',
      notes: 'Notes',
      calculator: 'Calculator',
      schedule: 'Schedule',
      recorder: 'Recorder',
      settings: 'Settings',
      clock: 'Clock',
      church: 'Church',
      messenger: 'Messenger',
      groups: 'Groups',
      pages: 'Pages',
      videos: 'Videos',
      photos: 'Photos',
      appstore: 'App Store',
      podcast: 'Podcast Studio',
      videoaudiorecorder: 'Media Recorder',
    };

    const appIcons: { [key: string]: string } = {
      slideshow: '🖼️',
      fileexplorer: '📁',
      notes: '📝',
      calculator: '🧮',
      schedule: '📅',
      recorder: '🎙️',
      settings: '⚙️',
      clock: '🕐',
      church: '⛪',
      messenger: '💬',
      groups: '👥',
      pages: '📄',
      videos: '🎬',
      photos: '📷',
      appstore: '🏪',
      podcast: '🎧',
      videoaudiorecorder: '🎬',
    };

    openWindow({
      id: appId,
      title: appNames[appId] || 'App',
      icon: appIcons[appId] || '📱',
      component: <div>Loading...</div>,
      width: 800,
      height: 600,
    });
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {shortcuts.map(shortcut => (
        <div
          key={shortcut.id}
          className="absolute pointer-events-auto cursor-move group"
          style={{
            left: `${shortcut.x}%`,
            top: `${shortcut.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          onMouseDown={(e) => handleMouseDown(e, shortcut.id)}
        >
          <div
            className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-accent/10 transition-colors"
            onClick={() => handleShortcutClick(shortcut.appId)}
          >
            <div className="text-5xl cursor-pointer hover:scale-110 transition-transform">
              {shortcut.icon}
            </div>
            <span className="text-xs text-center text-foreground/70 max-w-16 truncate">
              {shortcut.name}
            </span>
          </div>

          {/* Delete button on hover */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              removeShortcut(shortcut.id);
            }}
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ))}
    </div>
  );
}
