import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Grid, List, Search, X, Pin } from 'lucide-react';
import Slideshow from '@/components/Slideshow';
import FileExplorer from '@/components/FileExplorer';
import SettingsPanel from '@/components/SettingsPanel';
import ClockWidget from '@/components/ClockWidget';
import NotesApp from '@/components/NotesApp';
import CalculatorApp from '@/components/CalculatorApp';
import ScheduleApp from '@/components/ScheduleApp';
import RecorderApp from '@/components/RecorderApp';
import ChurchApp from '@/components/ChurchApp';
import MessengerApp from '@/components/MessengerApp';
import GroupsApp from '@/components/GroupsApp';
import PagesApp from '@/components/PagesApp';
import VideosApp from '@/components/VideosApp';
import PhotoApp from '@/components/PhotoApp';
import AppStore from '@/components/AppStore';
import PodcastApp from '@/components/PodcastApp';
import VideoAudioRecorder from '@/components/VideoAudioRecorder';
import MintMobileApp from '@/components/MintMobileApp';
import BusinessApp from '@/components/BusinessApp';
import ContractsApp from '@/components/ContractsApp';
import ConstructionApp from '@/components/ConstructionApp';
import DashboardApp from '@/components/DashboardApp';
import WebsitesApp from '@/components/WebsitesApp';
import TodoApp from '@/components/TodoApp';
import SocialApp from '@/components/SocialApp';
import ComprehensiveAppStore from '@/components/ComprehensiveAppStore';
import FacebookApp from '@/components/FacebookApp';
import InstagramApp from '@/components/InstagramApp';
import XcomApp from '@/components/XcomApp';
import YouTubeApp from '@/components/YouTubeApp';
import TikTokApp from '@/components/TikTokApp';
import TerminalApp from '@/components/TerminalApp';
import MarketplaceApp from '@/components/MarketplaceApp';
import BankApp from '@/components/BankApp';
import DownloadsApp from '@/components/DownloadsApp';
import CalendarApp from '@/components/CalendarApp';
import ScreenManagerApp from '@/components/ScreenManagerApp';
import OrientationApp from '@/components/OrientationApp';
import UsersApp from '@/components/UsersApp';
import MemoryApp from '@/components/MemoryApp';
import { useWindow } from '@/contexts/WindowContext';
import { useDesktopShortcuts } from '@/contexts/DesktopShortcutsContext';

interface App {
  id: string;
  name: string;
  icon: string;
  description: string;
  component: React.ReactNode;
}

