'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

import { Counter } from '@/components/counter';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/providers/settings-store-provider';
import type { Benefit, ParentItem } from '@/schemas/items';

type ItemsProps = Readonly<{
  items: ParentItem[];
}>;

const Benefits = dynamic(() =>
  import('@/components/benefits').then(mod => mod.Benefits)
);

export function Items({ items }: ItemsProps) {
  const { settings } = useSettingsStore(state => state);

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
      <div className="py-17 sm:max-w-2xl sm:self-center">
        {items.map(pItem => {
          return (
            <div
              key={pItem.id}
              className="bg-card text-card-foreground flex flex-col"
            >
              <Separator />
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
                  return (
                    <div key={cItem.id} className="flex flex-col gap-4">
                      <p className="font-arabic text-right text-2xl leading-loose">
                        {cItem.arabic}
                      </p>
                      {settings.transliteration && (
                        <p className="italic">{cItem.transliteration}</p>
                      )}
                      {settings.translation && (
                        <div className="flex flex-col gap-2">
                          <p>{`"${cItem.translation}"`}</p>
                          {cItem.narrator && (
                            <p className="text-sm">{`[${cItem.narrator}]`}</p>
                          )}
                        </div>
                      )}
                      <div
                        className={cn(
                          'flex w-full items-center',
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
                        {settings.counter &&
                          pItem.note &&
                          pItem.note !== 'Dibaca 1x' && <Counter />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {settings.benefits && (
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
