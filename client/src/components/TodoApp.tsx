import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Edit2, X, Calendar, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
}

const STORAGE_KEY = 'doashow_todo_app';

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newDueDate, setNewDueDate] = useState('');

  // Load todos from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setTodos(JSON.parse(saved));
    } else {
      // Initialize with sample todos
      const sampleTodos: Todo[] = [
        {
          id: '1',
          title: 'Complete project documentation',
          description: 'Write comprehensive docs for the new API',
          completed: false,
          priority: 'high',
          dueDate: '2026-04-25',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Review pull requests',
          description: 'Check and approve pending PRs',
          completed: false,
          priority: 'medium',
          dueDate: '2026-04-23',
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          title: 'Update dependencies',
          completed: true,
          priority: 'low',
          createdAt: new Date().toISOString(),
        },
      ];
      setTodos(sampleTodos);
    }
  }, []);

  // Save todos to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
    if (!newTitle.trim()) return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDescription,
      completed: false,
      priority: newPriority,
      dueDate: newDueDate,
      createdAt: new Date().toISOString(),
    };

    setTodos([newTodo, ...todos]);
    setNewTitle('');
    setNewDescription('');
    setNewPriority('medium');
    setNewDueDate('');
    setShowAddForm(false);
  };

  const handleToggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleUpdateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, ...updates } : todo
    ));
    setEditingId(null);
  };

  const filteredTodos = todos.filter(todo => {
    const statusMatch =
      filterStatus === 'all' ||
      (filterStatus === 'active' && !todo.completed) ||
      (filterStatus === 'completed' && todo.completed);

    const priorityMatch = filterPriority === 'all' || todo.priority === filterPriority;

    return statusMatch && priorityMatch;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
    high: todos.filter(t => t.priority === 'high' && !t.completed).length,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 bg-red-500/10';
      case 'medium':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'low':
        return 'text-green-500 bg-green-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '⚪';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = (dueDate: string, completed: boolean) => {
    if (completed || !dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white">
      {/* Header */}
      <div className="border-b border-yellow-600/30 p-4 bg-gradient-to-r from-slate-900 to-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-red-500 to-yellow-500" />
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">✓</span>
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
              TODO LIST
            </h1>
            <p className="text-xs text-gray-400">Stay organized and productive</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-slate-800/50 border border-yellow-600/20 rounded p-2">
            <div className="text-xs text-gray-400">Total</div>
            <div className="text-lg font-bold text-blue-400">{stats.total}</div>
          </div>
          <div className="bg-slate-800/50 border border-yellow-600/20 rounded p-2">
            <div className="text-xs text-gray-400">Active</div>
            <div className="text-lg font-bold text-cyan-400">{stats.active}</div>
          </div>
          <div className="bg-slate-800/50 border border-yellow-600/20 rounded p-2">
            <div className="text-xs text-gray-400">Completed</div>
            <div className="text-lg font-bold text-green-400">{stats.completed}</div>
          </div>
          <div className="bg-slate-800/50 border border-yellow-600/20 rounded p-2">
            <div className="text-xs text-gray-400">High Priority</div>
            <div className="text-lg font-bold text-red-400">{stats.high}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-yellow-600/30 p-4 bg-slate-900/50 space-y-3">
        <div className="flex gap-2">
          <Button
            onClick={() => setFilterStatus('all')}
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            className="text-xs"
          >
            All
          </Button>
          <Button
            onClick={() => setFilterStatus('active')}
            variant={filterStatus === 'active' ? 'default' : 'outline'}
            size="sm"
            className="text-xs"
          >
            Active
          </Button>
          <Button
            onClick={() => setFilterStatus('completed')}
            variant={filterStatus === 'completed' ? 'default' : 'outline'}
            size="sm"
            className="text-xs"
          >
            Completed
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => setFilterPriority('all')}
            variant={filterPriority === 'all' ? 'default' : 'outline'}
            size="sm"
            className="text-xs"
          >
            All Priorities
          </Button>
          <Button
            onClick={() => setFilterPriority('high')}
            variant={filterPriority === 'high' ? 'default' : 'outline'}
            size="sm"
            className="text-xs"
          >
            🔴 High
          </Button>
          <Button
            onClick={() => setFilterPriority('medium')}
            variant={filterPriority === 'medium' ? 'default' : 'outline'}
            size="sm"
            className="text-xs"
          >
            🟡 Medium
          </Button>
          <Button
            onClick={() => setFilterPriority('low')}
            variant={filterPriority === 'low' ? 'default' : 'outline'}
            size="sm"
            className="text-xs"
          >
            🟢 Low
          </Button>
        </div>
      </div>

      {/* Add Todo Form */}
      {showAddForm && (
        <div className="border-b border-yellow-600/30 p-4 bg-slate-800/50 space-y-3">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
            className="w-full px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            autoFocus
          />
          <textarea
            placeholder="Add a description (optional)"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 h-16"
          />
          <div className="grid grid-cols-3 gap-2">
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <div />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleAddTodo}
              className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-black font-bold"
            >
              Add Todo
            </Button>
            <Button
              onClick={() => {
                setShowAddForm(false);
                setNewTitle('');
                setNewDescription('');
                setNewPriority('medium');
                setNewDueDate('');
              }}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Add Button */}
      {!showAddForm && (
        <div className="px-4 py-3 border-b border-yellow-600/30 bg-slate-900/50">
          <Button
            onClick={() => setShowAddForm(true)}
            className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Todo
          </Button>
        </div>
      )}

      {/* Todos List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">No todos found</p>
            <p className="text-sm">Create a new todo to get started</p>
          </div>
        ) : (
          filteredTodos.map(todo => (
            <div
              key={todo.id}
              className={`bg-gradient-to-br from-slate-800 to-slate-900 border rounded-lg p-4 hover:border-yellow-400/50 transition-all ${
                isOverdue(todo.dueDate || '', todo.completed)
                  ? 'border-red-500/50'
                  : 'border-yellow-600/30'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <button
                  onClick={() => handleToggleTodo(todo.id)}
                  className="flex-shrink-0 mt-1 text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  {todo.completed ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className={`font-semibold text-sm ${
                        todo.completed ? 'line-through text-gray-500' : 'text-white'
                      }`}
                    >
                      {todo.title}
                    </h3>
                    <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(todo.priority)}`}>
                      {getPriorityBadge(todo.priority)} {todo.priority.toUpperCase()}
                    </span>
                  </div>

                  {todo.description && (
                    <p className={`text-xs mb-2 ${todo.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                      {todo.description}
                    </p>
                  )}

                  {/* Due Date */}
                  {todo.dueDate && (
                    <div className={`flex items-center gap-1 text-xs ${
                      isOverdue(todo.dueDate, todo.completed)
                        ? 'text-red-400'
                        : 'text-gray-400'
                    }`}>
                      <Calendar className="w-3 h-3" />
                      {formatDate(todo.dueDate)}
                      {isOverdue(todo.dueDate, todo.completed) && (
                        <span className="text-red-400 font-semibold">OVERDUE</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-gray-400 hover:text-yellow-400"
                    onClick={() => setEditingId(todo.id)}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-gray-400 hover:text-red-400"
                    onClick={() => handleDeleteTodo(todo.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
