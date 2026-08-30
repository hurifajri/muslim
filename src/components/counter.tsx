import { PlusIcon, RotateCcwIcon } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { useSettingsStore } from '@/providers/settings-store-provider';

function playClickSound() {
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(600, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(
    400,
    ctx.currentTime + 0.03
  );

  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.04);
}

export function Counter() {
  const [value, setValue] = useState(0);
  const clickSoundEnabled = useSettingsStore(
    state => state.settings.clickSound
  );

  const handleClick = useCallback(() => {
    if (clickSoundEnabled) {
      playClickSound();
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
