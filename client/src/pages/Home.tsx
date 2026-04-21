import Desktop from '@/components/Desktop';

/**
 * Design Philosophy: Modern Minimalist Cinema
 * - Full-screen immersive viewing with minimal UI chrome
 * - Dark sophisticated aesthetic (charcoal/black backgrounds)
 * - Auto-hiding controls that fade after 3 seconds of inactivity
 * - Smooth cross-fade transitions (800ms)
 * - Refined typography: Playfair Display (titles) + Inter (body)
 * - Refined gold accent color (oklch(0.85 0.15 39)) for interactive highlights
 * 
 * Desktop Environment:
 * - Multi-window management with draggable windows
 * - App launcher with slideshow, file explorer, and settings
 * - Taskbar for quick access to open applications
 * - Window minimize, maximize, and close controls
 */

export default function Home() {
  return (
    <div className="w-full h-screen">
      <Desktop />
    </div>
  );
}
