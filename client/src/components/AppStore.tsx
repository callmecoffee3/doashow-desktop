import { useState, useEffect } from 'react';
import { Search, Download, Trash2, Star, Users, Download as DownloadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StoredApp {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  rating: number;
  downloads: number;
  installed: boolean;
  version: string;
  developer: string;
  size: string;
  screenshots: string[];
}

export default function AppStore() {
  const [apps, setApps] = useState<StoredApp[]>([
    {
      id: 'photo',
      name: 'Photos',
      icon: '📷',
      description: 'Organize and manage your photo albums with ease',
      category: 'Media',
      rating: 4.8,
      downloads: 15420,
      installed: false,
      version: '1.0.0',
      developer: 'DoaShow Team',
      size: '2.5 MB',
      screenshots: ['📸', '🖼️', '📁'],
    },
    {
      id: 'music',
      name: 'Music Player',
      icon: '🎵',
      description: 'Listen to your favorite music with advanced controls',
      category: 'Media',
      rating: 4.6,
      downloads: 12890,
      installed: false,
      version: '1.2.0',
      developer: 'DoaShow Team',
      size: '3.1 MB',
      screenshots: ['🎧', '🎵', '📻'],
    },
    {
      id: 'weather',
      name: 'Weather',
      icon: '🌤️',
      description: 'Real-time weather updates and forecasts',
      category: 'Utilities',
      rating: 4.7,
      downloads: 8934,
      installed: false,
      version: '2.1.0',
      developer: 'DoaShow Team',
      size: '1.8 MB',
      screenshots: ['☀️', '🌧️', '⛈️'],
    },
    {
      id: 'todo',
      name: 'Todo List',
      icon: '✅',
      description: 'Manage your tasks and stay productive',
      category: 'Productivity',
      rating: 4.9,
      downloads: 22341,
      installed: false,
      version: '1.5.0',
      developer: 'DoaShow Team',
      size: '1.2 MB',
      screenshots: ['📋', '✔️', '📊'],
    },
    {
      id: 'drawing',
      name: 'Drawing App',
      icon: '🎨',
      description: 'Create beautiful digital art and sketches',
      category: 'Creative',
      rating: 4.5,
      downloads: 9876,
      installed: false,
      version: '1.3.0',
      developer: 'DoaShow Team',
      size: '4.2 MB',
      screenshots: ['🖌️', '🎭', '✨'],
    },
    {
      id: 'podcast',
      name: 'Podcast Hub',
      icon: '🎙️',
      description: 'Listen to your favorite podcasts and shows',
      category: 'Media',
      rating: 4.4,
      downloads: 7654,
      installed: false,
      version: '1.1.0',
      developer: 'DoaShow Team',
      size: '2.8 MB',
      screenshots: ['🎧', '📻', '🎬'],
    },
    {
      id: 'fitness',
      name: 'Fitness Tracker',
      icon: '💪',
      description: 'Track your workouts and health goals',
      category: 'Health',
      rating: 4.6,
      downloads: 11234,
      installed: false,
      version: '1.4.0',
      developer: 'DoaShow Team',
      size: '2.0 MB',
      screenshots: ['🏃', '🏋️', '📈'],
    },
    {
      id: 'recipe',
      name: 'Recipe Book',
      icon: '🍳',
      description: 'Discover and save your favorite recipes',
      category: 'Lifestyle',
      rating: 4.7,
      downloads: 6543,
      installed: false,
      version: '1.2.0',
      developer: 'DoaShow Team',
      size: '1.9 MB',
      screenshots: ['🍽️', '👨‍🍳', '🥘'],
    },
    {
      id: 'budget',
      name: 'Budget Manager',
      icon: '💰',
      description: 'Manage your finances and track expenses',
      category: 'Finance',
      rating: 4.8,
      downloads: 13456,
      installed: false,
      version: '1.6.0',
      developer: 'DoaShow Team',
      size: '1.5 MB',
      screenshots: ['💳', '📊', '💵'],
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<StoredApp | null>(null);
  const [sortBy, setSortBy] = useState<'rating' | 'downloads' | 'name'>('rating');

  useEffect(() => {
    localStorage.setItem('doashow_app_store', JSON.stringify(apps));
  }, [apps]);

  const categories = ['All', 'Media', 'Productivity', 'Utilities', 'Creative', 'Health', 'Finance', 'Lifestyle'];

  const filteredApps = apps
    .filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || selectedCategory === 'All' || app.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'downloads') return b.downloads - a.downloads;
      return a.name.localeCompare(b.name);
    });

  const installApp = (appId: string) => {
    const updated = apps.map(app =>
      app.id === appId ? { ...app, installed: true } : app
    );
    setApps(updated);
    setSelectedApp(updated.find(a => a.id === appId) || null);
  };

  const uninstallApp = (appId: string) => {
    const updated = apps.map(app =>
      app.id === appId ? { ...app, installed: false } : app
    );
    setApps(updated);
    setSelectedApp(updated.find(a => a.id === appId) || null);
  };

  return (
    <div className="flex h-full bg-background">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-6 bg-card sticky top-0 z-10">
          <h1 className="text-3xl font-bold mb-4">🏪 App Store</h1>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/50" />
            <input
              type="text"
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-sm"
            />
          </div>

          {/* Categories and Sort */}
          <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2">
            <div className="flex gap-2">
              {categories.map(cat => (
                <Button
                  key={cat}
                  onClick={() => setSelectedCategory(cat === 'All' ? null : cat)}
                  variant={selectedCategory === (cat === 'All' ? null : cat) ? 'default' : 'outline'}
                  size="sm"
                  className="flex-shrink-0"
                >
                  {cat}
                </Button>
              ))}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-background border border-border rounded text-sm flex-shrink-0"
            >
              <option value="rating">Top Rated</option>
              <option value="downloads">Most Downloaded</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Apps Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map(app => (
              <button
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className="bg-card border border-border rounded-lg overflow-hidden hover:border-accent transition-colors text-left"
              >
                {/* App Icon */}
                <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-6xl">
                  {app.icon}
                </div>

                {/* App Info */}
                <div className="p-4">
                  <h3 className="font-bold text-lg">{app.name}</h3>
                  <p className="text-xs text-foreground/60 mb-3">{app.developer}</p>
                  <p className="text-sm text-foreground/80 mb-3 line-clamp-2">{app.description}</p>

                  {/* Rating and Downloads */}
                  <div className="flex items-center justify-between mb-3 text-xs text-foreground/60">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      <span>{app.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DownloadIcon className="w-3 h-3" />
                      <span>{(app.downloads / 1000).toFixed(1)}K</span>
                    </div>
                  </div>

                  {/* Install Button */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      app.installed ? uninstallApp(app.id) : installApp(app.id);
                    }}
                    variant={app.installed ? 'destructive' : 'default'}
                    className="w-full gap-2"
                    size="sm"
                  >
                    {app.installed ? (
                      <>
                        <Trash2 className="w-3 h-3" />
                        Uninstall
                      </>
                    ) : (
                      <>
                        <Download className="w-3 h-3" />
                        Install
                      </>
                    )}
                  </Button>
                </div>
              </button>
            ))}
          </div>

          {filteredApps.length === 0 && (
            <div className="flex items-center justify-center h-full text-foreground/50">
              <p>No apps found</p>
            </div>
          )}
        </div>
      </div>

      {/* App Details Sidebar */}
      {selectedApp && (
        <div className="w-96 border-l border-border bg-secondary flex flex-col">
          {/* App Header */}
          <div className="border-b border-border p-6 bg-card">
            <div className="flex items-start gap-4">
              <div className="text-5xl">{selectedApp.icon}</div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{selectedApp.name}</h2>
                <p className="text-xs text-foreground/60 mt-1">{selectedApp.developer}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span className="text-sm font-semibold">{selectedApp.rating}</span>
                  </div>
                  <span className="text-xs text-foreground/60">({(selectedApp.downloads / 1000).toFixed(1)}K downloads)</span>
                </div>
              </div>
            </div>
          </div>

          {/* App Details */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Description */}
            <div>
              <h3 className="font-semibold text-sm mb-2">About</h3>
              <p className="text-sm text-foreground/80">{selectedApp.description}</p>
            </div>

            {/* Details */}
            <div>
              <h3 className="font-semibold text-sm mb-3">Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground/60">Version</span>
                  <span>{selectedApp.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">Size</span>
                  <span>{selectedApp.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">Category</span>
                  <span>{selectedApp.category}</span>
                </div>
              </div>
            </div>

            {/* Screenshots */}
            <div>
              <h3 className="font-semibold text-sm mb-3">Screenshots</h3>
              <div className="grid grid-cols-3 gap-2">
                {selectedApp.screenshots.map((screenshot, idx) => (
                  <div
                    key={idx}
                    className="aspect-square bg-gradient-to-br from-slate-900 to-slate-800 rounded border border-border flex items-center justify-center text-2xl"
                  >
                    {screenshot}
                  </div>
                ))}
              </div>
            </div>

            {/* Ratings */}
            <div>
              <h3 className="font-semibold text-sm mb-3">User Ratings</h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(stars => (
                  <div key={stars} className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < stars ? 'fill-yellow-500 text-yellow-500' : 'text-foreground/30'}`}
                        />
                      ))}
                    </div>
                    <div className="flex-1 h-1 bg-foreground/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500"
                        style={{ width: `${Math.random() * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Install Button */}
          <div className="border-t border-border p-4 bg-card">
            <Button
              onClick={() => {
                selectedApp.installed ? uninstallApp(selectedApp.id) : installApp(selectedApp.id);
              }}
              variant={selectedApp.installed ? 'destructive' : 'default'}
              className="w-full gap-2"
            >
              {selectedApp.installed ? (
                <>
                  <Trash2 className="w-4 h-4" />
                  Uninstall
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Install
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
