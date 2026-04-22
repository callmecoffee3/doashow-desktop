import React, { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Clock, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Contract {
  id: string;
  title: string;
  type: 'actor' | 'crew' | 'vendor' | 'location' | 'equipment' | 'other';
  party: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'pending' | 'completed' | 'terminated';
  description: string;
  terms: string;
}

interface ContractMetrics {
  totalValue: number;
  activeContracts: number;
  pendingContracts: number;
  completedContracts: number;
}

const STORAGE_KEY = 'doashow_contracts_app';

export default function ContractsApp() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [showAddContract, setShowAddContract] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setContracts(JSON.parse(saved));
    } else {
      // Initialize with sample data
      const sampleContracts: Contract[] = [
        {
          id: '1',
          title: 'Lead Actor Contract - Neon Horizons',
          type: 'actor',
          party: 'Emma Stone',
          amount: 25000000,
          startDate: '2024-01-01',
          endDate: '2024-06-30',
          status: 'completed',
          description: 'Lead actress for Neon Horizons',
          terms: 'Exclusive contract, 5% backend participation',
        },
        {
          id: '2',
          title: 'Location Rental - Downtown Studio',
          type: 'location',
          party: 'Downtown Studio Rentals',
          amount: 500000,
          startDate: '2024-02-01',
          endDate: '2024-05-31',
          status: 'active',
          description: 'Primary filming location',
          terms: '30 days notice for cancellation',
        },
        {
          id: '3',
          title: 'Equipment Rental - Camera Package',
          type: 'equipment',
          party: 'CinemaGear Pro',
          amount: 750000,
          startDate: '2024-03-01',
          endDate: '2024-09-01',
          status: 'active',
          description: '4K camera package with lenses',
          terms: 'Insurance required, daily rate $25,000',
        },
        {
          id: '4',
          title: 'Production Designer Contract',
          type: 'crew',
          party: 'Michael Chen',
          amount: 3500000,
          startDate: '2024-01-15',
          endDate: '2024-08-15',
          status: 'pending',
          description: 'Production design for The Last Echo',
          terms: 'Weekly rate $65,000, 12-week commitment',
        },
      ];
      setContracts(sampleContracts);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contracts));
  }, [contracts]);

  const metrics: ContractMetrics = {
    totalValue: contracts.reduce((sum, c) => sum + c.amount, 0),
    activeContracts: contracts.filter(c => c.status === 'active').length,
    pendingContracts: contracts.filter(c => c.status === 'pending').length,
    completedContracts: contracts.filter(c => c.status === 'completed').length,
  };

  const handleAddContract = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newContract: Contract = {
      id: Date.now().toString(),
      title: formData.get('title') as string,
      type: formData.get('type') as Contract['type'],
      party: formData.get('party') as string,
      amount: parseFloat(formData.get('amount') as string) || 0,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      status: formData.get('status') as Contract['status'],
      description: formData.get('description') as string,
      terms: formData.get('terms') as string,
    };
    setContracts([...contracts, newContract]);
    setShowAddContract(false);
  };

  const handleDeleteContract = (id: string) => {
    setContracts(contracts.filter(c => c.id !== id));
  };

  const filteredContracts = contracts.filter(c => {
    const typeMatch = filterType === 'all' || c.type === filterType;
    const statusMatch = filterStatus === 'all' || c.status === filterStatus;
    return typeMatch && statusMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'completed':
        return 'text-blue-400';
      case 'terminated':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'actor':
        return 'bg-purple-900/30 text-purple-300';
      case 'crew':
        return 'bg-blue-900/30 text-blue-300';
      case 'vendor':
        return 'bg-orange-900/30 text-orange-300';
      case 'location':
        return 'bg-green-900/30 text-green-300';
      case 'equipment':
        return 'bg-cyan-900/30 text-cyan-300';
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
          <FileText className="w-8 h-8 text-yellow-400" />
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
              CONTRACTS
            </h1>
            <p className="text-xs text-gray-400">Production & Service Agreements</p>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="border-b border-yellow-600/30 p-4 bg-slate-900/50 grid grid-cols-4 gap-3">
        <div className="bg-slate-800/50 border border-yellow-600/20 rounded p-3">
          <div className="text-xs text-gray-400">Total Value</div>
          <div className="text-lg font-bold text-green-400">{formatCurrency(metrics.totalValue)}</div>
        </div>
        <div className="bg-slate-800/50 border border-yellow-600/20 rounded p-3">
          <div className="text-xs text-gray-400">Active</div>
          <div className="text-lg font-bold text-blue-400">{metrics.activeContracts}</div>
        </div>
        <div className="bg-slate-800/50 border border-yellow-600/20 rounded p-3">
          <div className="text-xs text-gray-400">Pending</div>
          <div className="text-lg font-bold text-yellow-400">{metrics.pendingContracts}</div>
        </div>
        <div className="bg-slate-800/50 border border-yellow-600/20 rounded p-3">
          <div className="text-xs text-gray-400">Completed</div>
          <div className="text-lg font-bold text-purple-400">{metrics.completedContracts}</div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="border-b border-yellow-600/30 p-4 bg-slate-900/30 space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-yellow-400">Contracts</h2>
          <Button
            onClick={() => setShowAddContract(!showAddContract)}
            size="sm"
            className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Contract
          </Button>
        </div>
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-yellow-600/20 rounded text-sm text-white"
          >
            <option value="all">All Types</option>
            <option value="actor">Actor</option>
            <option value="crew">Crew</option>
            <option value="vendor">Vendor</option>
            <option value="location">Location</option>
            <option value="equipment">Equipment</option>
            <option value="other">Other</option>
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-yellow-600/20 rounded text-sm text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>
      </div>

      {/* Add Contract Form */}
      {showAddContract && (
        <form onSubmit={handleAddContract} className="border-b border-yellow-600/30 p-4 bg-slate-800/50 space-y-3 max-h-96 overflow-y-auto">
          <input
            type="text"
            name="title"
            placeholder="Contract Title"
            required
            className="w-full px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white placeholder-gray-500"
          />
          <div className="grid grid-cols-2 gap-2">
            <select name="type" className="px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white">
              <option value="actor">Actor</option>
              <option value="crew">Crew</option>
              <option value="vendor">Vendor</option>
              <option value="location">Location</option>
              <option value="equipment">Equipment</option>
              <option value="other">Other</option>
            </select>
            <select name="status" className="px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white">
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
          <input
            type="text"
            name="party"
            placeholder="Party Name"
            required
            className="w-full px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white placeholder-gray-500"
          />
          <input
            type="number"
            name="amount"
            placeholder="Contract Amount ($)"
            required
            className="w-full px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white placeholder-gray-500"
          />
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
          <textarea
            name="description"
            placeholder="Description"
            className="w-full px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white placeholder-gray-500 h-16"
          />
          <textarea
            name="terms"
            placeholder="Terms & Conditions"
            className="w-full px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white placeholder-gray-500 h-16"
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold">
              Save Contract
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowAddContract(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Contracts List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredContracts.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No contracts found</p>
          </div>
        ) : (
          filteredContracts.map(contract => (
            <div key={contract.id} className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-600/30 rounded-lg p-4 hover:border-yellow-400/50 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white">{contract.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${getTypeColor(contract.type)}`}>
                      {contract.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">{contract.party}</div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteContract(contract.id)}>
                  <Trash2 className="w-4 h-4 text-red-400" />
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 pb-3 border-b border-yellow-600/20">
                <div>
                  <div className="text-xs text-gray-500">Amount</div>
                  <div className="font-semibold text-yellow-400">{formatCurrency(contract.amount)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Status</div>
                  <div className={`font-semibold ${getStatusColor(contract.status)}`}>{contract.status.toUpperCase()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Start</div>
                  <div className="font-semibold text-white">{contract.startDate}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">End</div>
                  <div className="font-semibold text-white">{contract.endDate}</div>
                </div>
              </div>

              {contract.status === 'active' && (
                <div className="mb-2 p-2 bg-blue-900/20 border border-blue-600/30 rounded text-sm text-blue-300 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {getDaysRemaining(contract.endDate) > 0
                    ? `${getDaysRemaining(contract.endDate)} days remaining`
                    : 'Expiring soon'}
                </div>
              )}

              <div className="text-xs text-gray-400 space-y-1">
                {contract.description && <p><strong>Description:</strong> {contract.description}</p>}
                {contract.terms && <p><strong>Terms:</strong> {contract.terms}</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
