'use client';

import { SearchIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useDeferredValue, useRef, useState } from 'react';

import { ReadingActions } from '@/components/reading-actions';
import { Button } from '@/components/ui/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { searchReadings } from '@/lib/readings';
import { useReadingStore } from '@/providers/reading-store-provider';

export function ReadingLibrary() {
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const favoritesOnly = searchParams.get('tab') === 'favorit';
  const favorites = useReadingStore(state => state.favorites);
  const hydrated = useReadingStore(state => state.hydrated);
  const deferredQuery = useDeferredValue(query);
  const results = searchReadings(deferredQuery).filter(
    item => !favoritesOnly || favorites[item.id]
  );
  const selectTab = (showFavorites: boolean) => {
    if (favoritesOnly === showFavorites) return;
    const url = new URL(window.location.href);
    if (showFavorites) url.searchParams.set('tab', 'favorit');
    else url.searchParams.delete('tab');
    window.history.pushState(
      null,
      '',
      `${url.pathname}${url.search}${url.hash}`
    );
  };
  return (
    <div className="mx-auto mt-[calc(6.375rem+env(safe-area-inset-top))] flex max-w-2xl flex-col gap-4 pb-8">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reading-search">Cari doa atau dzikir</Label>
        <InputGroup>
          <InputGroupInput
            ref={inputRef}
            id="reading-search"
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Judul, terjemahan, atau teks bacaan…"
            className="[&::-webkit-search-cancel-button]:appearance-none"
          />
          <InputGroupAddon align="inline-start">
            <SearchIcon aria-hidden />
          </InputGroupAddon>
          {query && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-sm"
                aria-label="Hapus pencarian"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
              >
                <XIcon aria-hidden />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
      </div>
      <div className="flex gap-2">
        <Button
          variant={favoritesOnly ? 'outline' : 'default'}
          aria-pressed={!favoritesOnly}
          onClick={() => selectTab(false)}
        >
          Semua bacaan
        </Button>
        <Button
          variant={favoritesOnly ? 'default' : 'outline'}
          aria-pressed={favoritesOnly}
          onClick={() => selectTab(true)}
        >
          Favorit
        </Button>
      </div>
      <output className="text-sm">
        {favoritesOnly && !hydrated
          ? 'Memuat favorit…'
          : results.length
            ? `${results.length} bacaan`
            : favoritesOnly
              ? 'Belum ada favorit yang cocok. Simpan bacaan melalui tombol hati.'
              : 'Bacaan tidak ditemukan. Coba kata lain.'}
      </output>
      <div className="flex flex-col gap-3">
        {results.map(reading => (
          <article
            key={reading.id}
            className="bg-card flex flex-col gap-2 rounded-3xl border p-4"
          >
            <p className="text-muted-foreground text-xs">
              {reading.categoryLabel}
            </p>
            <Link
              href={reading.href}
              className="rounded-lg font-bold underline-offset-4 hover:underline"
            >
              <h2>{reading.title}</h2>
            </Link>
            <p className="line-clamp-3 text-sm">{reading.translation}</p>
            <p className="text-muted-foreground text-xs">{reading.narrator}</p>
            <div className="flex items-center justify-between">
              <Button asChild variant="outline" size="sm">
                <Link href={reading.href}>Baca lengkap</Link>
              </Button>
              <ReadingActions id={reading.id} href={reading.href} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
