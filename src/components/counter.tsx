import { CheckIcon, PlusIcon, RotateCcwIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { playClickSound } from '@/lib/click-sound';
import { useReadingStore } from '@/providers/reading-store-provider';
import { useSettingsStore } from '@/providers/settings-store-provider';

export function Counter({
  readingId,
  target,
}: {
  readingId: string;
  target?: number;
}) {
  const value = useReadingStore(state => state.counts[readingId] ?? 0);
  const undo = useReadingStore(state => state.undoCounts[readingId]);
  const hydrated = useReadingStore(state => state.hydrated);
  const increment = useReadingStore(state => state.increment);
  const reset = useReadingStore(state => state.reset);
  const undoReset = useReadingStore(state => state.undoReset);
  const clickSoundEnabled = useSettingsStore(
    state => state.settings.clickSound
  );
  const completed = target !== undefined && value >= target;
  const sound = () => {
    if (clickSoundEnabled) void playClickSound();
  };
  return (
    <div className="flex flex-col items-end gap-2">
      <ButtonGroup aria-label="Tombol hitung" className="items-center">
        <Button
          size="icon-lg"
          aria-label="Reset hitungan"
          disabled={!hydrated || value === 0}
          onClick={() => {
            reset(readingId);
            sound();
          }}
        >
          <RotateCcwIcon />
        </Button>
        <output
          aria-label="Jumlah bacaan"
          className="bg-primary/80 dark:bg-primary text-primary-foreground -ml-1 flex h-9.5 min-w-12 items-center justify-center px-2 font-bold tabular-nums"
        >
          {value}
          {target ? `/${target}` : ''}
        </output>
        <Button
          size="icon-lg"
          aria-label={completed ? 'Target bacaan selesai' : 'Tambah hitungan'}
          disabled={!hydrated || completed}
          onClick={() => {
            increment(readingId, target);
            sound();
          }}
        >
          {completed ? <CheckIcon /> : <PlusIcon />}
        </Button>
      </ButtonGroup>
      {undo !== undefined && (
        <Button variant="ghost" size="sm" onClick={() => undoReset(readingId)}>
          Batalkan reset
        </Button>
      )}
    </div>
  );
}
