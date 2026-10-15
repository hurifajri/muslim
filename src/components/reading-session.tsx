'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getSessionProgress } from '@/lib/reading-session';
import { useReadingStore } from '@/providers/reading-store-provider';
import { useSettingsStore } from '@/providers/settings-store-provider';
import type { ParentItem } from '@/schemas/items';

export function ReadingSession({
  items,
  scope,
}: {
  items: ParentItem[];
  scope: string;
}) {
  const counts = useReadingStore(state => state.counts);
  const hydrated = useReadingStore(state => state.hydrated);
  const undo = useReadingStore(state => state.undoSessions[scope]);
  const resetSession = useReadingStore(state => state.resetSession);
  const undoSession = useReadingStore(state => state.undoSession);
  const counter = useSettingsStore(state => state.settings.counter);
  const setSettings = useSettingsStore(state => state.setSettings);
  const progress = getSessionProgress(items, scope, counts);
  if (!progress.total) return null;
  const started = progress.entries.some(entry => (counts[entry.id] ?? 0) > 0);
  return (
    <section
      aria-label="Progres sesi dzikir"
      className="bg-card mb-4 flex flex-col gap-3 rounded-4xl border p-4"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-bold">Sesi dzikir</h2>
        <span className="text-sm tabular-nums">
          {progress.completed}/{progress.total} bacaan
        </span>
      </div>
      <Progress
        aria-label="Bacaan selesai"
        value={progress.completed}
        max={progress.total}
        getValueLabel={(value, max) => `${value} dari ${max} bacaan selesai`}
        className="h-2"
      />
      <p className="text-sm">
        {progress.next
          ? 'Progres tersimpan di perangkat ini. Lanjutkan kapan saja.'
          : 'Semua bacaan bertarget dalam sesi ini telah selesai.'}
      </p>
      <div className="flex flex-wrap gap-2">
        {progress.next && (
          <Button asChild disabled={!hydrated}>
            <a
              href={`#${progress.next.anchor}`}
              onClick={() => {
                if (!counter) setSettings('counter', true);
              }}
            >
              {started ? 'Lanjutkan sesi' : 'Mulai sesi'}
            </a>
          </Button>
        )}
        {started && (
          <Button variant="outline" onClick={() => resetSession(scope)}>
            Mulai sesi baru
          </Button>
        )}
        {undo && (
          <Button variant="ghost" onClick={() => undoSession(scope)}>
            Batalkan reset sesi
          </Button>
        )}
      </div>
    </section>
  );
}
