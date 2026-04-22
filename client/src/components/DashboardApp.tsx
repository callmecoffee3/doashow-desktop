import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertCircle, CheckCircle, Clock, DollarSign, Users, Film } from 'lucide-react';

interface FilmData {
  totalRevenue: number;
  releasedFilms: number;
  activeProductions: number;
  totalCast: number;
}

interface ContractData {
  totalValue: number;
  activeContracts: number;
  pendingContracts: number;
  completedContracts: number;
}

interface ConstructionData {
  totalBudget: number;
  totalSpent: number;
  activeProjects: number;
  completedProjects: number;
}

interface WebsiteData {
  totalWebsites: number;
  activeWebsites: number;
  totalVisitors: number;
  totalConversions: number;
}

export default function DashboardApp() {
  const [filmData, setFilmData] = useState<FilmData>({
    totalRevenue: 0,
    releasedFilms: 0,
    activeProductions: 0,
    totalCast: 0,
  });

  const [contractData, setContractData] = useState<ContractData>({
    totalValue: 0,
    activeContracts: 0,
    pendingContracts: 0,
    completedContracts: 0,
  });

  const [constructionData, setConstructionData] = useState<ConstructionData>({
    totalBudget: 0,
    totalSpent: 0,
    activeProjects: 0,
    completedProjects: 0,
  });

  const [websiteData, setWebsiteData] = useState<WebsiteData>({
    totalWebsites: 0,
    activeWebsites: 0,
    totalVisitors: 0,
    totalConversions: 0,
  });

  // Load data from all apps
  useEffect(() => {
    // Load Film Business data
    const filmBusiness = localStorage.getItem('doashow_film_business_app');
    if (filmBusiness) {
      const data = JSON.parse(filmBusiness);
      const films = data.films || [];
      const tickets = data.tickets || [];
      const cast = data.cast || [];

      setFilmData({
        totalRevenue: tickets.reduce((sum: number, t: any) => sum + t.revenue, 0),
        releasedFilms: films.filter((f: any) => f.status === 'released').length,
        activeProductions: films.filter((f: any) => f.status !== 'released').length,
        totalCast: cast.length,
      });
    }

    // Load Contracts data
    const contracts = localStorage.getItem('doashow_contracts_app');
    if (contracts) {
      const data = JSON.parse(contracts);
      setContractData({
        totalValue: data.reduce((sum: number, c: any) => sum + c.amount, 0),
        activeContracts: data.filter((c: any) => c.status === 'active').length,
        pendingContracts: data.filter((c: any) => c.status === 'pending').length,
        completedContracts: data.filter((c: any) => c.status === 'completed').length,
      });
    }

    // Load Construction data
    const construction = localStorage.getItem('doashow_construction_app');
    if (construction) {
      const data = JSON.parse(construction);
      setConstructionData({
        totalBudget: data.reduce((sum: number, p: any) => sum + p.budget, 0),
        totalSpent: data.reduce((sum: number, p: any) => sum + p.spent, 0),
        activeProjects: data.filter((p: any) => p.status === 'in-progress').length,
        completedProjects: data.filter((p: any) => p.status === 'completed').length,
      });
    }

    // Load Website data
    const websites = localStorage.getItem('doashow_websites_app');
    if (websites) {
      const data = JSON.parse(websites);
      setWebsiteData({
        totalWebsites: data.length,
        activeWebsites: data.filter((w: any) => w.status === 'active').length,
        totalVisitors: data.reduce((sum: number, w: any) => sum + w.visitors, 0),
        totalConversions: data.reduce((sum: number, w: any) => sum + w.conversions, 0),
      });
    }
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
    if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
    return value.toString();
  };

  const budgetUtilization = constructionData.totalBudget > 0
    ? Math.round((constructionData.totalSpent / constructionData.totalBudget) * 100)
    : 0;

  const conversionRate = websiteData.totalVisitors > 0
    ? Math.round((websiteData.totalConversions / websiteData.totalVisitors) * 100)
    : 0;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white">
      {/* Header */}
      <div className="border-b border-yellow-600/30 p-4 bg-gradient-to-r from-slate-900 to-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-red-500 to-yellow-500" />
        <div className="flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-yellow-400" />
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
              STUDIO DASHBOARD
            </h1>
            <p className="text-xs text-gray-400">Unified Production Analytics</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Film Business Section */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
            <Film className="w-5 h-5" />
            Film Production
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-600/30 rounded-lg p-4 hover:border-yellow-400/50 transition-all">
              <div className="text-sm text-gray-400">Box Office Revenue</div>
              <div className="text-2xl font-bold text-green-400 mt-2">{formatCurrency(filmData.totalRevenue)}</div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-600/30 rounded-lg p-4 hover:border-yellow-400/50 transition-all">
              <div className="text-sm text-gray-400">Released Films</div>
              <div className="text-2xl font-bold text-blue-400 mt-2">{filmData.releasedFilms}</div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-600/30 rounded-lg p-4 hover:border-yellow-400/50 transition-all">
              <div className="text-sm text-gray-400">In Production</div>
              <div className="text-2xl font-bold text-yellow-400 mt-2">{filmData.activeProductions}</div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-600/30 rounded-lg p-4 hover:border-yellow-400/50 transition-all">
              <div className="text-sm text-gray-400">Cast Members</div>
              <div className="text-2xl font-bold text-purple-400 mt-2">{filmData.totalCast}</div>
            </div>
          </div>
        </div>

        {/* Contracts Section */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Contracts & Agreements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-600/30 rounded-lg p-4 hover:border-yellow-400/50 transition-all">
              <div className="text-sm text-gray-400">Total Value</div>
              <div className="text-2xl font-bold text-green-400 mt-2">{formatCurrency(contractData.totalValue)}</div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-600/30 rounded-lg p-4 hover:border-yellow-400/50 transition-all">
              <div className="text-sm text-gray-400">Active</div>
              <div className="text-2xl font-bold text-blue-400 mt-2">{contractData.activeContracts}</div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-600/30 rounded-lg p-4 hover:border-yellow-400/50 transition-all">
              <div className="text-sm text-gray-400">Pending</div>
              <div className="text-2xl font-bold text-yellow-400 mt-2">{contractData.pendingContracts}</div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-600/30 rounded-lg p-4 hover:border-yellow-400/50 transition-all">
              <div className="text-sm text-gray-400">Completed</div>
              <div className="text-2xl font-bold text-purple-400 mt-2">{contractData.completedContracts}</div>
            </div>
          </div>
        </div>

        {/* Construction Section */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Construction & Logistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-600/30 rounded-lg p-4 hover:border-yellow-400/50 transition-all">
              <div className="text-sm text-gray-400">Total Budget</div>
              <div className="text-2xl font-bold text-yellow-400 mt-2">{formatCurrency(constructionData.totalBudget)}</div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-600/30 rounded-lg p-4 hover:border-yellow-400/50 transition-all">
              <div className="text-sm text-gray-400">Spent</div>
              <div className="text-2xl font-bold text-orange-400 mt-2">{formatCurrency(constructionData.totalSpent)}</div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-600/30 rounded-lg p-4 hover:border-yellow-400/50 transition-all">
              <div className="text-sm text-gray-400">In Progress</div>
              <div className="text-2xl font-bold text-blue-400 mt-2">{constructionData.activeProjects}</div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-600/30 rounded-lg p-4 hover:border-yellow-400/50 transition-all">
              <div className="text-sm text-gray-400">Completed</div>
              <div className="text-2xl font-bold text-green-400 mt-2">{constructionData.completedProjects}</div>
            </div>
          </div>

          {/* Budget Utilization */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-600/30 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Budget Utilization</span>
              <span className={`text-sm font-bold ${budgetUtilization > 90 ? 'text-red-400' : 'text-green-400'}`}>
                {budgetUtilization}%
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${budgetUtilization > 90 ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${budgetUtilization}%` }}
              />
            </div>
          </div>
        </div>

        {/* Websites Section */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Marketing Websites
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-600/30 rounded-lg p-4 hover:border-yellow-400/50 transition-all">
              <div className="text-sm text-gray-400">Total Websites</div>
              <div className="text-2xl font-bold text-blue-400 mt-2">{websiteData.totalWebsites}</div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-600/30 rounded-lg p-4 hover:border-yellow-400/50 transition-all">
              <div className="text-sm text-gray-400">Active</div>
              <div className="text-2xl font-bold text-green-400 mt-2">{websiteData.activeWebsites}</div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-600/30 rounded-lg p-4 hover:border-yellow-400/50 transition-all">
              <div className="text-sm text-gray-400">Total Visitors</div>
              <div className="text-2xl font-bold text-cyan-400 mt-2">{formatNumber(websiteData.totalVisitors)}</div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-600/30 rounded-lg p-4 hover:border-yellow-400/50 transition-all">
              <div className="text-sm text-gray-400">Conversions</div>
              <div className="text-2xl font-bold text-purple-400 mt-2">{websiteData.totalConversions}</div>
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-600/30 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Conversion Rate</span>
              <span className="text-sm font-bold text-cyan-400">{conversionRate}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div className="h-3 rounded-full bg-cyan-500 transition-all" style={{ width: `${conversionRate}%` }} />
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-600/30 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-bold text-yellow-400">Studio Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-400">
                <strong className="text-white">{contractData.pendingContracts}</strong> pending contracts
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-gray-400">
                <strong className="text-white">{constructionData.activeProjects}</strong> active projects
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-gray-400">
                <strong className="text-white">{filmData.activeProductions}</strong> in production
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-gray-400">
                <strong className="text-white">{filmData.totalCast}</strong> cast members
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-gray-400">
                <strong className="text-white">{formatCurrency(filmData.totalRevenue)}</strong> box office
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              <span className="text-gray-400">
                <strong className="text-white">{conversionRate}%</strong> conversion rate
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
