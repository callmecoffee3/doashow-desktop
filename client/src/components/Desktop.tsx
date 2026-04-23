import { useState, useEffect } from 'react';
import { useWindow } from '@/contexts/WindowContext';
import DraggableWindow from '@/components/DraggableWindow';
import AppLauncher from '@/components/AppLauncher';
import StartMenu from '@/components/StartMenu';
import ScrollingBanner from '@/components/ScrollingBanner';
import DesktopShortcuts from '@/components/DesktopShortcuts';
import { Button } from '@/components/ui/button';
import { Grid3x3, Clock, Search, X } from 'lucide-react';

const ALL_APPS = [
  { id: 'slideshow', name: 'Slideshow', icon: '🖼️' },
  { id: 'explorer', name: 'File Explorer', icon: '📁' },
  { id: 'notes', name: 'Notes', icon: '📝' },
  { id: 'calculator', name: 'Calculator', icon: '🧮' },
  { id: 'schedule', name: 'Schedule', icon: '📅' },
  { id: 'recorder', name: 'Recorder', icon: '🎙️' },
  { id: 'settings', name: 'Settings', icon: '⚙️' },
  { id: 'clock', name: 'Clock', icon: '🕐' },
  { id: 'messenger', name: 'Messenger', icon: '💬' },
  { id: 'groups', name: 'Groups', icon: '👥' },
  { id: 'pages', name: 'Pages', icon: '📄' },
  { id: 'videos', name: 'Videos', icon: '🎥' },
  { id: 'photos', name: 'Photos', icon: '📸' },
  { id: 'podcast', name: 'Podcast', icon: '🎧' },
  { id: 'business', name: 'Cinema Studios', icon: '💼' },
  { id: 'contracts', name: 'Contracts', icon: '📋' },
  { id: 'construction', name: 'Construction', icon: '🔨' },
  { id: 'dashboard', name: 'Dashboard', icon: '📊' },
  { id: 'social', name: 'SocialHub', icon: '👥' },
  { id: 'todo', name: 'Todo List', icon: '✓' },
];

export default function Desktop() {
  const { windows, openWindow } = useWindow();
  const [showAppLauncher, setShowAppLauncher] = useState(true);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const visibleWindows = windows.filter(w => !w.isMinimized);

  const handleLaunchApp = (appId: string) => {
    setShowStartMenu(false);
    setShowAppLauncher(true);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const filteredApps = ALL_APPS.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-screen bg-gradient-to-br from-background via-card to-background overflow-hidden flex flex-col">
      {/* DoaShow Header */}
      <div className="bg-gradient-to-r from-accent/20 to-accent/10 border-b border-accent/30 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎬</span>
          <h1 className="text-xl font-bold bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">DoaShow</h1>
        </div>
        <p className="text-xs text-foreground/60">Desktop Environment v1.0</p>
      </div>

      {/* Scrolling Banner */}
      <ScrollingBanner autoScroll={true} scrollInterval={5000} />

      {/* Main Desktop Area */}
      <div className="flex-1 relative">
        {/* Desktop Shortcuts */}
        <DesktopShortcuts />

        {/* App Launcher Background */}
        {showAppLauncher && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full">
              <div className="w-full max-w-4xl">
                <AppLauncher />
              </div>
            </div>
          </div>
        )}

        {/* Open Windows */}
        {visibleWindows.map(window => (
          <DraggableWindow
            key={window.id}
            id={window.id}
            title={window.title}
            icon={window.icon}
            width={window.width}
            height={window.height}
            x={window.x}
            y={window.y}
            isMaximized={window.isMaximized}
          >
            {window.component}
          </DraggableWindow>
        ))}
      </div>

      {/* Taskbar */}
      <div className="bg-secondary border-t border-border px-4 py-2 flex items-center justify-between h-14 shadow-lg relative">
        {/* Start Menu */}
        <StartMenu
          isOpen={showStartMenu}
          onClose={() => setShowStartMenu(false)}
          onAppLaunch={handleLaunchApp}
        />

        {/* Left: Start Button */}
        <Button
          onClick={() => setShowStartMenu(!showStartMenu)}
          variant={showStartMenu ? 'default' : 'ghost'}
          size="icon"
          className="rounded-lg bg-accent/20 hover:bg-accent/30"
          title="Start Menu"
        >
          <Grid3x3 className="w-5 h-5" />
        </Button>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-md mx-4 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
            <input
              type="text"
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(e.target.value.length > 0);
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && filteredApps.length > 0) {
                  const app = filteredApps[0];
                  openWindow({ id: app.id, title: app.name, icon: app.icon, component: null });
                  setSearchQuery('');
                  setShowSearchResults(false);
                }
              }}
              className="w-full pl-9 pr-8 py-1.5 bg-background/50 border border-border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-accent"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchResults(false);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            )}

            {/* Search Results Dropdown */}
            {showSearchResults && filteredApps.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
                {filteredApps.slice(0, 8).map(app => (
                  <button
                    key={app.id}
                    onClick={() => {
                      openWindow({ id: app.id, title: app.name, icon: app.icon, component: null });
                      setSearchQuery('');
                      setShowSearchResults(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent/10 transition-colors text-left text-xs border-b border-border/50 last:border-b-0"
                  >
                    <span className="text-lg">{app.icon}</span>
                    <span className="font-medium">{app.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Open Windows */}
        <div className="flex gap-2 flex-1 justify-center">
          {windows.map(window => (
            <Button
              key={window.id}
              variant={window.isMinimized ? 'outline' : 'default'}
              size="sm"
              className="gap-2 max-w-xs truncate"
            >
              <span>{window.icon}</span>
              <span className="truncate">{window.title}</span>
            </Button>
          ))}
        </div>

        {/* Right: System Tray */}
        <div className="flex items-center gap-3 text-sm text-foreground/70 cursor-pointer hover:text-foreground transition-colors">
          <Clock className="w-4 h-4" />
          <span className="font-mono">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
}
