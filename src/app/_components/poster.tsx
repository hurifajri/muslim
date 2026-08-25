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

  const [showTitle, setShowTitle] = useState(true);
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
    <div className={cn('flex flex-col gap-4', isMobile ? 'p-4' : '')}>
      {/* Unified Preview Container Group */}
      <div className="bg-app-6/30 relative flex w-full flex-col items-center gap-4 overflow-y-auto rounded-xl p-4">
        {/* Preview Image */}
        <div className="w-67.5 max-w-full shrink-0">
          <AspectRatio
            ratio={9 / 16}
            className="overflow-hidden rounded-xl shadow-2xl"
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
              <div className="my-auto flex flex-col gap-4 rounded-xl bg-white/60 p-4">
                {showTitle && (
                  <h2 className="text-sm font-semibold">{doa.title}</h2>
                )}
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
              <div className="my-auto flex flex-col gap-15 rounded-[32px] bg-white/60 p-12">
                {showTitle && (
                  <h3 className="text-[48px] font-bold text-slate-900">
                    {doa.title}
                  </h3>
                )}
                {showArabic && (
                  <p
                    dir="rtl"
                    className="font-arabic text-right text-[72px] leading-[1.6] text-slate-900"
                  >
                    {doa.arabic}
                  </p>
                )}
                {showTranslation && (
                  <p className="text-[42px] leading-normal font-medium">
                    {doa.translation}
                  </p>
                )}
                {doa.narrator && (
                  <p className="mt-5 text-right text-[28px] font-medium">
                    {doa.narrator}
                  </p>
                )}
              </div>

              <div className="mt-auto -mb-2 flex items-end justify-end pt-10">
                <span className="text-outline-poster text-[32px] leading-none font-medium opacity-50">
                  muslim.vercel.app
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Text Toggles */}
      <div className="text-app-1-1 flex flex-wrap justify-center gap-6 text-sm">
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
