'use client';

import { ChevronLeft, MenuIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { Settings } from './settings';

type HeaderProps = Readonly<{
  title: string;
}>;

const Header = ({ title }: HeaderProps) => {
  const { back } = useRouter();
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
