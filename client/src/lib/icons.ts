// Centralized icons and emojis for DoaShow
// This file organizes all icons and emojis used throughout the application

export const EMOJIS = {
  // Media
  media: {
    slideshow: '🖼️',
    video: '🎬',
    audio: '🎙️',
    music: '🎵',
    podcast: '🎧',
    camera: '📷',
    film: '🎞️',
    record: '⏺️',
    play: '▶️',
    pause: '⏸️',
    stop: '⏹️',
    volume: '🔊',
    mute: '🔇',
  },

  // Files & Folders
  files: {
    folder: '📁',
    file: '📄',
    document: '📃',
    text: '📝',
    image: '🖼️',
    archive: '📦',
    download: '⬇️',
    upload: '⬆️',
    save: '💾',
    delete: '🗑️',
    copy: '📋',
  },

  // Communication
  communication: {
    message: '💬',
    chat: '💭',
    email: '📧',
    phone: '📱',
    call: '☎️',
    messenger: '💬',
    group: '👥',
    people: '👨‍👩‍👧‍👦',
    user: '👤',
    share: '🔗',
  },

  // Productivity
  productivity: {
    notes: '📝',
    tasks: '✓',
    calendar: '📅',
    schedule: '📆',
    clock: '🕐',
    timer: '⏱️',
    alarm: '⏰',
    calculator: '🧮',
    chart: '📊',
    graph: '📈',
  },

  // System & Settings
  system: {
    settings: '⚙️',
    gear: '⚙️',
    tools: '🛠️',
    wrench: '🔧',
    power: '⚡',
    battery: '🔋',
    wifi: '📶',
    signal: '📡',
    lock: '🔒',
    unlock: '🔓',
    key: '🔑',
    shield: '🛡️',
  },

  // Navigation
  navigation: {
    home: '🏠',
    back: '⬅️',
    forward: '➡️',
    up: '⬆️',
    down: '⬇️',
    menu: '☰',
    search: '🔍',
    find: '🔎',
    star: '⭐',
    favorite: '❤️',
    bookmark: '🔖',
  },

  // Status & Feedback
  status: {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    question: '❓',
    loading: '⏳',
    pending: '⏳',
    done: '✓',
    check: '✔️',
    cross: '✕',
  },

  // Applications
  apps: {
    slideshow: '🖼️',
    fileExplorer: '📁',
    notes: '📝',
    calculator: '🧮',
    schedule: '📅',
    recorder: '🎙️',
    settings: '⚙️',
    clock: '🕐',
    church: '⛪',
    messenger: '💬',
    groups: '👥',
    pages: '📄',
    videos: '🎬',
    photos: '📷',
    appStore: '🏪',
    podcast: '🎧',
  },

  // Other
  other: {
    star: '⭐',
    heart: '❤️',
    thumbsUp: '👍',
    thumbsDown: '👎',
    fire: '🔥',
    rocket: '🚀',
    bulb: '💡',
    gift: '🎁',
    party: '🎉',
    celebration: '🎊',
  },
};

export const ICON_CATEGORIES = {
  media: ['slideshow', 'video', 'audio', 'music', 'podcast', 'camera'],
  files: ['folder', 'file', 'document', 'text', 'image', 'archive'],
  communication: ['message', 'chat', 'email', 'phone', 'messenger', 'group'],
  productivity: ['notes', 'tasks', 'calendar', 'schedule', 'calculator'],
  system: ['settings', 'tools', 'power', 'wifi', 'lock', 'shield'],
  navigation: ['home', 'back', 'forward', 'search', 'star', 'bookmark'],
  status: ['success', 'error', 'warning', 'info', 'loading'],
};

export const getEmoji = (category: keyof typeof EMOJIS, key: string): string => {
  const categoryEmojis = EMOJIS[category];
  if (categoryEmojis && key in categoryEmojis) {
    return categoryEmojis[key as keyof typeof categoryEmojis];
  }
  return '❓'; // Default fallback emoji
};

export const getAllEmojis = (): string[] => {
  const emojis: string[] = [];
  Object.values(EMOJIS).forEach(category => {
    if (typeof category === 'object') {
      emojis.push(...Object.values(category));
    }
  });
  return Array.from(new Set(emojis)); // Remove duplicates
};

export const searchEmojis = (query: string): { category: string; key: string; emoji: string }[] => {
  const results: { category: string; key: string; emoji: string }[] = [];
  const lowerQuery = query.toLowerCase();

  Object.entries(EMOJIS).forEach(([category, items]) => {
    if (typeof items === 'object') {
      Object.entries(items).forEach(([key, emoji]) => {
        if (key.toLowerCase().includes(lowerQuery) || category.toLowerCase().includes(lowerQuery)) {
          results.push({ category, key, emoji });
        }
      });
    }
  });

  return results;
};
