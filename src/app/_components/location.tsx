'use client';

import {
  CheckIcon,
  LoaderIcon,
  MapPinIcon,
  SearchIcon,
  XIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Item, ItemContent, ItemGroup, ItemTitle } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { useLocationSearch } from '@/hooks/use-location-search';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  formatCityName,
  formatCountryName,
  formatLocationLabel,
} from '@/lib/location-display';
import { cn } from '@/lib/utils';
import { useLocationStore } from '@/providers/location-store-provider';
import type { LocationSuggestion } from '@/schemas/nominatim';
import { fetchReverseGeocode } from '@/services/nominatim';

import { LocationTime } from './location-time';

// ─── Types ────────────────────────────────────────────────────────────────────

type GeoState = 'idle' | 'loading' | 'error';

export type LocationProps = Readonly<{
  isOpen: boolean;
  onClose: () => void;
}>;

// ─── Shared Form Body ─────────────────────────────────────────────────────────

type LocationFormProps = Readonly<{
  isMobile?: boolean;
  query: string;
  suggestions: LocationSuggestion[];
  selected: LocationSuggestion | null;
  selectedTimeZone?: string;
  isSearching: boolean;
  searchError: boolean;
  isEmpty: boolean;
  onRetry: () => void;
  geoState: GeoState;
  geoError: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onQueryChange: (value: string) => void;
  onSelect: (suggestion: LocationSuggestion) => void;
  onClear: () => void;
  onUseGeolocation: () => void;
}>;

