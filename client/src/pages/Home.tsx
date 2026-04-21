import Slideshow from '@/components/Slideshow';

/**
 * Design Philosophy: Modern Minimalist Cinema
 * - Full-screen immersive viewing with minimal UI chrome
 * - Dark sophisticated aesthetic (charcoal/black backgrounds)
 * - Auto-hiding controls that fade after 3 seconds of inactivity
 * - Smooth cross-fade transitions (800ms)
 * - Refined typography: Playfair Display (titles) + Inter (body)
 * - Refined gold accent color (#d4af37 / oklch(0.85 0.15 39)) for interactive highlights
 */

export default function Home() {
  // Sample images for demonstration
  const sampleImages = [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
      title: 'Mountain Vista',
      description: 'Serene alpine landscape at sunset',
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&q=80',
      title: 'Ocean Horizon',
      description: 'Tranquil seascape with golden hour light',
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&q=60',
      title: 'Forest Path',
      description: 'Winding trail through ancient woodland',
    },
    {
      id: '4',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&q=40',
      title: 'Desert Dunes',
      description: 'Golden sands under starlit sky',
    },
    {
      id: '5',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&q=20',
      title: 'Urban Lights',
      description: 'City skyline illuminated at night',
    },
  ];

  return (
    <div className="w-full h-screen">
      <Slideshow images={sampleImages} autoPlayInterval={5000} />
    </div>
  );
}
