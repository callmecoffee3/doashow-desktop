import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClockWidgetProps {
  compact?: boolean;
  onClick?: () => void;
}

export default function ClockWidget({ compact = false, onClick }: ClockWidgetProps) {
  const [time, setTime] = useState(new Date());
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const date = time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  if (compact) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={onClick}
        className="flex items-center gap-2 text-foreground/70 hover:text-foreground"
      >
        <Clock className="w-4 h-4" />
        <span className="font-mono text-sm">{hours}:{minutes}</span>
      </Button>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Large Clock Display */}
      <div className="text-center mb-8">
        <div className="text-7xl font-bold font-mono text-accent mb-4">
          {hours}:{minutes}:{seconds}
        </div>
        <div className="text-2xl text-foreground/70 font-light">
          {date}
        </div>
      </div>

      {/* Time Zone Info */}
      <div className="bg-secondary rounded-lg p-4 w-full max-w-sm">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-foreground/60 uppercase tracking-wider mb-1">Hour</div>
            <div className="text-2xl font-bold">{hours}</div>
          </div>
          <div>
            <div className="text-xs text-foreground/60 uppercase tracking-wider mb-1">Minute</div>
            <div className="text-2xl font-bold">{minutes}</div>
          </div>
          <div>
            <div className="text-xs text-foreground/60 uppercase tracking-wider mb-1">Second</div>
            <div className="text-2xl font-bold">{seconds}</div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 text-center">
        <div className="flex items-center justify-center gap-2 text-foreground/60 mb-2">
          <Calendar className="w-4 h-4" />
          <span>System Time</span>
        </div>
        <div className="text-sm text-foreground/50">
          Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
        </div>
      </div>
    </div>
  );
}
