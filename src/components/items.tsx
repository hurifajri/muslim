'use client';

import dynamic from 'next/dynamic';
import { useState, useSyncExternalStore } from 'react';

import { Counter } from '@/components/counter';
import { ReadingActions } from '@/components/reading-actions';
import { ReadingSession } from '@/components/reading-session';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Collection } from '@/data/categories';
import { readingAnchor, readingHref, readingId } from '@/lib/reading-identity';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/providers/settings-store-provider';
import type { Benefit, ParentItem } from '@/schemas/items';

type ItemsProps = Readonly<{
  items: ParentItem[];
  scope: string;
}>;

const Benefits = dynamic(() =>
  import('@/components/benefits').then(mod => mod.Benefits)
);

function subscribeToHash(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  window.addEventListener('popstate', onChange);
  return () => {
    window.removeEventListener('hashchange', onChange);
    window.removeEventListener('popstate', onChange);
  };
}

export function Items({ items, scope }: ItemsProps) {
  const { settings, fontSizes } = useSettingsStore(state => state);
  // Next Link changes history without updating the browser's CSS :target.
  const highlightedId = useSyncExternalStore<string | null>(
    subscribeToHash,
    () => window.location.hash.slice(1),
    () => null
  );

  const [collection, category] = scope.split(':') as [Collection, string];

  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [title, setTitle] = useState('');

  const handleClickBenefits = (
    currentTitle: string,
    currentBenefits: Benefit[]
  ) => {
    setTitle(currentTitle);
    setBenefits(currentBenefits);
    onOpen();
  };

  return (
    <>
      <div className="mt-[calc(6.375rem+env(safe-area-inset-top))] mb-25.5 w-full px-4 sm:max-w-2xl sm:self-center">
        {collection === 'dzikir' && (
          <ReadingSession items={items} scope={scope} />
        )}
        <div className="overflow-hidden rounded-4xl">
          {items.map((pItem, index) => {
            return (
              <div
                key={pItem.id}
                className="bg-card text-card-foreground flex flex-col"
              >
                {index !== 0 && <Separator />}
                <div className="flex items-center justify-between gap-2 p-4">
                  <h2 className="font-bold">{pItem.title}</h2>
                  {pItem.note && (
                    <span className="shrink-0 text-sm font-bold">
                      {pItem.note}
                    </span>
                  )}
                </div>
                <Separator />
                <div className="flex flex-col gap-8 p-4 pb-8">
                  {pItem.items.map(cItem => {
                    const anchor = readingAnchor(
                      collection,
                      pItem.id,
                      cItem.id
                    );
                    return (
                      <div
                        key={cItem.id}
                        id={anchor}
                        className={cn(
                          'flex scroll-mt-[calc(7rem+env(safe-area-inset-top))] flex-col gap-4 rounded-xl',
                          highlightedId === null &&
                            'target:ring-primary target:p-4 target:ring-2',
                          highlightedId === anchor && 'ring-primary p-4 ring-2'
                        )}
                      >
                        <ReadingActions
                          id={readingId(collection, pItem.id, cItem.id)}
                          href={readingHref(
                            collection,
                            category,
                            pItem.id,
                            cItem.id
                          )}
                        />
                        <p
                          lang="ar"
                          dir="rtl"
                          style={{ fontSize: fontSizes.arabic }}
                          className="font-arabic text-right leading-loose"
                        >
                          {cItem.arabic}
                        </p>
                        {settings.transliteration &&
                          cItem.transliteration.trim() && (
                            <p
                              style={{ fontSize: fontSizes.translation }}
                              className="italic"
                            >
                              {cItem.transliteration}
                            </p>
                          )}
                        {settings.translation && (
                          <div className="flex flex-col gap-2">
                            <p
                              style={{ fontSize: fontSizes.translation }}
                            >{`"${cItem.translation}"`}</p>
                            {cItem.narrator && (
                              <p className="text-sm">{`[${cItem.narrator}]`}</p>
                            )}
                          </div>
                        )}
                        <div
                          className={cn(
                            'flex w-full flex-wrap items-center gap-2',
                            settings.benefits && cItem.benefits.length > 0
                              ? 'justify-between'
                              : 'justify-end'
                          )}
                        >
                          {settings.benefits && cItem.benefits.length > 0 && (
                            <Button
                              size="lg"
                              aria-label="Lihat keutamaan"
                              onClick={() =>
                                handleClickBenefits(pItem.title, cItem.benefits)
                              }
                              className="w-auto"
                            >
                              Lihat Keutamaan
                            </Button>
                          )}
                          {settings.counter && pItem.repetitions && (
                            <Counter
                              readingId={`${scope}:${pItem.id}:${cItem.id}`}
                              target={pItem.repetitions}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {settings.benefits && isOpen && (
        <Benefits
          benefits={benefits}
          title={title}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </>
  );
}
