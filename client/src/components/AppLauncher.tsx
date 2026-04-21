import { useWindow } from '@/contexts/WindowContext';
import { Button } from '@/components/ui/button';
import Slideshow from '@/components/Slideshow';
import FileExplorer from '@/components/FileExplorer';
import SettingsPanel from '@/components/SettingsPanel';
import ClockWidget from '@/components/ClockWidget';

interface App {
  id: string;
  name: string;
  icon: string;
  description: string;
  component: React.ReactNode;
}

export default function AppLauncher() {
  const { openWindow } = useWindow();

  const sampleImages = [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
      title: 'Mountain Vista',
      description: 'Serene alpine landscape at sunset',
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&q=80',
      title: 'Ocean Horizon',
      description: 'Tranquil seascape with golden hour light',
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&q=60',
      title: 'Forest Path',
      description: 'Winding trail through ancient woodland',
    },
  ];

  const apps: App[] = [
    {
      id: 'slideshow',
      name: 'Slideshow',
      icon: '🖼️',
      description: 'View image galleries',
      component: <Slideshow images={sampleImages} autoPlayInterval={5000} />,
    },
    {
      id: 'explorer',
      name: 'File Explorer',
      icon: '📁',
      description: 'Browse files and folders',
      component: <FileExplorer />,
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: '⚙️',
      description: 'System preferences',
      component: <SettingsPanel />,
    },
    {
      id: 'clock',
      name: 'Clock',
      icon: '🕐',
      description: 'Date and time display',
      component: <ClockWidget />,
    },
  ];

  const handleLaunchApp = (app: App) => {
    openWindow({
      id: app.id,
      title: app.name,
      icon: app.icon,
      component: app.component,
      width: app.id === 'slideshow' ? 1024 : 800,
      height: app.id === 'slideshow' ? 768 : 600,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {apps.map(app => (
        <Button
          key={app.id}
          onClick={() => handleLaunchApp(app)}
          variant="outline"
          className="h-auto flex flex-col items-center justify-center gap-3 p-6 hover:bg-accent/10"
        >
          <span className="text-4xl">{app.icon}</span>
          <div className="text-center">
            <div className="font-semibold">{app.name}</div>
            <div className="text-xs text-foreground/60">{app.description}</div>
          </div>
        </Button>
      ))}
    </div>
  );
}
