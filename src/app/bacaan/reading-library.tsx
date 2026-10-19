'use client';

import { SearchIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useDeferredValue, useRef, useState } from 'react';

import { ReadingActions } from '@/components/reading-actions';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
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
  let resultMessage = favoritesOnly
    ? 'Belum ada favorit yang cocok. Simpan bacaan melalui tombol hati.'
    : 'Bacaan tidak ditemukan. Coba kata lain.';
  if (favoritesOnly && !hydrated) resultMessage = 'Memuat favorit…';
  else if (results.length) resultMessage = `${results.length} bacaan`;
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
      <FieldGroup>
        <Field className="gap-1.5">
          <FieldLabel htmlFor="reading-search">Cari doa atau dzikir</FieldLabel>
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
            <InputGroupAddon align="inline-start" asChild>
              <Label htmlFor="reading-search" aria-hidden>
                <SearchIcon aria-hidden />
              </Label>
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
        </Field>
      </FieldGroup>
      <ToggleGroup
        type="single"
        variant="outline"
        value={favoritesOnly ? 'favorit' : 'semua'}
        onValueChange={value => {
          if (value) selectTab(value === 'favorit');
        }}
        aria-label="Filter bacaan"
      >
        <ToggleGroupItem value="semua">Semua bacaan</ToggleGroupItem>
        <ToggleGroupItem value="favorit">Favorit</ToggleGroupItem>
      </ToggleGroup>
      <output className="text-sm">{resultMessage}</output>
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
