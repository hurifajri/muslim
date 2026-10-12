import { PlusIcon, RotateCcwIcon } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { useSettingsStore } from '@/providers/settings-store-provider';

const AudioCtx =
  typeof window !== 'undefined'
    ? (window.AudioContext ??
      (
        window as unknown as {
          webkitAudioContext: typeof AudioContext;
        }
      ).webkitAudioContext)
    : undefined;

let sharedCtx: AudioContext | undefined;

function getAudioContext(): AudioContext | undefined {
  if (!AudioCtx) return;

  if (!sharedCtx || sharedCtx.state === 'closed') {
    sharedCtx = new AudioCtx();
  }
  return sharedCtx;
}

async function playClickSound() {
  let ctx: AudioContext | undefined;

  try {
    ctx = getAudioContext();
    if (!ctx) return;

    // Resume from the click gesture, including Safari's interrupted state.
    if (ctx.state !== 'running') {
      await ctx.resume();
    }
    if (ctx.state !== 'running') return;

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, now);
    oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.03);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    oscillator.start(now);
    oscillator.stop(now + 0.04);
  } catch {
    // Discard a failed context so the next click can try a fresh one.
    if (ctx && sharedCtx === ctx) {
      sharedCtx = undefined;
      void ctx.close().catch(() => {});
    }
  }
}

export function Counter() {
  const [value, setValue] = useState(0);
  const clickSoundEnabled = useSettingsStore(
    state => state.settings.clickSound
  );

  const handleClick = useCallback(() => {
    if (clickSoundEnabled) {
      void playClickSound();
    }
  }, [clickSoundEnabled]);

  return (
    <ButtonGroup aria-label="Tombol hitung" className="items-center">
      <Button
        size="icon-lg"
        onClick={() => {
          setValue(0);
          handleClick();
        }}
      >
        <RotateCcwIcon />
      </Button>
      <div className="bg-primary/80 dark:bg-primary text-primary-foreground -ml-1 flex h-9.5 w-12 items-center justify-center font-bold">
        {value}
      </div>
      <Button
        size="icon-lg"
        onClick={() => {
          setValue(v => v + 1);
          handleClick();
        }}
      >
        <PlusIcon />
      </Button>
    </ButtonGroup>
  );
}
