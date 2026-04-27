import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Event {
  id: string;
  date: string;
  title: string;
  description: string;
  time: string;
  color: string;
}

export default function CalendarApp() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 26));
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      date: '2026-04-26',
      title: 'Team Meeting',
      description: 'Quarterly review meeting',
      time: '10:00 AM',
      color: 'bg-blue-500',
    },
    {
      id: '2',
      date: '2026-04-28',
      title: 'Project Deadline',
      description: 'Submit final deliverables',
      time: '05:00 PM',
      color: 'bg-red-500',
    },
    {
      id: '3',
      date: '2026-04-30',
      title: 'Conference',
      description: 'Annual tech conference',
      time: '09:00 AM',
      color: 'bg-purple-500',
    },
  ]);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    time: '09:00 AM',
    color: 'bg-blue-500',
  });

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleAddEvent = () => {
    if (!selectedDate || !newEvent.title) return;

    setEvents([
      ...events,
      {
        id: Date.now().toString(),
        date: selectedDate,
        title: newEvent.title,
        description: newEvent.description,
        time: newEvent.time,
        color: newEvent.color,
      },
    ]);

    setNewEvent({ title: '', description: '', time: '09:00 AM', color: 'bg-blue-500' });
    setShowEventForm(false);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const getDateString = (day: number) => {
    return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getEventsForDate = (dateStr: string) => {
    return events.filter(e => e.date === dateStr);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 bg-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">📅 Calendar</h2>
          <Button
            size="sm"
            onClick={() => setShowEventForm(true)}
            className="bg-accent hover:bg-accent/90"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Event
          </Button>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={handlePrevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h3 className="text-lg font-bold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <Button variant="outline" size="sm" onClick={handleNextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 flex gap-4">
        {/* Calendar */}
        <div className="flex-1 space-y-4">
          {/* Day Names */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center font-bold text-sm text-foreground/60">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
              const dateStr = day ? getDateString(day) : null;
              const dayEvents = dateStr ? getEventsForDate(dateStr) : [];
              const isToday = day && new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

              return (
                <div
                  key={index}
                  onClick={() => day && setSelectedDate(dateStr)}
                  className={`min-h-24 p-2 rounded-lg border cursor-pointer transition-all ${
                    day
                      ? selectedDate === dateStr
                        ? 'border-accent bg-accent/10'
                        : isToday
                        ? 'border-blue-500 bg-blue-500/5'
                        : 'border-border hover:border-accent'
                      : 'border-transparent'
                  }`}
                >
                  {day && (
                    <div className="space-y-1">
                      <div className={`text-sm font-bold ${isToday ? 'text-blue-600' : ''}`}>
                        {day}
                      </div>
                      <div className="space-y-0.5">
                        {dayEvents.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className={`text-xs px-1 py-0.5 rounded text-white truncate ${event.color}`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-foreground/60">+{dayEvents.length - 2} more</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar - Events */}
        <div className="w-64 space-y-4">
          <h3 className="font-bold">
            {selectedDate ? new Date(selectedDate).toDateString() : 'Select a date'}
          </h3>

          {selectedDate && getEventsForDate(selectedDate).length > 0 ? (
            <div className="space-y-2">
              {getEventsForDate(selectedDate).map(event => (
                <div key={event.id} className="bg-card border border-border rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{event.title}</p>
                      <p className="text-xs text-foreground/60">{event.time}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  {event.description && (
                    <p className="text-xs text-foreground/70">{event.description}</p>
                  )}
                  <div className={`w-2 h-2 rounded-full ${event.color}`} />
                </div>
              ))}
            </div>
          ) : selectedDate ? (
            <p className="text-sm text-foreground/60">No events scheduled</p>
          ) : null}

          {/* Add Event Form */}
          {showEventForm && selectedDate && (
            <div className="bg-card border border-border rounded-lg p-3 space-y-3">
              <h4 className="font-bold text-sm">New Event</h4>
              <input
                type="text"
                placeholder="Event title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <input
                type="text"
                placeholder="Description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <input
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <select
                value={newEvent.color}
                onChange={(e) => setNewEvent({ ...newEvent, color: e.target.value })}
                className="w-full px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="bg-blue-500">Blue</option>
                <option value="bg-red-500">Red</option>
                <option value="bg-green-500">Green</option>
                <option value="bg-purple-500">Purple</option>
                <option value="bg-yellow-500">Yellow</option>
              </select>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleAddEvent}
                  className="flex-1 bg-accent hover:bg-accent/90"
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowEventForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
