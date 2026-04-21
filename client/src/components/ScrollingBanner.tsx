import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, Zap } from 'lucide-react';

interface BannerMessage {
  id: string;
  text: string;
  type: 'info' | 'success' | 'alert' | 'feature';
}

interface ScrollingBannerProps {
  messages?: BannerMessage[];
  autoScroll?: boolean;
  scrollInterval?: number;
}

export default function ScrollingBanner({
  messages,
  autoScroll = true,
  scrollInterval = 5000,
}: ScrollingBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const defaultMessages: BannerMessage[] = [
    { id: '1', text: '🎉 Welcome to DoaShow Desktop Environment v1.0', type: 'feature' },
    { id: '2', text: '📝 Tip: Use Notes app to save your important thoughts', type: 'info' },
    { id: '3', text: '🎙️ Record audio messages with the Recorder app', type: 'feature' },
    { id: '4', text: '📅 Organize your schedule with the Calendar app', type: 'info' },
    { id: '5', text: '✓ All your data is saved locally on your device', type: 'success' },
    { id: '6', text: '🚀 Explore all 8 applications in the app launcher', type: 'feature' },
    { id: '7', text: '💡 Use the Calculator for quick math operations', type: 'info' },
    { id: '8', text: '⚡ Drag windows to move them around the desktop', type: 'info' },
  ];

  const displayMessages = messages || defaultMessages;

  useEffect(() => {
    if (!autoScroll || displayMessages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayMessages.length);
    }, scrollInterval);

    return () => clearInterval(interval);
  }, [autoScroll, scrollInterval, displayMessages.length]);

  if (displayMessages.length === 0) return null;

  const currentMessage = displayMessages[currentIndex];

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />;
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />;
      case 'feature':
        return <Zap className="w-4 h-4 text-yellow-500 flex-shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />;
    }
  };

  return (
    <div className="bg-gradient-to-r from-accent/30 via-accent/20 to-accent/30 border-b border-accent/40 px-4 py-3 overflow-hidden">
      <div className="flex items-center gap-3 max-w-full">
        <div className="flex-shrink-0">{getIcon(currentMessage.type)}</div>
        
        {/* Scrolling Text */}
        <div className="flex-1 overflow-hidden">
          <div className="animate-scroll-banner whitespace-nowrap text-sm font-medium text-foreground/80">
            {currentMessage.text}
          </div>
        </div>

        {/* Indicator Dots */}
        <div className="flex gap-1 flex-shrink-0">
          {displayMessages.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                idx === currentIndex ? 'bg-accent' : 'bg-accent/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
