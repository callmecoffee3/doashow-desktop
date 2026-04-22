import React, { useState, useEffect } from 'react';
import { Film, Users, Ticket, DollarSign, TrendingUp, Plus, Trash2, Edit2, Play, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilmProduction {
  id: string;
  title: string;
  genre: string;
  budget: number;
  status: 'pre-production' | 'production' | 'post-production' | 'released';
  releaseDate: string;
  rating: number;
  boxOffice: number;
}

interface CastMember {
  id: string;
  name: string;
  role: string;
  salary: number;
  filmId: string;
}

interface TicketSale {
  id: string;
  filmId: string;
  filmTitle: string;
  ticketPrice: number;
  ticketsSold: number;
  revenue: number;
  date: string;
}

interface FilmMetrics {
  totalRevenue: number;
  activeProductions: number;
  releasedFilms: number;
  totalCast: number;
}

const STORAGE_KEY = 'doashow_film_business_app';

export default function BusinessApp() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'productions' | 'cast' | 'tickets'>('dashboard');
  const [films, setFilms] = useState<FilmProduction[]>([]);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [tickets, setTickets] = useState<TicketSale[]>([]);
  const [showAddFilm, setShowAddFilm] = useState(false);
  const [showAddCast, setShowAddCast] = useState(false);
  const [showAddTicket, setShowAddTicket] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setFilms(data.films || []);
      setCast(data.cast || []);
      setTickets(data.tickets || []);
    } else {
      // Initialize with sample data
      const sampleFilms: FilmProduction[] = [
        {
          id: '1',
          title: 'Neon Horizons',
          genre: 'Sci-Fi',
          budget: 150000000,
          status: 'released',
          releaseDate: '2024-03-15',
          rating: 8.5,
          boxOffice: 450000000,
        },
        {
          id: '2',
          title: 'The Last Echo',
          genre: 'Drama',
          budget: 85000000,
          status: 'post-production',
          releaseDate: '2024-06-20',
          rating: 0,
          boxOffice: 0,
        },
        {
          id: '3',
          title: 'Shadows of Tomorrow',
          genre: 'Thriller',
          budget: 120000000,
          status: 'production',
          releaseDate: '2024-11-01',
          rating: 0,
          boxOffice: 0,
        },
      ];
      const sampleCast: CastMember[] = [
        { id: '1', name: 'Emma Stone', role: 'Lead Actress', salary: 25000000, filmId: '1' },
        { id: '2', name: 'Oscar Isaac', role: 'Lead Actor', salary: 28000000, filmId: '1' },
        { id: '3', name: 'Timothée Chalamet', role: 'Lead Actor', salary: 22000000, filmId: '2' },
      ];
      const sampleTickets: TicketSale[] = [
        { id: '1', filmId: '1', filmTitle: 'Neon Horizons', ticketPrice: 15.99, ticketsSold: 28000000, revenue: 447200000, date: '2024-03-15' },
        { id: '2', filmId: '1', filmTitle: 'Neon Horizons', ticketPrice: 15.99, ticketsSold: 500000, revenue: 7995000, date: '2024-04-01' },
      ];
      setFilms(sampleFilms);
      setCast(sampleCast);
      setTickets(sampleTickets);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ films, cast, tickets }));
  }, [films, cast, tickets]);

  const metrics: FilmMetrics = {
    totalRevenue: tickets.reduce((sum, t) => sum + t.revenue, 0),
    activeProductions: films.filter(f => f.status !== 'released').length,
    releasedFilms: films.filter(f => f.status === 'released').length,
    totalCast: cast.length,
  };

  // Film Management
  const handleAddFilm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newFilm: FilmProduction = {
      id: Date.now().toString(),
      title: formData.get('title') as string,
      genre: formData.get('genre') as string,
      budget: parseFloat(formData.get('budget') as string) || 0,
      status: formData.get('status') as 'pre-production' | 'production' | 'post-production' | 'released',
      releaseDate: formData.get('releaseDate') as string,
      rating: 0,
      boxOffice: 0,
    };
    setFilms([...films, newFilm]);
    setShowAddFilm(false);
  };

  const handleDeleteFilm = (id: string) => {
    setFilms(films.filter(f => f.id !== id));
    setCast(cast.filter(c => c.filmId !== id));
  };

  // Cast Management
  const handleAddCast = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCast: CastMember = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      role: formData.get('role') as string,
      salary: parseFloat(formData.get('salary') as string) || 0,
      filmId: formData.get('filmId') as string,
    };
    setCast([...cast, newCast]);
    setShowAddCast(false);
  };

  const handleDeleteCast = (id: string) => {
    setCast(cast.filter(c => c.id !== id));
  };

  // Ticket Management
  const handleAddTicket = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const filmId = formData.get('filmId') as string;
    const ticketPrice = parseFloat(formData.get('ticketPrice') as string) || 0;
    const ticketsSold = parseInt(formData.get('ticketsSold') as string) || 0;
    const revenue = ticketPrice * ticketsSold;
    const filmTitle = films.find(f => f.id === filmId)?.title || 'Unknown';

    const newTicket: TicketSale = {
      id: Date.now().toString(),
      filmId,
      filmTitle,
      ticketPrice,
      ticketsSold,
      revenue,
      date: formData.get('date') as string,
    };
    setTickets([...tickets, newTicket]);
    setShowAddTicket(false);
  };

  const handleDeleteTicket = (id: string) => {
    setTickets(tickets.filter(t => t.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'released':
        return 'text-green-400';
      case 'post-production':
        return 'text-blue-400';
      case 'production':
        return 'text-yellow-400';
      case 'pre-production':
        return 'text-purple-400';
      default:
        return 'text-gray-400';
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

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white">
      {/* Film Strip Header */}
      <div className="border-b border-yellow-600/30 p-4 bg-gradient-to-r from-slate-900 to-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-red-500 to-yellow-500" />
        <div className="flex items-center gap-3">
          <Film className="w-8 h-8 text-yellow-400" />
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
              CINEMA STUDIOS
            </h1>
            <p className="text-xs text-gray-400">Film Production & Distribution</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation - Film Strip Style */}
      <div className="border-b border-yellow-600/30 flex gap-0 bg-slate-900/50 backdrop-blur">
        {(['dashboard', 'productions', 'cast', 'tickets'] as const).map((tab, idx) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-medium border-b-2 transition-all capitalize relative ${
              activeTab === tab
                ? 'border-yellow-400 text-yellow-400 bg-slate-800/50'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab === 'dashboard' && '🎬'}
            {tab === 'productions' && '🎥'}
            {tab === 'cast' && '⭐'}
            {tab === 'tickets' && '🎟️'}
            <span className="ml-2">{tab}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-yellow-400">Studio Dashboard</h2>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-600/30 rounded-lg p-4 hover:border-yellow-400/50 transition-all">
                <div className="text-sm text-gray-400">Total Box Office</div>
                <div className="text-2xl font-bold text-green-400 mt-2">{formatCurrency(metrics.totalRevenue)}</div>
              </div>
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-600/30 rounded-lg p-4 hover:border-yellow-400/50 transition-all">
                <div className="text-sm text-gray-400">In Production</div>
                <div className="text-2xl font-bold text-yellow-400 mt-2">{metrics.activeProductions}</div>
              </div>
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-600/30 rounded-lg p-4 hover:border-yellow-400/50 transition-all">
                <div className="text-sm text-gray-400">Released Films</div>
                <div className="text-2xl font-bold text-blue-400 mt-2">{metrics.releasedFilms}</div>
              </div>
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-600/30 rounded-lg p-4 hover:border-yellow-400/50 transition-all">
                <div className="text-sm text-gray-400">Cast Members</div>
                <div className="text-2xl font-bold text-purple-400 mt-2">{metrics.totalCast}</div>
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-600/30 rounded-lg p-6">
              <h3 className="font-bold mb-4 text-yellow-400 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Top Performing Films
              </h3>
              <div className="space-y-3">
                {films
                  .filter(f => f.status === 'released')
                  .sort((a, b) => b.boxOffice - a.boxOffice)
                  .slice(0, 3)
                  .map(film => (
                    <div key={film.id} className="flex justify-between items-center p-3 bg-slate-700/30 rounded border border-yellow-600/20">
                      <div>
                        <div className="font-semibold text-white">{film.title}</div>
                        <div className="text-xs text-gray-400">⭐ {film.rating}/10</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-400">{formatCurrency(film.boxOffice)}</div>
                        <div className="text-xs text-gray-400">{film.genre}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Productions Tab */}
        {activeTab === 'productions' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
                <Play className="w-6 h-6" />
                Productions
              </h2>
              <Button
                onClick={() => setShowAddFilm(!showAddFilm)}
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Film
              </Button>
            </div>

            {showAddFilm && (
              <form onSubmit={handleAddFilm} className="bg-slate-800 border border-yellow-600/30 rounded-lg p-4 space-y-3">
                <input
                  type="text"
                  name="title"
                  placeholder="Film Title"
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white placeholder-gray-500"
                />
                <input
                  type="text"
                  name="genre"
                  placeholder="Genre"
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white placeholder-gray-500"
                />
                <input
                  type="number"
                  name="budget"
                  placeholder="Budget ($)"
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white placeholder-gray-500"
                />
                <select name="status" className="w-full px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white">
                  <option value="pre-production">Pre-Production</option>
                  <option value="production">Production</option>
                  <option value="post-production">Post-Production</option>
                  <option value="released">Released</option>
                </select>
                <input
                  type="date"
                  name="releaseDate"
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white"
                />
                <div className="flex gap-2">
                  <Button type="submit" size="sm" className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold">
                    Save
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowAddFilm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {films.map(film => (
                <div key={film.id} className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-600/30 rounded-lg p-4 hover:border-yellow-400/50 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="font-bold text-lg text-white">{film.title}</div>
                      <div className={`text-xs font-semibold ${getStatusColor(film.status)}`}>{film.status.toUpperCase()}</div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteFilm(film.id)}>
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Genre:</span>
                      <span className="text-white">{film.genre}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Budget:</span>
                      <span className="text-yellow-400 font-semibold">{formatCurrency(film.budget)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Release:</span>
                      <span className="text-white">{film.releaseDate}</span>
                    </div>
                    {film.status === 'released' && (
                      <>
                        <div className="flex justify-between pt-2 border-t border-yellow-600/20">
                          <span className="text-gray-400">Rating:</span>
                          <span className="text-blue-400 font-semibold">⭐ {film.rating}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Box Office:</span>
                          <span className="text-green-400 font-semibold">{formatCurrency(film.boxOffice)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cast Tab */}
        {activeTab === 'cast' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
                <Star className="w-6 h-6" />
                Cast & Crew
              </h2>
              <Button
                onClick={() => setShowAddCast(!showAddCast)}
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Cast
              </Button>
            </div>

            {showAddCast && (
              <form onSubmit={handleAddCast} className="bg-slate-800 border border-yellow-600/30 rounded-lg p-4 space-y-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Actor Name"
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white placeholder-gray-500"
                />
                <input
                  type="text"
                  name="role"
                  placeholder="Role/Character"
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white placeholder-gray-500"
                />
                <input
                  type="number"
                  name="salary"
                  placeholder="Salary ($)"
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white placeholder-gray-500"
                />
                <select name="filmId" className="w-full px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white">
                  <option value="">Select Film</option>
                  {films.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.title}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <Button type="submit" size="sm" className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold">
                    Save
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowAddCast(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {cast.map(member => {
                const film = films.find(f => f.id === member.filmId);
                return (
                  <div key={member.id} className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-600/30 rounded-lg p-4 hover:border-yellow-400/50 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-bold text-white flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-400" />
                          {member.name}
                        </div>
                        <div className="text-sm text-gray-400">{member.role}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {film ? `${film.title}` : 'Unknown Film'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-purple-400">{formatCurrency(member.salary)}</div>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteCast(member.id)}>
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
                <Ticket className="w-6 h-6" />
                Box Office & Pricing
              </h2>
              <Button
                onClick={() => setShowAddTicket(!showAddTicket)}
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Record Sale
              </Button>
            </div>

            {showAddTicket && (
              <form onSubmit={handleAddTicket} className="bg-slate-800 border border-yellow-600/30 rounded-lg p-4 space-y-3">
                <select name="filmId" className="w-full px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white">
                  <option value="">Select Film</option>
                  {films.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.title}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  name="ticketPrice"
                  placeholder="Ticket Price ($)"
                  step="0.01"
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white placeholder-gray-500"
                />
                <input
                  type="number"
                  name="ticketsSold"
                  placeholder="Tickets Sold"
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white placeholder-gray-500"
                />
                <input
                  type="date"
                  name="date"
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-yellow-600/20 rounded text-sm text-white"
                />
                <div className="flex gap-2">
                  <Button type="submit" size="sm" className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold">
                    Save
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowAddTicket(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {tickets.map(ticket => (
                <div key={ticket.id} className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-600/30 rounded-lg p-4 hover:border-yellow-400/50 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="font-bold text-white">{ticket.filmTitle}</div>
                      <div className="text-sm text-gray-400">{ticket.date}</div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteTicket(ticket.id)}>
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm pt-2 border-t border-yellow-600/20">
                    <div>
                      <div className="text-gray-400 text-xs">Price</div>
                      <div className="font-semibold text-yellow-400">{formatCurrency(ticket.ticketPrice)}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs">Tickets</div>
                      <div className="font-semibold text-blue-400">{ticket.ticketsSold.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs">Revenue</div>
                      <div className="font-semibold text-green-400">{formatCurrency(ticket.revenue)}</div>
                    </div>
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
