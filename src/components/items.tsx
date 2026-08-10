// Eksternal
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import type { Benefit } from '@/components/benefits';
// Internal
import { Counter } from '@/components/counter';
import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/providers/settings-store-provider';

interface ContentItem {
  id: number;
  arabic: string;
  transliteration: string | null;
  translation: string;
  narrator: string | null;
  benefits: Benefit[] | null;
}

interface ParentItem {
  id: number;
  title: string;
  note: string | null;
  arabic?: string | null;
  items: ContentItem[];
}

interface ItemsProps {
  items: ParentItem[];
}

const Benefits = dynamic(() =>
  import('@/components/benefits').then(mod => mod.Benefits)
);

const Items = ({ items }: ItemsProps) => {
  const pathname = usePathname();
  // Settings
  const { settings } = useSettingsStore(state => state);

  // Open/close drawer (now sheet) benefits handler
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  // Set selected item benefits data
  const [benefits, setBenefits] = useState<Benefit[] | null>(null);
  const [title, setTitle] = useState('');

  const handleClickBenefits = (
    currentTitle: string,
    currentBenefits: Benefit[] | null
  ) => {
    setTitle(currentTitle);
    setBenefits(currentBenefits);
    onOpen();
  };

  return (
    <>
      <div className="flex flex-col gap-[30px] pb-10">
        {items.length > 0 &&
          items.map(pItem => {
            return (
              <div
                key={pItem.id}
                className="flex flex-col rounded-[25px] p-5 gap-[15px] shadow-sm bg-card"
              >
                {/* Title */}
                <h2 className="text-xl font-bold leading-tight">
                  {pItem.title}
                </h2>
                {/* Condition to render note */}
                {pItem.note && (
                  <span className="text-sm font-bold uppercase text-app-text-purple-dark">
                    {pItem.note}
                  </span>
                )}
                {/* Condition to render arabic if exist outside content object */}
                {pItem.arabic && settings.arabic === true && (
                  <p className="font-arabic font-normal text-right leading-loose tracking-wide mt-2.5 text-[32px] text-app-text-dark">
                    {pItem.arabic}
                  </p>
                )}
                {/* Condition to separate line */}
                {(settings.translation === true ||
                  settings.transliteration === true) && (
                  <hr className="my-2 border-t-[1.5px] border-border" />
                )}
                {pItem.items.map((cItem, i) => {
                  return (
                    <div key={cItem.id} className="flex flex-col gap-5 mt-2.5">
                      {/* Sub title */}
                      {pItem.items.length > 1 && (
                        <h2 className="text-xl font-bold leading-tight">
                          Bagian {i + 1}
                        </h2>
                      )}
                      {/* Condition to render arabic */}
                      {settings.arabic === true && (
                        <p className="font-arabic font-normal text-right leading-loose tracking-wide text-[32px] text-app-text-dark">
                          {cItem.arabic}
                        </p>
                      )}
                      {/* Condition to render row of button benefits and button counter */}
                      {pathname.includes('dzikir') && (
                        <div
                          className="flex items-center w-full"
                          style={{
                            justifyContent:
                              cItem.benefits !== null &&
                              settings.benefits === true
                                ? 'space-between'
                                : 'flex-end',
                          }}
                        >
                          {/* Condition to render benefits button */}
                          {cItem.benefits !== null &&
                            settings.benefits === true && (
                              <Button
                                aria-label="Lihat Keutamaan"
                                onClick={() =>
                                  handleClickBenefits(
                                    pItem.title,
                                    cItem.benefits
                                  )
                                }
                                variant="ghost"
                                className={`py-2 cursor-pointer text-sm md:text-base uppercase hover:opacity-90 active:opacity-90 transition-opacity bg-app-bg-button ${
                                  pItem.note !== null &&
                                  pItem.note !== 'Dibaca 1x' &&
                                  settings.counter === true
                                    ? 'w-auto'
                                    : 'w-full'
                                }`}
                              >
                                Lihat Keutamaan
                              </Button>
                            )}
                          {/* Condition to render counter button */}
                          {pItem.note !== null &&
                            pItem.note !== 'Dibaca 1x' &&
                            settings.counter === true && <Counter />}
                        </div>
                      )}
                      {/*  Condition to render transliteration */}
                      {cItem.transliteration &&
                        settings.transliteration === true && (
                          <p className="text-base md:text-lg italic">
                            {cItem.transliteration}
                          </p>
                        )}
                      {/*  Condition to render translation */}
                      {settings.translation === true && (
                        <p className="text-base md:text-lg">
                          {`"${cItem.translation}"`}
                          {cItem.narrator && (
                            <span className="text-sm md:text-base opacity-80">
                              {` [${cItem.narrator}]`}
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>
      {/* Benefits of each item Dzikir or Doa */}
      {settings.benefits === true && (
        <Benefits
          benefits={benefits}
          title={title}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </>
  );
};

export { Items };
