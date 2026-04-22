import React, { useState, useEffect } from 'react';
import { Hammer, Plus, Trash2, CheckCircle, AlertCircle, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConstructionProject {
  id: string;
  name: string;
  type: 'set' | 'prop' | 'equipment' | 'location' | 'infrastructure';
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  location: string;
  crew: number;
  description: string;
}

interface ConstructionMetrics {
  totalBudget: number;
  totalSpent: number;
  activeProjects: number;
  completedProjects: number;
}

const STORAGE_KEY = 'doashow_construction_app';

export default function ConstructionApp() {
  const [projects, setProjects] = useState<ConstructionProject[]>([]);
  const [showAddProject, setShowAddProject] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setProjects(JSON.parse(saved));
    } else {
      // Initialize with sample data
      const sampleProjects: ConstructionProject[] = [
        {
          id: '1',
          name: 'Downtown Street Set - Neon Horizons',
          type: 'set',
          status: 'completed',
          budget: 2500000,
          spent: 2450000,
          startDate: '2024-01-15',
          endDate: '2024-03-30',
          location: 'Downtown Studio Lot',
          crew: 45,
          description: 'Full-scale downtown street set with neon lighting and practical effects',
        },
        {
          id: '2',
          name: 'Futuristic Lab Set Construction',
          type: 'set',
          status: 'in-progress',
          budget: 3200000,
          spent: 1800000,
          startDate: '2024-03-01',
          endDate: '2024-06-15',
          location: 'Stage 5 - Main Lot',
          crew: 52,
          description: 'High-tech laboratory set with LED walls and interactive props',
        },
        {
          id: '3',
          name: 'Prop Manufacturing - Weapons & Gadgets',
          type: 'prop',
          status: 'in-progress',
          budget: 850000,
          spent: 620000,
          startDate: '2024-02-01',
          endDate: '2024-07-01',
          location: 'Prop Shop - Building C',
          crew: 18,
          description: 'Custom prop creation including sci-fi weapons and futuristic gadgets',
        },
        {
          id: '4',
          name: 'Lighting & Electrical Infrastructure',
          type: 'infrastructure',
          status: 'completed',
          budget: 1200000,
          spent: 1195000,
          startDate: '2024-01-01',
          endDate: '2024-02-28',
          location: 'All Stages',
          crew: 28,
          description: 'Upgraded electrical systems and professional lighting infrastructure',
        },
        {
          id: '5',
          name: 'Camera Crane Installation',
          type: 'equipment',
          status: 'planning',
          budget: 1500000,
          spent: 0,
          startDate: '2024-05-01',
          endDate: '2024-05-30',
          location: 'Stage 1 & 2',
          crew: 15,
          description: 'Installation of 100ft camera crane system with motion control',
        },
      ];
      setProjects(sampleProjects);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  const metrics: ConstructionMetrics = {
    totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
    totalSpent: projects.reduce((sum, p) => sum + p.spent, 0),
    activeProjects: projects.filter(p => p.status === 'in-progress').length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
  };

  const handleAddProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProject: ConstructionProject = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      type: formData.get('type') as ConstructionProject['type'],
      status: formData.get('status') as ConstructionProject['status'],
      budget: parseFloat(formData.get('budget') as string) || 0,
      spent: parseFloat(formData.get('spent') as string) || 0,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      location: formData.get('location') as string,
      crew: parseInt(formData.get('crew') as string) || 0,
      description: formData.get('description') as string,
    };
    setProjects([...projects, newProject]);
    setShowAddProject(false);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const filteredProjects = projects.filter(p => {
    const typeMatch = filterType === 'all' || p.type === filterType;
    const statusMatch = filterStatus === 'all' || p.status === filterStatus;
    return typeMatch && statusMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'in-progress':
        return 'text-blue-400';
      case 'planning':
        return 'text-yellow-400';
      case 'on-hold':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'set':
        return 'bg-purple-900/30 text-purple-300';
      case 'prop':
        return 'bg-orange-900/30 text-orange-300';
      case 'equipment':
        return 'bg-cyan-900/30 text-cyan-300';
      case 'location':
        return 'bg-green-900/30 text-green-300';
      case 'infrastructure':
        return 'bg-blue-900/30 text-blue-300';
      default:
        return 'bg-gray-900/30 text-gray-300';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getBudgetPercentage = (spent: number, budget: number) => {
    return budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white">
      {/* Header */}
      <div className="border-b border-yellow-600/30 p-4 bg-gradient-to-r from-slate-900 to-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-red-500 to-yellow-500" />
        <div className="flex items-center gap-3">
          <Hammer className="w-8 h-8 text-yellow-400" />
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
              CONSTRUCTION
            </h1>
            <p className="text-xs text-gray-400">Set & Production Logistics</p>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="border-b border-yellow-600/30 p-4 bg-slate-900/50 grid grid-cols-4 gap-3">
        <div className="bg-slate-800/50 border border-yellow-600/20 rounded p-3">
          <div className="text-xs text-gray-400">Total Budget</div>
          <div className="text-lg font-bold text-yellow-400">{formatCurrency(metrics.totalBudget)}</div>
        </div>
        <div className="bg-slate-800/50 border border-yellow-600/20 rounded p-3">
          <div className="text-xs text-gray-400">Spent</div>
          <div className="text-lg font-bold text-orange-400">{formatCurrency(metrics.totalSpent)}</div>
        </div>
        <div className="bg-slate-800/50 border border-yellow-600/20 rounded p-3">
          <div className="text-xs text-gray-400">In Progress</div>
          <div className="text-lg font-bold text-blue-400">{metrics.activeProjects}</div>
        </div>
        <div className="bg-slate-800/50 border border-yellow-600/20 rounded p-3">
          <div className="text-xs text-gray-400">Completed</div>
          <div className="text-lg font-bold text-green-400">{metrics.completedProjects}</div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="border-b border-yellow-600/30 p-4 bg-slate-900/30 space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-yellow-400">Projects</h2>
          <Button
            onClick={() => setShowAddProject(!showAddProject)}
            size="sm"
            className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-yellow-600/20 rounded text-sm text-white"
          >
            <option value="all">All Types</option>
            <option value="set">Set</option>
            <option value="prop">Prop</option>
            <option value="equipment">Equipment</option>
            <option value="location">Location</option>
            <option value="infrastructure">Infrastructure</option>
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-yellow-600/20 rounded text-sm text-white"
          >
            <option value="all">All Status</option>
            <option value="planning">Planning</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Add Project Form */}
      {showAddProject && (
        <form onSubmit={handleAddProject} className="border-b border-yellow-600/30 p-4 bg-slate-800/50 space-y-3 max-h-96 overflow-y-auto">
          <input
            type="text"
            name="name"
            placeholder="Project Name"
            required
            className="w-full px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white placeholder-gray-500"
          />
          <div className="grid grid-cols-2 gap-2">
            <select name="type" className="px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white">
              <option value="set">Set</option>
              <option value="prop">Prop</option>
              <option value="equipment">Equipment</option>
              <option value="location">Location</option>
              <option value="infrastructure">Infrastructure</option>
            </select>
            <select name="status" className="px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white">
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>
          <input
            type="text"
            name="location"
            placeholder="Location"
            required
            className="w-full px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white placeholder-gray-500"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              name="budget"
              placeholder="Budget ($)"
              required
              className="px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white placeholder-gray-500"
            />
            <input
              type="number"
              name="spent"
              placeholder="Spent ($)"
              className="px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white placeholder-gray-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              name="startDate"
              required
              className="px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white"
            />
            <input
              type="date"
              name="endDate"
              required
              className="px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white"
            />
          </div>
          <input
            type="number"
            name="crew"
            placeholder="Crew Size"
            className="w-full px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white placeholder-gray-500"
          />
          <textarea
            name="description"
            placeholder="Description"
            className="w-full px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white placeholder-gray-500 h-16"
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold">
              Save Project
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowAddProject(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Hammer className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No projects found</p>
          </div>
        ) : (
          filteredProjects.map(project => (
            <div key={project.id} className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-600/30 rounded-lg p-4 hover:border-yellow-400/50 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white">{project.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${getTypeColor(project.type)}`}>
                      {project.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">{project.location}</div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteProject(project.id)}>
                  <Trash2 className="w-4 h-4 text-red-400" />
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 pb-3 border-b border-yellow-600/20">
                <div>
                  <div className="text-xs text-gray-500">Budget</div>
                  <div className="font-semibold text-yellow-400">{formatCurrency(project.budget)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Spent</div>
                  <div className="font-semibold text-orange-400">{formatCurrency(project.spent)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Status</div>
                  <div className={`font-semibold ${getStatusColor(project.status)}`}>{project.status.toUpperCase()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Crew</div>
                  <div className="font-semibold text-blue-400">{project.crew} members</div>
                </div>
              </div>

              {/* Budget Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400">Budget Utilization</span>
                  <span className={`text-xs font-semibold ${getBudgetPercentage(project.spent, project.budget) > 90 ? 'text-red-400' : 'text-green-400'}`}>
                    {Math.round(getBudgetPercentage(project.spent, project.budget))}%
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      getBudgetPercentage(project.spent, project.budget) > 90 ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${getBudgetPercentage(project.spent, project.budget)}%` }}
                  />
                </div>
              </div>

              {/* Timeline */}
              <div className="flex items-center gap-2 mb-2 p-2 bg-slate-700/30 rounded text-sm text-gray-300">
                <Zap className="w-4 h-4 text-yellow-400" />
                {project.startDate} to {project.endDate}
                {project.status === 'in-progress' && (
                  <span className="ml-auto text-blue-400">
                    {getDaysRemaining(project.endDate) > 0 ? `${getDaysRemaining(project.endDate)} days left` : 'Overdue'}
                  </span>
                )}
              </div>

              {project.description && <p className="text-xs text-gray-400">{project.description}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
