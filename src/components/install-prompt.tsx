'use client';

import { DownloadIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from './ui/button';

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    let mounted = true;
    Promise.resolve().then(() => {
      if (!mounted) return;
      setIsIOS(
        /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window)
      );
      setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
      const dismissedAt = localStorage.getItem('installPromptDismissedAt');
      if (dismissedAt) {
        const dismissedTime = Number.parseInt(dismissedAt, 10);
        const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;

        if (Date.now() - dismissedTime < SEVEN_DAYS_IN_MS) {
          setIsDismissed(true);
        } else {
          localStorage.removeItem('installPromptDismissedAt');
        }
      }
    });

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      mounted = false;
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  if (isStandalone) {
    return null;
  }

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  // If it's already installed or neither iOS nor Android prompt is available, don't show
  if (!isIOS && !deferredPrompt) return null;

  if (isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('installPromptDismissedAt', Date.now().toString());
  };

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="from-secondary/50 to-primary/50 relative flex flex-col gap-3 rounded-4xl border border-white/50 bg-linear-to-tr p-4 backdrop-blur-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-foreground font-bold">Install Muslim App</h3>
          {isIOS ? (
            <p className="text-muted-foreground text-sm">
              Tekan tombol <b>Share</b>{' '}
              <span className="inline-block text-xl">⎋</span> di bawah, lalu
              pilih <b>&quot;Add to Home Screen&quot;</b>{' '}
              <span className="inline-block text-xl">➕</span> untuk pengalaman
              lebih baik.
            </p>
          ) : (
            <p className="text-muted-foreground text-sm">
              Install aplikasi untuk akses offline!
            </p>
          )}
        </div>
        {!isIOS && deferredPrompt && (
          <Button
            onClick={handleInstall}
            className="w-full shrink-0 gap-2 sm:w-auto"
          >
            <DownloadIcon className="size-4" /> Install
          </Button>
        )}
        <Button
          variant="ghost"
          className="bg-secondary absolute -inset-e-2 -top-2"
          size="icon-xs"
          onClick={handleDismiss}
        >
          <XIcon />
          <span className="sr-only">Close</span>
        </Button>
      </div>
    </div>
  );
}
