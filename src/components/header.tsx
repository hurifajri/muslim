'use client';

import { ChevronLeft, MenuIcon } from 'lucide-react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { Settings } from './settings';

const Header = () => {
  const { back } = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const isDzikir = pathname?.startsWith('/dzikir/');
  const isDoa = pathname?.startsWith('/doa/');
  const category = Array.isArray(params?.category)
    ? params.category[0]
    : (params?.category ?? '');

  const title = isDzikir
    ? `Dzikir ${category}`
    : isDoa
      ? `Kumpulan Doa ${category}`
      : '';

  const [isOpenSettings, setIsOpenSettings] = useState(false);

  return (
    <>
      <header className="fixed top-0 right-0 left-0 flex items-center justify-between p-4 backdrop-blur-xs">
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            aria-label="Kembali"
            onClick={back}
            className="bg-app-6 hover:bg-app-6/80"
          >
            <ChevronLeft />
          </Button>
          <h1 className="text-lg font-bold capitalize">{title}</h1>
        </div>
        <Button
          size="icon"
          aria-label="Buka pengaturan"
          onClick={() => setIsOpenSettings(true)}
          className="bg-app-6 hover:bg-app-6/80"
        >
          <MenuIcon />
        </Button>
      </header>

      {/* Settings */}
      <Settings
        isOpen={isOpenSettings}
        onClose={() => setIsOpenSettings(false)}
      />
    </>
  );
};

export { Header };
