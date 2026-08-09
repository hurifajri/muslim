'use client';

import { ChevronLeft, Moon, Sun } from 'lucide-react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

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

  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const toggleColorMode = () => setTheme(isDark ? 'light' : 'dark');

  return (
    <header className="fixed top-0 left-0 right-0 z-[2] flex items-center justify-between p-3 bg-app-bg-blue">
      <div className="flex items-center gap-1">
        <Button
          aria-label="Back"
          variant="ghost"
          size="icon"
          onClick={back}
          className="hover:bg-transparent active:bg-transparent text-app-text-light"
        >
          <ChevronLeft />
        </Button>
        <h1 className="text-lg capitalize font-bold text-app-text-light">
          {title}
        </h1>
      </div>
      <Button
        aria-label={`Mode ${isDark ? 'Gelap' : 'Terang'}`}
        variant="ghost"
        size="icon"
        onClick={toggleColorMode}
        className="hover:bg-transparent active:bg-transparent text-app-text-light"
      >
        {isDark ? <Moon /> : <Sun />}
      </Button>
    </header>
  );
};

export { Header };
