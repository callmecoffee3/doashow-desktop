import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Event {
  id: string;
  date: string;
  title: string;
  time: string;
  description: string;
}

export default function ScheduleApp() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', time: '09:00', description: '' });

  // Load events from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('doashow_events');
    if (saved) {
      setEvents(JSON.parse(saved));
    }
  }, []);

  const saveEvents = (updatedEvents: Event[]) => {
    setEvents(updatedEvents);
    localStorage.setItem('doashow_events', JSON.stringify(updatedEvents));
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const addEvent = () => {
    if (!selectedDate || !formData.title) return;
    const newEvent: Event = {
      id: Date.now().toString(),
      date: selectedDate,
      title: formData.title,
      time: formData.time,
      description: formData.description,
    };
    saveEvents([...events, newEvent]);
    setFormData({ title: '', time: '09:00', description: '' });
    setShowForm(false);
  };

  const deleteEvent = (id: string) => {
    saveEvents(events.filter(e => e.id !== id));
  };

  const getEventsForDate = (date: string) => {
    return events.filter(e => e.date === date);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthName = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="flex h-full">
      {/* Calendar */}
      <div className="w-2/3 border-r border-border p-4 overflow-y-auto">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button onClick={previousMonth} variant="ghost" size="icon">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-bold">{monthName}</h2>
          <Button onClick={nextMonth} variant="ghost" size="icon">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-semibold text-foreground/60 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => {
            const dateStr = day ? formatDate(currentDate.getFullYear(), currentDate.getMonth(), day) : null;
            const dayEvents = dateStr ? getEventsForDate(dateStr) : [];
            const isSelected = dateStr === selectedDate;

            return (
              <button
                key={idx}
                onClick={() => day && setSelectedDate(dateStr)}
                className={`aspect-square p-2 rounded border transition-colors text-sm ${
                  day
                    ? isSelected
                      ? 'bg-accent text-accent-foreground border-accent'
                      : 'border-border hover:bg-accent/10'
                    : 'bg-secondary/30 border-transparent'
                }`}
              >
                {day && (
                  <div>
                    <div className="font-semibold">{day}</div>
                    {dayEvents.length > 0 && (
                      <div className="text-xs text-accent mt-1">
                        {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events Panel */}
      <div className="w-1/3 bg-secondary flex flex-col">
        <div className="border-b border-border p-4">
          <h3 className="font-semibold mb-2">
            {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Select a date'}
          </h3>
          {selectedDate && (
            <Button onClick={() => setShowForm(!showForm)} size="sm" className="w-full gap-2">
              <Plus className="w-4 h-4" />
              Add Event
            </Button>
          )}
        </div>

        {/* Add Event Form */}
        {showForm && selectedDate && (
          <div className="border-b border-border p-4 space-y-3">
            <input
              type="text"
              placeholder="Event title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
            />
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm h-20 resize-none"
            />
            <div className="flex gap-2">
              <Button onClick={addEvent} size="sm" className="flex-1">
                Save
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline" size="sm" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Events List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {selectedDate ? (
            getEventsForDate(selectedDate).length > 0 ? (
              getEventsForDate(selectedDate).map(event => (
                <div key={event.id} className="bg-card p-3 rounded border border-border">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <div className="font-semibold text-sm">{event.title}</div>
                      <div className="text-xs text-foreground/60">{event.time}</div>
                    </div>
                    <Button
                      onClick={() => deleteEvent(event.id)}
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  {event.description && (
                    <p className="text-xs text-foreground/70 mt-2">{event.description}</p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-foreground/50 py-8">
                <p className="text-sm">No events scheduled</p>
              </div>
            )
          ) : (
            <div className="text-center text-foreground/50 py-8">
              <p className="text-sm">Select a date to view events</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
