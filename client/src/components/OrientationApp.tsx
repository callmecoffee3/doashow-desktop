import { useState } from 'react';
import { RotateCw, Smartphone, Monitor, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Orientation = 'portrait' | 'landscape' | 'auto' | 'reverse-portrait' | 'reverse-landscape';

interface OrientationSettings {
  current: Orientation;
  autoRotate: boolean;
  rotationLock: boolean;
  portraitLock: boolean;
  displaySize: 'small' | 'normal' | 'large' | 'extra-large';
  fontSize: 'small' | 'normal' | 'large' | 'extra-large';
}

export default function OrientationApp() {
  const [settings, setSettings] = useState<OrientationSettings>({
    current: 'landscape',
    autoRotate: true,
    rotationLock: false,
    portraitLock: false,
    displaySize: 'normal',
    fontSize: 'normal',
  });

  const [history, setHistory] = useState<Orientation[]>(['landscape', 'portrait', 'landscape']);

  const orientations: { value: Orientation; label: string; icon: string }[] = [
    { value: 'portrait', label: 'Portrait', icon: '📱' },
    { value: 'landscape', label: 'Landscape', icon: '📺' },
    { value: 'auto', label: 'Auto', icon: '🔄' },
    { value: 'reverse-portrait', label: 'Reverse Portrait', icon: '📱' },
    { value: 'reverse-landscape', label: 'Reverse Landscape', icon: '📺' },
  ];

  const handleOrientationChange = (orientation: Orientation) => {
    if (settings.rotationLock) return;
    setSettings({ ...settings, current: orientation });
    setHistory([...history.slice(-4), orientation]);
  };

  const toggleAutoRotate = () => {
    if (settings.rotationLock) return;
    setSettings({ ...settings, autoRotate: !settings.autoRotate });
  };

  const toggleRotationLock = () => {
    setSettings({ ...settings, rotationLock: !settings.rotationLock });
  };

  const togglePortraitLock = () => {
    if (settings.rotationLock) return;
    setSettings({ ...settings, portraitLock: !settings.portraitLock });
  };

  const getOrientationPreview = () => {
    const baseClasses = 'border-4 border-accent rounded-lg flex items-center justify-center font-bold text-2xl bg-card';
    switch (settings.current) {
      case 'portrait':
        return <div className={`${baseClasses} w-32 h-48`}>📱</div>;
      case 'landscape':
        return <div className={`${baseClasses} w-48 h-32`}>📺</div>;
      case 'reverse-portrait':
        return <div className={`${baseClasses} w-32 h-48 transform scale-x-[-1]`}>📱</div>;
      case 'reverse-landscape':
        return <div className={`${baseClasses} w-48 h-32 transform scale-x-[-1]`}>📺</div>;
      case 'auto':
        return <div className={`${baseClasses} w-40 h-40`}>🔄</div>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 bg-card">
        <div className="flex items-center gap-2">
          <RotateCw className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-bold">Screen Orientation</h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl space-y-6">
          {/* Current Orientation Preview */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h3 className="font-bold">Current Orientation</h3>
            <div className="flex justify-center">
              {getOrientationPreview()}
            </div>
            <div className="text-center">
              <p className="text-lg font-bold capitalize">{settings.current.replace('-', ' ')}</p>
              <p className="text-sm text-foreground/60">
                {settings.current === 'landscape' ? '1920 x 1080' : '1080 x 1920'}
              </p>
            </div>
          </div>

          {/* Orientation Controls */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h3 className="font-bold">Select Orientation</h3>
            <div className="grid grid-cols-2 gap-3">
              {orientations.map(orientation => (
                <button
                  key={orientation.value}
                  onClick={() => handleOrientationChange(orientation.value)}
                  disabled={settings.rotationLock && orientation.value !== settings.current}
                  className={`py-4 px-4 rounded-lg border-2 font-semibold transition-all ${
                    settings.current === orientation.value
                      ? 'border-accent bg-accent/10 text-accent'
                      : settings.rotationLock && orientation.value !== settings.current
                      ? 'border-border opacity-50 cursor-not-allowed'
                      : 'border-border hover:border-accent'
                  }`}
                >
                  <div className="text-2xl mb-2">{orientation.icon}</div>
                  {orientation.label}
                </button>
              ))}
            </div>
          </div>

          {/* Auto-Rotate Settings */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h3 className="font-bold">Auto-Rotate Settings</h3>
            <div className="space-y-3">
              {/* Auto-Rotate Toggle */}
              <div className="flex items-center justify-between p-4 bg-background rounded border border-border">
                <div className="flex items-center gap-2">
                  <RotateCw className="w-4 h-4" />
                  <span className="font-semibold">Auto-Rotate</span>
                </div>
                <button
                  onClick={toggleAutoRotate}
                  disabled={settings.rotationLock}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    settings.autoRotate
                      ? 'bg-accent text-white'
                      : 'bg-card border border-border'
                  } ${settings.rotationLock ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {settings.autoRotate ? 'On' : 'Off'}
                </button>
              </div>

              {/* Rotation Lock */}
              <div className="flex items-center justify-between p-4 bg-background rounded border border-border">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span className="font-semibold">Lock Rotation</span>
                </div>
                <button
                  onClick={toggleRotationLock}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    settings.rotationLock
                      ? 'bg-red-500 text-white'
                      : 'bg-card border border-border'
                  }`}
                >
                  {settings.rotationLock ? 'Locked' : 'Unlocked'}
                </button>
              </div>

              {/* Portrait Lock */}
              <div className="flex items-center justify-between p-4 bg-background rounded border border-border">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <span className="font-semibold">Portrait Lock</span>
                </div>
                <button
                  onClick={togglePortraitLock}
                  disabled={settings.rotationLock}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    settings.portraitLock
                      ? 'bg-accent text-white'
                      : 'bg-card border border-border'
                  } ${settings.rotationLock ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {settings.portraitLock ? 'On' : 'Off'}
                </button>
              </div>
            </div>
          </div>

          {/* Display Size */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h3 className="font-bold">Display Size</h3>
            <div className="grid grid-cols-4 gap-3">
              {['small', 'normal', 'large', 'extra-large'].map(size => (
                <button
                  key={size}
                  onClick={() => setSettings({ ...settings, displaySize: size as any })}
                  className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all ${
                    settings.displaySize === size
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border hover:border-accent'
                  }`}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h3 className="font-bold">Font Size</h3>
            <div className="grid grid-cols-4 gap-3">
              {['small', 'normal', 'large', 'extra-large'].map(size => (
                <button
                  key={size}
                  onClick={() => setSettings({ ...settings, fontSize: size as any })}
                  className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all ${
                    settings.fontSize === size
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border hover:border-accent'
                  }`}
                >
                  {size === 'small' ? 'A' : size === 'normal' ? 'A' : size === 'large' ? 'A' : 'A'}
                </button>
              ))}
            </div>
          </div>

          {/* Rotation History */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h3 className="font-bold">Recent Orientations</h3>
            <div className="flex gap-2">
              {history.map((orientation, index) => (
                <button
                  key={index}
                  onClick={() => handleOrientationChange(orientation)}
                  className="px-4 py-2 bg-background border border-border rounded-lg hover:border-accent transition-all capitalize text-sm"
                >
                  {orientation.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
