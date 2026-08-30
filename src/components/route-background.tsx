'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { COLOR_PALETTES } from '@/data/color-palettes';
import { usePaletteStore } from '@/providers/palette-store-provider';

export function RouteBackground() {
  const pathname = usePathname();
  const paletteId = usePaletteStore(state => state.paletteId);

  useEffect(() => {
    const paletteData = COLOR_PALETTES.find(p => p.id === paletteId);
    if (!paletteData) return;

    const themeColor = paletteData.themeColor;
    const backgroundColor = paletteData.backgroundColor;

    // 1. Set body background
    document.body.style.backgroundColor = backgroundColor;

    // 2. Force update theme-color meta tag
    const updateMetaTag = () => {
      let meta = document.querySelector('meta[name="theme-color"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'theme-color');
        document.head.appendChild(meta);
      }
      if (meta.getAttribute('content') !== themeColor) {
        meta.setAttribute('content', themeColor);
      }
    };

    updateMetaTag();

    // 3. Next.js sometimes overwrites the <head> asynchronously on client navigation.
    // We use a MutationObserver to ensure our dynamic themeColor stays locked.
    const observerOptions: MutationObserverInit = {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['content'],
    };

    const observer = new MutationObserver(() => {
      observer.disconnect();
      updateMetaTag();
      observer.observe(document.head, observerOptions);
    });

    observer.observe(document.head, observerOptions);

    return () => {
      observer.disconnect();
    };
    // Re-run on pathname change to re-assert theme-color after Next.js
    // client navigation overwrites <head>.
  }, [pathname, paletteId]);

  return null;
}
