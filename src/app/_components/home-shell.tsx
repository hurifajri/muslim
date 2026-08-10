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
    <div className="p-4 flex flex-col gap-4 sm:min-h-dvh">
      <header className="flex items-center justify-between">
        <div className="flex flex-col items-start">
          <span className="text-base font-bold text-right">{hijriDate}</span>
          <span className="text-xs font-bold text-right text-app-text-purple-dark">
            {gregDate}
          </span>
        </div>
        <Button
          size="icon"
          aria-label="Buka pengaturan"
          onClick={() => setIsOpenSettings(true)}
        >
          <MenuIcon />
        </Button>
      </header>

      <main className="sm:flex-1 sm:flex sm:items-center sm:portrait:max-w-md sm:portrait:self-center  sm:landscape:max-w-3xl sm:landscape:self-center">
        <div className="flex flex-col sm:landscape:flex-row gap-4">
          {/* Praying times and dzikir */}
          <div className="flex flex-col gap-4 sm:landscape:flex-1">
            {/* Praying times */}
            <AspectRatio asChild ratio={16 / 9}>
              <div className="rounded-4xl bg-linear-to-bl from-app-gradient-from to-app-gradient-to h-full flex flex-col justify-between p-4 2xs:p-8 overflow-hidden">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    aria-label="Buka modal lokasi"
                    onClick={() => setIsOpenLocation(true)}
                    className="text-xl font-bold capitalize text-app-text-light -ml-4"
                  >
                    {city}
                    <Pencil />
                  </Button>
                  <span className="text-xl font-bold text-app-text-light">
                    {gregTime}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  {prayingTimes.map(item => (
                    <div key={item.id} className="flex flex-col items-center">
                      <span className="text-sm font-bold text-app-text-light">
                        {item.name}
                      </span>
                      <span className="text-sm font-bold text-app-text-light">
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
                <MosqueIcon className="size-full scale-90 opacity-10 absolute top-0 -right-3/12" />
              </div>
            </AspectRatio>

            {/* Dzikir */}
            <div className="flex gap-4">
              {toc
                .filter(({ category }) => category === 'dzikir')
                .map(content => {
                  const { id, title, link } = content;
                  const bgClass =
                    id === 1 ? 'bg-app-bg-purple' : 'bg-app-bg-blue';
                  const textClass =
                    id === 1 ? 'text-app-text-dark' : 'text-app-text-light';
                  return (
                    <Link href={link} key={id} className="flex-1">
                      <AspectRatio asChild ratio={1 / 1}>
                        <div
                          className={cn(
                            bgClass,
                            'rounded-4xl flex flex-col gap-4 items-center justify-center'
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
                        <div className="rounded-4xl flex flex-col gap-2 items-center justify-center bg-card">
                          {Icons[id]}
                          <span className="text-xs font-bold">{title}</span>
                        </div>
                      </AspectRatio>
                    </Link>
                  );
                })}
            </div>

            {/* Quotes */}
            <div className="flex flex-col rounded-4xl p-4 gap-4 bg-card sm:flex-1">
              <h2 className="text-base font-bold">Mutiara Hikmah</h2>
              <div className="flex flex-col gap-2">
                <p className="text-sm">{quote}</p>
                <span className="text-xs text-muted-foreground">
                  {narrator}
                </span>
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
