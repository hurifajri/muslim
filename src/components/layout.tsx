'use client';

import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import React from 'react';

import { Header } from '@/components/header';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <div
      className={cn('min-h-screen', isDark ? 'bg-[#322659]' : 'bg-[#faf5ff]')}
    >
      {!isHome && <Header />}
      <div
        className={cn(
          'mx-auto flex max-w-sm flex-col',
          isHome ? 'gap-[30px] px-7 pt-7 pb-7' : 'gap-[30px] pt-14'
        )}
      >
        {children}
      </div>
    </div>
  );
};

export { Layout };
