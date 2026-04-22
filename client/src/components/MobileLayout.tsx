import { useState } from 'react';
import { Menu, Home, Grid3x3, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppLauncher from '@/components/AppLauncher';
import StartMenu from '@/components/StartMenu';
import { useWindow } from '@/contexts/WindowContext';

export default function MobileLayout() {
  const { windows, openWindow } = useWindow();
  const [showMenu, setShowMenu] = useState(false);
  const [showAppLauncher, setShowAppLauncher] = useState(true);
  const [showStartMenu, setShowStartMenu] = useState(false);

  const visibleWindows = windows.filter(w => !w.isMinimized);
  const currentWindow = visibleWindows.length > 0 ? visibleWindows[visibleWindows.length - 1] : null;

  return (
    <div className="w-full h-screen bg-background flex flex-col overflow-hidden">
      {/* Mobile Header */}
      <div className="bg-secondary border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎬</span>
          <h1 className="text-sm font-bold truncate">DoaShow</h1>
        </div>
        <Button
          onClick={() => setShowMenu(!showMenu)}
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          {showMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* App Launcher View */}
        {showAppLauncher && !currentWindow ? (
          <div className="w-full h-full overflow-y-auto">
            <AppLauncher />
          </div>
        ) : null}

        {/* Current Window View */}
        {currentWindow && (
          <div className="w-full h-full flex flex-col bg-background">
            {/* Window Header */}
            <div className="bg-secondary border-b border-border px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>{currentWindow.icon}</span>
                <h2 className="text-sm font-semibold truncate">{currentWindow.title}</h2>
              </div>
              <Button
                onClick={() => setShowAppLauncher(true)}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <Home className="w-4 h-4" />
              </Button>
            </div>

            {/* Window Content */}
            <div className="flex-1 overflow-y-auto">
              {currentWindow.component}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowMenu(false)}>
          <div className="absolute bottom-0 left-0 right-0 bg-secondary border-t border-border rounded-t-lg p-4 space-y-2">
            <Button
              onClick={() => {
                setShowAppLauncher(true);
                setShowMenu(false);
              }}
              variant="outline"
              className="w-full justify-start gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </Button>
            <Button
              onClick={() => {
                setShowStartMenu(!showStartMenu);
              }}
              variant="outline"
              className="w-full justify-start gap-2"
            >
              <Grid3x3 className="w-4 h-4" />
              Apps
            </Button>
            <Button
              onClick={() => {
                // Open settings
                setShowMenu(false);
              }}
              variant="outline"
              className="w-full justify-start gap-2"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="bg-secondary border-t border-border px-4 py-2 flex items-center justify-around h-14">
        <Button
          onClick={() => {
            setShowAppLauncher(true);
          }}
          variant={showAppLauncher ? 'default' : 'ghost'}
          size="icon"
          className="h-8 w-8"
          title="Home"
        >
          <Home className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => {
            setShowStartMenu(!showStartMenu);
          }}
          variant={showStartMenu ? 'default' : 'ghost'}
          size="icon"
          className="h-8 w-8"
          title="Apps"
        >
          <Grid3x3 className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-1 text-xs text-foreground/60">
          <span>{windows.length}</span>
          <span>app{windows.length !== 1 ? 's' : ''}</span>
        </div>
        <Button
          onClick={() => {
            setShowMenu(!showMenu);
          }}
          variant={showMenu ? 'default' : 'ghost'}
          size="icon"
          className="h-8 w-8"
          title="Menu"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      {/* Start Menu Overlay */}
      {showStartMenu && (
        <div className="absolute inset-0 bg-black/50 z-30" onClick={() => setShowStartMenu(false)}>
          <div className="absolute bottom-14 left-0 right-0 bg-card border-t border-border">
            <StartMenu
              isOpen={showStartMenu}
              onClose={() => setShowStartMenu(false)}
              onAppLaunch={() => {
                setShowStartMenu(false);
                setShowAppLauncher(true);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
