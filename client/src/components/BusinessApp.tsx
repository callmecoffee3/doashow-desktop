import React, { useState, useEffect } from 'react';
import { BarChart3, Users, FileText, TrendingUp, Settings, Plus, Trash2, Edit2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Employee {
  id: string;
  name: string;
  position: string;
  email: string;
  department: string;
}

interface Project {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'pending';
  progress: number;
  team: string[];
}

interface Invoice {
  id: string;
  number: string;
  client: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
}

interface BusinessMetrics {
  revenue: number;
  employees: number;
  projects: number;
  invoices: number;
}

const STORAGE_KEY = 'doashow_business_app';

export default function BusinessApp() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'employees' | 'projects' | 'invoices'>('dashboard');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setEmployees(data.employees || []);
      setProjects(data.projects || []);
      setInvoices(data.invoices || []);
    } else {
      // Initialize with sample data
      const sampleEmployees: Employee[] = [
        { id: '1', name: 'John Smith', position: 'CEO', email: 'john@company.com', department: 'Executive' },
        { id: '2', name: 'Sarah Johnson', position: 'CTO', email: 'sarah@company.com', department: 'Technology' },
        { id: '3', name: 'Mike Davis', position: 'Sales Manager', email: 'mike@company.com', department: 'Sales' },
      ];
      const sampleProjects: Project[] = [
        { id: '1', name: 'Website Redesign', status: 'active', progress: 65, team: ['1', '2'] },
        { id: '2', name: 'Mobile App', status: 'active', progress: 40, team: ['2', '3'] },
        { id: '3', name: 'Q1 Marketing', status: 'completed', progress: 100, team: ['3'] },
      ];
      const sampleInvoices: Invoice[] = [
        { id: '1', number: 'INV-001', client: 'Tech Corp', amount: 15000, date: '2024-01-15', status: 'paid' },
        { id: '2', number: 'INV-002', client: 'Global Industries', amount: 22500, date: '2024-01-20', status: 'pending' },
        { id: '3', number: 'INV-003', client: 'StartUp Inc', amount: 8500, date: '2024-01-10', status: 'overdue' },
      ];
      setEmployees(sampleEmployees);
      setProjects(sampleProjects);
      setInvoices(sampleInvoices);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ employees, projects, invoices }));
  }, [employees, projects, invoices]);

  const metrics: BusinessMetrics = {
    revenue: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    employees: employees.length,
    projects: projects.length,
    invoices: invoices.length,
  };

  // Employee Management
  const handleAddEmployee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newEmployee: Employee = {
      id: editingId || Date.now().toString(),
      name: formData.get('name') as string,
      position: formData.get('position') as string,
      email: formData.get('email') as string,
      department: formData.get('department') as string,
    };

    if (editingId) {
      setEmployees(employees.map(emp => emp.id === editingId ? newEmployee : emp));
      setEditingId(null);
    } else {
      setEmployees([...employees, newEmployee]);
    }
    setShowAddEmployee(false);
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  // Project Management
  const handleAddProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProject: Project = {
      id: editingId || Date.now().toString(),
      name: formData.get('name') as string,
      status: formData.get('status') as 'active' | 'completed' | 'pending',
      progress: parseInt(formData.get('progress') as string) || 0,
      team: [],
    };

    if (editingId) {
      setProjects(projects.map(proj => proj.id === editingId ? newProject : proj));
      setEditingId(null);
    } else {
      setProjects([...projects, newProject]);
    }
    setShowAddProject(false);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(proj => proj.id !== id));
  };

  // Invoice Management
  const handleAddInvoice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newInvoice: Invoice = {
      id: editingId || Date.now().toString(),
      number: formData.get('number') as string,
      client: formData.get('client') as string,
      amount: parseFloat(formData.get('amount') as string) || 0,
      date: formData.get('date') as string,
      status: formData.get('status') as 'paid' | 'pending' | 'overdue',
    };

    if (editingId) {
      setInvoices(invoices.map(inv => inv.id === editingId ? newInvoice : inv));
      setEditingId(null);
    } else {
      setInvoices([...invoices, newInvoice]);
    }
    setShowAddInvoice(false);
  };

  const handleDeleteInvoice = (id: string) => {
    setInvoices(invoices.filter(inv => inv.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
      case 'active':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'overdue':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border p-4 bg-card">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          Business Management
        </h1>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border flex gap-0 bg-card/50">
        {(['dashboard', 'employees', 'projects', 'invoices'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-medium border-b-2 transition-colors capitalize ${
              activeTab === tab
                ? 'border-blue-400 text-blue-400'
                : 'border-transparent text-foreground/60 hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Dashboard Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-sm text-foreground/60">Total Revenue</div>
                <div className="text-2xl font-bold text-green-400 mt-2">${metrics.revenue.toLocaleString()}</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-sm text-foreground/60">Employees</div>
                <div className="text-2xl font-bold text-blue-400 mt-2">{metrics.employees}</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-sm text-foreground/60">Active Projects</div>
                <div className="text-2xl font-bold text-purple-400 mt-2">{metrics.projects}</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-sm text-foreground/60">Invoices</div>
                <div className="text-2xl font-bold text-orange-400 mt-2">{metrics.invoices}</div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Recent Activity
              </h3>
              <div className="space-y-2 text-sm">
                <div>✓ {employees.length} team members active</div>
                <div>✓ {projects.filter(p => p.status === 'active').length} projects in progress</div>
                <div>✓ ${invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0).toLocaleString()} collected</div>
              </div>
            </div>
          </div>
        )}

        {/* Employees Tab */}
        {activeTab === 'employees' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Members
              </h2>
              <Button onClick={() => setShowAddEmployee(!showAddEmployee)} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
            </div>

            {showAddEmployee && (
              <form onSubmit={handleAddEmployee} className="bg-card border border-border rounded-lg p-4 space-y-3">
                <input type="text" name="name" placeholder="Name" required className="w-full px-3 py-2 bg-background border border-border rounded text-sm" />
                <input type="text" name="position" placeholder="Position" required className="w-full px-3 py-2 bg-background border border-border rounded text-sm" />
                <input type="email" name="email" placeholder="Email" required className="w-full px-3 py-2 bg-background border border-border rounded text-sm" />
                <input type="text" name="department" placeholder="Department" required className="w-full px-3 py-2 bg-background border border-border rounded text-sm" />
                <div className="flex gap-2">
                  <Button type="submit" size="sm">Save</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowAddEmployee(false)}>Cancel</Button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {employees.map(emp => (
                <div key={emp.id} className="bg-card border border-border rounded-lg p-4 flex justify-between items-start">
                  <div>
                    <div className="font-bold">{emp.name}</div>
                    <div className="text-sm text-foreground/60">{emp.position}</div>
                    <div className="text-xs text-foreground/50">{emp.email} • {emp.department}</div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteEmployee(emp.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Projects</h2>
              <Button onClick={() => setShowAddProject(!showAddProject)} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>

            {showAddProject && (
              <form onSubmit={handleAddProject} className="bg-card border border-border rounded-lg p-4 space-y-3">
                <input type="text" name="name" placeholder="Project Name" required className="w-full px-3 py-2 bg-background border border-border rounded text-sm" />
                <select name="status" className="w-full px-3 py-2 bg-background border border-border rounded text-sm">
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
                <input type="number" name="progress" placeholder="Progress %" min="0" max="100" className="w-full px-3 py-2 bg-background border border-border rounded text-sm" />
                <div className="flex gap-2">
                  <Button type="submit" size="sm">Save</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowAddProject(false)}>Cancel</Button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {projects.map(proj => (
                <div key={proj.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-bold">{proj.name}</div>
                      <div className={`text-xs font-semibold ${getStatusColor(proj.status)}`}>{proj.status.toUpperCase()}</div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteProject(proj.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{ width: `${proj.progress}%` }} />
                  </div>
                  <div className="text-xs text-foreground/60 mt-1">{proj.progress}% Complete</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Invoices
              </h2>
              <Button onClick={() => setShowAddInvoice(!showAddInvoice)} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Invoice
              </Button>
            </div>

            {showAddInvoice && (
              <form onSubmit={handleAddInvoice} className="bg-card border border-border rounded-lg p-4 space-y-3">
                <input type="text" name="number" placeholder="Invoice #" required className="w-full px-3 py-2 bg-background border border-border rounded text-sm" />
                <input type="text" name="client" placeholder="Client Name" required className="w-full px-3 py-2 bg-background border border-border rounded text-sm" />
                <input type="number" name="amount" placeholder="Amount" step="0.01" required className="w-full px-3 py-2 bg-background border border-border rounded text-sm" />
                <input type="date" name="date" required className="w-full px-3 py-2 bg-background border border-border rounded text-sm" />
                <select name="status" className="w-full px-3 py-2 bg-background border border-border rounded text-sm">
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
                <div className="flex gap-2">
                  <Button type="submit" size="sm">Save</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowAddInvoice(false)}>Cancel</Button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {invoices.map(inv => (
                <div key={inv.id} className="bg-card border border-border rounded-lg p-4 flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-bold">{inv.number}</div>
                      <div className={`text-xs font-semibold ${getStatusColor(inv.status)}`}>{inv.status.toUpperCase()}</div>
                    </div>
                    <div className="text-sm text-foreground/60">{inv.client}</div>
                    <div className="text-xs text-foreground/50">{inv.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-400">${inv.amount.toLocaleString()}</div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteInvoice(inv.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
