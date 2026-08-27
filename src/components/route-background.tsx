'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { COLOR_PALETTES } from '@/data/color-palettes';
import { usePaletteStore } from '@/providers/palette-store-provider';

export function RouteBackground() {
  const pathname = usePathname();
  const paletteId = usePaletteStore(state => state.paletteId);

  useEffect(() => {
    // Determine if we are on a secondary page
    const paletteData = COLOR_PALETTES.find(p => p.id === paletteId);
    if (paletteData) {
      // Set body background to primary background color to prevent white/black flashes on iOS overscroll
      const bodyColor = paletteData.backgroundColor;

      // Update body background color so transparent status bars/safe areas match
      document.body.style.backgroundColor = bodyColor;

      // Update theme-color meta tag for Android PWA / Chrome
      const themeColor = paletteData.previewColor;
      let metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', themeColor);
      } else {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.setAttribute('name', 'theme-color');
        metaThemeColor.setAttribute('content', themeColor);
        document.head.appendChild(metaThemeColor);
      }
    }
  }, [pathname, paletteId]);

  return null;
}
