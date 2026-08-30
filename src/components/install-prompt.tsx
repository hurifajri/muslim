'use client';

import { DownloadIcon, ShareIcon, XIcon } from 'lucide-react';
import { useEffect, useState, useSyncExternalStore } from 'react';

import { Button } from './ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;

// Static subscribe — these values never change during a session
const noop = () => () => {};
const returnFalse = () => false;

function getIsIOS() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

function getIsStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches;
}

function getIsDismissed() {
  const dismissedAt = localStorage.getItem('installPromptDismissedAt');
  if (!dismissedAt) return false;
  const dismissedTime = Number.parseInt(dismissedAt, 10);
  return Date.now() - dismissedTime < SEVEN_DAYS_IN_MS;
}

export function InstallPrompt() {
  const isIOS = useSyncExternalStore(noop, getIsIOS, returnFalse);
  const isStandalone = useSyncExternalStore(noop, getIsStandalone, returnFalse);
  const wasDismissed = useSyncExternalStore(noop, getIsDismissed, returnFalse);

  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Clean up expired dismissal from localStorage
    const dismissedAt = localStorage.getItem('installPromptDismissedAt');
    if (dismissedAt) {
      const dismissedTime = Number.parseInt(dismissedAt, 10);
      if (Date.now() - dismissedTime >= SEVEN_DAYS_IN_MS) {
        localStorage.removeItem('installPromptDismissedAt');
      }
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  if (isStandalone) return null;

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    try {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
    } catch {
      // prompt() can throw if already called or dismissed
    } finally {
      setDeferredPrompt(null);
    }
  };

  // If it's already installed or neither iOS nor Android prompt is available, don't show
  if (!isIOS && !deferredPrompt) return null;

  if (isDismissed || wasDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('installPromptDismissedAt', Date.now().toString());
  };

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="bg-card border-border relative flex flex-col gap-2 rounded-4xl border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <h3 className="text-card-foreground font-bold">Install Muslim App</h3>
          {isIOS ? (
            <p className="text-card-foreground flex flex-wrap items-center text-sm">
              Tekan tombol&nbsp;<span className="font-semibold">Share</span>
              &nbsp;
              <ShareIcon className="size-4" />
              &nbsp;di bawah, lalu pilih&nbsp;
              <span className="font-semibold">Add to Home Screen</span>
              &nbsp;atau&nbsp;{' '}
              <span className="font-semibold">
                Tambahkan ke Layar Utama
              </span>{' '}
              &nbsp;untuk dapat mengakses aplikasi secara offline.
            </p>
          ) : (
            <p className="text-card-foreground text-sm">
              Install untuk dapat mengakses aplikasi secara offline.
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
