'use client';

import { MenuIcon, Pencil } from 'lucide-react';
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
import { useQuote } from '@/hooks/use-quote';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/providers/settings-store-provider';

const Location = dynamic(() => import('./location').then(mod => mod.Location));
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

  const { location: city } = useSettingsStore(state => state);
  const { gregDate, gregTime } = useGregDate();
  const { prayingTimes, hijriDate } = useHijriDate(city);
  const { quote, narrator } = useQuote();

  return (
    <div className="from-primary to-secondary relative flex flex-col gap-4 bg-linear-to-bl p-4 sm:min-h-dvh">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-size-[32px_32px] dark:bg-[linear-gradient(to_right,#ffffff0d_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0d_1px,transparent_1px)]" />

      <header className="relative flex items-center justify-between">
        <div className="text-secondary-foreground flex flex-col">
          <span className="text-base font-bold">{hijriDate}</span>
          <span className="text-xs font-bold">{gregDate}</span>
        </div>
        <Button
          size="icon"
          aria-label="Buka pengaturan"
          onClick={() => setIsOpenSettings(true)}
        >
          <MenuIcon />
        </Button>
      </header>

      <main className="relative z-10 sm:flex sm:flex-1 sm:items-center sm:portrait:max-w-md sm:portrait:self-center sm:landscape:max-w-3xl sm:landscape:self-center">
        <div className="flex flex-col gap-4 sm:landscape:flex-row">
          {/* Praying times and dzikir */}
          <div className="flex flex-col gap-4 sm:landscape:flex-1">
            {/* Praying times */}
            <AspectRatio asChild ratio={16 / 9}>
              <div className="from-primary/10 to-secondary/10 2xs:p-8 flex h-full flex-col justify-between overflow-hidden rounded-4xl border border-white/50 bg-linear-to-bl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-xs">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    aria-label="Buka modal lokasi"
                    onClick={() => setIsOpenLocation(true)}
                    className="text-secondary-foreground -ml-4 text-xl font-bold capitalize"
                  >
                    {city}
                    <Pencil />
                  </Button>
                  <span className="text-primary-foreground text-xl font-bold">
                    {gregTime}
                  </span>
                </div>
                <div className="text-secondary-foreground flex items-center justify-between">
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
              {toc
                .filter(({ category }) => category === 'dzikir')
                .map(content => {
                  const { id, title, link } = content;
                  const bgClass =
                    id === 1 ? 'bg-primary/10' : 'bg-secondary/10';
                  const textClass =
                    id === 1
                      ? 'text-primary-foreground'
                      : 'text-secondary-foreground';
                  return (
                    <Link href={link} key={id} className="flex-1">
                      <AspectRatio asChild ratio={1 / 1}>
                        <div
                          className={cn(
                            bgClass,
                            'flex flex-col items-center justify-center gap-4 rounded-4xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-xs'
                          )}
                        >
                          {Icons[id]}
                          <span className={cn(textClass, 'text-sm font-bold')}>
                            {title}
                          </span>
                        </div>
                      </AspectRatio>
                    </Link>
                  );
                })}
            </div>
          </div>

          {/* Dua and quotes */}
          <div className="flex flex-col gap-4 sm:landscape:flex-1">
            {/* Dua */}
            <div className="flex gap-4">
              {toc
                .filter(({ category }) => category === 'doa')
                .map(content => {
                  const { id, title, link } = content;
                  return (
                    <Link href={link} key={id} className="flex-1">
                      <AspectRatio asChild ratio={1 / 1}>
                        <div className="flex flex-col items-center justify-center gap-2 rounded-4xl border border-white/50 bg-transparent shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-xs">
                          {Icons[id]}
                          <span className="text-card-foreground text-xs font-bold">
                            {title}
                          </span>
                        </div>
                      </AspectRatio>
                    </Link>
                  );
                })}
            </div>

            {/* Quotes */}
            <div className="flex flex-col gap-4 rounded-4xl border border-white/50 bg-transparent p-4 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-xs sm:flex-1">
              <h2 className="text-card-foreground text-base font-bold">
                Mutiara Hikmah
              </h2>
              <div className="flex flex-col gap-2">
                <p className="text-card-foreground text-sm">{quote}</p>
                <span className="text-card-foreground text-xs">{narrator}</span>
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
    </div>
  );
}
