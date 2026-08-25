import { toBlob } from 'html-to-image';
import { Share2 } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/hooks/use-mobile';
import { RandomDoa } from '@/hooks/use-random-doa';
import { cn } from '@/lib/utils';

type PosterProps = Readonly<{
  isOpen: boolean;
  onClose: () => void;
  doa: RandomDoa;
}>;

const BACKGROUNDS = Array.from({ length: 12 }, (_, i) => `/bgs/bg-${i + 1}.jpeg`);

export function Poster({ isOpen, onClose, doa }: PosterProps) {
  const { isMobile } = useIsMobile();

  const [ratio, setRatio] = useState<'1:1' | '9:16'>('9:16');
  const [bgIndex, setBgIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  const [showArabic, setShowArabic] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);

  if (!doa) return null;

  const handleShare = async () => {
    if (!posterRef.current) return;
    try {
      setIsGenerating(true);
      // Generate image blob
      const blob = await toBlob(posterRef.current, {
        quality: 1,
        pixelRatio: 2, // High resolution
        cacheBust: true,
      });

      if (!blob) throw new Error('Failed to generate image');

      const file = new File([blob], 'doa-poster.png', { type: 'image/png' });

      // Check if Web Share API is supported and can share files
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: doa.title,
          text: 'Selected Dua from Dua App',
        });
      } else {
        // Fallback to download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'doa-poster.png';
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to share image.');
    } finally {
      setIsGenerating(false);
    }
  };

  const is916 = ratio === '9:16';

  const modalContent = (
    <>
      <div
        className={cn(
          'flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto',
          isMobile ? 'p-4' : ''
        )}
      >
        {/* Ratio Selector */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className={cn(
              'bg-app-1 text-app-1-1 border-app-6-6 hover:bg-app-6 flex-1',
              ratio === '1:1' && 'bg-app-6 text-app-6-6 border-app-6-6'
            )}
            onClick={() => setRatio('1:1')}
          >
            1:1 (Feed)
          </Button>
          <Button
            variant="outline"
            className={cn(
              'bg-app-1 text-app-1-1 border-app-6-6 hover:bg-app-6 flex-1',
              ratio === '9:16' && 'bg-app-6 text-app-6-6 border-app-6-6'
            )}
            onClick={() => setRatio('9:16')}
          >
            9:16 (Story)
          </Button>
        </div>

        {/* Text Toggles */}
        <div className="text-app-1-1 flex gap-2 text-sm">
          <div className="flex cursor-pointer items-center gap-2">
            <Checkbox
              id="showArabic"
              checked={showArabic}
              onCheckedChange={checked => setShowArabic(checked === true)}
            />
            <Label htmlFor="showArabic" className="cursor-pointer">
              Teks Arab
            </Label>
          </div>
          <div className="flex cursor-pointer items-center gap-2">
            <Checkbox
              id="showTranslation"
              checked={showTranslation}
              onCheckedChange={checked => setShowTranslation(checked === true)}
            />
            <Label htmlFor="showTranslation" className="cursor-pointer">
              Terjemahan
            </Label>
          </div>
        </div>

        {/* Background Selector */}
        <div className="flex min-h-20 snap-x gap-2 overflow-x-auto py-2">
          {BACKGROUNDS.map((bg, idx) => (
            <Button
              variant="ghost"
              key={bg}
              onClick={() => setBgIndex(idx)}
              className={cn(
                'relative h-16 w-16 shrink-0 snap-center overflow-hidden rounded-lg border-2 p-0 transition-all',
                bgIndex === idx
                  ? 'border-app-6'
                  : 'border-transparent opacity-50 hover:opacity-100'
              )}
            >
              <Image
                src={bg}
                alt={`Background ${idx + 1}`}
                fill
                className="object-cover"
              />
            </Button>
          ))}
        </div>

        {/* Preview Container (Scaled down for UI) */}
        <div className="relative flex w-full justify-center overflow-hidden rounded-xl bg-black/10 py-4">
          {/* The Actual High-Res Poster Element (rendered off-screen to avoid scaling issues, but we show a scaled preview using transform) */}
          <div
            className="transform-origin-top relative flex justify-center overflow-hidden shadow-2xl transition-all duration-300"
            style={{
              width: is916 ? '270px' : '300px', // Scaled down UI width
              aspectRatio: ratio === '9:16' ? '9/16' : '1/1',
            }}
          >
            {/* This is a visual clone for the user to see */}
            <div className="absolute inset-0 z-0">
              <Image
                src={BACKGROUNDS[bgIndex]}
                alt="bg"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>

            <div className="relative z-10 flex h-full w-full flex-col p-4 text-white">
              <h3 className="text-app-3 mb-auto text-sm font-bold">
                {doa.title}
              </h3>

              {(showArabic || showTranslation) && (
                <div className="my-auto flex flex-col gap-3 rounded-xl bg-gradient-to-t from-black/60 to-black/10 p-4 backdrop-blur-sm">
                  {showArabic && (
                    <p
                      className="font-arabic text-right text-lg leading-relaxed"
                      dir="rtl"
                    >
                      {doa.arabic}
                    </p>
                  )}
                  {showTranslation && (
                    <p className="text-xs leading-relaxed opacity-90">
                      {doa.translation}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-auto flex items-end justify-between pt-4">
                <span className="text-[10px] opacity-70">
                  Aplikasi Dua Muslim
                </span>
                {doa.narrator && (
                  <span className="max-w-[50%] truncate text-right text-[10px] opacity-70">
                    {doa.narrator}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* THE REAL ELEMENT USED FOR IMAGE CAPTURE (Offscreen, full resolution) */}
          <div className="fixed top-[-9999px] left-[-9999px]">
            <div
              ref={posterRef}
              className="relative flex justify-center overflow-hidden bg-black"
              style={{
                width: '1080px',
                height: is916 ? '1920px' : '1080px',
              }}
            >
              {/* Fallback styling explicitly needed for html-to-image */}
              <Image
                src={BACKGROUNDS[bgIndex]}
                unoptimized
                fill
                style={{ objectFit: 'cover' }}
                alt=""
              />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                }}
              />

              <div
                style={{
                  position: 'relative',
                  zIndex: 10,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '80px',
                  color: 'white',
                }}
              >
                <h3
                  style={{
                    fontSize: '48px',
                    fontWeight: 'bold',
                    color: '#fbbf24',
                    marginBottom: 'auto',
                  }}
                >
                  {doa.title}
                </h3>

                {(showArabic || showTranslation) && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '60px',
                      marginTop: 'auto',
                      marginBottom: 'auto',
                      background: 'linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.1))',
                      padding: '48px',
                      borderRadius: '32px',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    {showArabic && (
                      <p
                        style={{
                          textAlign: 'right',
                          fontSize: '72px',
                          lineHeight: '1.6',
                          direction: 'rtl',
                          fontFamily: 'serif',
                        }}
                      >
                        {doa.arabic}
                      </p>
                    )}
                    {showTranslation && (
                      <p
                        style={{
                          fontSize: '42px',
                          opacity: 0.9,
                          lineHeight: '1.5',
                        }}
                      >
                        {doa.translation}
                      </p>
                    )}
                  </div>
                )}

                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: '40px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    borderTop: '2px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <span style={{ fontSize: '32px', opacity: 0.8 }}>
                    Aplikasi Dua - Muslim
                  </span>
                  {doa.narrator && (
                    <span
                      style={{
                        fontSize: '32px',
                        opacity: 0.8,
                        maxWidth: '60%',
                        textAlign: 'right',
                      }}
                    >
                      {doa.narrator}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={cn('flex gap-2', isMobile ? 'p-4 pt-0' : 'pt-4')}>
        <Button
          className="bg-app-6 text-app-6-6 hover:bg-app-6/80 flex-1"
          onClick={handleShare}
          disabled={isGenerating}
        >
          {isGenerating ? (
            'Memproses...'
          ) : (
            <>
              <Share2 className="mr-2 h-4 w-4" />
              Bagikan
            </>
          )}
        </Button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="before:bg-app-1 max-h-[90dvh]">
          <DrawerHeader>
            <DrawerTitle className="text-app-1-1 text-left">
              Buat Poster Doa
            </DrawerTitle>
          </DrawerHeader>
          {modalContent}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-app-1 flex max-h-[90dvh] max-w-md flex-col overflow-hidden p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-app-1-1">Buat Poster Doa</DialogTitle>
        </DialogHeader>
        {modalContent}
      </DialogContent>
    </Dialog>
  );
}
