'use client';

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import {
  Toaster as Sonner,
  type ToasterProps as SonnerToasterProps,
} from 'sonner';

import { buttonVariants } from '@/components/ui/button';
import { COLOR_PALETTES } from '@/data/color-palettes';
import { usePaletteStore } from '@/providers/palette-store-provider';

type ToasterProps = Readonly<SonnerToasterProps>;

const Toaster = ({ ...props }: ToasterProps) => {
  const paletteId = usePaletteStore(state => state.paletteId);
  const theme =
    COLOR_PALETTES.find(palette => palette.id === paletteId)?.mode ?? 'light';

  return (
    <Sonner
      theme={theme}
      richColors
      position="top-center"
      duration={4000}
      mobileOffset={{ top: 'max(1rem, env(safe-area-inset-top))' }}
      containerAriaLabel="Notifikasi"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--success-bg': 'var(--secondary)',
          '--success-text': 'var(--secondary-foreground)',
          '--success-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: 'cn-toast rounded-4xl!',
          actionButton: buttonVariants({
            size: 'xs',
            // Sonner's unlayered CSS otherwise overrides the theme styles.
            className:
              'rounded-4xl! bg-primary! text-primary-foreground! hover:bg-primary/80!',
          }),
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
