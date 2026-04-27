import { useState } from 'react';
import { HardDrive, Cpu, Zap, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StorageItem {
  id: string;
  name: string;
  size: number;
  percentage: number;
  type: 'app' | 'media' | 'document' | 'system' | 'cache';
  color: string;
}

export default function MemoryApp() {
  const [storageItems] = useState<StorageItem[]>([
    { id: '1', name: 'Applications', size: 45.2, percentage: 28, type: 'app', color: 'bg-blue-500' },
    { id: '2', name: 'Media Files', size: 38.7, percentage: 24, type: 'media', color: 'bg-purple-500' },
    { id: '3', name: 'Documents', size: 22.4, percentage: 14, type: 'document', color: 'bg-green-500' },
    { id: '4', name: 'System Files', size: 35.1, percentage: 22, type: 'system', color: 'bg-red-500' },
    { id: '5', name: 'Cache', size: 18.6, percentage: 12, type: 'cache', color: 'bg-yellow-500' },
  ]);

  const [ramUsage] = useState({
    used: 8.4,
    total: 16,
    percentage: 52.5,
  });

  const [cpuUsage] = useState({
    current: 34,
    average: 28,
    peak: 78,
  });

  const totalStorage = storageItems.reduce((sum, item) => sum + item.size, 0);
  const usedStorage = totalStorage;
  const totalCapacity = 160;

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 bg-card">
        <div className="flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-bold">System Memory & Storage</h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Storage Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Total Storage */}
          <div className="bg-card border border-border rounded-lg p-4 space-y-3">
            <h3 className="font-bold flex items-center gap-2">
              <HardDrive className="w-4 h-4" />
              Total Storage
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-foreground/60">{usedStorage.toFixed(1)} GB / {totalCapacity} GB</span>
                <span className="font-bold text-accent">{((usedStorage / totalCapacity) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-background rounded-full h-3 overflow-hidden border border-border">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all"
                  style={{ width: `${(usedStorage / totalCapacity) * 100}%` }}
                />
              </div>
              <p className="text-xs text-foreground/60">{(totalCapacity - usedStorage).toFixed(1)} GB available</p>
            </div>
          </div>

          {/* RAM Usage */}
          <div className="bg-card border border-border rounded-lg p-4 space-y-3">
            <h3 className="font-bold flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              Memory (RAM)
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-foreground/60">{ramUsage.used.toFixed(1)} GB / {ramUsage.total} GB</span>
                <span className="font-bold text-accent">{ramUsage.percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-background rounded-full h-3 overflow-hidden border border-border">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all"
                  style={{ width: `${ramUsage.percentage}%` }}
                />
              </div>
              <p className="text-xs text-foreground/60">{(ramUsage.total - ramUsage.used).toFixed(1)} GB available</p>
            </div>
          </div>

          {/* CPU Usage */}
          <div className="bg-card border border-border rounded-lg p-4 space-y-3">
            <h3 className="font-bold flex items-center gap-2">
              <Zap className="w-4 h-4" />
              CPU Usage
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-foreground/60">Current</span>
                <span className="font-bold text-accent">{cpuUsage.current}%</span>
              </div>
              <div className="w-full bg-background rounded-full h-3 overflow-hidden border border-border">
                <div
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all"
                  style={{ width: `${cpuUsage.current}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-foreground/60">Average:</span>
                  <span className="font-bold ml-1">{cpuUsage.average}%</span>
                </div>
                <div>
                  <span className="text-foreground/60">Peak:</span>
                  <span className="font-bold ml-1">{cpuUsage.peak}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Storage Breakdown */}
        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
          <h3 className="font-bold">Storage Breakdown</h3>
          <div className="space-y-3">
            {storageItems.map(item => (
              <div key={item.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded ${item.color}`} />
                    <span className="text-sm font-semibold">{item.name}</span>
                  </div>
                  <span className="text-sm text-foreground/60">{item.size.toFixed(1)} GB</span>
                </div>
                <div className="w-full bg-background rounded-full h-2 overflow-hidden border border-border">
                  <div
                    className={`${item.color} h-full transition-all`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Storage Management */}
        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
          <h3 className="font-bold">Storage Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button variant="outline" className="flex items-center justify-center gap-2">
              <Trash2 className="w-4 h-4" />
              Clear Cache
            </Button>
            <Button variant="outline" className="flex items-center justify-center gap-2">
              <Trash2 className="w-4 h-4" />
              Empty Trash
            </Button>
            <Button variant="outline" className="flex items-center justify-center gap-2">
              <HardDrive className="w-4 h-4" />
              Optimize Storage
            </Button>
            <Button variant="outline" className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" />
              Performance Boost
            </Button>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-card border border-border rounded-lg p-4 space-y-3">
          <h3 className="font-bold">System Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-background rounded border border-border">
              <span className="text-foreground/60">Processor</span>
              <p className="font-semibold">Intel Core i7-11700K</p>
            </div>
            <div className="p-3 bg-background rounded border border-border">
              <span className="text-foreground/60">System Memory</span>
              <p className="font-semibold">{ramUsage.total} GB DDR4</p>
            </div>
            <div className="p-3 bg-background rounded border border-border">
              <span className="text-foreground/60">Storage Drive</span>
              <p className="font-semibold">SSD NVMe {totalCapacity}GB</p>
            </div>
            <div className="p-3 bg-background rounded border border-border">
              <span className="text-foreground/60">System Uptime</span>
              <p className="font-semibold">45 days 12 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
