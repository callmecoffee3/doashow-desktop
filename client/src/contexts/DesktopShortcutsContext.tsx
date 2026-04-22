import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface DesktopShortcut {
  id: string;
  appId: string;
  name: string;
  icon: string;
  x: number;
  y: number;
}

interface DesktopShortcutsContextType {
  shortcuts: DesktopShortcut[];
  addShortcut: (appId: string, name: string, icon: string) => void;
  removeShortcut: (id: string) => void;
  updateShortcutPosition: (id: string, x: number, y: number) => void;
  clearAllShortcuts: () => void;
}

const DesktopShortcutsContext = createContext<DesktopShortcutsContextType | undefined>(undefined);

export const DesktopShortcutsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [shortcuts, setShortcuts] = useState<DesktopShortcut[]>(() => {
    const saved = localStorage.getItem('doashow_desktop_shortcuts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('doashow_desktop_shortcuts', JSON.stringify(shortcuts));
  }, [shortcuts]);

  const addShortcut = (appId: string, name: string, icon: string) => {
    // Check if shortcut already exists
    if (shortcuts.some(s => s.appId === appId)) {
      return;
    }

    const newShortcut: DesktopShortcut = {
      id: `shortcut-${Date.now()}`,
      appId,
      name,
      icon,
      x: Math.random() * 100,
      y: Math.random() * 100,
    };

    setShortcuts([...shortcuts, newShortcut]);
  };

  const removeShortcut = (id: string) => {
    setShortcuts(shortcuts.filter(s => s.id !== id));
  };

  const updateShortcutPosition = (id: string, x: number, y: number) => {
    setShortcuts(
      shortcuts.map(s =>
        s.id === id ? { ...s, x, y } : s
      )
    );
  };

  const clearAllShortcuts = () => {
    setShortcuts([]);
  };

  return (
    <DesktopShortcutsContext.Provider
      value={{
        shortcuts,
        addShortcut,
        removeShortcut,
        updateShortcutPosition,
        clearAllShortcuts,
      }}
    >
      {children}
    </DesktopShortcutsContext.Provider>
  );
};

export const useDesktopShortcuts = () => {
  const context = useContext(DesktopShortcutsContext);
  if (!context) {
    throw new Error('useDesktopShortcuts must be used within DesktopShortcutsProvider');
  }
  return context;
};
