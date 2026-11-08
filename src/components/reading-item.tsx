'use client';

import { memo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { Counter } from '@/components/counter';
import { ReadingActions } from '@/components/reading-actions';
import { Button } from '@/components/ui/button';
import type { ReadingEntry } from '@/lib/reading-sequence';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/providers/settings-store-provider';
import type { Benefit } from '@/schemas/items';

type ReadingItemProps = Readonly<{
  entry: ReadingEntry;
  highlighted: boolean | null;
  onOpenBenefits: (title: string, benefits: Benefit[]) => void;
}>;

export const ReadingItem = memo(function ReadingItem({
  entry,
  highlighted,
  onOpenBenefits,
}: ReadingItemProps) {
  const { counter, benefits, translation, transliteration, fontSizes } =
    useSettingsStore(
      useShallow(state => ({
        counter: state.settings.counter,
        benefits: state.settings.benefits,
        translation: state.settings.translation,
        transliteration: state.settings.transliteration,
        fontSizes: state.fontSizes,
      }))
    );
  const { parent, item } = entry;
  const hasBenefits = benefits && item.benefits.length > 0;

  return (
    <div
      id={entry.anchor}
      className={cn(
        'flex scroll-mt-[calc(7rem+env(safe-area-inset-top))] flex-col gap-4 p-4',
        highlighted === null &&
          'target:ring-primary target:m-0.5 target:ring-2',
        highlighted && 'ring-primary m-0.5 ring-2'
      )}
    >
      <ReadingActions id={entry.id} href={entry.href} />
      <p
        lang="ar"
        dir="rtl"
        style={{ fontSize: fontSizes.arabic }}
        className="font-arabic text-right leading-loose"
      >
        {item.arabic}
      </p>
      {transliteration && item.transliteration.trim() && (
        <p style={{ fontSize: fontSizes.translation }} className="italic">
          {item.transliteration}
        </p>
      )}
      {translation && (
        <div className="flex flex-col gap-2">
          <p
            style={{ fontSize: fontSizes.translation }}
          >{`"${item.translation}"`}</p>
          {item.narrator && <p className="text-sm">{`[${item.narrator}]`}</p>}
        </div>
      )}
      <div
        className={cn(
          'flex w-full flex-wrap items-center gap-2',
          hasBenefits ? 'justify-between' : 'justify-end'
        )}
      >
        {hasBenefits && (
          <Button
            size="lg"
            onClick={() => onOpenBenefits(parent.title, item.benefits)}
            className="w-auto"
          >
            Lihat keutamaan
          </Button>
        )}
        {counter && entry.target && (
          <Counter readingId={entry.progressId} target={entry.target} />
        )}
      </div>
    </div>
  );
});