export default function AppLauncher() {
  const { openWindow } = useWindow();
  const { addShortcut } = useDesktopShortcuts();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    const saved = localStorage.getItem('doashow_app_view_mode');
    return (saved as 'grid' | 'list') || 'grid';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPreview, setSelectedPreview] = useState<App | null>(null);
  const [pinnedApps, setPinnedApps] = useState<string[]>(() => {
    const saved = localStorage.getItem('doashow_pinned_apps');
    return saved ? JSON.parse(saved) : ['slideshow', 'notes', 'calculator'];
  });

  const togglePinApp = (appId: string) => {
    setPinnedApps(prev => {
      const updated = prev.includes(appId) ? prev.filter(id => id !== appId) : [...prev, appId];
      localStorage.setItem('doashow_pinned_apps', JSON.stringify(updated));
      return updated;
    });
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    localStorage.setItem('doashow_app_view_mode', mode);
  };

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
      id: 'notes',
      name: 'Notes',
      icon: '📝',
      description: 'Create and manage notes',
      component: <NotesApp />,
    },
    {
      id: 'calculator',
      name: 'Calculator',
      icon: '🧮',
      description: 'Perform calculations',
      component: <CalculatorApp />,
    },
    {
      id: 'schedule',
      name: 'Schedule',
      icon: '📅',
      description: 'Manage events and calendar',
      component: <ScheduleApp />,
    },
    {
      id: 'recorder',
      name: 'Recorder',
      icon: '🎙️',
      description: 'Record audio messages',
      component: <RecorderApp />,
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
    {
      id: 'church',
      name: 'Church',
      icon: '⛪',
      description: 'Classes and Bible reading',
      component: <ChurchApp />,
    },
    {
      id: 'messenger',
      name: 'Messenger',
      icon: '💬',
      description: 'Chat and messaging',
      component: <MessengerApp />,
    },
    {
      id: 'groups',
      name: 'Groups',
      icon: '👥',
      description: 'Community and groups',
      component: <GroupsApp />,
    },
    {
      id: 'pages',
      name: 'Pages',
      icon: '📄',
      description: 'Content creation',
      component: <PagesApp />,
    },
    {
      id: 'videos',
      name: 'Videos',
      icon: '🎬',
      description: 'Video playback',
      component: <VideosApp />,
    },
    {
      id: 'photos',
      name: 'Photos',
      icon: '📷',
      description: 'Photo gallery and albums',
      component: <PhotoApp />,
    },
    {
      id: 'appstore',
      name: 'App Store',
      icon: '🏪',
      description: 'Browse and install apps',
      component: <AppStore />,
    },
    {
      id: 'podcast',
      name: 'Podcast Studio',
      icon: '🎧',
      description: 'Create and manage podcasts',
      component: <PodcastApp />,
    },
    {
      id: 'videoaudiorecorder',
      name: 'Media Recorder',
      icon: '🎬',
      description: 'Record video and audio',
      component: <VideoAudioRecorder />,
    },
    {
      id: 'mintmobile',
      name: 'Mint Mobile',
      icon: '📱',
      description: 'Wireless that makes sense',
      component: <MintMobileApp />,
    },
    {
      id: 'business',
      name: 'Business',
      icon: '💼',
      description: 'Business management suite',
      component: <BusinessApp />,
    },
    {
      id: 'contracts',
      name: 'Contracts',
      icon: '📋',
      description: 'Production contracts & agreements',
      component: <ContractsApp />,
    },
    {
      id: 'construction',
      name: 'Construction',
      icon: '🔨',
      description: 'Set construction & logistics',
      component: <ConstructionApp />,
    },
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: '📊',
      description: 'Studio analytics & metrics',
      component: <DashboardApp />,
    },
    {
      id: 'websites',
      name: 'Websites',
      icon: '🌐',
      description: 'Marketing & promotion sites',
      component: <WebsitesApp />,
    },
    {
      id: 'todo',
      name: 'Todo List',
      icon: '✓',
      description: 'Manage tasks and stay organized',
      component: <TodoApp />,
    },
    {
      id: 'social',
      name: 'SocialHub',
      icon: '👥',
      description: 'Connect with friends and share posts',
      component: <SocialApp />,
    },
    {
      id: 'appstore-comprehensive',
      name: 'App Store Pro',
      icon: '🏬',
      description: 'Browse all available apps and features',
      component: <ComprehensiveAppStore />,
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: '👥',
      description: 'Connect with friends and share updates',
      component: <FacebookApp />,
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: '📷',
      description: 'Share photos and stories',
      component: <InstagramApp />,
    },
    {
      id: 'xcom',
      name: 'X',
      icon: '𝕏',
      description: 'Share thoughts and ideas',
      component: <XcomApp />,
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: '▶️',
      description: 'Watch and share videos',
      component: <YouTubeApp />,
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: '♪',
      description: 'Create and watch short videos',
      component: <TikTokApp />,
    },
    {
      id: 'terminal',
      name: 'Terminal',
      icon: '💻',
      description: 'Command-line interface',
      component: <TerminalApp />,
    },
    {
      id: 'marketplace',
      name: 'Marketplace',
      icon: '🛍️',
      description: 'Buy and sell items',
      component: <MarketplaceApp />,
    },
    {
      id: 'bank',
      name: 'Bank',
      icon: '🏦',
      description: 'Manage your finances',
      component: <BankApp />,
    },
    {
      id: 'downloads',
      name: 'Downloads',
      icon: '📥',
      description: 'Manage downloaded files',
      component: <DownloadsApp />,
    },
    {
      id: 'calendar',
      name: 'Calendar',
      icon: '📅',
      description: 'Manage dates and events',
      component: <CalendarApp />,
    },
    {
      id: 'screenmanager',
      name: 'Screen Manager',
      icon: '🖥️',
      description: 'Display and screen settings',
      component: <ScreenManagerApp />,
    },
    {
      id: 'orientation',
      name: 'Orientation',
      icon: '🔄',
      description: 'Screen orientation control',
      component: <OrientationApp />,
    },
    {
      id: 'users',
      name: 'Users',
      icon: '👥',
      description: 'Manage user accounts and profiles',
      component: <UsersApp />,
    },
    {
      id: 'memory',
      name: 'Memory',
      icon: '💾',
      description: 'System memory and storage management',
      component: <MemoryApp />,
    }
  ];

  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLaunchApp = (app: App) => {
    const widthMap: { [key: string]: number } = {
      slideshow: 1024,
      schedule: 1200,
      recorder: 900,
      church: 1000,
      messenger: 1200,
      groups: 1200,
      pages: 1200,
      videos: 1400,
      photos: 1400,
      appstore: 1600,
      podcast: 1200,
      videoaudiorecorder: 1200,
      mintmobile: 1400,
      business: 1400,
      contracts: 1400,
      construction: 1400,
      dashboard: 1600,
      websites: 1400,
    };

    const heightMap: { [key: string]: number } = {
      slideshow: 768,
      schedule: 700,
      recorder: 700,
      church: 700,
      messenger: 700,
      groups: 700,
      pages: 700,
      videos: 800,
      photos: 800,
      appstore: 800,
      'appstore-comprehensive': 1200,
      facebook: 1000,
      instagram: 900,
      xcom: 1000,
      youtube: 1200,
      tiktok: 800,
      terminal: 1000,
      marketplace: 1200,
      bank: 1000,
      downloads: 1100,
      calendar: 1200,
      screenmanager: 1400,
      orientation: 1200,
      users: 1400,
      memory: 1400,
      podcast: 800,
      videoaudiorecorder: 900,
      mintmobile: 900,
      business: 900,
      contracts: 900,
      construction: 900,
      dashboard: 1000,
      websites: 900,
    };

    openWindow({
      id: app.id,
      title: app.name,
      icon: app.icon,
      component: app.component,
      width: widthMap[app.id] || 800,
      height: heightMap[app.id] || 600,
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with Search and View Mode Toggle */}
      <div className="border-b border-border p-4 bg-card space-y-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">📱 Applications</h2>
          <div className="flex gap-2">
          <Button
            onClick={() => handleViewModeChange('grid')}
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            title="Grid view"
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => handleViewModeChange('list')}
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            title="List view"
          >
            <List className="w-4 h-4" />
          </Button>
          </div>
        </div>
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
          <input
            type="text"
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content - Apps and Preview */}
      <div className="flex-1 overflow-hidden flex">
        {/* Apps Container */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredApps.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-foreground/50">
              <Search className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-lg">No apps found</p>
              <p className="text-sm">Try a different search term</p>
            </div>
          ) : viewMode === 'grid' ? (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredApps.map(app => (
              <div key={app.id} className="relative group">
                <Button
                  onClick={() => {
                    handleLaunchApp(app);
                    setSelectedPreview(null);
                  }}
                  onMouseEnter={() => setSelectedPreview(app)}
                  variant="outline"
                  className="h-auto w-full flex flex-col items-center justify-center gap-3 p-6 hover:bg-accent/10 transition-colors"
                >
                  <span className="text-5xl">{app.icon}</span>
                  <div className="text-center">
                    <div className="font-semibold text-sm">{app.name}</div>
                    <div className="text-xs text-foreground/60">{app.description}</div>
                  </div>
                </Button>
                <Button
                  onClick={() => addShortcut(app.id, app.name, app.icon)}
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Pin to desktop"
                >
                  📌
                </Button>
              </div>
            ))}  
            </div>
          ) : (
            // List View
            <div className="space-y-2 max-w-3xl">
              {filteredApps.map(app => (
              <Button
                key={app.id}
                onClick={() => {
                  handleLaunchApp(app);
                  setSelectedPreview(null);
                }}
                onMouseEnter={() => setSelectedPreview(app)}
                variant="outline"
                className="w-full flex items-center justify-start gap-4 p-4 h-auto hover:bg-accent/10 transition-colors"
              >
                <span className="text-3xl flex-shrink-0">{app.icon}</span>
                <div className="text-left flex-1 min-w-0">
                  <div className="font-semibold text-sm">{app.name}</div>
                  <div className="text-xs text-foreground/60 truncate">{app.description}</div>
                </div>
              </Button>
              ))}  
            </div>
          )}
        </div>

        {/* Preview Panel */}
        {selectedPreview && (
          <div className="w-80 border-l border-border bg-card p-6 overflow-y-auto flex flex-col gap-4">
            <div>
              <div className="text-6xl mb-4">{selectedPreview.icon}</div>
              <h3 className="text-xl font-bold mb-1">{selectedPreview.name}</h3>
              <p className="text-sm text-foreground/70">{selectedPreview.description}</p>
            </div>
            <Button
              onClick={() => {
                handleLaunchApp(selectedPreview);
                setSelectedPreview(null);
              }}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Launch App
            </Button>
            <Button
              onClick={() => addShortcut(selectedPreview.id, selectedPreview.name, selectedPreview.icon)}
              variant="outline"
              className="w-full"
            >
              📌 Pin to Desktop
            </Button>
            <Button
              onClick={() => togglePinApp(selectedPreview.id)}
              variant={pinnedApps.includes(selectedPreview.id) ? 'default' : 'outline'}
              className="w-full"
            >
              {pinnedApps.includes(selectedPreview.id) ? '📍 Pinned to Taskbar' : '📍 Pin to Taskbar'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
