'use client';

import { HomeIcon, MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { Settings } from './settings';

type HeaderProps = Readonly<{
  title: string;
}>;

export function Header({ title }: HeaderProps) {
  const [isOpenSettings, setIsOpenSettings] = useState(false);

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-20 p-4 pt-[max(1rem,env(safe-area-inset-top))] pr-[max(1rem,env(safe-area-inset-right))] pl-[max(1rem,env(safe-area-inset-left))]">
        <div className="from-secondary/50 to-primary/50 flex items-center justify-between rounded-4xl border border-white/50 bg-linear-to-tr p-4 backdrop-blur-xs">
          <div className="flex items-center gap-2">
            <Button asChild size="icon">
              <Link href="/" aria-label="Ke beranda">
                <HomeIcon />
              </Link>
            </Button>
            <h1 className="text-lg font-bold capitalize">{title}</h1>
          </div>
          <Button
            size="icon"
            aria-label="Buka pengaturan"
            onClick={() => setIsOpenSettings(true)}
          >
            <MenuIcon />
          </Button>
        </div>
      </header>

      {/* Settings */}
      {isOpenSettings && (
        <Settings
          isOpen={isOpenSettings}
          onClose={() => setIsOpenSettings(false)}
        />
      )}
    </>
  );
}
