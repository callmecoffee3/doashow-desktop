import { useState, useEffect } from 'react';
import { useWindow } from '@/contexts/WindowContext';
import DraggableWindow from '@/components/DraggableWindow';
import AppLauncher from '@/components/AppLauncher';
import StartMenu from '@/components/StartMenu';
import ScrollingBanner from '@/components/ScrollingBanner';
import { Button } from '@/components/ui/button';
import { Grid3x3, Clock } from 'lucide-react';

export default function Desktop() {
  const { windows, openWindow } = useWindow();
  const [showAppLauncher, setShowAppLauncher] = useState(true);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const visibleWindows = windows.filter(w => !w.isMinimized);

  const handleLaunchApp = (appId: string) => {
    setShowStartMenu(false);
    setShowAppLauncher(true);
  };

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

        {/* Center: Open Windows */}
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
