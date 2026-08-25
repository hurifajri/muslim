import { toBlob } from 'html-to-image';
import { Share2, XIcon } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogClose,
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

const BACKGROUNDS = Array.from(
  { length: 12 },
  (_, i) => `/bgs/bg-${i + 1}.jpeg`
);

export function Poster({ isOpen, onClose, doa }: PosterProps) {
  const { isMobile } = useIsMobile();
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [bgIndex, setBgIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  const [showArabic, setShowArabic] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);

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

  const modalContent = (
    <div
      className={cn(
        'flex flex-1 flex-col gap-4 overflow-hidden',
        isMobile ? 'p-4' : ''
      )}
    >
      {/* Unified Preview Container Group */}
      <div className="relative flex w-full flex-1 flex-col items-center justify-start gap-4 overflow-x-hidden overflow-y-auto rounded-xl bg-black/10 p-4">
        {/* Preview Image */}
        <div className="w-67.5 max-w-full shrink-0">
          <AspectRatio
            ratio={9 / 16}
            className="relative flex overflow-hidden rounded-lg shadow-2xl"
          >
            {/* This is a visual clone for the user to see */}
            <Image
              src={BACKGROUNDS[bgIndex]}
              alt="bg"
              fill
              sizes="270px"
              className="object-cover"
            />

            <div className="relative z-10 flex h-full w-full flex-col p-4">
              <div className="my-auto flex flex-col gap-3 rounded-xl bg-white/60 p-4 shadow-sm">
                <h2 className="text-sm font-semibold">{doa.title}</h2>
                {showArabic && (
                  <p
                    className="font-arabic text-right text-lg leading-relaxed"
                    dir="rtl"
                  >
                    {doa.arabic}
                  </p>
                )}
                {showTranslation && (
                  <p className="text-xs font-medium">{doa.translation}</p>
                )}
                {doa.narrator && (
                  <p className="text-[10px] font-medium">{doa.narrator}</p>
                )}
              </div>

              <p className="text-outline mt-auto flex items-end justify-end text-[8px] font-medium">
                muslim.vercel.app
              </p>
            </div>
          </AspectRatio>
        </div>

        {/* Background Selector */}
        <div className="w-full">
          <Carousel
            setApi={setCarouselApi}
            opts={{
              align: 'center',
              dragFree: true,
            }}
            orientation="horizontal"
            className="w-full"
          >
            <CarouselContent className="-ms-2 px-1">
              {BACKGROUNDS.map((bg, idx) => (
                <CarouselItem key={bg} className="basis-auto ps-2">
                  <div
                    onClick={() => {
                      setBgIndex(idx);
                      carouselApi?.scrollTo(idx);
                    }}
                    className={cn(
                      'relative w-12 cursor-pointer overflow-hidden rounded-lg border-2 p-0 transition-all',
                      bgIndex === idx
                        ? 'border-app-6'
                        : 'border-transparent opacity-50 hover:opacity-100'
                    )}
                  >
                    <AspectRatio ratio={9 / 16} className="h-full w-full">
                      <Image
                        src={bg}
                        alt={`Background ${idx + 1}`}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </AspectRatio>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* THE REAL ELEMENT USED FOR IMAGE CAPTURE (Offscreen, full resolution) */}
        <div className="fixed top-[-9999px] left-[-9999px]">
          <div
            ref={posterRef}
            className="relative flex justify-center overflow-hidden bg-black"
            style={{
              width: '1080px',
              height: '1920px',
            }}
          >
            {/* Fallback styling explicitly needed for html-to-image */}
            <Image
              src={BACKGROUNDS[bgIndex]}
              unoptimized
              fill
              sizes="1080px"
              style={{ objectFit: 'cover' }}
              alt=""
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
                color: '#1e293b',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '60px',
                  marginTop: 'auto',
                  marginBottom: 'auto',
                  background: 'rgba(255, 255, 255, 0.6)',
                  padding: '48px',
                  borderRadius: '32px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              >
                <h3
                  style={{
                    fontSize: '48px',
                    fontWeight: 'bold',
                    color: '#0f172a',
                    textShadow:
                      '0px 4px 16px rgba(255, 255, 255, 1), 0px 2px 6px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  {doa.title}
                </h3>
                {showArabic && (
                  <p
                    style={{
                      textAlign: 'right',
                      fontSize: '72px',
                      lineHeight: '1.6',
                      direction: 'rtl',
                      fontFamily: 'serif',
                      color: '#0f172a',
                      textShadow:
                        '0px 4px 16px rgba(255, 255, 255, 1), 0px 2px 6px rgba(0, 0, 0, 0.2)',
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
                      fontWeight: 500,
                      textShadow:
                        '0px 4px 16px rgba(255, 255, 255, 1), 0px 2px 6px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    {doa.translation}
                  </p>
                )}
                {doa.narrator && (
                  <p
                    style={{
                      textAlign: 'right',
                      fontSize: '28px',
                      opacity: 0.7,
                      fontWeight: 500,
                      marginTop: '20px',
                      textShadow:
                        '0px 4px 16px rgba(255, 255, 255, 1), 0px 2px 6px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {doa.narrator}
                  </p>
                )}
              </div>

              <div
                style={{
                  marginTop: 'auto',
                  paddingTop: '40px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  marginBottom: '-8px',
                }}
              >
                <span
                  style={{
                    fontSize: '32px',
                    opacity: 0.8,
                    fontWeight: 500,
                    lineHeight: 1,
                    textShadow:
                      '-3px -3px 0 #fff, 3px -3px 0 #fff, -3px 3px 0 #fff, 3px 3px 0 #fff',
                  }}
                >
                  muslim.vercel.app
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Text Toggles */}
      <div className="text-app-1-1 flex justify-center gap-6 text-sm">
        {[
          {
            id: 'showArabic',
            label: 'Teks Arab',
            checked: showArabic,
            onChange: setShowArabic,
          },
          {
            id: 'showTranslation',
            label: 'Terjemahan',
            checked: showTranslation,
            onChange: setShowTranslation,
          },
        ].map(({ id, label, checked, onChange }) => (
          <div key={id} className="flex cursor-pointer items-center gap-2">
            <Checkbox
              id={id}
              checked={checked}
              onCheckedChange={val => onChange(val === true)}
              className="bg-app-4 data-checked:border-app-6 data-checked:bg-app-6 data-checked:text-app-5"
            />
            <Label htmlFor={id} className="cursor-pointer">
              {label}
            </Label>
          </div>
        ))}
      </div>

      {/* Share Button */}
      <Button
        onClick={handleShare}
        className="bg-app-6 hover:bg-app-6/80 text-app-6-6"
        disabled={isGenerating}
      >
        <Share2 />
        {isGenerating ? 'Memproses...' : 'Bagikan'}
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="before:bg-app-1 data-[vaul-drawer-direction=bottom]:max-h-[90vh]">
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
      <DialogContent
        showCloseButton={false}
        className="bg-app-1 flex max-h-[90vh] flex-col overflow-hidden p-4 sm:max-w-xl"
      >
        <DialogHeader className="flex-row items-center justify-between">
          <DialogTitle className="text-app-1-1">Buat Poster Doa</DialogTitle>
          <DialogClose asChild>
            <Button
              size="icon"
              aria-label="Tutup dialog poster"
              onClick={onClose}
              className="bg-app-6 hover:bg-app-6/80 text-app-6-6"
            >
              <XIcon />
            </Button>
          </DialogClose>
        </DialogHeader>
        {modalContent}
      </DialogContent>
    </Dialog>
  );
}
