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
    <div className="bg-app-1 relative flex min-h-dvh flex-col gap-4 overflow-hidden p-4 pt-[max(1rem,env(safe-area-inset-top))] pr-[max(1rem,env(safe-area-inset-right))] pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))]">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-size-[32px_32px] dark:bg-[linear-gradient(to_right,#ffffff0d_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0d_1px,transparent_1px)]" />
      {/* <CherryBlossomsIcon className="fixed top-8 left-[-4%] w-1/2 rotate-180 opacity-25 sm:w-1/3" />
      <CherryBlossomsIcon className="fixed right-[-4%] bottom-8 opacity-25 sm:w-1/2" /> */}
      <header className="relative flex items-center justify-between">
        <div className="text-app-1-1 flex flex-col">
          <span className="font-bold">{hijriDate}</span>
          <span className="text-sm font-bold" suppressHydrationWarning>
            {gregDate}
          </span>
        </div>
        <Button
          size="icon"
          aria-label="Buka pengaturan"
          onClick={() => setIsOpenSettings(true)}
          className="bg-app-6 hover:bg-app-6/80 text-app-6-6"
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
              <div className="from-app-3/50 to-app-6/50 2xs:p-8 shadow-glass flex h-full flex-col justify-between overflow-hidden rounded-4xl border border-white/50 bg-linear-to-tr p-4 backdrop-blur-xs">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    aria-label="Buka dialog lokasi"
                    onClick={() => setIsOpenLocation(true)}
                    className="text-app-3-3 hover:bg-app-3 -ml-4 text-xl font-bold capitalize"
                  >
                    {city}
                    <PencilIcon />
                  </Button>
                  <span className="text-app-6-6 flex items-baseline font-bold tabular-nums">
                    <span className="text-4xl" suppressHydrationWarning>
                      {gregTime}
                    </span>
                    <span className="ml-0.5 text-xl" suppressHydrationWarning>
                      {gregSeconds}
                    </span>
                  </span>
                </div>
                <div className="text-app-3-3 flex items-center justify-between">
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
                  const bgClass = id === 1 ? 'bg-app-3/50' : 'bg-app-6/50';
                  const textClass = id === 1 ? 'text-app-3-3' : 'text-app-6-6';

                  return (
                    <Link key={id} href={link} title={title} className="flex-1">
                      <AspectRatio asChild ratio={1 / 1}>
                        <div
                          className={cn(
                            bgClass,
                            'shadow-glass flex flex-col items-center justify-center gap-4 rounded-4xl border border-white/50 backdrop-blur-xs'
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
                        <div className="shadow-glass bg-app-2/50 flex flex-col items-center justify-center gap-2 rounded-4xl border border-white/50 backdrop-blur-xs">
                          {Icons[id]}
                          <h3 className="text-app-2-2 text-sm font-bold">
                            {title}
                          </h3>
                        </div>
                      </AspectRatio>
                    </Link>
                  );
                })}
            </div>

            {/* Selected Dua */}
            <div className="bg-app-2/50 relative flex flex-col gap-4 rounded-4xl border border-white/50 p-4 backdrop-blur-xs sm:flex-1">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-app-2-2 font-bold">Doa Pilihan</h2>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    aria-label="Ganti doa"
                    onClick={rollNewDoa}
                    className="bg-app-3 hover:bg-app-3/80 text-app-3-3"
                  >
                    <RefreshCwIcon />
                  </Button>
                  <Button
                    onClick={() => setIsShareModalOpen(true)}
                    className="bg-app-6 hover:bg-app-6/80 text-app-6-6"
                  >
                    <Share2Icon /> Bagikan
                  </Button>
                </div>
              </div>
              <div className="relative flex flex-col gap-2">
                <h3 className="text-app-2-2 text-sm font-medium">
                  {randomDoa.title}
                </h3>
                <p
                  className="text-app-2-2 font-arabic text-right text-base leading-loose sm:line-clamp-3"
                  dir="rtl"
                >
                  {randomDoa.arabic}
                </p>
                <p className="text-app-2-2 text-sm opacity-90 sm:line-clamp-2">
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
