'use client';

import dynamic from 'next/dynamic';
import { useCallback, useMemo, useState } from 'react';

import { ReadingItem } from '@/components/reading-item';
import { ReadingSession } from '@/components/reading-session';
import { Separator } from '@/components/ui/separator';
import type { Collection } from '@/data/categories';
import { useReadingTarget } from '@/hooks/use-reading-target';
import { getReadingSequence, type ReadingEntry } from '@/lib/reading-sequence';
import { useSettingsStore } from '@/providers/settings-store-provider';
import type { Benefit, ParentItem } from '@/schemas/items';

type ItemsProps = Readonly<{
  items: ParentItem[];
  scope: string;
}>;

const Benefits = dynamic(() =>
  import('@/components/benefits').then(mod => mod.Benefits)
);

export function Items({ items, scope }: ItemsProps) {
  const showBenefits = useSettingsStore(state => state.settings.benefits);
  const highlightedId = useReadingTarget();
  const collection = scope.split(':')[0] as Collection;
  const readingsByParent = useMemo(() => {
    const groups = new Map<number, ReadingEntry[]>();
    for (const entry of getReadingSequence(items, scope)) {
      const group = groups.get(entry.parent.id) ?? [];
      group.push(entry);
      groups.set(entry.parent.id, group);
    }
    return groups;
  }, [items, scope]);
  const [selectedBenefits, setSelectedBenefits] = useState<{
    title: string;
    benefits: Benefit[];
  } | null>(null);
  const openBenefits = useCallback(
    (title: string, benefits: Benefit[]) => {
      setSelectedBenefits({ title, benefits });
    },
    [setSelectedBenefits]
  );

  return (
    <>
      <div className="mt-[calc(6.375rem+env(safe-area-inset-top))] mb-25.5 w-full px-4 sm:max-w-2xl sm:self-center">
        {collection === 'dzikir' && (
          <ReadingSession items={items} scope={scope} />
        )}
        <div className="overflow-hidden rounded-4xl">
          {items.map((parent, index) => (
            <div
              key={parent.id}
              className="bg-card text-card-foreground flex flex-col"
            >
              {index !== 0 && <Separator />}
              <div className="flex items-center justify-between gap-2 p-4">
                <h2 className="font-bold">{parent.title}</h2>
                {parent.note && (
                  <span className="shrink-0 text-sm font-bold">
                    {parent.note}
                  </span>
                )}
              </div>
              <Separator />
              <div className="flex flex-col gap-8">
                {readingsByParent.get(parent.id)?.map(entry => (
                  <ReadingItem
                    key={entry.id}
                    entry={entry}
                    highlighted={
                      highlightedId === null
                        ? null
                        : highlightedId === entry.anchor
                    }
                    onOpenBenefits={openBenefits}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showBenefits && selectedBenefits && (
        <Benefits
          benefits={selectedBenefits.benefits}
          title={selectedBenefits.title}
          isOpen
          onClose={() => setSelectedBenefits(null)}
        />
      )}
    </>
  );
}
