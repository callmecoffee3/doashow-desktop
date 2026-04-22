import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface DeviceInfo {
  type: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  userAgent: string;
}

export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => getDeviceInfo());

  useEffect(() => {
    const handleResize = () => {
      setDeviceInfo(getDeviceInfo());
    };

    const handleOrientationChange = () => {
      setDeviceInfo(getDeviceInfo());
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return deviceInfo;
};

function getDeviceInfo(): DeviceInfo {
  const userAgent = navigator.userAgent.toLowerCase();
  const width = window.innerWidth;
  const height = window.innerHeight;
  const orientation = width > height ? 'landscape' : 'portrait';

  // Detect mobile devices
  const isMobileDevice =
    /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent) ||
    (width <= 768 && /mobile|tablet/i.test(userAgent));

  // Detect tablet devices
  const isTabletDevice =
    /ipad|android(?!.*mobile)|xoom|kindle|playbook|nexus 7|nexus 10|windows phone/i.test(userAgent) ||
    (width > 768 && width <= 1024 && /tablet/i.test(userAgent));

  // Determine device type
  let type: DeviceType = 'desktop';
  let isMobile = false;
  let isTablet = false;
  let isDesktop = false;

  if (isMobileDevice && width <= 768) {
    type = 'mobile';
    isMobile = true;
  } else if (isTabletDevice || (width > 768 && width <= 1024)) {
    type = 'tablet';
    isTablet = true;
  } else {
    type = 'desktop';
    isDesktop = true;
  }

  return {
    type,
    isMobile,
    isTablet,
    isDesktop,
    width,
    height,
    orientation,
    userAgent,
  };
}

// Utility function to detect if device is touch-enabled
export const isTouchDevice = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    (navigator.maxTouchPoints > 0 || ('ontouchstart' in window))
  );
};

// Utility function to get viewport size
export const getViewportSize = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};
