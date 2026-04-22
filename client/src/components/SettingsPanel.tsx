import { useState, useEffect } from 'react';
import { Volume2, Sun, Bell, Monitor, Palette, Lock, Database, HardDrive, Zap, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SystemPreferences {
  brightness: number;
  volume: number;
  notifications: boolean;
  autoplay: boolean;
  darkMode: boolean;
  highContrast: boolean;
  systemSounds: boolean;
  theme: 'dark' | 'light' | 'auto';
  language: string;
  fontSize: 'small' | 'medium' | 'large';
  autoLock: boolean;
  lockTimeout: number;
}

export default function SettingsPanel() {
  const [preferences, setPreferences] = useState<SystemPreferences>(() => {
    const saved = localStorage.getItem('doashow_preferences');
    return saved ? JSON.parse(saved) : {
      brightness: 80,
      volume: 70,
      notifications: true,
      autoplay: true,
      darkMode: true,
      highContrast: false,
      systemSounds: true,
      theme: 'dark',
      language: 'en',
      fontSize: 'medium',
      autoLock: false,
      lockTimeout: 5,
    };
  });

  const [storageInfo, setStorageInfo] = useState({
    used: 2.4,
    total: 50,
    percentage: 4.8,
  });

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    localStorage.setItem('doashow_preferences', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreference = (key: keyof SystemPreferences, value: any) => {
    setPreferences({ ...preferences, [key]: value });
  };

  const resetSettings = () => {
    const defaultPrefs: SystemPreferences = {
      brightness: 80,
      volume: 70,
      notifications: true,
      autoplay: true,
      darkMode: true,
      highContrast: false,
      systemSounds: true,
      theme: 'dark',
      language: 'en',
      fontSize: 'medium',
      autoLock: false,
      lockTimeout: 5,
    };
    setPreferences(defaultPrefs);
    setShowResetConfirm(false);
  };

  const clearCache = () => {
    localStorage.clear();
    alert('Cache cleared successfully');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 bg-secondary sticky top-0 z-10">
        <h2 className="text-2xl font-bold">⚙️ Settings</h2>
        <p className="text-sm text-foreground/60">System Preferences & Customization</p>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-8 max-w-3xl">
          {/* Display Settings */}
          <section className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-center gap-3 mb-6">
              <Monitor className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-bold">Display</h3>
            </div>
            <div className="space-y-4 ml-8">
              <div>
                <label className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Brightness</span>
                  <span className="text-sm text-foreground/60">{preferences.brightness}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={preferences.brightness}
                  onChange={(e) => updatePreference('brightness', Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-3">Theme</label>
                <div className="space-y-2">
                  {['dark', 'light', 'auto'].map(theme => (
                    <label key={theme} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="theme"
                        value={theme}
                        checked={preferences.theme === theme}
                        onChange={(e) => updatePreference('theme', e.target.value as any)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm capitalize">{theme} Mode</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-3">Font Size</label>
                <div className="space-y-2">
                  {['small', 'medium', 'large'].map(size => (
                    <label key={size} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="fontSize"
                        value={size}
                        checked={preferences.fontSize === size}
                        onChange={(e) => updatePreference('fontSize', e.target.value as any)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm capitalize">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={preferences.highContrast}
                    onChange={(e) => updatePreference('highContrast', e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">High Contrast Mode</span>
                </label>
              </div>
            </div>
          </section>

          {/* Sound Settings */}
          <section className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-center gap-3 mb-6">
              <Volume2 className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-bold">Sound & Audio</h3>
            </div>
            <div className="space-y-4 ml-8">
              <div>
                <label className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Master Volume</span>
                  <span className="text-sm text-foreground/60">{preferences.volume}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={preferences.volume}
                  onChange={(e) => updatePreference('volume', Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={preferences.systemSounds}
                    onChange={(e) => updatePreference('systemSounds', e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">System Sounds</span>
                </label>
              </div>
            </div>
          </section>

          {/* Notification Settings */}
          <section className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-bold">Notifications</h3>
            </div>
            <div className="space-y-3 ml-8">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={preferences.notifications}
                  onChange={(e) => updatePreference('notifications', e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm">Enable Notifications</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={preferences.autoplay}
                  onChange={(e) => updatePreference('autoplay', e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm">Autoplay Media</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm">Show System Updates</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm">Message Notifications</span>
              </label>
            </div>
          </section>

          {/* Security Settings */}
          <section className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-bold">Security & Privacy</h3>
            </div>
            <div className="space-y-4 ml-8">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={preferences.autoLock}
                  onChange={(e) => updatePreference('autoLock', e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm">Auto-lock System</span>
              </label>
              {preferences.autoLock && (
                <div>
                  <label className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Lock Timeout (minutes)</span>
                    <span className="text-sm text-foreground/60">{preferences.lockTimeout}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={preferences.lockTimeout}
                    onChange={(e) => updatePreference('lockTimeout', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}
              <div>
                <label className="text-sm font-medium block mb-3">Language</label>
                <select
                  value={preferences.language}
                  onChange={(e) => updatePreference('language', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="zh">中文</option>
                </select>
              </div>
            </div>
          </section>

          {/* Storage Information */}
          <section className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-center gap-3 mb-6">
              <HardDrive className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-bold">Storage</h3>
            </div>
            <div className="ml-8 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Storage Used</span>
                  <span className="text-sm text-foreground/60">{storageInfo.used} GB / {storageInfo.total} GB</span>
                </div>
                <div className="w-full h-2 bg-foreground/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-accent/50"
                    style={{ width: `${storageInfo.percentage}%` }}
                  ></div>
                </div>
              </div>
              <Button onClick={clearCache} variant="outline" size="sm" className="w-full">
                Clear Cache
              </Button>
            </div>
          </section>

          {/* System Information */}
          <section className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-bold">System Information</h3>
            </div>
            <div className="space-y-3 text-sm text-foreground/70 ml-8">
              <div className="flex justify-between">
                <span>System Name:</span>
                <span className="font-mono">DoaShow Desktop</span>
              </div>
              <div className="flex justify-between">
                <span>Version:</span>
                <span className="font-mono">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>Build:</span>
                <span className="font-mono">2026.04.22</span>
              </div>
              <div className="flex justify-between">
                <span>Platform:</span>
                <span className="font-mono">Web-based</span>
              </div>
              <div className="flex justify-between">
                <span>Installed Apps:</span>
                <span className="font-mono">15+</span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated:</span>
                <span className="font-mono">2026-04-22</span>
              </div>
            </div>
          </section>

          {/* Reset Settings */}
          <section className="border border-border rounded-lg p-6 bg-card border-destructive/50">
            <h3 className="text-lg font-bold mb-4 text-destructive">Danger Zone</h3>
            <div className="space-y-3 ml-8">
              <p className="text-sm text-foreground/70">
                Reset all settings to their default values. This action cannot be undone.
              </p>
              {!showResetConfirm ? (
                <Button onClick={() => setShowResetConfirm(true)} variant="destructive" size="sm">
                  Reset All Settings
                </Button>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Are you sure? This cannot be undone.</p>
                  <div className="flex gap-2">
                    <Button onClick={resetSettings} variant="destructive" size="sm" className="flex-1">
                      Confirm Reset
                    </Button>
                    <Button onClick={() => setShowResetConfirm(false)} variant="outline" size="sm" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