function LocationForm({
  isMobile = false,
  query,
  suggestions,
  selected,
  selectedTimeZone,
  isSearching,
  searchError,
  isEmpty,
  onRetry,
  geoState,
  geoError,
  inputRef,
  onQueryChange,
  onSelect,
  onClear,
  onUseGeolocation,
}: LocationFormProps) {
  const showDropdown = suggestions.length > 0 && !selected;

  return (
    <div className={cn('flex flex-col gap-3', isMobile && 'p-4')}>
      {/* Search input */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="city-search">Lokasi</Label>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            {isSearching ? (
              <LoaderIcon className="size-4 animate-spin" />
            ) : (
              <SearchIcon className="size-4" />
            )}
          </InputGroupAddon>

          <InputGroupInput
            id="city-search"
            ref={inputRef}
            placeholder="Cari kota…"
            value={query}
            autoComplete="off"
            onChange={e => onQueryChange(e.target.value)}
          />

          {query && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                size="icon-sm"
                variant="ghost"
                onClick={onClear}
                aria-label="Hapus pencarian"
              >
                <XIcon className="size-4" />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>

        {/* Suggestions dropdown */}
        {showDropdown && (
          <ItemGroup className="mt-1 max-h-48 gap-0! overflow-y-auto rounded-2xl">
            {suggestions.map(s => (
              <Item
                key={s.placeId}
                role="button"
                tabIndex={0}
                variant="default"
                size="xs"
                onClick={() => onSelect(s)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(s);
                  }
                }}
              >
                <ItemContent>
                  <ItemTitle>{s.displayName}</ItemTitle>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        )}

        {searchError && (
          <div role="alert" className="text-sm">
            <p>Pencarian gagal. Periksa koneksi lalu coba lagi.</p>
            <Button size="sm" variant="outline" onClick={onRetry}>
              Coba lagi
            </Button>
          </div>
        )}
        {isEmpty && (
          <output className="text-sm">
            Kota tidak ditemukan. Coba nama lain.
          </output>
        )}
        {/* Selected badge */}
        {selected && (
          <div className="flex flex-col gap-1">
            <p className="flex items-center gap-1 text-xs">
              <CheckIcon aria-hidden className="size-3 shrink-0" />
              <span className="font-medium">{selected.displayName}</span>
            </p>
            <LocationTime
              key={`${selected.city}:${selected.countryCode}`}
              city={selected.city}
              country={selected.countryCode}
              timeZone={selectedTimeZone}
            />
          </div>
        )}
      </div>

      {/* Geolocation button */}
      <Button
        type="button"
        variant="ghost"
        onClick={onUseGeolocation}
        disabled={geoState === 'loading'}
        className="justify-start"
      >
        {geoState === 'loading' ? (
          <LoaderIcon className="size-4 animate-spin" />
        ) : (
          <MapPinIcon className="size-4" />
        )}
        {geoState === 'loading' ? 'Mendeteksi lokasi…' : 'Gunakan lokasi saya'}
      </Button>

      {/* Geo error */}
      {geoState === 'error' && (
        <p className="text-destructive text-xs">{geoError}</p>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Location({ isOpen, onClose }: LocationProps) {
  const {
    city: savedCity,
    country: savedCountry,
    timeZone: savedTimeZone,
    setLocation,
  } = useLocationStore(state => state);
  const { isMobile } = useIsMobile();
  const [query, setQuery] = useState(() =>
    formatLocationLabel(savedCity, savedCountry)
  );
  const [selected, setSelected] = useState<LocationSuggestion | null>({
    placeId: 0,
    displayName: formatLocationLabel(savedCity, savedCountry),
    city: formatCityName(savedCity),
    country: formatCountryName(savedCountry),
    countryCode: savedCountry.toUpperCase(),
  });
  const [geoState, setGeoState] = useState<GeoState>('idle');
  const [geoError, setGeoError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const geoVersion = useRef(0);
  const geoController = useRef<AbortController | null>(null);
  const search = useLocationSearch(query, isOpen && !selected);
  const { suggestions, isSearching } = search;

  useEffect(
    () => () => {
      geoVersion.current++;
      geoController.current?.abort();
    },
    []
  );
  const cancelGeolocation = () => {
    geoVersion.current++;
    geoController.current?.abort();
    setGeoState('idle');
  };
  const handleQueryChange = (value: string) => {
    cancelGeolocation();
    setQuery(value);
    setSelected(null);
  };
  const handleSelect = (suggestion: LocationSuggestion) => {
    cancelGeolocation();
    setSelected(suggestion);
    setQuery(suggestion.displayName);
  };
  const handleClear = () => {
    handleQueryChange('');
    inputRef.current?.focus();
  };
  const handleClose = () => {
    cancelGeolocation();
    onClose();
  };

  const handleUseGeolocation = () => {
    cancelGeolocation();
    if (!navigator.geolocation) {
      setGeoState('error');
      setGeoError('Browser tidak mendukung geolokasi.');
      return;
    }
    const version = geoVersion.current;
    setGeoState('loading');
    navigator.geolocation.getCurrentPosition(
      async position => {
        if (version !== geoVersion.current) return;
        const controller = new AbortController();
        geoController.current = controller;
        try {
          const result = await fetchReverseGeocode(
            position.coords.latitude,
            position.coords.longitude,
            controller.signal
          );
          if (version !== geoVersion.current) return;
          if (!result) throw new Error('Kota tidak ditemukan.');
          handleSelect(result);
        } catch {
          if (version !== geoVersion.current) return;
          setGeoState('error');
          setGeoError('Gagal mendapatkan nama kota dari koordinat. Coba lagi.');
        }
      },
      error => {
        if (version !== geoVersion.current) return;
        const messages: Record<number, string> = {
          1: 'Izin lokasi ditolak. Aktifkan di pengaturan browser.',
          2: 'Posisi tidak dapat ditemukan.',
          3: 'Waktu habis. Coba lagi.',
        };
        setGeoState('error');
        setGeoError(messages[error.code] ?? 'Gagal mendapatkan lokasi.');
      },
      { timeout: 10_000, maximumAge: 5 * 60_000 }
    );
  };

  const handleSave = () => {
    if (!selected) return;
    setLocation({
      city: selected.city,
      country: selected.countryCode,
    });
    handleClose();
  };

  const formProps: LocationFormProps = {
    isMobile,
    query,
    suggestions,
    searchError: search.isError,
    isEmpty: search.isEmpty,
    onRetry: search.retry,
    selected,
    selectedTimeZone:
      selected?.city.toLowerCase() === savedCity.toLowerCase() &&
      selected?.countryCode === savedCountry.toUpperCase()
        ? savedTimeZone
        : undefined,
    isSearching,
    geoState,
    geoError,
    inputRef,
    onQueryChange: handleQueryChange,
    onSelect: handleSelect,
    onClear: handleClear,
    onUseGeolocation: handleUseGeolocation,
  };

  const saveButton = (
    <Button onClick={handleSave} disabled={!selected} className="w-full">
      Simpan
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer
        open={isOpen}
        onOpenChange={open => {
          if (!open) handleClose();
        }}
      >
        <DrawerContent>
          <DrawerHeader className="pb-0">
            <DrawerTitle className="text-left">Ubah Lokasi</DrawerTitle>
          </DrawerHeader>
          <LocationForm {...formProps} />
          <DrawerFooter className="pt-0">{saveButton}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        if (!open) handleClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ubah Lokasi</DialogTitle>
        </DialogHeader>
        <LocationForm {...formProps} />
        <DialogFooter>{saveButton}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
