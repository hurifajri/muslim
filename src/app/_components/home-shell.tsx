'use client';

import { MenuIcon, PencilIcon, RefreshCwIcon, Share2Icon } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ReactNode, useState } from 'react';

import { EveningIcon } from '@/components/icons/evening';
import { MorningIcon } from '@/components/icons/morning';
import { MosqueIcon } from '@/components/icons/mosque';
import { PrayIcon } from '@/components/icons/pray';
import { ProphetIcon } from '@/components/icons/prophet';
import { QuranIcon } from '@/components/icons/quran';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { toc } from '@/data/toc';
import { useGregDate } from '@/hooks/use-greg-date';
import { useHijriDate } from '@/hooks/use-hijri-date';
import { useRandomDoa } from '@/hooks/use-random-doa';
import { cn } from '@/lib/utils';
import { useLocationStore } from '@/providers/location-store-provider';

const Location = dynamic(() => import('./location').then(mod => mod.Location));
const Poster = dynamic(() => import('./poster').then(mod => mod.Poster));
const Settings = dynamic(() =>
  import('@/components/settings').then(mod => mod.Settings)
);

// Dynamic icons for table of contents
const Icons: Record<number, ReactNode> = {
  1: <MorningIcon className="size-6/12" />,
  2: <EveningIcon className="size-6/12" />,
  3: <QuranIcon className="size-5/12" />,
  4: <ProphetIcon className="size-5/12" />,
  5: <PrayIcon className="size-5/12" />,
};

export function HomeShell() {
  const [isOpenLocation, setIsOpenLocation] = useState(false);
  const [isOpenSettings, setIsOpenSettings] = useState(false);

  const { city, country } = useLocationStore(state => state);
  const { gregDate, gregTime, gregSeconds } = useGregDate();
  const { prayingTimes, hijriDate } = useHijriDate({
    mode: 'city',
    city,
    country,
  });
  const { randomDoa, rollNewDoa } = useRandomDoa();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  return (
    <div className="bg-background relative flex min-h-dvh flex-col gap-4 overflow-hidden p-4 pt-[max(1rem,env(safe-area-inset-top))] pr-[max(1rem,env(safe-area-inset-right))] pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))]">
      <header className="relative flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-bold">{hijriDate}</span>
          <span className="text-sm font-bold">{gregDate}</span>
        </div>
        <Button
          size="icon"
          aria-label="Buka pengaturan"
          onClick={() => setIsOpenSettings(true)}
        >
          <MenuIcon />
        </Button>
      </header>
      <main className="w-full sm:flex sm:flex-1 sm:items-center sm:portrait:max-w-md sm:portrait:self-center sm:landscape:max-w-3xl sm:landscape:self-center">
        <div className="flex w-full flex-col gap-4 sm:landscape:flex-row">
          {/* Praying times and dzikir */}
          <div className="flex flex-col gap-4 sm:landscape:flex-1">
            {/* Praying times */}
            <AspectRatio asChild ratio={16 / 9}>
              <div className="from-secondary/50 to-primary/50 2xs:p-8 shadow-glass flex h-full flex-col justify-between overflow-hidden rounded-4xl border border-white/50 bg-linear-to-tr p-4 backdrop-blur-xs dark:border-white/30 dark:bg-linear-to-bl">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    aria-label="Buka dialog lokasi"
                    onClick={() => setIsOpenLocation(true)}
                    className="-ml-4 text-xl font-bold capitalize"
                  >
                    {city}
                    <PencilIcon />
                  </Button>
                  <span className="flex items-baseline font-bold tabular-nums">
                    <span className="text-4xl">{gregTime}</span>
                    <span className="ml-0.5 text-xl">{gregSeconds}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  {prayingTimes.map(item => (
                    <div key={item.id} className="flex flex-col items-center">
                      <span className="text-sm font-bold">{item.name}</span>
                      <span className="text-sm font-bold">{item.time}</span>
                    </div>
                  ))}
                </div>
                <MosqueIcon className="absolute top-0 -right-3/12 size-full scale-90 opacity-10" />
              </div>
            </AspectRatio>

            {/* Dzikir */}
            <div className="flex gap-4">
              <h2 className="sr-only">Kumpulan Dzikir</h2>
              {toc
                .filter(({ category }) => category === 'dzikir')
                .map(content => {
                  const { id, title, link } = content;
                  const bgClass =
                    id === 1
                      ? 'bg-secondary/50 dark:bg-primary/50'
                      : 'bg-primary/50 dark:bg-secondary/50';
                  const textClass =
                    id === 1
                      ? 'text-secondary-foreground dark:text-primary-foreground'
                      : 'text-primary-foreground dark:text-secondary-foreground';

                  return (
                    <Link key={id} href={link} title={title} className="flex-1">
                      <AspectRatio asChild ratio={1 / 1}>
                        <div
                          className={cn(
                            bgClass,
                            'shadow-glass flex flex-col items-center justify-center gap-4 rounded-4xl border border-white/50 backdrop-blur-xs dark:border-white/30'
                          )}
                        >
                          {Icons[id]}
                          <h3 className={cn(textClass, 'text-sm font-bold')}>
                            {title}
                          </h3>
                        </div>
                      </AspectRatio>
                    </Link>
                  );
                })}
            </div>
          </div>

          {/* Dua and selected dua */}
          <div className="flex flex-col gap-4 sm:landscape:flex-1">
            {/* Dua */}
            <div className="flex gap-4">
              <h2 className="sr-only">Kumpulan Doa</h2>
              {toc
                .filter(({ category }) => category === 'doa')
                .map(content => {
                  const { id, title, link } = content;
                  return (
                    <Link key={id} href={link} title={title} className="flex-1">
                      <AspectRatio asChild ratio={1 / 1}>
                        <div className="shadow-glass bg-card/50 flex flex-col items-center justify-center gap-2 rounded-4xl border border-white/50 backdrop-blur-xs dark:border-white/30">
                          {Icons[id]}
                          <h3 className="text-sm font-bold">{title}</h3>
                        </div>
                      </AspectRatio>
                    </Link>
                  );
                })}
            </div>

            {/* Selected Dua */}
            <div className="bg-card/50 shadow-glass relative flex flex-col gap-4 rounded-4xl border border-white/50 p-4 backdrop-blur-xs sm:flex-1 dark:border-white/30">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-bold">Doa Pilihan</h2>
                <div className="flex items-center gap-2">
                  <Button
                    aria-label="Ganti doa"
                    size="icon"
                    variant="outline"
                    onClick={rollNewDoa}
                  >
                    <RefreshCwIcon />
                  </Button>
                  <Button onClick={() => setIsShareModalOpen(true)}>
                    <Share2Icon /> Bagikan
                  </Button>
                </div>
              </div>
              <div className="relative flex flex-col gap-2">
                <h3 className="text-sm font-medium">{randomDoa.title}</h3>
                <p
                  className="font-arabic text-right text-base leading-loose sm:line-clamp-3"
                  dir="rtl"
                >
                  {randomDoa.arabic}
                </p>
                <p className="text-sm opacity-90 sm:line-clamp-2">
                  {randomDoa.translation}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Settings */}
      <Settings
        isOpen={isOpenSettings}
        onClose={() => setIsOpenSettings(false)}
      />
      {/* Location picker */}
      <Location
        isOpen={isOpenLocation}
        onClose={() => setIsOpenLocation(false)}
      />
      {/* Share Poster Modal */}
      {randomDoa && (
        <Poster
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          doa={randomDoa}
          onRollNewDoa={rollNewDoa}
        />
      )}
    </div>
  );
}
