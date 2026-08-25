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
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
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

  const [showTitle, setShowTitle] = useState(true);
  const [showArabic, setShowArabic] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);

  const [fontSizeLevel, setFontSizeLevel] = useState([1]);
  const [overlayOpacity, setOverlayOpacity] = useState([60]);

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

  const sizeLevel = fontSizeLevel[0];
  const uiSizes = {
    title: ['text-xs', 'text-sm', 'text-base'][sizeLevel],
    arabic: ['text-base', 'text-lg', 'text-xl'][sizeLevel],
    translation: ['text-[10px]', 'text-xs', 'text-sm'][sizeLevel],
    narrator: ['text-[8px]', 'text-[10px]', 'text-xs'][sizeLevel],
  };
  const offSizes = {
    title: ['text-[38px]', 'text-[48px]', 'text-[60px]'][sizeLevel],
    arabic: ['text-[58px]', 'text-[72px]', 'text-[90px]'][sizeLevel],
    translation: ['text-[34px]', 'text-[42px]', 'text-[52px]'][sizeLevel],
    narrator: ['text-[22px]', 'text-[28px]', 'text-[35px]'][sizeLevel],
  };

  const modalContent = (
    <div
      className={cn('flex flex-col gap-4 sm:flex-row', isMobile ? 'p-4' : '')}
    >
      {/* Unified Preview Container Group */}
      <div className="bg-app-6/30 relative flex max-h-[calc(100dvh-398px)] w-full flex-col items-center gap-4 overflow-y-auto rounded-xl p-4 sm:max-h-full sm:w-fit sm:flex-1">
        {/* Preview Image */}
        <div className="w-67.5 max-w-full">
          <AspectRatio
            ratio={9 / 16}
            className="shrink-0 overflow-hidden rounded-xl shadow-2xl"
          >
            {/* This is a visual clone for the user to see */}
            <Image
              src={BACKGROUNDS[bgIndex]}
              alt="Background"
              fill
              sizes="270px"
              className="object-cover"
            />

            <div className="relative flex h-full w-full flex-col p-4">
              <div
                className="my-auto flex flex-col gap-2 rounded-xl p-4"
                style={{
                  backgroundColor: `rgba(255, 255, 255, ${overlayOpacity[0] / 100})`,
                }}
              >
                {showTitle && (
                  <h2 className={cn('font-semibold', uiSizes.title)}>
                    {doa.title}
                  </h2>
                )}
                {showArabic && (
                  <p
                    className={cn(
                      'font-arabic text-right leading-relaxed',
                      uiSizes.arabic
                    )}
                    dir="rtl"
                  >
                    {doa.arabic}
                  </p>
                )}
                {showTranslation && (
                  <p className={cn('font-medium', uiSizes.translation)}>
                    {doa.translation}
                  </p>
                )}
                {doa.narrator && (
                  <p className={cn('font-medium', uiSizes.narrator)}>
                    {doa.narrator}
                  </p>
                )}
              </div>

              <p className="text-outline mt-auto flex items-end justify-end text-[8px] font-medium opacity-50">
                muslim.vercel.app
              </p>
            </div>
          </AspectRatio>
        </div>

        {/* Background Selector */}
        <div className="w-full">
          <Carousel
            orientation="horizontal"
            setApi={setCarouselApi}
            opts={{
              align: 'center',
            }}
          >
            <CarouselContent className="-ms-2 px-1">
              {BACKGROUNDS.map((bg, idx) => (
                <CarouselItem key={bg} className="basis-auto ps-2">
                  <Button
                    variant="ghost"
                    aria-label={`Pilih latar belakang ${idx + 1}`}
                    onClick={() => {
                      setBgIndex(idx);
                      carouselApi?.scrollTo(idx);
                    }}
                    className={cn(
                      'relative block h-auto w-12 cursor-pointer overflow-hidden rounded-lg border-2 p-0 transition-all hover:bg-transparent',
                      bgIndex === idx
                        ? 'border-app-6'
                        : 'border-transparent opacity-50 hover:opacity-100'
                    )}
                  >
                    <AspectRatio ratio={9 / 16} className="h-full w-full">
                      <Image
                        src={bg}
                        alt="bg"
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </AspectRatio>
                  </Button>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* THE REAL ELEMENT USED FOR IMAGE CAPTURE (Offscreen, full resolution) */}
        <div className="fixed top-[-9999px] left-[-9999px]">
          <div
            ref={posterRef}
            className="relative flex h-[1920px] w-270 justify-center overflow-hidden bg-black"
          >
            {/* Fallback styling explicitly needed for html-to-image */}
            <Image
              src={BACKGROUNDS[bgIndex]}
              unoptimized
              fill
              sizes="1080px"
              className="object-cover"
              alt=""
            />
            <div className="relative z-10 flex h-full w-full flex-col p-20 text-slate-800">
              <div
                className="my-auto flex flex-col gap-15 rounded-[32px] p-12"
                style={{
                  backgroundColor: `rgba(255, 255, 255, ${overlayOpacity[0] / 100})`,
                }}
              >
                {showTitle && (
                  <h3
                    className={cn('font-bold text-slate-900', offSizes.title)}
                  >
                    {doa.title}
                  </h3>
                )}
                {showArabic && (
                  <p
                    dir="rtl"
                    className={cn(
                      'font-arabic text-right leading-[1.6] text-slate-900',
                      offSizes.arabic
                    )}
                  >
                    {doa.arabic}
                  </p>
                )}
                {showTranslation && (
                  <p
                    className={cn(
                      'leading-normal font-medium',
                      offSizes.translation
                    )}
                  >
                    {doa.translation}
                  </p>
                )}
                {doa.narrator && (
                  <p
                    className={cn(
                      'mt-5 text-right font-medium',
                      offSizes.narrator
                    )}
                  >
                    {doa.narrator}
                  </p>
                )}
              </div>

              <div className="mt-auto -mb-2 flex items-end justify-end pt-10">
                <span className="text-outline-poster text-[32px] leading-none font-medium opacity-75">
                  muslim.vercel.app
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="flex flex-col gap-4 sm:flex-1">
        {/* Text Toggles */}
        <div className="flex flex-col gap-4">
          {[
            {
              id: 'showTitle',
              label: 'Judul',
              checked: showTitle,
              onChange: setShowTitle,
            },
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
          ].map(option => (
            <div key={option.id} className="flex items-center justify-between">
              <Label htmlFor={option.id} className="text-app-1-1">
                {option.label}
              </Label>
              <Switch
                id={option.id}
                checked={option.checked}
                onCheckedChange={val => option.onChange(val === true)}
                className="*:data-[slot=switch-thumb]:bg-app-5 dark:*:data-[slot=switch-thumb]:bg-app-5 data-checked:border-app-6 data-checked:bg-app-6! bg-app-4!"
              />
            </div>
          ))}
        </div>

        {/* Visual Adjustments */}
        <div className="flex flex-col gap-4">
          {[
            {
              id: 'fontSize',
              label: 'Ukuran Teks',
              value: fontSizeLevel,
              onChange: setFontSizeLevel,
              min: 0,
              max: 2,
              step: 1,
              displayValue: ['Kecil', 'Sedang', 'Besar'][fontSizeLevel[0]],
            },
            {
              id: 'overlayOpacity',
              label: 'Latar Teks',
              value: overlayOpacity,
              onChange: setOverlayOpacity,
              min: 50,
              max: 100,
              step: 1,
              displayValue: `${overlayOpacity[0]}%`,
            },
          ].map(option => (
            <div key={option.id} className="flex flex-col gap-2">
              <div className="flex w-full items-center justify-between">
                <Label htmlFor={option.id}>{option.label}</Label>
                <span className="text-xs">{option.displayValue}</span>
              </div>
              <Slider
                id={option.id}
                value={option.value}
                onValueChange={option.onChange}
                min={option.min}
                max={option.max}
                step={option.step}
                className="**:data-[slot=slider-track]:bg-app-4 **:data-[slot=slider-range]:bg-app-6 **:data-[slot=slider-thumb]:bg-app-5"
              />
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
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="before:bg-app-1 data-[vaul-drawer-direction=bottom]:max-h-dvh">
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
        className="bg-app-1 flex max-h-dvh flex-col overflow-hidden p-4 sm:max-w-xl"
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
