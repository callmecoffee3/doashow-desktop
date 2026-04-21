import { useState } from 'react';
import { ChevronRight, Power, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAppLaunch?: (appId: string) => void;
}

interface AppCategory {
  name: string;
  apps: Array<{ id: string; name: string; icon: string }>;
}

export default function StartMenu({ isOpen, onClose, onAppLaunch }: StartMenuProps) {
  const [showPowerMenu, setShowPowerMenu] = useState(false);

  const categories: AppCategory[] = [
    {
      name: 'Media',
      apps: [
        { id: 'slideshow', name: 'Slideshow', icon: '🖼️' },
        { id: 'recorder', name: 'Recorder', icon: '🎙️' },
      ],
    },
    {
      name: 'Productivity',
      apps: [
        { id: 'notes', name: 'Notes', icon: '📝' },
        { id: 'schedule', name: 'Schedule', icon: '📅' },
        { id: 'calculator', name: 'Calculator', icon: '🧮' },
      ],
    },
    {
      name: 'System',
      apps: [
        { id: 'explorer', name: 'File Explorer', icon: '📁' },
        { id: 'settings', name: 'Settings', icon: '⚙️' },
        { id: 'clock', name: 'Clock', icon: '🕐' },
      ],
    },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Start Menu */}
      <div className="fixed bottom-14 left-0 w-96 bg-card border border-border rounded-lg shadow-2xl z-50 overflow-hidden flex flex-col max-h-[600px]">
        {/* Header */}
        <div className="bg-gradient-to-r from-accent to-accent/80 px-6 py-4 flex-shrink-0">
          <h2 className="text-xl font-bold text-accent-foreground">DoaShow</h2>
          <p className="text-xs text-accent-foreground/70">Desktop Environment</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* App Categories */}
          {categories.map((category, idx) => (
            <div key={category.name} className={idx > 0 ? 'border-t border-border' : ''}>
              <div className="px-4 py-2 text-xs font-semibold text-foreground/60 uppercase tracking-wider bg-secondary/30 sticky top-0">
                {category.name}
              </div>
              <div className="space-y-1 px-2 py-2">
                {category.apps.map(app => (
                  <button
                    key={app.id}
                    onClick={() => {
                      onAppLaunch?.(app.id);
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-accent/10 transition-colors text-left"
                  >
                    <span className="text-xl">{app.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{app.name}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-foreground/40" />
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Power Options Section */}
          <div className="border-t border-border">
            <div className="px-4 py-2 text-xs font-semibold text-foreground/60 uppercase tracking-wider bg-secondary/30">
              Power
            </div>
            <div className="space-y-1 px-2 py-2">
              <button
                onClick={() => setShowPowerMenu(!showPowerMenu)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-accent/10 transition-colors text-left"
              >
                <Power className="w-5 h-5 text-foreground/70" />
                <span className="flex-1 text-sm">Power Options</span>
                <ChevronRight className={`w-4 h-4 text-foreground/40 transition-transform ${showPowerMenu ? 'rotate-90' : ''}`} />
              </button>

              {showPowerMenu && (
                <div className="ml-8 space-y-1">
                  <button className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm hover:bg-destructive/10 text-destructive transition-colors">
                    <Power className="w-4 h-4" />
                    Shut Down
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm hover:bg-accent/10 transition-colors">
                    <Power className="w-4 h-4" />
                    Restart
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm hover:bg-accent/10 transition-colors">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-4 py-3 bg-secondary/50 flex-shrink-0">
          <div className="text-xs text-foreground/60">
            <p>DoaShow v1.0</p>
            <p>© 2026 Desktop Environment</p>
          </div>
        </div>
      </div>
    </>
  );
}
