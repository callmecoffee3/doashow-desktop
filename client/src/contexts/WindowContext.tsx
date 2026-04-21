import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Window {
  id: string;
  title: string;
  icon: string;
  component: React.ReactNode;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
}

interface WindowContextType {
  windows: Window[];
  openWindow: (window: Omit<Window, 'isMinimized' | 'isMaximized' | 'zIndex'>) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindow: (id: string, updates: Partial<Window>) => void;
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

export function WindowProvider({ children }: { children: React.ReactNode }) {
  const [windows, setWindows] = useState<Window[]>([]);
  const [maxZIndex, setMaxZIndex] = useState(1);

  const openWindow = useCallback((newWindow: Omit<Window, 'isMinimized' | 'isMaximized' | 'zIndex'>) => {
    const id = newWindow.id || `window-${Date.now()}`;
    setMaxZIndex(prev => prev + 1);
    
    setWindows(prev => {
      // Check if window already exists
      const exists = prev.find(w => w.id === id);
      if (exists) {
        // Focus existing window
        return prev.map(w => 
          w.id === id ? { ...w, isMinimized: false, zIndex: maxZIndex + 1 } : w
        );
      }
      
      return [...prev, {
        ...newWindow,
        isMinimized: false,
        isMaximized: false,
        zIndex: maxZIndex + 1,
      }];
    });
  }, [maxZIndex]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => 
      prev.map(w => w.id === id ? { ...w, isMinimized: true } : w)
    );
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => 
      prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)
    );
  }, []);

  const focusWindow = useCallback((id: string) => {
    setMaxZIndex(prev => prev + 1);
    setWindows(prev => 
      prev.map(w => w.id === id ? { ...w, zIndex: maxZIndex + 1, isMinimized: false } : w)
    );
  }, [maxZIndex]);

  const updateWindow = useCallback((id: string, updates: Partial<Window>) => {
    setWindows(prev => 
      prev.map(w => w.id === id ? { ...w, ...updates } : w)
    );
  }, []);

  return (
    <WindowContext.Provider value={{ windows, openWindow, closeWindow, minimizeWindow, maximizeWindow, focusWindow, updateWindow }}>
      {children}
    </WindowContext.Provider>
  );
}

export function useWindow() {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindow must be used within WindowProvider');
  }
  return context;
}
