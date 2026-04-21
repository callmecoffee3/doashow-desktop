import { useState } from 'react';
import { Volume2, Sun, Bell, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SettingsPanel() {
  const [brightness, setBrightness] = useState(80);
  const [volume, setVolume] = useState(70);
  const [notifications, setNotifications] = useState(true);
  const [autoplay, setAutoplay] = useState(true);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 bg-secondary">
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-sm text-foreground/60">System Preferences</p>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6 max-w-2xl">
          {/* Display Settings */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Monitor className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold">Display</h3>
            </div>
            <div className="space-y-4 ml-8">
              <div>
                <label className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Brightness</span>
                  <span className="text-sm text-foreground/60">{brightness}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">Dark Mode</span>
                </label>
              </div>
              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">High Contrast</span>
                </label>
              </div>
            </div>
          </section>

          {/* Sound Settings */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Volume2 className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold">Sound</h3>
            </div>
            <div className="space-y-4 ml-8">
              <div>
                <label className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Volume</span>
                  <span className="text-sm text-foreground/60">{volume}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">System Sounds</span>
                </label>
              </div>
            </div>
          </section>

          {/* Notification Settings */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold">Notifications</h3>
            </div>
            <div className="space-y-4 ml-8">
              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">Enable Notifications</span>
                </label>
              </div>
              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={autoplay}
                    onChange={(e) => setAutoplay(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">Autoplay Media</span>
                </label>
              </div>
              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">Show System Updates</span>
                </label>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <div className="space-y-2 text-sm text-foreground/70 ml-8">
              <div className="flex justify-between">
                <span>System:</span>
                <span className="font-mono">DoaShow v1.0</span>
              </div>
              <div className="flex justify-between">
                <span>Build:</span>
                <span className="font-mono">2026.04.21</span>
              </div>
              <div className="flex justify-between">
                <span>Platform:</span>
                <span className="font-mono">Web-based</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
