import React, { useState, useEffect } from 'react';
import { Globe, Plus, Trash2, Edit2, TrendingUp, Eye, Share2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Website {
  id: string;
  name: string;
  url: string;
  type: 'film' | 'merchandise' | 'ticketing' | 'news' | 'fan-community' | 'other';
  status: 'active' | 'maintenance' | 'inactive';
  launchDate: string;
  visitors: number;
  conversions: number;
  description: string;
}

interface WebsiteMetrics {
  totalWebsites: number;
  activeWebsites: number;
  totalVisitors: number;
  totalConversions: number;
}

const STORAGE_KEY = 'doashow_websites_app';

export default function WebsitesApp() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [showAddWebsite, setShowAddWebsite] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setWebsites(JSON.parse(saved));
    } else {
      // Initialize with sample data
      const sampleWebsites: Website[] = [
        {
          id: '1',
          name: 'Neon Horizons - Official',
          url: 'neonhorizons.film',
          type: 'film',
          status: 'active',
          launchDate: '2024-02-01',
          visitors: 2500000,
          conversions: 125000,
          description: 'Official movie website with trailers, cast info, and ticket booking',
        },
        {
          id: '2',
          name: 'Neon Horizons - Merchandise Store',
          url: 'shop.neonhorizons.film',
          type: 'merchandise',
          status: 'active',
          launchDate: '2024-03-15',
          visitors: 850000,
          conversions: 42500,
          description: 'E-commerce store for official merchandise and collectibles',
        },
        {
          id: '3',
          name: 'The Last Echo - Coming Soon',
          url: 'thelasteecho.film',
          type: 'film',
          status: 'maintenance',
          launchDate: '2024-05-01',
          visitors: 450000,
          conversions: 18000,
          description: 'Teaser website for upcoming film with newsletter signup',
        },
        {
          id: '4',
          name: 'Neon Horizons - Fan Community',
          url: 'community.neonhorizons.film',
          type: 'fan-community',
          status: 'active',
          launchDate: '2024-03-20',
          visitors: 1200000,
          conversions: 36000,
          description: 'Fan forum and community platform for discussions and fan art',
        },
        {
          id: '5',
          name: 'Studio News & Updates',
          url: 'news.studiox.film',
          type: 'news',
          status: 'active',
          launchDate: '2024-01-01',
          visitors: 3200000,
          conversions: 64000,
          description: 'Official studio news portal with production updates and announcements',
        },
      ];
      setWebsites(sampleWebsites);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(websites));
  }, [websites]);

  const metrics: WebsiteMetrics = {
    totalWebsites: websites.length,
    activeWebsites: websites.filter(w => w.status === 'active').length,
    totalVisitors: websites.reduce((sum, w) => sum + w.visitors, 0),
    totalConversions: websites.reduce((sum, w) => sum + w.conversions, 0),
  };

  const handleAddWebsite = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newWebsite: Website = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      url: formData.get('url') as string,
      type: formData.get('type') as Website['type'],
      status: formData.get('status') as Website['status'],
      launchDate: formData.get('launchDate') as string,
      visitors: parseInt(formData.get('visitors') as string) || 0,
      conversions: parseInt(formData.get('conversions') as string) || 0,
      description: formData.get('description') as string,
    };
    setWebsites([...websites, newWebsite]);
    setShowAddWebsite(false);
  };

  const handleDeleteWebsite = (id: string) => {
    setWebsites(websites.filter(w => w.id !== id));
  };

  const filteredWebsites = websites.filter(w => {
    const typeMatch = filterType === 'all' || w.type === filterType;
    const statusMatch = filterStatus === 'all' || w.status === filterStatus;
    return typeMatch && statusMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400';
      case 'maintenance':
        return 'text-yellow-400';
      case 'inactive':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'film':
        return 'bg-purple-900/30 text-purple-300';
      case 'merchandise':
        return 'bg-orange-900/30 text-orange-300';
      case 'ticketing':
        return 'bg-blue-900/30 text-blue-300';
      case 'news':
        return 'bg-green-900/30 text-green-300';
      case 'fan-community':
        return 'bg-pink-900/30 text-pink-300';
      default:
        return 'bg-gray-900/30 text-gray-300';
    }
  };

  const formatNumber = (value: number) => {
    if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
    if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
    return value.toString();
  };

  const getConversionRate = (visitors: number, conversions: number) => {
    return visitors > 0 ? ((conversions / visitors) * 100).toFixed(2) : '0.00';
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white">
      {/* Header */}
      <div className="border-b border-yellow-600/30 p-4 bg-gradient-to-r from-slate-900 to-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-red-500 to-yellow-500" />
        <div className="flex items-center gap-3">
          <Globe className="w-8 h-8 text-yellow-400" />
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
              WEBSITES
            </h1>
            <p className="text-xs text-gray-400">Marketing & Promotion Sites</p>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="border-b border-yellow-600/30 p-4 bg-slate-900/50 grid grid-cols-4 gap-3">
        <div className="bg-slate-800/50 border border-yellow-600/20 rounded p-3">
          <div className="text-xs text-gray-400">Total Sites</div>
          <div className="text-lg font-bold text-blue-400">{metrics.totalWebsites}</div>
        </div>
        <div className="bg-slate-800/50 border border-yellow-600/20 rounded p-3">
          <div className="text-xs text-gray-400">Active</div>
          <div className="text-lg font-bold text-green-400">{metrics.activeWebsites}</div>
        </div>
        <div className="bg-slate-800/50 border border-yellow-600/20 rounded p-3">
          <div className="text-xs text-gray-400">Total Visitors</div>
          <div className="text-lg font-bold text-cyan-400">{formatNumber(metrics.totalVisitors)}</div>
        </div>
        <div className="bg-slate-800/50 border border-yellow-600/20 rounded p-3">
          <div className="text-xs text-gray-400">Conversions</div>
          <div className="text-lg font-bold text-purple-400">{formatNumber(metrics.totalConversions)}</div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="border-b border-yellow-600/30 p-4 bg-slate-900/30 space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-yellow-400">Websites</h2>
          <Button
            onClick={() => setShowAddWebsite(!showAddWebsite)}
            size="sm"
            className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Website
          </Button>
        </div>
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-yellow-600/20 rounded text-sm text-white"
          >
            <option value="all">All Types</option>
            <option value="film">Film</option>
            <option value="merchandise">Merchandise</option>
            <option value="ticketing">Ticketing</option>
            <option value="news">News</option>
            <option value="fan-community">Fan Community</option>
            <option value="other">Other</option>
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-yellow-600/20 rounded text-sm text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Add Website Form */}
      {showAddWebsite && (
        <form onSubmit={handleAddWebsite} className="border-b border-yellow-600/30 p-4 bg-slate-800/50 space-y-3 max-h-96 overflow-y-auto">
          <input
            type="text"
            name="name"
            placeholder="Website Name"
            required
            className="w-full px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white placeholder-gray-500"
          />
          <input
            type="text"
            name="url"
            placeholder="URL (e.g., example.film)"
            required
            className="w-full px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white placeholder-gray-500"
          />
          <div className="grid grid-cols-2 gap-2">
            <select name="type" className="px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white">
              <option value="film">Film</option>
              <option value="merchandise">Merchandise</option>
              <option value="ticketing">Ticketing</option>
              <option value="news">News</option>
              <option value="fan-community">Fan Community</option>
              <option value="other">Other</option>
            </select>
            <select name="status" className="px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white">
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <input
            type="date"
            name="launchDate"
            required
            className="w-full px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              name="visitors"
              placeholder="Visitors"
              className="px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white placeholder-gray-500"
            />
            <input
              type="number"
              name="conversions"
              placeholder="Conversions"
              className="px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white placeholder-gray-500"
            />
          </div>
          <textarea
            name="description"
            placeholder="Description"
            className="w-full px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white placeholder-gray-500 h-16"
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold">
              Save Website
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowAddWebsite(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Websites List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredWebsites.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Globe className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No websites found</p>
          </div>
        ) : (
          filteredWebsites.map(website => (
            <div key={website.id} className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-600/30 rounded-lg p-4 hover:border-yellow-400/50 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white">{website.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${getTypeColor(website.type)}`}>
                      {website.type.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    {website.url}
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteWebsite(website.id)}>
                  <Trash2 className="w-4 h-4 text-red-400" />
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 pb-3 border-b border-yellow-600/20">
                <div>
                  <div className="text-xs text-gray-500">Status</div>
                  <div className={`font-semibold ${getStatusColor(website.status)}`}>{website.status.toUpperCase()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Launched</div>
                  <div className="font-semibold text-white">{website.launchDate}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Visitors</div>
                  <div className="font-semibold text-cyan-400 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {formatNumber(website.visitors)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Conversions</div>
                  <div className="font-semibold text-purple-400 flex items-center gap-1">
                    <Share2 className="w-3 h-3" />
                    {formatNumber(website.conversions)}
                  </div>
                </div>
              </div>

              {/* Conversion Rate Bar */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400">Conversion Rate</span>
                  <span className="text-xs font-semibold text-cyan-400">{getConversionRate(website.visitors, website.conversions)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-cyan-500 transition-all"
                    style={{ width: `${Math.min(parseFloat(getConversionRate(website.visitors, website.conversions)) * 10, 100)}%` }}
                  />
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 text-sm">
                {website.status === 'active' ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">Live and operational</span>
                  </>
                ) : website.status === 'maintenance' ? (
                  <>
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400">Under maintenance</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400">Inactive</span>
                  </>
                )}
              </div>

              {website.description && <p className="text-xs text-gray-400 mt-2">{website.description}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
