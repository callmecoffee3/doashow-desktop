# 🎬 DoaShow - Desktop Slideshow Environment v1.0

**DoaShow** is a comprehensive desktop environment simulator built with React, featuring a fully functional app ecosystem with 33+ integrated applications, floating taskbar, global search, and rich multimedia capabilities.

---

## 📋 Table of Contents

- [Features](#features)
- [Apps Overview](#apps-overview)
- [Getting Started](#getting-started)
- [System Architecture](#system-architecture)
- [Usage Guide](#usage-guide)
- [Development](#development)
- [Project Structure](#project-structure)

---

## ✨ Features

### Core Desktop Features
- **Floating Taskbar** - Draggable taskbar with pinned apps and quick search
- **Global Search** - Real-time app search from taskbar or Start Menu
- **Start Menu** - Organized app launcher with search and categories
- **App Launcher** - Browse 33+ apps with grid/list view and preview panel
- **Draggable Windows** - Move and manage multiple app windows
- **Browser Toolbar** - Navigation, address bar, bookmarks in each app window
- **Desktop Shortcuts** - Pin apps to desktop for quick access
- **Dark Theme** - Cinema-inspired dark aesthetic with golden/red accents

### System Management
- **File Explorer** - Browse files with simulation ticker messages
- **Downloads Manager** - Track downloaded files by type and size
- **Users Management** - Manage user accounts with roles and permissions
- **Memory Monitor** - Real-time system memory, RAM, and CPU monitoring
- **Calendar** - Event management with monthly view
- **Screen Manager** - Display settings and customization
- **Orientation Control** - Screen orientation management

---

## 🎯 Apps Overview

### **Media Apps** (🎨 Creative & Entertainment)
| App | Icon | Description |
|-----|------|-------------|
| Slideshow | 🖼️ | Create and play photo slideshows from desktop files |
| Photos | 📷 | Organize photos into albums with likes and comments |
| Videos | 🎬 | Browse and play video content |
| Music | 🎵 | Music player with playlists and playback controls |
| Podcast | 🎙️ | Podcast episodes with descriptions and ratings |
| Recorder | 🎙️ | Record audio and video content |

### **Productivity Apps** (📊 Work & Organization)
| App | Icon | Description |
|-----|------|-------------|
| Notes | 📝 | Organize notes into notebooks and folders |
| Todo | ✅ | Task management with priorities and due dates |
| Calendar | 📅 | Event planning and scheduling |
| File Explorer | 📁 | Browse files and folders |
| Terminal | 💻 | Command-line interface with common commands |
| Messenger | 💬 | Direct messaging and conversations |

### **Social Apps** (👥 Networking & Communication)
| App | Icon | Description |
|-----|------|-------------|
| SocialHub | 🌐 | Social network with posts, likes, and comments |
| Facebook | 👥 | Facebook integration with feeds and events |
| Instagram | 📷 | Photo sharing with gradient theme |
| X.com | 𝕏 | Twitter-like platform with tweets and retweets |
| YouTube | ▶️ | Video browsing and player |
| TikTok | ♪ | Short video platform with swipeable feed |

### **Business Apps** (💼 Enterprise & Management)
| App | Icon | Description |
|-----|------|-------------|
| Cinema Studios | 🎬 | Film production management with budgets and box office |
| Contracts | 📋 | Contract management for production agreements |
| Construction | 🔨 | Set construction and production logistics |
| Dashboard | 📊 | Unified analytics from all business apps |
| Websites | 🌐 | Marketing website management and analytics |
| Marketplace | 🛍️ | E-commerce with products and shopping cart |
| Bank | 🏦 | Financial management and transactions |

### **System Apps** (⚙️ Settings & Management)
| App | Icon | Description |
|-----|------|-------------|
| Users | 👥 | User account management and profiles |
| Memory | 💾 | System memory and storage monitoring |
| Settings | ⚙️ | System preferences and configuration |
| Help | ❓ | Help and documentation |
| Groups | 👫 | Community and group management |
| Pages | 📄 | Document and page management |

### **Utility Apps** (🛠️ Tools & Helpers)
| App | Icon | Description |
|-----|------|-------------|
| Calculator | 🧮 | Basic and scientific calculations |
| Church | ⛪ | Community and religious content |
| MintMobile | 📱 | Mobile service management |
| Schedule | 📅 | Scheduling and time management |
| Screen Manager | 🖥️ | Display settings and customization |
| Orientation | 🔄 | Screen orientation control |
| App Store | 🏪 | Browse 170+ apps with categories |

---

## 🚀 Getting Started

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd doashow

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Access the Application
- **Local**: http://localhost:3000
- **Network**: http://169.254.0.21:3000
- **Public**: https://doashow-puykbhxx.manus.space

---

## 🏗️ System Architecture

### Technology Stack
- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Routing**: Wouter (client-side)
- **State Management**: React Hooks + Context API
- **Icons**: Lucide React
- **Storage**: localStorage for persistence

### Key Components

#### Desktop (`Desktop.tsx`)
Main desktop environment with floating taskbar, window management, and global search.

#### Window Management (`DraggableWindow.tsx`)
Handles window dragging, resizing, and browser toolbar for each app.

#### App Launcher (`AppLauncher.tsx`)
Central hub for all 33+ apps with search, filtering, and preview panel.

#### Contexts
- `WindowContext.tsx` - Window state management
- `DesktopShortcutsContext.tsx` - Desktop shortcuts management

---

## 📖 Usage Guide

### Launching Apps
1. **Start Menu** - Click ⊞ button on taskbar
2. **Global Search** - Click 🔍 on taskbar and type app name
3. **Pinned Apps** - Click app icons on taskbar
4. **App Launcher** - Open from Start Menu or search

### Managing Windows
- **Drag** - Click title bar to move window
- **Resize** - Drag corners or edges
- **Maximize** - Double-click title bar
- **Close** - Click X button
- **Browser Toolbar** - Use navigation, address bar, bookmarks

### Taskbar Features
- **Drag Taskbar** - Move floating taskbar anywhere
- **Pin Apps** - Right-click app to pin to taskbar
- **Search** - Type to find and launch apps
- **Clock** - Shows current time

### File Management
- **File Explorer** - Browse desktop files
- **Downloads** - Track downloaded files
- **Slideshow** - Upload photos from desktop

---

## 💻 Development

### Project Structure
```
doashow/
├── client/
│   ├── src/
│   │   ├── components/      # 33+ app components
│   │   ├── contexts/        # React contexts
│   │   ├── lib/             # Utilities
│   │   ├── pages/           # Page components
│   │   ├── App.tsx          # Main app component
│   │   ├── main.tsx         # React entry point
│   │   └── index.css        # Global styles
│   ├── public/              # Static files
│   └── index.html           # HTML template
├── server/                  # Placeholder for API
├── shared/                  # Shared types
└── package.json
```

### Key Files

| File | Purpose |
|------|---------|
| `App.tsx` | Routes and top-level layout |
| `Desktop.tsx` | Main desktop environment |
| `AppLauncher.tsx` | App registry and launcher |
| `DraggableWindow.tsx` | Window component with toolbar |
| `index.css` | Design tokens and global styles |

### Adding New Apps

1. Create new component in `components/` folder
2. Export default function with app UI
3. Add to apps array in `AppLauncher.tsx`
4. Add window width to `widthMap`
5. Test in app launcher

Example:
```tsx
// components/MyApp.tsx
export default function MyApp() {
  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* App content */}
    </div>
  );
}

// In AppLauncher.tsx
import MyApp from '@/components/MyApp';

// Add to apps array
{
  id: 'myapp',
  name: 'My App',
  icon: '🎯',
  description: 'My awesome app',
  component: <MyApp />,
}

// Add to widthMap
widthMap: {
  myapp: 1000,
}
```

### Styling Guidelines
- Use Tailwind CSS utilities for layout
- Use shadcn/ui components for UI elements
- Define colors in `index.css` using CSS variables
- Follow dark theme with golden/red accents
- Ensure text contrast and accessibility

---

## 🎨 Design System

### Color Palette
- **Background**: Dark slate (#1a1a1a)
- **Accent**: Golden yellow (#fbbf24)
- **Secondary**: Red (#ef4444)
- **Text**: Light gray (#e5e7eb)
- **Border**: Dark gray (#374151)

### Typography
- **Display**: Bold sans-serif for headers
- **Body**: Regular sans-serif for content
- **Mono**: Monospace for code/terminal

### Spacing
- Base unit: 4px (Tailwind default)
- Padding: 4px, 8px, 12px, 16px, 24px, 32px
- Gaps: 8px, 12px, 16px, 24px

---

## 📱 Responsive Design

DoaShow is optimized for desktop environments with:
- Minimum width: 1024px
- Recommended: 1440px or higher
- Touch support for mobile devices
- Adaptive window sizing

---

## 🔧 Configuration

### Environment Variables
```
VITE_APP_TITLE=DoaShow
VITE_APP_LOGO=🎬
VITE_ANALYTICS_ENDPOINT=...
VITE_ANALYTICS_WEBSITE_ID=...
```

### localStorage Keys
- `pinnedApps` - Pinned app icons on taskbar
- `taskbarPosition` - Floating taskbar position
- `[appName]Data` - App-specific data storage

---

## 📊 Performance

- **Lazy Loading**: Apps load on demand
- **Code Splitting**: Separate bundles per app
- **localStorage Caching**: Persistent app data
- **Optimized Rendering**: React hooks and memoization
- **CSS-in-JS**: Tailwind for minimal CSS

---

## 🤝 Contributing

To contribute to DoaShow:

1. Create a new branch for your feature
2. Make changes and test thoroughly
3. Submit a pull request with description
4. Ensure code follows project guidelines

---

## 📝 License

DoaShow is open source and available under the MIT License.

---

## 🙋 Support

For issues, questions, or suggestions:
- Check the Help app (❓) for documentation
- Review existing issues on GitHub
- Create a new issue with detailed description

---

## 🎯 Roadmap

### Upcoming Features
- Real-time notifications system
- Cross-app data synchronization
- Theme customization panel
- Advanced file management
- Cloud storage integration
- Multi-user support
- Mobile app companion

### Future Enhancements
- Voice commands
- AI assistant integration
- Advanced analytics
- Plugin system
- API for third-party apps

---

## 📈 Statistics

- **33+ Apps** - Comprehensive app ecosystem
- **170+ App Store Items** - Browsable app catalog
- **Dark Theme** - Cinema-inspired aesthetic
- **Floating UI** - Draggable windows and taskbar
- **Real-time Search** - Global app discovery
- **localStorage Persistence** - Data retention across sessions

---

## 🎬 About

DoaShow is inspired by desktop operating systems and modern web applications, combining the best of both worlds into a web-based desktop environment simulator. Perfect for presentations, demos, and immersive web experiences.

**Version**: 1.0  
**Last Updated**: April 27, 2026  
**Status**: Active Development

---

**Made with ❤️ by the DoaShow Team**
