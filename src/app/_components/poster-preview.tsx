import Image from 'next/image';
import { type CSSProperties, type Ref, useLayoutEffect, useRef } from 'react';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import type { RandomDoa } from '@/hooks/use-random-doa';
import { POSTER_HEIGHT, POSTER_WIDTH } from '@/lib/poster-export';
import { cn } from '@/lib/utils';

import {
  BACKGROUNDS,
  MAX_FONT_SIZE,
  type PosterOptions,
} from './poster-options';

export function PosterPreview({
  doa,
  options,
  posterRef,
  onMaxFontSizeChange,
}: {
  doa: RandomDoa;
  options: PosterOptions;
  posterRef: Ref<HTMLDivElement>;
  onMaxFontSizeChange: (maximum: number) => void;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const resize = (width: number) =>
      frame.style.setProperty(
        '--poster-preview-scale',
        String(width / POSTER_WIDTH)
      );
    const observer = new ResizeObserver(([entry]) =>
      resize(entry.contentRect.width)
    );
    observer.observe(frame);
    resize(Number.parseFloat(getComputedStyle(frame).width));
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const area = areaRef.current;
    const text = textRef.current;
    if (!area || !text) return;
    let active = true;
    const fit = () => {
      if (!active || !area.clientHeight || !area.clientWidth) return;
      const fits = () =>
        text.scrollHeight <= area.clientHeight - 2 &&
        text.scrollWidth <= area.clientWidth;
      const setSize = (size: number) =>
        text.style.setProperty('--poster-font-size', `${size}px`);
      // Measure at export resolution so the limit never depends on viewport size.
      let low = 1;
      let high = MAX_FONT_SIZE;
      while (low < high) {
        const size = Math.ceil((low + high) / 2);
        setSize(size);
        if (fits()) low = size;
        else high = size - 1;
      }
      setSize(Math.min(options.fontSize, low));
      onMaxFontSizeChange(low);
    };
    fit();
    void document.fonts.ready.then(fit);
    document.fonts.addEventListener('loadingdone', fit);
    return () => {
      active = false;
      document.fonts.removeEventListener('loadingdone', fit);
    };
  }, [
    doa,
    onMaxFontSizeChange,
    options.fontSize,
    options.showArabic,
    options.showTitle,
    options.showTranslation,
  ]);

  return (
    <AspectRatio
      ref={frameRef}
      ratio={POSTER_WIDTH / POSTER_HEIGHT}
      className="isolate overflow-hidden"
    >
      <div
        ref={posterRef}
        className="absolute top-0 left-0 origin-top-left overflow-hidden"
        style={{
          width: POSTER_WIDTH,
          height: POSTER_HEIGHT,
          borderRadius: 48,
          transform: 'scale(var(--poster-preview-scale, 0))',
        }}
      >
        <Image
          src={BACKGROUNDS[options.bgIndex]}
          alt=""
          fill
          unoptimized
          sizes={`${POSTER_WIDTH}px`}
          className="object-cover"
        />
        <div
          className="absolute inset-0 flex flex-col text-black"
          style={{ padding: 60, gap: 45 }}
        >
          <div ref={areaRef} className="flex min-h-0 flex-1 items-center">
            <div
              ref={textRef}
              className="flex w-full flex-col"
              style={
                {
                  '--poster-font-size': `${options.fontSize}px`,
                  borderRadius: 48,
                  padding: 60,
                  gap: 90,
                  backgroundColor: `rgba(255, 255, 255, ${options.opacity / 100})`,
                } as CSSProperties
              }
            >
              {options.showTitle && (
                <h2
                  className={cn(
                    'font-semibold',
                    options.textOutline && 'text-outline'
                  )}
                  style={{ fontSize: 'calc(var(--poster-font-size) * 7 / 9)' }}
                >
                  {doa.title}
                </h2>
              )}
              <div className="flex flex-col" style={{ gap: 60 }}>
                {options.showArabic && (
                  <p
                    lang="ar"
                    dir="rtl"
                    className={cn(
                      'font-arabic text-right',
                      'leading-loose',
                      options.textOutline && 'text-outline'
                    )}
                    style={{ fontSize: 'var(--poster-font-size)' }}
                  >
                    {doa.arabic}
                  </p>
                )}
                {options.showTranslation && (
                  <p
                    className={cn(
                      'font-medium',
                      options.textOutline && 'text-outline'
                    )}
                    style={{
                      fontSize: 'calc(var(--poster-font-size) * 2 / 3)',
                    }}
                  >
                    {doa.translation}
                  </p>
                )}
                {doa.narrator && (
                  <p
                    className={cn(
                      'font-medium',
                      options.textOutline && 'text-outline'
                    )}
                    style={{
                      fontSize: 'calc(var(--poster-font-size) * 5 / 9)',
                    }}
                  >
                    {doa.narrator}
                  </p>
                )}
              </div>
            </div>
          </div>
          <p
            className="text-outline shrink-0 text-right font-medium"
            style={{ fontSize: 30 }}
          >
            muslim.vercel.app
          </p>
        </div>
      </div>
    </AspectRatio>
  );
}
