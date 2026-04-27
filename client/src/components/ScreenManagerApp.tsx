import { useState } from 'react';
import { Monitor, Settings, Zap, Eye, Volume2, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DisplaySettings {
  brightness: number;
  contrast: number;
  saturation: number;
  resolution: string;
  refreshRate: string;
  colorMode: 'standard' | 'vivid' | 'cinema';
  nightLight: boolean;
  nightLightIntensity: number;
  volume: number;
}

export default function ScreenManagerApp() {
  const [settings, setSettings] = useState<DisplaySettings>({
    brightness: 80,
    contrast: 100,
    saturation: 100,
    resolution: '1920x1080',
    refreshRate: '60Hz',
    colorMode: 'standard',
    nightLight: false,
    nightLightIntensity: 30,
    volume: 70,
  });

  const [activeTab, setActiveTab] = useState<'display' | 'audio' | 'advanced'>('display');

  const resolutions = ['1024x768', '1280x720', '1366x768', '1920x1080', '2560x1440', '3840x2160'];
  const refreshRates = ['30Hz', '60Hz', '120Hz', '144Hz', '240Hz'];

  const handleBrightnessChange = (value: number) => {
    setSettings({ ...settings, brightness: value });
  };

  const handleContrastChange = (value: number) => {
    setSettings({ ...settings, contrast: value });
  };

  const handleSaturationChange = (value: number) => {
    setSettings({ ...settings, saturation: value });
  };

  const handleVolumeChange = (value: number) => {
    setSettings({ ...settings, volume: value });
  };

  const toggleNightLight = () => {
    setSettings({ ...settings, nightLight: !settings.nightLight });
  };

  const handleColorModeChange = (mode: 'standard' | 'vivid' | 'cinema') => {
    setSettings({ ...settings, colorMode: mode });
  };

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 bg-card">
        <div className="flex items-center gap-2">
          <Monitor className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-bold">Display & Screen Settings</h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border bg-card/50">
        {(['display', 'audio', 'advanced'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-4 font-semibold transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-accent text-accent'
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Display Tab */}
        {activeTab === 'display' && (
          <div className="space-y-6 max-w-2xl">
            {/* Brightness */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-semibold flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  Brightness
                </label>
                <span className="text-sm text-foreground/60">{settings.brightness}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.brightness}
                onChange={(e) => handleBrightnessChange(Number(e.target.value))}
                className="w-full h-2 bg-card border border-border rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Contrast */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-semibold">Contrast</label>
                <span className="text-sm text-foreground/60">{settings.contrast}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={settings.contrast}
                onChange={(e) => handleContrastChange(Number(e.target.value))}
                className="w-full h-2 bg-card border border-border rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Saturation */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-semibold">Saturation</label>
                <span className="text-sm text-foreground/60">{settings.saturation}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="150"
                value={settings.saturation}
                onChange={(e) => handleSaturationChange(Number(e.target.value))}
                className="w-full h-2 bg-card border border-border rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Color Mode */}
            <div className="space-y-3">
              <label className="font-semibold">Color Mode</label>
              <div className="grid grid-cols-3 gap-3">
                {(['standard', 'vivid', 'cinema'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => handleColorModeChange(mode)}
                    className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all ${
                      settings.colorMode === mode
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-border hover:border-accent'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution */}
            <div className="space-y-3">
              <label className="font-semibold">Resolution</label>
              <select
                value={settings.resolution}
                onChange={(e) => setSettings({ ...settings, resolution: e.target.value })}
                className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {resolutions.map(res => (
                  <option key={res} value={res}>{res}</option>
                ))}
              </select>
            </div>

            {/* Refresh Rate */}
            <div className="space-y-3">
              <label className="font-semibold">Refresh Rate</label>
              <select
                value={settings.refreshRate}
                onChange={(e) => setSettings({ ...settings, refreshRate: e.target.value })}
                className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {refreshRates.map(rate => (
                  <option key={rate} value={rate}>{rate}</option>
                ))}
              </select>
            </div>

            {/* Night Light */}
            <div className="space-y-3 bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <label className="font-semibold flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Night Light
                </label>
                <button
                  onClick={toggleNightLight}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    settings.nightLight
                      ? 'bg-accent text-white'
                      : 'bg-card border border-border'
                  }`}
                >
                  {settings.nightLight ? 'On' : 'Off'}
                </button>
              </div>
              {settings.nightLight && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground/60">Intensity</span>
                    <span className="text-sm text-foreground/60">{settings.nightLightIntensity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.nightLightIntensity}
                    onChange={(e) => setSettings({ ...settings, nightLightIntensity: Number(e.target.value) })}
                    className="w-full h-2 bg-background border border-border rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Audio Tab */}
        {activeTab === 'audio' && (
          <div className="space-y-6 max-w-2xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-semibold flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  Volume
                </label>
                <span className="text-sm text-foreground/60">{settings.volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-full h-2 bg-card border border-border rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="bg-card border border-border rounded-lg p-4 space-y-3">
              <h3 className="font-semibold">Audio Devices</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-background rounded border border-border">
                  <span className="text-sm">Speakers</span>
                  <span className="text-xs text-accent">Connected</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-background rounded border border-border">
                  <span className="text-sm">Microphone</span>
                  <span className="text-xs text-accent">Connected</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-background rounded border border-border">
                  <span className="text-sm">Headphones</span>
                  <span className="text-xs text-foreground/60">Not connected</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Tab */}
        {activeTab === 'advanced' && (
          <div className="space-y-6 max-w-2xl">
            <div className="bg-card border border-border rounded-lg p-4 space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Power Settings
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-background rounded border border-border">
                  <span className="text-sm">Screen Timeout</span>
                  <select className="bg-card border border-border rounded px-2 py-1 text-sm">
                    <option>5 minutes</option>
                    <option>10 minutes</option>
                    <option>15 minutes</option>
                    <option>Never</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-3 bg-background rounded border border-border">
                  <span className="text-sm">Power Mode</span>
                  <select className="bg-card border border-border rounded px-2 py-1 text-sm">
                    <option>Balanced</option>
                    <option>Performance</option>
                    <option>Power Saver</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4 space-y-3">
              <h3 className="font-semibold">Display Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-background rounded">
                  <span className="text-foreground/60">Monitor Model</span>
                  <span className="font-semibold">Dell UltraSharp</span>
                </div>
                <div className="flex justify-between p-2 bg-background rounded">
                  <span className="text-foreground/60">Native Resolution</span>
                  <span className="font-semibold">2560x1440</span>
                </div>
                <div className="flex justify-between p-2 bg-background rounded">
                  <span className="text-foreground/60">Color Depth</span>
                  <span className="font-semibold">32-bit</span>
                </div>
                <div className="flex justify-between p-2 bg-background rounded">
                  <span className="text-foreground/60">Refresh Rate</span>
                  <span className="font-semibold">{settings.refreshRate}</span>
                </div>
              </div>
            </div>

            <Button className="w-full bg-accent hover:bg-accent/90">
              <Settings className="w-4 h-4 mr-2" />
              Advanced Display Settings
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
